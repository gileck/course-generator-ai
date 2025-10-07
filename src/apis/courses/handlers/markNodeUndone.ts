// context intentionally unused (auth optional)
import { MarkNodeDoneRequest, MarkNodeDoneResponse } from '../types';
import { nodes } from '@/server/database/collections';

export const markNodeUndone = async (
    params: MarkNodeDoneRequest
): Promise<MarkNodeDoneResponse> => {
    const now = new Date();
    const updated = await nodes.updateNode(params.node_id, { isDone: false, doneAt: null, updatedAt: now });
    if (!updated) throw new Error('Node not found');
    return {
        success: true,
        node: {
            _id: updated._id.toHexString(),
            courseId: updated.courseId.toHexString(),
            parentId: updated.parentId ? updated.parentId.toHexString() : null,
            title: updated.title,
            synopsis: updated.synopsis,
            orderIndex: updated.orderIndex,
            depth: updated.depth,
            tabOverviewMd: updated.tabOverviewMd,
            tabDeepDiveMd: updated.tabDeepDiveMd,
            tabTerminologyMd: updated.tabTerminologyMd,
            timeEstMinutes: updated.timeEstMinutes,
            isDone: updated.isDone,
            doneAt: updated.doneAt ? updated.doneAt.toISOString() : null,
            lastViewedAt: updated.lastViewedAt ? updated.lastViewedAt.toISOString() : null,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
        }
    };
};


