import React, { useEffect } from 'react';
import { useRouter } from '@/client/router';
import { withDataFetcher } from '@/client/utils/DataFetcherWrapper';
import { getCourse } from '@/apis/courses/client';
import { Card } from '@/client/components/ui/card';
import { Badge } from '@/client/components/ui/badge';
import { Button } from '@/client/components/ui/button';
import { addRecentView } from '@/client/utils/recentViews';

interface ModuleCard { _id: string; title: string; synopsis: string }
const CourseDashboardBase: React.FC<{ data: { course: { title: string; overviewSummary?: string; difficulty?: string }; modules: ModuleCard[] }; isLoading: boolean; error: string | null; refresh: () => void }> = ({ data }) => {
    const { routeParams, navigate } = useRouter();
    const courseId = routeParams['courseId'];

    // Record recent course view
    useEffect(() => {
        if (courseId && data?.course?.title) {
            addRecentView({
                id: courseId,
                kind: 'course',
                title: data.course.title,
                path: `/courses/${courseId}`,
            });
        }
    }, [courseId, data?.course?.title]);

    const percentage = 0; // MVP: compute later when child progress exists
    const continueHref = data.modules[0]?._id ? `/courses/${courseId}/nodes/${data.modules[0]._id}` : undefined;

    return (
        <div className="page-padding max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="text-tertiary" style={{ fontSize: 'var(--caption-size)', lineHeight: 'var(--caption-line)' }}>
                <button className="underline" onClick={() => navigate('/courses')}>My Courses</button> <span>›</span> <span>{data.course.title}</span>
            </div>

            {/* Header */}
            <div className="mt-2">
                <h1 className="text-primary" style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)' }}>{data.course.title}</h1>
                <div className="mt-2" aria-label="progress" role="progressbar" aria-valuenow={percentage}>
                    <div style={{ height: 2, background: 'var(--border)', borderRadius: 999 }} />
                    <div className="bg-gradient-accent" style={{ height: 2, width: `${percentage}%`, borderRadius: 999, marginTop: -2 }} />
                    <div className="text-tertiary" style={{ fontSize: 'var(--caption-size)' }}>{percentage}%</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    {data.course.difficulty && <Badge variant="secondary">{data.course.difficulty}</Badge>}
                    {/* duration removed */}
                    <Badge variant="outline">{data.modules.length} modules</Badge>
                </div>
                <div className="mt-3">
                    <Button className="btn-pill bg-gradient-accent text-white w-full" onClick={() => continueHref && navigate(continueHref)} disabled={!continueHref}>Continue</Button>
                </div>
            </div>

            {/* Modules */}
            <div className="mt-6">
                <h2 className="text-primary" style={{ fontSize: 'var(--h2-size)', lineHeight: 'var(--h2-line)', fontWeight: 'var(--h2-weight)' }}>Modules</h2>
                <div className="mt-3 grid gap-3">
                    {data.modules.map((m: ModuleCard, idx) => (
                        <Card key={m._id} className="p-4 bg-background/60 border">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-primary" style={{ fontSize: 'var(--h3-size)', lineHeight: 'var(--h3-line)', fontWeight: 'var(--h3-weight)' }}>{idx + 1}. {m.title}</h3>
                                    <p className="text-secondary text-sm mt-1" style={{ lineHeight: 'var(--body-line)' }}>{m.synopsis}</p>
                                    {/* duration removed */}
                                </div>
                                <div>
                                    <Button variant="secondary" onClick={() => navigate(`/courses/${courseId}/nodes/${m._id}`)}>Open</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CourseDashboard: React.FC = () => {
    const { routeParams } = useRouter();
    const courseId = routeParams['courseId'];
    if (!courseId) return <div>Missing course</div>;
    const Wrapped = withDataFetcher(() => getCourse({ course_id: courseId }), CourseDashboardBase);
    return <Wrapped />;
};


