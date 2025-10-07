import React from 'react';
import { withDataFetcher } from '@/client/utils/DataFetcherWrapper';
import { getCourses, deleteCourse } from '@/apis/courses/client';
import { useRouter } from '@/client/router';
import { Card } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import type { CourseCard } from '@/apis/courses/types';

const AllCoursesBase: React.FC<{ data: { courses: CourseCard[] }; isLoading: boolean; error: string | null; refresh: () => void }> = ({ data, refresh }) => {
    const { navigate } = useRouter();
    const onDelete = async (id: string, title: string) => {
        if (!confirm(`Delete course "${title}"? This cannot be undone.`)) return;
        await deleteCourse({ course_id: id });
        refresh();
    };
    return (
        <div className="page-padding max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-primary" style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)' }}>My Courses</h1>
                <Button className="btn-pill bg-gradient-accent text-white" onClick={() => navigate('/')}>+ New Course</Button>
            </div>
            <div className="grid gap-3">
                {data.courses.map((c) => (
                    <Card key={c._id} className="p-4 bg-background/60 border">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-primary" style={{ fontSize: 'var(--h3-size)', lineHeight: 'var(--h3-line)', fontWeight: 'var(--h3-weight)' }}>{c.title}</h3>
                                <div className="mt-2" aria-label="progress" role="progressbar" aria-valuenow={c.progress_percentage}>
                                    <div style={{ height: 2, background: 'var(--border)', borderRadius: 999 }} />
                                    <div className="bg-gradient-accent" style={{ height: 2, width: `${c.progress_percentage}%`, borderRadius: 999, marginTop: -2 }} />
                                </div>
                                <div className="text-tertiary" style={{ fontSize: 'var(--caption-size)' }}>{c.progress_percentage}%</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => navigate(`/courses/${c._id}`)}>{c.progress_percentage > 0 ? 'Continue' : 'Open'}</Button>
                                <Button variant="outline" onClick={() => onDelete(c._id, c.title)}>Delete</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const AllCourses: React.FC = () => {
    const Wrapped = withDataFetcher(() => getCourses({}), AllCoursesBase);
    return <Wrapped />;
};


