import React, { useState, useEffect } from 'react';
import { MessageSquare, FileText, User, Award } from 'lucide-react';
import { manuscriptAPI } from '../services/api';

interface Review {
  _id: string;
  manuscript: { _id: string; title: string };
  reviewer: { firstName: string; lastName: string; email: string; profile?: { expertise?: string[]; affiliation?: string } };
  recommendation: string;
  scores: { originality: number; methodology: number; contribution: number; clarity: number; references: number };
  commentsToAuthor: string;
  commentsToEditor?: string;
  submittedDate: string;
  status: string;
}

interface Manuscript {
  _id: string;
  title: string;
  reviews: Review[];
}

const EditorReviewHistory = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedManuscript, setExpandedManuscript] = useState<string | null>(null);

  useEffect(() => {
    fetchAllManuscriptsWithReviews();
  }, []);

  const fetchAllManuscriptsWithReviews = async () => {
    try {
      // Fetch from admin pending manuscripts endpoint first (requires editor/admin role)
      const resp = await fetch('http://localhost:3000/api/admin/pending-manuscripts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (resp.ok) {
        const adminData = await resp.json();
        const pendingMs = adminData?.data?.manuscripts || [];
        
        // Fetch reviews for each manuscript
        const manuscriptsWithReviews = await Promise.all(
          pendingMs.map(async (m: any) => {
            try {
              const reviewResp = await fetch(
                `http://localhost:3000/api/reviews/manuscript/${m.id || m._id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              if (reviewResp.ok) {
                const reviewData = await reviewResp.json();
                return {
                  _id: m.id || m._id,
                  title: m.title,
                  reviews: reviewData?.data?.reviews || []
                };
              }
            } catch (e) {
              console.warn(`Failed to fetch reviews for manuscript ${m.id}:`, e);
            }
            return { _id: m.id || m._id, title: m.title, reviews: [] };
          })
        );
        setManuscripts(manuscriptsWithReviews.filter(m => m.reviews.length > 0));
      }
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'accept':
        return 'bg-green-100 text-green-800';
      case 'minor_revisions':
        return 'bg-yellow-100 text-yellow-800';
      case 'major_revisions':
        return 'bg-orange-100 text-orange-800';
      case 'reject':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAverageScore = (scores: any) => {
    const values = Object.values(scores).filter(v => typeof v === 'number') as number[];
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading review history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review History</h2>
        <p className="mt-1 text-gray-600">Reviews submitted for your manuscripts</p>
      </div>

      {manuscripts.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No reviews yet</h3>
          <p className="text-gray-600">Manuscripts will appear here once reviewers submit their feedback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {manuscripts.map((manuscript) => (
            <div key={manuscript._id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
              {/* Manuscript Header */}
              <div
                onClick={() => setExpandedManuscript(expandedManuscript === manuscript._id ? null : manuscript._id)}
                className="cursor-pointer border-b border-gray-200 bg-gray-50 p-4 hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{manuscript.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{manuscript.reviews.length} review(s) received</p>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {expandedManuscript === manuscript._id ? '▼' : '▶'}
                  </div>
                </div>
              </div>

              {/* Reviews Details */}
              {expandedManuscript === manuscript._id && (
                <div className="divide-y divide-gray-200 p-4">
                  {manuscript.reviews.map((review) => (
                    <div key={review._id} className="py-4 first:pt-0">
                      {/* Reviewer Info & Recommendation */}
                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Reviewer</p>
                          <p className="mt-1 font-medium text-gray-900">
                            {review.reviewer.firstName} {review.reviewer.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{review.reviewer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Recommendation</p>
                          <p className={`mt-1 inline-block rounded px-2 py-1 text-xs font-semibold ${getRecommendationColor(review.recommendation)}`}>
                            {review.recommendation.replace(/_/g, ' ').toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Submitted</p>
                          <p className="mt-1 text-gray-900">{review.submittedDate ? formatDate(review.submittedDate) : 'N/A'}</p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="mb-4 rounded bg-blue-50 p-3">
                        <p className="mb-2 text-sm font-semibold text-gray-900">Scores</p>
                        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
                          <div>
                            <span className="text-gray-600">Originality:</span>
                            <span className="ml-1 font-medium">{review.scores.originality}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Methodology:</span>
                            <span className="ml-1 font-medium">{review.scores.methodology}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Contribution:</span>
                            <span className="ml-1 font-medium">{review.scores.contribution}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Clarity:</span>
                            <span className="ml-1 font-medium">{review.scores.clarity}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">References:</span>
                            <span className="ml-1 font-medium">{review.scores.references}/5</span>
                          </div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-gray-700">
                          Avg Score: {calculateAverageScore(review.scores)}/5
                        </p>
                      </div>

                      {/* Comments to Author */}
                      {review.commentsToAuthor && (
                        <div className="mb-4 rounded bg-gray-50 p-3">
                          <p className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                            <MessageSquare size={16} className="mr-2" />
                            Comments to Author
                          </p>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">{review.commentsToAuthor}</p>
                        </div>
                      )}

                      {/* Comments to Editor (if visible to editor) */}
                      {review.commentsToEditor && (
                        <div className="rounded bg-yellow-50 p-3">
                          <p className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                            <MessageSquare size={16} className="mr-2" />
                            Comments to Editor
                          </p>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">{review.commentsToEditor}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorReviewHistory;
