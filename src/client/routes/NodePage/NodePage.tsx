import React, { useEffect, useState } from 'react';
import { useRouter } from '@/client/router';
import { getNode, markNodeDone, setLastViewed, generateSubtopics } from '@/apis/courses/client';
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
    const [childrenLocal, setChildrenLocal] = useState<NodeClient[]>(data.children);
    const subtopicsRef = React.useRef<HTMLDivElement | null>(null);
    const [autoTriggered, setAutoTriggered] = useState(false);

    useEffect(() => {
        setChildrenLocal(data.children);
    }, [data.children]);

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
    // Record recent node/module view when data is ready
    useEffect(() => {
        if (data?.node && courseId && nodeId) {
            addRecentView({
                id: nodeId,
                kind: data.node.depth === 0 ? 'module' : 'node',
                title: data.node.title,
                path: `/courses/${courseId}/nodes/${nodeId}`,
            });
        }
    }, [data?.node?._id, courseId, nodeId]);

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
        try {
            const { data: resp } = await generateSubtopics({ node_id: nodeId!, count: 5, granularity: 'balanced' });
            if (resp?.subtopics && Array.isArray(resp.subtopics)) {
                setChildrenLocal(resp.subtopics);
            } else {
                // fallback to refresh if unexpected
                refresh();
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Preload logic removed; navigation is fast due to route-level data fetching

    // Auto-generate subtopics lazily when subtopics section enters viewport
    useEffect(() => {
        if (!subtopicsRef.current || autoTriggered || isGenerating || childrenLocal.length > 0) return;
        const el = subtopicsRef.current;
        const obs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && childrenLocal.length === 0 && !autoTriggered) {
                    setAutoTriggered(true);
                    void onGenerateSubtopics();
                    break;
                }
            }
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [subtopicsRef.current, autoTriggered, isGenerating, childrenLocal.length]);

    if (isLoading) {
        const bar = (w: string) => (
            <div style={{ height: 12, width: w, background: 'rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 8 }} />
        );
        return (
            <div className="page-padding mx-auto pb-24" style={{ maxWidth: '72ch' }}>
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
        <div className="page-padding mx-auto pb-24" style={{ maxWidth: '72ch' }}>
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

            {/* Title */}
            <h1 className="text-primary" style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)', marginBottom: 8 }}>{data.node.title}</h1>

            {/* Meta row intentionally empty (duration removed); difficulty may be added later */}

            <div className="sticky z-10" style={{ top: 56, background: 'rgba(11,12,26,0.70)', backdropFilter: 'blur(8px)' }}>
                <nav className="flex gap-6" style={{ height: 44, alignItems: 'flex-end', padding: '0 4px', marginBottom: 12 }} role="tablist" aria-label="Node content tabs">
                    {['overview', 'deep', 'terms'].map((tab) => (
                        <button
                            key={tab}
                            className="pb-2 text-sm"
                            style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)', borderBottom: activeTab === tab ? '2px solid transparent' : '2px solid transparent', backgroundImage: activeTab === tab ? 'linear-gradient(90deg, var(--accent-from), var(--accent-to))' : 'none', backgroundClip: activeTab === tab ? 'text' : 'unset', WebkitBackgroundClip: activeTab === tab ? 'text' : 'unset', WebkitTextFillColor: activeTab === tab ? 'transparent' : 'inherit' }}
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                            role="tab"
                            aria-selected={activeTab === tab}
                        >
                            {tab === 'overview' ? 'Overview' : tab === 'deep' ? 'Deep Dive' : 'Terminology'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <Card className="p-4 bg-background/60 border mb-6" style={{ borderColor: 'var(--border)', borderRadius: 16 }}>
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
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-primary" style={{ fontSize: 'var(--h2-size)', lineHeight: 'var(--h2-line)', fontWeight: 'var(--h2-weight)' }}>Subtopics</h2>
                    {childrenLocal.length > 0 && (
                        <Button variant="outline" size="sm" onClick={onGenerateSubtopics} disabled={isGenerating}>Add more</Button>
                    )}
                </div>
                {childrenLocal.length === 0 ? (
                    <Card className="p-6 bg-background/60 border text-center">
                        <p className="text-secondary mb-4">No subtopics yet. Generate them to dive deeper.</p>
                        <Button className="btn-pill bg-gradient-accent text-white" onClick={onGenerateSubtopics} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Subtopics'}
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {childrenLocal.map((child) => (
                            <button key={child._id} className="w-full text-left rounded-2xl border bg-background/60 p-4 hover:border-white/20"
                                style={{ borderColor: 'var(--border)' }}
                                onClick={() => navigate(`/courses/${courseId}/nodes/${child._id}`)}
                                aria-label={`${child.title}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-primary" style={{ fontSize: '15px', lineHeight: '24px', fontWeight: 500 }}>{child.title}</div>
                                        {child.synopsis && <div className="text-secondary text-sm" style={{ opacity: 0.6 }}>{child.synopsis}</div>}
                                    </div>
                                    <div className="flex items-center gap-3"><span className="text-tertiary">→</span></div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 border-t" style={{ borderColor: 'var(--border)', backdropFilter: 'blur(8px)', padding: '12px 16px', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
                <div className="mx-auto" style={{ maxWidth: '72ch' }}>
                    <Button className="btn-pill bg-gradient-accent text-white w-full" aria-label={`Mark node complete and go back`} onClick={onDone}>✅ Mark as Done</Button>
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
        NodePageBase,
        { showGlobalLoading: true }
    );
    return <Wrapped />;
};


