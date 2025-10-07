import React, { useEffect, useState } from 'react';
import { useRouter } from '@/client/router';
import { getNode, markNodeDone, setLastViewed, generateSubtopics, prefetchNode } from '@/apis/courses/client';
import { withDataFetcher } from '@/client/utils/DataFetcherWrapper';
import { Card } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import type { NodeClient, Breadcrumb } from '@/apis/courses/types';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addRecentView } from '@/client/utils/recentViews';

const NodePageBase: React.FC<{ data: { node: NodeClient; children: NodeClient[]; breadcrumbs: Breadcrumb[]; parent_id?: string | null }; isLoading: boolean; error: string | null; refresh: () => void }> = ({ data, isLoading, refresh }) => {
    const { routeParams, navigate } = useRouter();
    const courseId = routeParams['courseId'];
    const nodeId = routeParams['nodeId'];
    const [activeTab, setActiveTab] = useState<'overview' | 'deep' | 'terms'>('overview');
    const [isGenerating, setIsGenerating] = useState(false);
    const [preloadingIds, setPreloadingIds] = useState<Set<string>>(new Set());
    const [preloadedIds, setPreloadedIds] = useState<Set<string>>(new Set());
    const subtopicsRef = React.useRef<HTMLDivElement | null>(null);
    const [autoTriggered, setAutoTriggered] = useState(false);

    const mdComponents: Components = {
        h1: (props) => (
            <h2 className="text-primary" style={{ fontSize: 'var(--h2-size)', lineHeight: 'var(--h2-line)', fontWeight: 'var(--h2-weight)', marginBottom: 8 }}>{props.children}</h2>
        ),
        h2: (props) => (
            <h3 className="text-primary" style={{ fontSize: 'var(--h3-size)', lineHeight: 'var(--h3-line)', fontWeight: 'var(--h3-weight)', marginBottom: 6 }}>{props.children}</h3>
        ),
        p: (props) => (
            <p className="text-secondary" style={{ marginBottom: 10 }}>{props.children}</p>
        ),
        ul: (props) => (
            <ul className="text-secondary" style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 6, marginBottom: 10 }}>{props.children}</ul>
        ),
        ol: (props) => (
            <ol className="text-secondary" style={{ listStyle: 'decimal', paddingLeft: 20, marginTop: 6, marginBottom: 10 }}>{props.children}</ol>
        ),
        li: (props) => (
            <li style={{ marginBottom: 6 }}>{props.children}</li>
        ),
        strong: (props) => (
            <strong className="text-primary" style={{ fontWeight: 600 }}>{props.children}</strong>
        ),
        em: (props) => (
            <em {...props} className={[props.className, 'text-secondary'].filter(Boolean).join(' ')} />
        ),
    };

    // Check if content is still generating (empty or loading state)
    const isContentEmpty = !data.node.tabOverviewMd?.trim() && !data.node.tabDeepDiveMd?.trim() && !data.node.tabTerminologyMd?.trim();
    const showLoading = isLoading || isContentEmpty;

    const onDone = async () => {
        await markNodeDone({ node_id: nodeId! });
        if (data.parent_id) {
            navigate(`/courses/${courseId}/nodes/${data.parent_id}`);
        } else {
            navigate(`/courses/${courseId}`);
        }
    };

    const onGenerateSubtopics = async () => {
        setIsGenerating(true);
        await generateSubtopics({ node_id: nodeId!, count: 5, granularity: 'balanced' });
        setIsGenerating(false);
        refresh();
    };

    const onPreload = async (id: string) => {
        const next = new Set(preloadingIds); next.add(id); setPreloadingIds(next);
        try {
            await prefetchNode(id);
            const done = new Set(preloadedIds); done.add(id); setPreloadedIds(done);
        } finally {
            const stop = new Set(preloadingIds); stop.delete(id); setPreloadingIds(stop);
        }
    };

    // Auto-generate subtopics lazily when subtopics section enters viewport
    useEffect(() => {
        if (!subtopicsRef.current || autoTriggered || isGenerating || data.children.length > 0) return;
        const el = subtopicsRef.current;
        const obs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && data.children.length === 0 && !autoTriggered) {
                    setAutoTriggered(true);
                    void onGenerateSubtopics();
                    break;
                }
            }
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [subtopicsRef.current, autoTriggered, isGenerating, data.children.length]);

    if (isLoading) {
        const bar = (w: string) => (
            <div style={{ height: 12, width: w, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 8 }} />
        );
        return (
            <div className="page-padding max-w-4xl mx-auto pb-24">
                {/* Breadcrumb skeleton */}
                {bar('50%')}
                {/* Title skeleton */}
                <div style={{ height: 32, width: '75%', background: 'rgba(255,255,255,0.14)', borderRadius: 10, margin: '8px 0 12px' }} />
                {/* Tabs skeleton */}
                <div className="border-b" style={{ borderColor: 'var(--border)', paddingBottom: 8, marginBottom: 12, display: 'flex', gap: 16 }}>
                    <div style={{ height: 24, width: 80, background: 'rgba(255,255,255,0.12)', borderRadius: 12 }} />
                    <div style={{ height: 24, width: 96, background: 'rgba(255,255,255,0.12)', borderRadius: 12 }} />
                    <div style={{ height: 24, width: 112, background: 'rgba(255,255,255,0.12)', borderRadius: 12 }} />
                </div>
                {/* Content card skeleton */}
                <Card className="p-4 bg-background/60 border">
                    {bar('70%')}
                    {bar('100%')}
                    {bar('85%')}
                    {bar('80%')}
                    <p className="text-secondary" style={{ marginTop: 8 }}>Loading node…</p>
                </Card>
                {/* Subtopics skeleton */}
                <div style={{ height: 24, width: 128, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginTop: 24 }} />
                <Card className="p-4 bg-background/60 border" style={{ marginTop: 8 }}>
                    {bar('60%')}
                </Card>
            </div>
        );
    }

    return (
        <div className="page-padding max-w-4xl mx-auto pb-24">
            {/* Breadcrumbs */}
            <div className="text-tertiary mb-1" style={{ fontSize: 'var(--caption-size)', lineHeight: 'var(--caption-line)' }}>
                {data.breadcrumbs.map((crumb, idx) => (
                    <span key={crumb.id}>
                        {idx < data.breadcrumbs.length - 1 ? (
                            <><button className="underline" onClick={() => navigate(idx === 0 ? `/courses/${courseId}` : `/courses/${courseId}/nodes/${crumb.id}`)}>{crumb.title}</button> <span>›</span> </>
                        ) : (
                            <span>{crumb.title}</span>
                        )}
                    </span>
                ))}
            </div>

            {/* Back */}
            {data.parent_id && (
                <button className="text-sm text-secondary mb-2" onClick={() => navigate(data.parent_id === null ? `/courses/${courseId}` : `/courses/${courseId}/nodes/${data.parent_id}`)}>← Back</button>
            )}

            {/* Title */}
            <h1 className="text-primary mb-3" style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)' }}>{data.node.title}</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-4" style={{ borderColor: 'var(--border)' }}>
                {['overview', 'deep', 'terms'].map((tab) => (
                    <button
                        key={tab}
                        className="pb-2 text-sm"
                        style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)', borderBottom: activeTab === tab ? '2px solid transparent' : 'none', backgroundImage: activeTab === tab ? 'linear-gradient(90deg, var(--accent-from), var(--accent-to))' : 'none', backgroundClip: activeTab === tab ? 'text' : 'unset', WebkitBackgroundClip: activeTab === tab ? 'text' : 'unset', WebkitTextFillColor: activeTab === tab ? 'transparent' : 'inherit' }}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                    >
                        {tab === 'overview' ? 'Overview' : tab === 'deep' ? 'Deep Dive' : 'Terminology'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <Card className="p-4 bg-background/60 border mb-6">
                {showLoading ? (
                    <div className="text-center" style={{ padding: '24px 0' }}>
                        <div style={{ margin: '0 auto', width: '90%' }}>
                            <div style={{ height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 8, margin: '0 auto 8px', width: '75%' }} />
                            <div style={{ height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 8, width: '100%' }} />
                            <div style={{ height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 8, width: '85%' }} />
                            <div style={{ height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 8, width: '80%' }} />
                        </div>
                        <p className="text-secondary" style={{ marginTop: 12, fontSize: 14 }}>Generating content...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="text-secondary" style={{ fontSize: 'var(--body-size)', lineHeight: 'var(--body-line)' }}>
                                {data.node.tabOverviewMd ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                        {data.node.tabOverviewMd}
                                    </ReactMarkdown>
                                ) : 'Content will generate on first open.'}
                            </div>
                        )}
                        {activeTab === 'deep' && (
                            <div className="text-secondary" style={{ fontSize: 'var(--body-size)', lineHeight: 'var(--body-line)' }}>
                                {data.node.tabDeepDiveMd ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                        {data.node.tabDeepDiveMd}
                                    </ReactMarkdown>
                                ) : 'Deep dive content not yet generated.'}
                            </div>
                        )}
                        {activeTab === 'terms' && (
                            <div className="text-secondary" style={{ fontSize: 'var(--body-size)', lineHeight: 'var(--body-line)' }}>
                                {data.node.tabTerminologyMd ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                        {data.node.tabTerminologyMd}
                                    </ReactMarkdown>
                                ) : 'Terminology not yet generated.'}
                            </div>
                        )}
                        {/* Node duration intentionally removed */}
                    </>
                )}
            </Card>

            {/* Subtopics */}
            <div ref={subtopicsRef}>
                <h2 className="text-primary mb-3" style={{ fontSize: 'var(--h2-size)', lineHeight: 'var(--h2-line)', fontWeight: 'var(--h2-weight)' }}>Subtopics</h2>
                {data.children.length === 0 ? (
                    <Card className="p-6 bg-background/60 border text-center">
                        <p className="text-secondary mb-4">No subtopics yet. Generate them to dive deeper.</p>
                        <Button className="btn-pill bg-gradient-accent text-white" onClick={onGenerateSubtopics} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Subtopics'}
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {data.children.map((child) => (
                            <Card key={child._id} className="p-4 bg-background/60 border cursor-pointer hover:border-accent-from"
                                onClick={() => navigate(`/courses/${courseId}/nodes/${child._id}`)}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-primary" style={{ fontSize: 'var(--h3-size)', lineHeight: 'var(--h3-line)', fontWeight: 'var(--h3-weight)' }}>{child.title}</h3>
                                        {child.synopsis && <p className="text-secondary text-sm mt-1">{child.synopsis}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Node duration intentionally removed */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            aria-label={`Preload ${child.title}`}
                                            onClick={(e) => { e.stopPropagation(); void onPreload(child._id); }}
                                            disabled={preloadingIds.has(child._id) || preloadedIds.has(child._id)}
                                        >
                                            {preloadedIds.has(child._id) ? 'Ready' : (preloadingIds.has(child._id) ? 'Preloading…' : 'Preload')}
                                        </Button>
                                        <span className="text-tertiary">→</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="max-w-4xl mx-auto">
                    <Button className="btn-pill bg-gradient-accent text-white w-full" onClick={onDone}>✅ Done</Button>
                </div>
            </div>
        </div>
    );
};

export const NodePage: React.FC = () => {
    const { routeParams } = useRouter();
    const courseId = routeParams['courseId'];
    const nodeId = routeParams['nodeId'];

    useEffect(() => {
        if (nodeId) {
            setLastViewed({ node_id: nodeId });
        }
    }, [nodeId]);

    if (!courseId || !nodeId) return <div>Missing node</div>;
    const Wrapped = withDataFetcher(
        () => getNode({ node_id: nodeId }),
        (props) => {
            // Record node/module view when data arrives
            useEffect(() => {
                if (props.data?.node && nodeId && courseId) {
                    addRecentView({
                        id: nodeId,
                        kind: props.data.node.depth === 0 ? 'module' : 'node',
                        title: props.data.node.title,
                        path: `/courses/${courseId}/nodes/${nodeId}`,
                        courseTitle: props.data.breadcrumbs[0]?.title,
                    });
                }
            }, [props.data?.node, nodeId, courseId, props.data?.breadcrumbs]);
            return <NodePageBase {...props} />;
        },
        { showGlobalLoading: true }
    );
    return <Wrapped />;
};


