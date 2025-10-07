import React, { useState } from 'react';
import { useRouter } from '@/client/router';

export const Home: React.FC = () => {
  const { navigate } = useRouter();
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError(null);
    setLoading(true);
    // Navigate to suggestions page; API will be called there
    navigate(`/course-suggestions?q=${encodeURIComponent(topic.trim())}`);
    setLoading(false);
  };

  const setExample = (t: string) => {
    setTopic(t);
    setError(null);
  };

  return (
    <div className="min-h-screen page-padding" style={{ background: 'linear-gradient(180deg, #0B0C1A 0%, #101226 100%)' }}>
      <div className="w-full max-w-xl mx-auto pt-16">
        <h1 style={{ fontSize: 'var(--h1-size)', lineHeight: 'var(--h1-line)', fontWeight: 'var(--h1-weight)' }} className="text-primary mb-4">What do you want to learn today?</h1>
        <div className="flex gap-2 items-center">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type a topic or question..."
            className="flex-1 px-4 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onKeyDown={(e) => { if (e.key === 'Enter') onGenerate(); }}
          />
          <button className="btn-pill bg-gradient-accent text-white px-6 py-3" onClick={onGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="mt-4 text-sm text-secondary">
          <div className="mb-2">Examples:</div>
          <div className="flex gap-2 flex-wrap">
            {['Metabolism and health', 'How AI works', 'The science of sleep'].map((ex) => (
              <button key={ex} className="px-3 py-1" style={{ border: '1px solid var(--border)', borderRadius: '999px' }} onClick={() => setExample(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
