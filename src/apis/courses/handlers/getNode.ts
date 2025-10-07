// context intentionally unused (auth optional)
import { GetNodeRequest, GetNodeResponse, Breadcrumb } from '../types';
import { nodes, courses } from '@/server/database/collections';
import { ObjectId } from 'mongodb';

import { generateNodeContent } from '@/server/ai/helpers/nodeGenerator';

export const getNode = async (
    params: GetNodeRequest
): Promise<GetNodeResponse> => {
    let node = await nodes.findNodeById(params.node_id);
    if (!node) {
        throw new Error('Node not found');
    }

    // Auto-generate content on first open if not yet generated (check for missing or empty strings)
    const needsContent = !node.tabOverviewMd?.trim() || !node.tabDeepDiveMd?.trim() || !node.tabTerminologyMd?.trim();
    if (needsContent) {
        const course = await courses.findCourseById(node.courseId);
        if (course) {
            // Build context chain for better content generation
            const contextChain: string[] = [course.title];
            let currentParentId = node.parentId;
            while (currentParentId) {
                const parent = await nodes.findNodeById(currentParentId);
                if (!parent) break;
                contextChain.push(parent.title);
                currentParentId = parent.parentId ?? null;
            }

            const rawContent = await generateNodeContent({
                courseTitle: course.title,
                contextChain,
                currentNodeTitle: node.title,
                aiModelId: 'gpt-4o-mini', // Use default model for auto-generation
            });

            // Normalize AI response into the three tabs we expect
            const toStringSafe = (v: unknown): string | undefined => (typeof v === 'string' && v.trim().length > 0 ? v : undefined);
            const getProp = (o: Record<string, unknown>, key: string): unknown => (Object.prototype.hasOwnProperty.call(o, key) ? o[key] : undefined);
            const normalize = (res: unknown): { overview?: string; deepDive?: string; terminology?: string; short_title?: string; title?: string } => {
                if (!res || typeof res !== 'object') return {};
                const obj = res as Record<string, unknown>;
                // Direct keys
                const overview = toStringSafe(getProp(obj, 'overview'))
                    || toStringSafe(getProp(obj, 'OVERVIEW'))
                    || toStringSafe(getProp(obj, 'overview_md'))
                    || toStringSafe(getProp(obj, 'overviewMarkdown'));
                const deepDive = toStringSafe(getProp(obj, 'deepDive'))
                    || toStringSafe(getProp(obj, 'DEEP_DIVE'))
                    || toStringSafe(getProp(obj, 'deep_dive_md'))
                    || toStringSafe(getProp(obj, 'deepDiveMarkdown'));
                const terminology = toStringSafe(getProp(obj, 'terminology'))
                    || toStringSafe(getProp(obj, 'TERMINOLOGY'))
                    || toStringSafe(getProp(obj, 'terminology_md'))
                    || toStringSafe(getProp(obj, 'terminologyMarkdown'));
                const titleCandidate = toStringSafe(getProp(obj, 'title'));
                const shortTitleCandidate = toStringSafe(getProp(obj, 'short_title'));
                let result: { overview?: string; deepDive?: string; terminology?: string; title?: string; short_title?: string } = { overview, deepDive, terminology, title: titleCandidate, short_title: shortTitleCandidate };
                if (result.overview && result.deepDive && result.terminology) return result;

                // Tabs object: { tabs: { overview: '', deep_dive: '', terminology: '' } }
                if (obj.tabs && typeof obj.tabs === 'object') {
                    const t = obj.tabs as Record<string, unknown>;
                    result = {
                        overview: result.overview || toStringSafe(getProp(t, 'overview')) || toStringSafe(getProp(t, 'OVERVIEW')),
                        deepDive: result.deepDive || toStringSafe(getProp(t, 'deepDive')) || toStringSafe(getProp(t, 'DEEP_DIVE')) || toStringSafe(getProp(t, 'deep_dive')),
                        terminology: result.terminology || toStringSafe(getProp(t, 'terminology')) || toStringSafe(getProp(t, 'TERMINOLOGY')),
                        title: result.title,
                        short_title: result.short_title,
                    };
                    if (result.overview && result.deepDive && result.terminology) return result;
                }

                // Array of sections [{ id: 'overview', content: '...' }]
                if (Array.isArray(obj.sections)) {
                    const sections = obj.sections as Array<Record<string, unknown>>;
                    for (const s of sections) {
                        const sid = (getProp(s, 'id') || getProp(s, 'key') || getProp(s, 'name')) as string | undefined;
                        const content = toStringSafe(getProp(s, 'content') || getProp(s, 'body') || getProp(s, 'markdown'));
                        if (!sid || !content) continue;
                        if (/overview/i.test(sid)) result.overview = result.overview || content;
                        else if (/deep/i.test(sid)) result.deepDive = result.deepDive || content;
                        else if (/term/i.test(sid)) result.terminology = result.terminology || content;
                    }
                    return result;
                }

                // Last resort: try to find any stringy values with indicative keys
                for (const [k, v] of Object.entries(obj)) {
                    const val = toStringSafe(v);
                    if (!val) continue;
                    if (/overview/i.test(k)) result.overview = result.overview || val;
                    else if (/deep(_|\s)?dive/i.test(k)) result.deepDive = result.deepDive || val;
                    else if (/terminology|terms/i.test(k)) result.terminology = result.terminology || val;
                }
                return result;
            };
            const content = normalize(rawContent);

            // Update node with generated content
            await nodes.updateNode(node._id, {
                tabOverviewMd: content.overview ?? node.tabOverviewMd ?? '',
                tabDeepDiveMd: content.deepDive ?? node.tabDeepDiveMd ?? '',
                tabTerminologyMd: content.terminology ?? node.tabTerminologyMd ?? '',
                shortTitle: content.short_title ?? node.shortTitle,
                title: content.title ?? node.title,
                updatedAt: new Date(),
            });

            // Re-fetch to get updated content
            node = await nodes.findNodeById(params.node_id);
            if (!node) throw new Error('Node not found after update');
        }
    }

    const children = await nodes.findChildren(node.courseId, node.parentId ?? node._id);

    // Build breadcrumbs upwards by traversing parent chain
    const breadcrumbs: Breadcrumb[] = [];
    const course = await courses.findCourseById(node.courseId);
    if (course) {
        breadcrumbs.push({ id: course._id.toHexString(), title: course.shortTitle || course.title });
    }

    // Traverse parents
    let currentParentId: ObjectId | null | undefined = node.parentId;
    const parentChain: Breadcrumb[] = [];
    while (currentParentId) {
        const parent = await nodes.findNodeById(currentParentId);
        if (!parent) break;
        parentChain.unshift({ id: parent._id.toHexString(), title: parent.shortTitle || parent.title });
        currentParentId = parent.parentId ?? null;
    }
    breadcrumbs.push(...parentChain);
    breadcrumbs.push({ id: node._id.toHexString(), title: node.shortTitle || node.title });
    return {
        node: {
            _id: node._id.toHexString(),
            courseId: node.courseId.toHexString(),
            parentId: node.parentId ? node.parentId.toHexString() : null,
            title: node.title,
            shortTitle: node.shortTitle,
            synopsis: node.synopsis,
            orderIndex: node.orderIndex,
            depth: node.depth,
            tabOverviewMd: node.tabOverviewMd,
            tabDeepDiveMd: node.tabDeepDiveMd,
            tabTerminologyMd: node.tabTerminologyMd,
            // timeEstMinutes removed from UI
            isDone: node.isDone,
            doneAt: node.doneAt ? node.doneAt.toISOString() : null,
            lastViewedAt: node.lastViewedAt ? node.lastViewedAt.toISOString() : null,
            createdAt: node.createdAt.toISOString(),
            updatedAt: node.updatedAt.toISOString(),
        },
        children: children.map(c => ({
            _id: c._id.toHexString(),
            courseId: c.courseId.toHexString(),
            parentId: c.parentId ? c.parentId.toHexString() : null,
            title: c.title,
            shortTitle: c.shortTitle,
            synopsis: c.synopsis,
            orderIndex: c.orderIndex,
            depth: c.depth,
            tabOverviewMd: c.tabOverviewMd,
            tabDeepDiveMd: c.tabDeepDiveMd,
            tabTerminologyMd: c.tabTerminologyMd,
            // timeEstMinutes removed from UI
            isDone: c.isDone,
            doneAt: c.doneAt ? c.doneAt.toISOString() : null,
            lastViewedAt: c.lastViewedAt ? c.lastViewedAt.toISOString() : null,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
        })),
        breadcrumbs,
        parent_id: node.parentId ? node.parentId.toHexString() : null,
    };
};


