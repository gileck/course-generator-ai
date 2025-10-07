import React, { useEffect, useState } from 'react';
import { useRouter } from '@/client/router';
import { generateCourseSuggestions, selectCourseSuggestion } from '@/apis/courses/client';
import { useSettings } from '@/client/settings/SettingsContext';
import { Card } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';
import { Input } from '@/client/components/ui/input';

export const CourseSuggestions: React.FC = () => {
    const { queryParams, navigate } = useRouter();
    const { settings } = useSettings();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    type Suggestion = { title: string; overview_summary: string; overview_detail: string; learning_outcomes: string[]; difficulty?: string };
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [refineText, setRefineText] = useState<string>('');
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
    const onRegenerate = async () => {
        const topic = queryParams['q'];
        if (!topic) return;
        try {
            setLoading(true);
            setError(undefined);
            const res = await generateCourseSuggestions({
                user_input: topic,
                refine_input: refineText || undefined,
                previous_suggestions: suggestions,
                ai_model: settings.aiModel,
            }, { disableCache: true, bypassCache: true });
            setSuggestions(res.data.suggestions || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to regenerate suggestions');
        } finally {
            setLoading(false);
        }
    };


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
                                    {/* duration removed */}
                                </div>
                            </div>
                            <div>
                                <Button onClick={() => onSelect(s)}>Select</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Card className="p-4 mt-4 bg-background/60 border">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="refine">Add more detail or refine your request</label>
                    <Input
                        id="refine"
                        placeholder="E.g., prefer hands-on projects, target intermediate level, focus on React and TypeScript, 6 weeks max..."
                        value={refineText}
                        onChange={(e) => setRefineText(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onRegenerate} disabled={loading}>
                            Regenerate Suggestions
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


