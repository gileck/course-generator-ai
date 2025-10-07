import React, { useMemo, useState } from 'react';
import { useRouter } from '@/client/router';
import { Card } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';
import { getRecentViews, clearRecentViews } from '@/client/utils/recentViews';

const kindLabel: Record<'course' | 'module' | 'node', string> = {
    course: 'Course',
    module: 'Module',
    node: 'Node',
};

export const RecentlyViewed: React.FC = () => {
    const { navigate } = useRouter();
    const [version, setVersion] = useState(0);
    const items = useMemo(() => getRecentViews(), [version]);

    const onClear = () => {
        clearRecentViews();
        setVersion((v) => v + 1);
    };

    return (
        <div className="page-padding max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-primary" style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)' }}>Recently Viewed</h1>
                {items.length > 0 && (
                    <Button variant="secondary" onClick={onClear}>Clear</Button>
                )}
            </div>

            {items.length === 0 ? (
                <Card className="p-6 bg-background/60 border mt-4 text-center">
                    <p className="text-secondary">No recent items yet. Browse courses and modules to populate this list.</p>
                </Card>
            ) : (
                <div className="mt-4 grid gap-3">
                    {items.map((it) => (
                        <Card key={`${it.kind}:${it.id}`} className="p-4 bg-background/60 border cursor-pointer hover:border-accent-from" onClick={() => navigate(it.path)}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{kindLabel[it.kind]}</Badge>
                                        <span className="text-tertiary" style={{ fontSize: 'var(--caption-size)' }}>{new Date(it.viewedAt).toLocaleString()}</span>
                                    </div>
                                    <h3 className="text-primary mt-1" style={{ fontSize: 'var(--h3-size)', lineHeight: 'var(--h3-line)', fontWeight: 'var(--h3-weight)' }}>{it.title}</h3>
                                    <p className="text-secondary text-sm mt-1">{it.path}</p>
                                </div>
                                <div className="text-tertiary">→</div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};


