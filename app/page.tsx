'use client';

import { useState } from 'react';
import { BookOpen, Brain, CheckCircle, Loader2 } from 'lucide-react';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: input,
          task_type: activeTab,
        }),
      });

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
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'explain'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Explain Concept
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-5 h-5 inline mr-2" />
              Study Notes
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'explain' && 'What concept would you like explained?'}
                {activeTab === 'quiz' && 'Generate quiz questions for:'}
                {activeTab === 'notes' && 'Create study notes for:'}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Binary Search Trees, Photosynthesis, etc."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Result:</h3>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {result}
                  </pre>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="text-center py-12 text-gray-400">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter a topic above to get started</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <BookOpen className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Simple Explanations</h3>
            <p className="text-gray-600 text-sm">
              Get complex topics explained in easy-to-understand language
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <CheckCircle className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Practice Quizzes</h3>
            <p className="text-gray-600 text-sm">
              Test your knowledge with AI-generated quiz questions
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Brain className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Study Materials</h3>
            <p className="text-gray-600 text-sm">
              Generate comprehensive notes for any subject
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
