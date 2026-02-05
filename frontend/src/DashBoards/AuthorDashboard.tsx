import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye, MessageSquare, Upload } from 'lucide-react';
import { manuscriptAPI, downloadManuscriptFile, authAPI } from '../services/api';


const AuthorDashboard = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orcidEmail, setOrcidEmail] = useState<string | null>(null);
  const [orcidId, setOrcidId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: any[] }>({});
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});
  const [revisionFile, setRevisionFile] = useState<{ [key: string]: File }>({});
  const [revisionNotes, setRevisionNotes] = useState<{ [key: string]: string }>({});
  const [submittingRevision, setSubmittingRevision] = useState<{ [key: string]: boolean }>({});


  useEffect(() => {
    fetchMyManuscripts();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try { 
      const resp: any = await authAPI.getProfile();
      if (resp?.data?.user) {
        const user = resp.data.user;
        if (user.orcidVerified && user.orcidEmail) setOrcidEmail(user.orcidEmail);
        if (user.orcidVerified && user.orcidId) setOrcidId(user.orcidId);
      }
    } catch (e) {
    }
  };

  const fetchMyManuscripts = async () => {
    try {
      const response = await manuscriptAPI.getMyManuscripts();
      if (response.success) {
        const mss = response.data.manuscripts || [];
        setManuscripts(mss);
        mss.forEach(m => fetchReviewsForManuscript(m._id));
      } else {
        if (response.message) {
          alert(response.message);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsForManuscript = async (manuscriptId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/manuscript/${manuscriptId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(prev => ({
          ...prev,
          [manuscriptId]: data?.data?.reviews || []
        }));
      }
    } catch (error) {
    }
  };

  const toggleReviewsExpanded = (manuscriptId: string) => {
    if (!expandedReviews[manuscriptId] && !reviews[manuscriptId]) {
      fetchReviewsForManuscript(manuscriptId);
    }
    setExpandedReviews(prev => ({
      ...prev,
      [manuscriptId]: !prev[manuscriptId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="text-blue-600" size={20} />;
      case 'under_review': return <Clock className="text-yellow-600" size={20} />;
      case 'revisions_required': return <AlertCircle className="text-orange-600" size={20} />;
      case 'accepted': return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected': return <XCircle className="text-red-600" size={20} />;
      default: return <FileText className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'revisions_required': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = async (manuscript) => {
    try {
      const filename = `manuscript-${manuscript._id}.pdf`;
      await downloadManuscriptFile(manuscript._id, filename);
    } catch (error) {
      alert('Failed to download manuscript. Please try again.');
    }
  };

  const handleRevisionSubmit = async (manuscriptId: string) => {
    const file = revisionFile[manuscriptId];
    if (!file) {
      alert('Please select a file to submit');
      return;
    }

    setSubmittingRevision(prev => ({
      ...prev,
      [manuscriptId]: true
    }));

    try {
      const formData = new FormData();
      formData.append('revisionFile', file);
      if (revisionNotes[manuscriptId]) {
        formData.append('revisionNotes', revisionNotes[manuscriptId]);
      }

      const response = await manuscriptAPI.submitRevision(manuscriptId, formData);
      if (response.success) {
        alert('Revision submitted successfully! Reviewers will review your revised manuscript.');
        setRevisionFile(prev => {
          const newState = { ...prev };
          delete newState[manuscriptId];
          return newState;
        });
        setRevisionNotes(prev => {
          const newState = { ...prev };
          delete newState[manuscriptId];
          return newState;
        });
        await fetchMyManuscripts();
      } else {
        alert('Failed to submit revision: ' + response.message);
      }
    } catch (error) {
      alert('Error submitting revision. Please try again.');
    } finally {
      setSubmittingRevision(prev => ({
        ...prev,
        [manuscriptId]: false
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your manuscript submissions and reviewer feedback</p>
          {orcidId && (
            <p className="mt-1 text-sm text-gray-500">ORCID iD: <span className="font-medium text-gray-800">{orcidId}</span></p>
          )}
          {orcidEmail && (
            <p className="mt-1 text-sm text-gray-500">ORCID email: <span className="font-medium text-gray-800">{orcidEmail}</span></p>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link 
            to="/submit-manuscript" 
            className="flex items-center gap-4 rounded-lg bg-blue-600 p-6 text-white shadow-md transition-colors hover:bg-blue-700"
          >
            <Plus size={24} />
            <div>
              <h3 className="text-lg font-semibold">Submit New Manuscript</h3>
              <p className="text-sm text-blue-100">Submit your research paper for publication</p>
            </div>
          </Link>

          <Link 
            to="/my-manuscripts" 
            className="flex items-center gap-4 rounded-lg bg-green-600 p-6 text-white shadow-md transition-colors hover:bg-green-700"
          >
            <FileText size={24} />
            <div>
              <h3 className="text-lg font-semibold">My Manuscripts</h3>
              <p className="text-sm text-green-100">Track all your submissions</p>
            </div>
          </Link>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          
          <div className="p-6">
            {manuscripts.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="mb-2 text-lg font-medium text-gray-900">No manuscripts yet</h3>
                <p className="mb-6 text-gray-600">Start by submitting your first research paper</p>
                <Link 
                  to="/submit-manuscript" 
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Submit Your First Paper
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {manuscripts.slice(0, 5).map((manuscript) => (
                  <div key={manuscript._id} className="rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-gray-900">{manuscript.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Domain: {manuscript.domain}</span>
                            <span>Submitted: {formatDate(manuscript.submissionDate)}</span>
                            <span>Status: 
                              <span className={`ml-1 px-2 py-1 rounded text-xs ${getStatusColor(manuscript.status)}`}>
                                {manuscript.status.replace('_', ' ')}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(manuscript.status)}
                          <button
                            onClick={() => handleDownload(manuscript)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <Link
                            to={`/manuscript/${manuscript._id}`}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {reviews[manuscript._id] && reviews[manuscript._id].length > 0 && (
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => toggleReviewsExpanded(manuscript._id)}
                          className="w-full bg-blue-50 px-4 py-3 text-left hover:bg-blue-100"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} className="text-blue-600" />
                              <span className="font-medium text-blue-900">
                                {reviews[manuscript._id].length} Review(s)
                              </span>
                            </div>
                            <span className="text-sm text-blue-700">
                              {expandedReviews[manuscript._id] ? '▼' : '▶'}
                            </span>
                          </div>
                        </button>
                        
                        {expandedReviews[manuscript._id] && (
                          <div className="divide-y divide-gray-200 bg-gray-50 p-4">
                            {reviews[manuscript._id].map((review, idx) => (
                              <div key={idx} className="py-4 first:pt-0">
                                <div className="mb-3 flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {review.reviewer?.firstName} {review.reviewer?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">{review.reviewer?.email}</p>
                                  </div>
                                  <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                    review.recommendation === 'accept' ? 'bg-green-100 text-green-800' :
                                    review.recommendation === 'minor_revisions' ? 'bg-yellow-100 text-yellow-800' :
                                    review.recommendation === 'major_revisions' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {review.recommendation.replace(/_/g, ' ').toUpperCase()}
                                  </span>
                                </div>
                                
                                {review.scores && (
                                  <div className="mb-2 text-xs font-medium text-gray-700">
                                    Average Score: {(
                                      (review.scores.originality + review.scores.methodology + 
                                       review.scores.contribution + review.scores.clarity + 
                                       review.scores.references) / 5
                                    ).toFixed(2)}/5
                                  </div>
                                )}
                                
                                {review.commentsToAuthor && (
                                  <div className="mt-3 rounded bg-white p-3">
                                    <p className="text-xs font-semibold text-gray-700 uppercase">Reviewer Comments:</p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                      {review.commentsToAuthor}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {manuscript.status === 'revisions_required' && (
                      <div className="border-t border-orange-200 bg-orange-50 p-4">
                        <div className="mb-4">
                          <h4 className="mb-2 font-semibold text-orange-900">Submit Your Revised Manuscript</h4>
                          <p className="mb-4 text-sm text-orange-800">
                            The reviewers have requested revisions. Please upload your revised manuscript below.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Revised Manuscript *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setRevisionFile(prev => ({
                                    ...prev,
                                    [manuscript._id]: e.target.files![0]
                                  }));
                                }
                              }}
                              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                            {revisionFile[manuscript._id] && (
                              <p className="mt-1 text-xs text-green-600">
                                ✓ {revisionFile[manuscript._id].name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Revision Notes (Optional)
                            </label>
                            <textarea
                              placeholder="Briefly describe the changes you made in response to the reviewer feedback..."
                              value={revisionNotes[manuscript._id] || ''}
                              onChange={(e) => {
                                setRevisionNotes(prev => ({
                                  ...prev,
                                  [manuscript._id]: e.target.value
                                }));
                              }}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              rows={3}
                            />
                          </div>

                          <button
                            onClick={() => handleRevisionSubmit(manuscript._id)}
                            disabled={!revisionFile[manuscript._id] || submittingRevision[manuscript._id]}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <Upload size={16} />
                            {submittingRevision[manuscript._id] ? 'Submitting...' : 'Submit Revision'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {manuscripts.length > 5 && (
              <div className="mt-6 text-center">
                <Link 
                  to="/my-manuscripts" 
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  View All Manuscripts →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
