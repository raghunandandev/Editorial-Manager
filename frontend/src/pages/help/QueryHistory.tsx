import React, { useState, useEffect } from 'react';
import { queriesAPI } from '../../services/api';
import { Loader2, MessageCircle, CheckCircle } from 'lucide-react';

interface Query {
  _id: string;
  message: string;
  reply?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  repliedAt?: string;
}

const QueryHistory: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const res = await queriesAPI.getUserQueries();
        if (res.success) {
          setQueries(res.data?.queries || []);
        }
      } catch (err) {
        console.error('Failed to load query history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQueries();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">My Query History</h1>
      <p className="mb-6 text-gray-600">View your submitted queries and responses from the Editor-in-Chief</p>

      {queries.length === 0 ? (
        <div className="rounded-md bg-gray-50 px-6 py-8 text-center">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-gray-600">No queries submitted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((q) => (
            <div key={q._id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex cursor-pointer items-start justify-between px-6 py-4" onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      {q.message.substring(0, 80)}
                      {q.message.length > 80 ? '...' : ''}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted: {new Date(q.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  {q.status === 'answered' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Answered
                      </span>
                    </>
                  )}
                  {q.status === 'pending' && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {expandedId === q._id && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Your Query:</h4>
                    <p className="whitespace-pre-wrap rounded-md bg-white px-4 py-3 text-sm text-gray-700">{q.message}</p>
                  </div>

                  {q.status === 'answered' && q.reply && (
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900">Editor Response:</h4>
                      <p className="whitespace-pre-wrap rounded-md bg-white px-4 py-3 text-sm text-gray-700">{q.reply}</p>
                      {q.repliedAt && (
                        <p className="mt-2 text-xs text-gray-500">
                          Replied: {new Date(q.repliedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {q.status === 'pending' && (
                    <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      Awaiting response from Editor-in-Chief...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryHistory;
