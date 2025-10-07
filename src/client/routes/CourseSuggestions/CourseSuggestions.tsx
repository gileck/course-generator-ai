import React, { useEffect, useState } from 'react';
import { useRouter } from '@/client/router';
import { generateCourseSuggestions, selectCourseSuggestion } from '@/apis/courses/client';
import { useSettings } from '@/client/settings/SettingsContext';
import { Card } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';

export const CourseSuggestions: React.FC = () => {
    const { queryParams, navigate } = useRouter();
    const { settings } = useSettings();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    type Suggestion = { title: string; overview_summary: string; overview_detail: string; learning_outcomes: string[]; difficulty?: string; est_total_minutes?: number };
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    console.log('suggestions', suggestions);

    useEffect(() => {
        const topic = queryParams['q'];
        if (!topic) {
            setError('Missing topic');
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const res = await generateCourseSuggestions({ user_input: topic, ai_model: settings.aiModel });
                setSuggestions(res.data.suggestions || []);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load suggestions');
            } finally {
                setLoading(false);
            }
        })();
    }, [queryParams, settings.aiModel]);

    const onSelect = async (s: Suggestion) => {
        try {
            setLoading(true);
            const res = await selectCourseSuggestion({ suggestion: s, ai_model: settings.aiModel });
            navigate(`/courses/${res.data.course_id}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to create course');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading suggestions…</div>;
    if (error) return <div className="p-6 text-sm text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Choose Your Learning Path</h2>
            <div className="grid gap-4">
                {suggestions.map((s, idx) => (
                    <Card key={idx} className="p-4 bg-background/60 border">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium mb-2">{s.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{s.overview_summary}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    {s.difficulty && <Badge variant="secondary">{s.difficulty}</Badge>}
                                    {typeof s.est_total_minutes === 'number' && (
                                        <Badge variant="outline">~{Math.round(s.est_total_minutes / 60) || s.est_total_minutes} {s.est_total_minutes && s.est_total_minutes >= 60 ? 'hrs' : 'min'}</Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Button onClick={() => onSelect(s)}>Select</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};


