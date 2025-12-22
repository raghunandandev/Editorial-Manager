import React, { useState } from 'react';
import { Rss, Link as LinkIcon, Copy, CheckCircle } from 'lucide-react';

const RSS: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const rssFeeds = [
    {
      id: 'all',
      title: 'All Content',
      description: 'Complete feed of all published articles and issues',
      url: 'https://example.com/rss/all'
    },
    {
      id: 'latest',
      title: 'Latest Issue',
      description: 'Feed for the most recent journal issue',
      url: 'https://example.com/rss/latest'
    },
    {
      id: 'articles',
      title: 'Articles in Press',
      description: 'Newly accepted articles before publication',
      url: 'https://example.com/rss/articles-in-press'
    },
    {
      id: 'special',
      title: 'Special Issues',
      description: 'Updates on special issues and article collections',
      url: 'https://example.com/rss/special-issues'
    }
  ];

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Rss className="w-8 h-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">RSS Feeds</h1>
          </div>
          <p className="text-gray-600 mb-8">
            Subscribe to our RSS feeds to stay updated with the latest publications, articles, and journal news. Add any of these feeds to your RSS reader.
          </p>

          <div className="space-y-6">
            {rssFeeds.map((feed) => (
              <div key={feed.id} className="border border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feed.title}</h3>
                    <p className="text-gray-600 mb-4">{feed.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded px-3 py-2 font-mono">
                      <LinkIcon className="w-4 h-4" />
                      <span className="break-all">{feed.url}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyUrl(feed.url, feed.id)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0"
                  >
                    {copied === feed.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use RSS Feeds</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">1.</span>
                <span>Copy the RSS feed URL for the content you want to follow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">2.</span>
                <span>Open your RSS reader application (e.g., Feedly, NewsBlur, or your browser's built-in reader)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">3.</span>
                <span>Add the feed URL to your reader to start receiving updates automatically</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSS;

