import React, { useEffect, useState } from 'react';
import  { api,reviewerAPI,downloadManuscriptFile } from '../services/api';

import {
  FileText, Loader2, CheckCircle, Clock, TrendingUp, Award, Download,
  Eye, Send, Filter, X, AlertCircle, FileCheck, Star, Calendar, User
} from 'lucide-react';

interface ReviewerStats {
  totalAssignments: number;
  awaitingReview: number;
  reviewSubmitted: number;
  averageScore: number;
  fastestReviewDays: number;
  topDomainReviewed: string | null;
  minorRevisions: number;
  majorRevisions: number;
  acceptedManuscripts: number;
  averageResponseTimeDays: number;
}

interface ReviewAssignment {
  _id: string;
  manuscript: {
    _id: string;
    title: string;
    abstract: string;
    domain: string;
    status: string;
    submissionDate: string;
    manuscriptFile: {
      url: string;
      public_id: string;
    };
    correspondingAuthor: {
      firstName: string;
      lastName: string;
      email: string;
      profile?: {
        affiliation: string;
      };
    };
  };
  editor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  dueDate: string;
  createdAt: string;
  review?: {
    _id: string;
    overallScore: number;
    recommendation: string;
    submittedDate: string;
    status: string;
  };
}

interface ManuscriptForReview {
  _id: string;
  title: string;
  abstract: string;
  keywords: string[];
  domain: string;
  submissionDate: string;
  manuscriptFile: {
    url: string;
    public_id: string;
  };
  correspondingAuthor: {
    firstName: string;
    lastName: string;
    email: string;
    profile?: {
      affiliation: string;
    };
  };
  authors: Array<{
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

interface ReviewFormData {
  scores: {
    originality: number;
    methodology: number;
    contribution: number;
    clarity: number;
    references: number;
  };
  commentsToAuthor: string;
  commentsToEditor: string;
  confidentialComments: string;
  recommendation: 'accept' | 'minor_revisions' | 'major_revisions' | 'reject';
}

const ReviewerDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReviewerStats | null>(null);
  const [assignments, setAssignments] = useState<ReviewAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<ReviewAssignment | null>(null);
  const [fullReviewDetails, setFullReviewDetails] = useState<any>(null);
  const [viewingManuscript, setViewingManuscript] = useState<ManuscriptForReview | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    scores: {
      originality: 3,
      methodology: 3,
      contribution: 3,
      clarity: 3,
      references: 3
    },
    commentsToAuthor: '',
    commentsToEditor: '',
    confidentialComments: '',
    recommendation: 'minor_revisions'
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [filterStatus]);

  const loadDashboard = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        reviewerAPI.getStatistics(),
        reviewerAPI.getMyReviews({ status: filterStatus === 'all' ? undefined : filterStatus })
      ]);

      if (statsRes.success) {
        setStats(statsRes.data.statistics);
      }

      if (reviewsRes.success) {
        setAssignments(reviewsRes.data.assignments || []);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load dashboard' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewManuscript = async (assignment: ReviewAssignment) => {
    try {
      const res = await reviewerAPI.getManuscriptForReview(assignment.manuscript._id);
      if (res.success) {
        setViewingManuscript(res.data.manuscript);
        setShowReviewForm(false);
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to load manuscript' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to load manuscript' });
    }
  };

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      await reviewerAPI.acceptAssignment(assignmentId);
      setMessage({ type: 'success', text: 'Assignment accepted successfully' });
      loadDashboard();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to accept assignment' });
    }
  };

  // In newClient/src/DashBoards/ReviewerDashboard.tsx
const handleSubmitReview = async () => {
  if (!viewingManuscript) return;

  // Validate all required fields
  const errors: Record<string, string> = {};

  if (!reviewForm.commentsToAuthor || reviewForm.commentsToAuthor.trim().length < 50) {
    errors.commentsToAuthor = 'Comments to author must be at least 50 characters';
  }

  if (!reviewForm.recommendation) {
    errors.recommendation = 'Please select a recommendation';
  }

  // Validate all scores
  const scoreFields = ['originality', 'methodology', 'contribution', 'clarity', 'references'];
  for (const field of scoreFields) {
    if (!reviewForm.scores[field] || reviewForm.scores[field] < 1 || reviewForm.scores[field] > 5) {
      errors[`scores.${field}`] = 'Please provide a valid score between 1 and 5';
    }
  }

  if (Object.keys(errors).length > 0) {
    setMessage({ type: 'error', text: 'Please fix the validation errors' });
    // You might want to set these errors in state to display them in the form
    setValidationErrors(errors);
    return;
  }

  setSubmittingReview(true);
  try {
    const response = await api.post(`/api/reviews/${viewingManuscript._id}/submit`, reviewForm);
    
    if (response.success) {
      setMessage({ type: 'success', text: 'Review submitted successfully' });
      // Reset form and close modal
      setReviewForm(initialReviewFormState);
      setViewingManuscript(null);
      setShowReviewForm(false);
      // Refresh the assignments list
      loadDashboard();
    } else {
      throw new Error(response.message || 'Failed to submit review');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
    setMessage({ type: 'error', text: errorMessage });
    
    // Handle validation errors from the server
    if (error.response?.data?.errors) {
      const serverErrors: Record<string, string> = {};
      error.response.data.errors.forEach((err: any) => {
        serverErrors[err.field] = err.message;
      });
      setValidationErrors(serverErrors);
    }
  } finally {
    setSubmittingReview(false);
  }
};

  // const handleSubmitReview = async () => {
  //   if (!viewingManuscript) return;

  //   // Validate form
  //   if (!reviewForm.commentsToAuthor || reviewForm.commentsToAuthor.length < 50) {
  //     setMessage({ type: 'error', text: 'Comments to author must be at least 50 characters' });
  //     return;
  //   }

  //   setSubmittingReview(true);
  //   try {
  //     await reviewerAPI.submitReview(viewingManuscript._id, reviewForm);
  //     setMessage({ type: 'success', text: 'Review submitted successfully' });
  //     setViewingManuscript(null);
  //     setShowReviewForm(false);
  //     setReviewForm({
  //       scores: {
  //         originality: 3,
  //         methodology: 3,
  //         contribution: 3,
  //         clarity: 3,
  //         references: 3
  //       },
  //       commentsToAuthor: '',
  //       commentsToEditor: '',
  //       confidentialComments: '',
  //       recommendation: 'minor_revisions'
  //     });
  //     loadDashboard();
  //   } catch (error: any) {
  //     setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit review' });
  //   } finally {
  //     setSubmittingReview(false);
  //   }
  // };

  // const handleDownloadManuscript = (url: string) => {
  //   window.open(url, '_blank');
  // };
  // In newClient/src/DashBoards/ReviewerDashboard.tsx
// const handleDownloadManuscript = async (manuscriptId: string) => {
//   try {
//     const response = await api.get(`/api/manuscripts/${manuscriptId}/download`, {
//       responseType: 'blob' // Important for file downloads
//     });
    
//     // Create a blob URL for the file
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `manuscript-${manuscriptId}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.parentNode?.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Download failed:', error);
//     alert('Failed to download manuscript. Please try again.');
//   }
// };
  
const handleDownloadManuscript = async (manuscriptId: string) => {
  try {
    await downloadManuscriptFile(manuscriptId, `manuscript-${manuscriptId}.pdf`);
  } catch (error: any) {
    console.error('Download failed:', error);
    setMessage({ 
      type: 'error', 
      text: error.message || 'Failed to download manuscript' 
    });
  }
};

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading reviewer dashboard...</p>
        </div>
      </div>
    );
  }

  if (viewingManuscript && !showReviewForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Review Manuscript</h1>
            <button
              onClick={() => {
                setViewingManuscript(null);
                setShowReviewForm(false);
              }}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">{viewingManuscript.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Domain: {viewingManuscript.domain} • Submitted: {new Date(viewingManuscript.submissionDate).toLocaleDateString()}
              </p>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{viewingManuscript.abstract}</p>
              </div>

              {viewingManuscript.keywords && viewingManuscript.keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingManuscript.keywords.map((keyword, idx) => (
                      <span key={idx} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Authors</h3>
                <div className="space-y-1">
                  {viewingManuscript.authors.map((author, idx) => (
                    <p key={idx} className="text-gray-700">
                      {author.user.firstName} {author.user.lastName} ({author.user.email})
                    </p>
                  ))}
                </div>
              </div>

              {viewingManuscript.manuscriptFile?.url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Manuscript File</h3>
                  {/* <button
                    onClick={() => handleDownloadManuscript(viewingManuscript.manuscriptFile.url)}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Download Manuscript
                  </button> */}

                  <button
                    onClick={() => handleDownloadManuscript(viewingManuscript._id)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    disabled={!viewingManuscript.manuscriptFile?.url}
                  >
                    Download Manuscript
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <FileCheck size={16} />
                  Start Review / Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReviewForm && viewingManuscript) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Submit Review</h1>
            <button
              onClick={() => setShowReviewForm(false)}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Back to Manuscript
            </button>
          </div>

          {message && (
            <div className={`mb-6 rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="rounded-lg bg-white shadow p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{viewingManuscript.title}</h2>
              <p className="text-sm text-gray-600">{viewingManuscript.domain}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Scoring (1-5 scale)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['originality', 'methodology', 'contribution', 'clarity', 'references'] as const).map((scoreKey) => (
                  <div key={scoreKey}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {scoreKey}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={reviewForm.scores[scoreKey]}
                        onChange={(e) => setReviewForm({
                          ...reviewForm,
                          scores: { ...reviewForm.scores, [scoreKey]: parseInt(e.target.value) }
                        })}
                        className="flex-1"
                      />
                      <span className="w-8 text-center font-semibold">{reviewForm.scores[scoreKey]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendation *
              </label>
              <select
                value={reviewForm.recommendation}
                onChange={(e) => setReviewForm({ ...reviewForm, recommendation: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="accept">Accept</option>
                <option value="minor_revisions">Minor Revisions</option>
                <option value="major_revisions">Major Revisions</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments to Author * (Minimum 50 characters)
              </label>
              <textarea
                value={reviewForm.commentsToAuthor}
                onChange={(e) => setReviewForm({ ...reviewForm, commentsToAuthor: e.target.value })}
                rows={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Provide detailed comments for the author..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewForm.commentsToAuthor.length} / 50 characters (minimum)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments to Editor (Optional)
              </label>
              <textarea
                value={reviewForm.commentsToEditor}
                onChange={(e) => setReviewForm({ ...reviewForm, commentsToEditor: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Additional comments for the editor..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidential Comments (Optional)
              </label>
              <textarea
                value={reviewForm.confidentialComments}
                onChange={(e) => setReviewForm({ ...reviewForm, confidentialComments: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Confidential comments (only visible to editors)..."
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowReviewForm(false)}
                className="rounded-md bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {submittingReview ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter(a => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviewer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your review assignments and track your statistics</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-md p-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <AlertCircle size={16} />
            {message.text}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Assignments</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalAssignments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Awaiting Review</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.awaitingReview}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Reviews Submitted</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.reviewSubmitted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.averageScore.toFixed(2)}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Fastest Review</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.fastestReviewDays} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Top Domain</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.topDomainReviewed || 'N/A'}</p>
                </div>
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Minor Revisions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.minorRevisions}</p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Major Revisions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.majorRevisions}</p>
                </div>
                <FileCheck className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Accepted Manuscripts</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.acceptedManuscripts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Review Assignments */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Review Assignments</h2>
                <p className="text-sm text-gray-500">View and manage your assigned manuscripts</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAssignments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No review assignments found</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => (
                <div key={assignment._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{assignment.manuscript.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.manuscript.abstract}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>Domain: {assignment.manuscript.domain}</span>
                            <span>Author: {assignment.manuscript.correspondingAuthor.firstName} {assignment.manuscript.correspondingAuthor.lastName}</span>
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            {assignment.review && (
                              <span className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500" />
                                Score: {assignment.review.overallScore?.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            assignment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : assignment.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : assignment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {assignment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptAssignment(assignment._id)}
                          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>
                      </>
                    )}
                    {(assignment.status === 'accepted' || assignment.status === 'pending') && (
                      <button
                        onClick={() => handleViewManuscript(assignment)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Eye size={14} />
                        Review
                      </button>
                    )}
                    {assignment.status === 'completed' && assignment.review && (
                      <button
                        onClick={async () => {
                          setSelectedAssignment(assignment);
                          try {
                            const res = await reviewerAPI.getReviewDetails(assignment.review!._id);
                            if (res.success) {
                              setFullReviewDetails(res.data.review);
                            }
                          } catch (error) {
                            console.error('Failed to load review details:', error);
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        <Eye size={14} />
                        View Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Details Modal */}
        {selectedAssignment && selectedAssignment.review && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setFullReviewDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-4 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedAssignment.manuscript.title}</h3>
                  <p className="text-sm text-gray-600">{selectedAssignment.manuscript.domain}</p>
                </div>

                {fullReviewDetails ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Overall Score</p>
                        <p className="text-2xl font-bold text-gray-900">{fullReviewDetails.overallScore?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommendation</p>
                        <p className="text-lg text-gray-900 capitalize">{fullReviewDetails.recommendation?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {fullReviewDetails.scores && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Scores</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {Object.entries(fullReviewDetails.scores).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-gray-500 capitalize">{key}</p>
                              <p className="text-lg font-semibold text-gray-900">{value as number}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Comments to Author</p>
                      <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">{fullReviewDetails.commentsToAuthor}</p>
                    </div>

                    {fullReviewDetails.commentsToEditor && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Comments to Editor</p>
                        <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">{fullReviewDetails.commentsToEditor}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-700">Submitted Date</p>
                      <p className="text-gray-900">{new Date(fullReviewDetails.submittedDate).toLocaleString()}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                    <p className="mt-2 text-gray-600">Loading review details...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerDashboard;
