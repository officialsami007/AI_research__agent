import React, { useState } from 'react';
import { Search, Loader, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResearchAgent() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [stages, setStages] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const stages_list = [
    { id: 1, name: 'Planning', description: 'Generating search strategy...' },
    { id: 2, name: 'Searching', description: 'Finding relevant articles...' },
    { id: 3, name: 'Analyzing', description: 'Extracting and scoring sources...' },
    { id: 4, name: 'Synthesizing', description: 'Combining findings...' },
    { id: 5, name: 'Reporting', description: 'Generating report...' }
  ];

  const runResearch = async () => {
    if (!topic.trim()) {
      setError('Please enter a research topic');
      return;
    }

    setLoading(true);
    setError('');
    setStages([]);
    setReport(null);

    try {
      // Simulate stages with delays for UX
      for (let i = 0; i < stages_list.length; i++) {
        setStages(stages_list.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call backend API
      const response = await fetch('http://localhost:5000/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Research failed. Ensure backend is running on port 5000');
      }

      const data = await response.json();
      setReport(data);
      setError('');
    } catch (err) {
      setError(err.message || 'An error occurred. Make sure the backend is running.');
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `research_${topic.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    const reportText = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-3">Autonomous Research Agent</h1>
          <p className="text-blue-100 text-lg">
            AI-powered research that searches multiple sources, analyzes credibility, and generates professional reports in minutes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Input Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8 shadow-2xl">
          <label className="block text-white text-sm font-semibold mb-3">Research Topic</label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && runResearch()}
              placeholder="e.g., AI in Healthcare, Climate Change Solutions, Latest Trading Algorithms..."
              className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none placeholder-slate-400 transition"
              disabled={loading}
            />
            <button
              onClick={runResearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Research
                </>
              )}
            </button>
          </div>
          
          {/* Example Topics */}
          {!loading && !report && (
            <div className="text-slate-400 text-xs mt-2">
              <span className="font-semibold">Example topics:</span> AI in Healthcare • Climate Change • Cryptocurrency • Remote Work • Renewable Energy • Machine Learning in Finance
            </div>
          )}
          
          {error && (
            <div className="mt-3 p-3 bg-red-900 text-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Progress Stages */}
        {loading && stages.length > 0 && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8 shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-6">Research Progress</h2>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center gap-4 animate-fade-in">
                  <div className="flex-shrink-0">
                    {stage.id === stages.length ? (
                      <Loader className="w-6 h-6 text-blue-400 animate-spin" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{stage.name}</p>
                    <p className="text-slate-400 text-sm">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Display */}
        {report && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
            {/* Report Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700">
              <div>
                <h2 className="text-3xl font-bold text-white">📊 Research Report</h2>
                <p className="text-slate-400 text-sm mt-1">Topic: {topic}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download JSON
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            {report.executive_summary && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">📋 Executive Summary</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{report.executive_summary}</p>
              </div>
            )}

            {/* Key Findings */}
            {report.key_findings && report.key_findings.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">🔍 Key Findings</h3>
                <div className="space-y-4">
                  {report.key_findings.map((finding, idx) => (
                    <div key={idx} className="bg-slate-700 hover:bg-slate-600 transition rounded-lg p-5 border border-slate-600">
                      <h4 className="text-white font-bold text-lg mb-2">{finding.title}</h4>
                      <p className="text-slate-200 text-base mb-3">{finding.description}</p>
                      {finding.evidence && (
                        <div className="bg-slate-800 rounded p-3 border-l-4 border-blue-500">
                          <p className="text-blue-300 text-sm">
                            <span className="font-semibold">💡 Evidence:</span> {finding.evidence}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conclusions */}
            {report.conclusions && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">✅ Conclusions</h3>
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
                  <p className="text-slate-100 leading-relaxed text-lg">{report.conclusions}</p>
                </div>
              </div>
            )}

            {/* Sources */}
            {report.sources && report.sources.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">📚 Sources Used ({report.sources.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {report.sources.map((source, idx) => (
                    <div key={idx} className="bg-slate-700 hover:bg-slate-600 transition rounded-lg p-4 border border-slate-600">
                      <div className="flex items-start gap-3">
                        <div className="text-slate-400 font-bold text-sm min-w-fit">{idx + 1}.</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm break-words">{source.title}</p>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs mt-1 block break-all"
                          >
                            {source.url}
                          </a>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="inline-block bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                              {source.source}
                            </span>
                            <span className={`inline-block text-xs px-3 py-1 rounded font-semibold ${
                              source.credibility_score >= 8 
                                ? 'bg-green-900 text-green-200' 
                                : source.credibility_score >= 6
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-red-900 text-red-200'
                            }`}>
                              ⭐ {source.credibility_score}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !report && !error && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="w-16 h-16 mx-auto text-slate-600" />
            </div>
            <p className="text-slate-300 text-xl font-semibold">Ready to research anything?</p>
            <p className="text-slate-400 text-base mt-2">Enter a topic above and let the AI handle the research</p>
            <p className="text-slate-500 text-sm mt-4">Results include credibility scores, evidence, and citations from real sources</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-700 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Powered by Llama 3.3 70B • Built for Autonomous AI Research</p>
        </div>
      </div>
    </div>
  );
}
