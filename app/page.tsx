'use client';

import { useState } from 'react';
import { BookOpen, Brain, CheckCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type TaskType = 'explain' | 'quiz' | 'notes';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TaskType>('explain');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: input,
            task_type: activeTab,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Assistant AI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your personal AI tutor powered by Pydantic AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['explain', 'quiz', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TaskType)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'explain' && <BookOpen className="inline mr-2" />}
                {tab === 'quiz' && <CheckCircle className="inline mr-2" />}
                {tab === 'notes' && <Brain className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Backpropagation"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-blue max-w-none"
                >
                  {result}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
