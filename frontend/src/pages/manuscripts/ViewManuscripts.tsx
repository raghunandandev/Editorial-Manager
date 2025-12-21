//ViewManuscripts.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Mail,
  Building
} from 'lucide-react';
import { manuscriptAPI, downloadManuscriptFile } from '../../services/api';

const ViewManuscript = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchManuscript();
  }, [id]);

  const fetchManuscript = async () => {
    try {
      const response = await manuscriptAPI.getManuscript(id);
      if (response.success) {
        setManuscript(response.data.manuscript);
      } else {
        setError(response.message || 'Manuscript not found');
      }
    } catch (error) {
      console.error('Error fetching manuscript:', error);
      setError('Manuscript not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="text-blue-500" size={20} />;
      case 'under_review': return <FileText className="text-yellow-500" size={20} />;
      case 'revisions_required': return <AlertCircle className="text-orange-500" size={20} />;
      case 'accepted': return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revisions_required': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'revisions_required': 'Revisions Required',
      'accepted': 'Accepted',
      'rejected': 'Rejected',
      'published': 'Published'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    if (!manuscript?._id) {
      alert('File not available for download');
      return;
    }
    try {
      const filename = `manuscript-${manuscript._id}.pdf`;
      await downloadManuscriptFile(manuscript._id, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download manuscript. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading manuscript details...</p>
        </div>
      </div>
    );
  }

  if (error || !manuscript) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Manuscript Not Found</h1>
          <p className="mb-6 text-gray-600">{error || 'The manuscript you are looking for does not exist.'}</p>
          <Link
            to="/author-dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/author-dashboard"
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{manuscript.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Submitted: {formatDate(manuscript.submissionDate)}
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={16} />
                  Manuscript ID: {manuscript._id}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Status Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Submission Status</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full border ${getStatusColor(manuscript.status)}`}>
                    <span className="font-medium">{getStatusText(manuscript.status)}</span>
                  </div>
                  {getStatusIcon(manuscript.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Last updated: {formatDate(manuscript.updatedAt || manuscript.createdAt)}
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Abstract</h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-700">
                {manuscript.abstract}
              </p>
            </div>

            {/* Keywords */}
            {manuscript.keywords && manuscript.keywords.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {manuscript.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File Information */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Manuscript File</h2>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">Manuscript PDF</p>
                    <p className="text-sm text-gray-600">
                      Size: {manuscript.manuscriptFile?.size ? (manuscript.manuscriptFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Author Information */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Author Information</h2>
              <div className="space-y-4">
                {manuscript.authors?.map((author, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <User className="mt-1 text-gray-400" size={18} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {author.user?.firstName} {author.user?.lastName}
                        {author.isCorresponding && (
                          <span className="ml-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                            Corresponding Author
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail size={14} />
                        {author.user?.email}
                      </p>
                      {author.user?.profile?.affiliation && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                          <Building size={14} />
                          {author.user.profile.affiliation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manuscript Details */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Manuscript Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium text-gray-900">{manuscript.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submission Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(manuscript.submissionDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Round:</span>
                  <span className="font-medium text-gray-900">
                    Round {manuscript.currentRound || 1}
                  </span>
                </div>
                {manuscript.publicationCharges && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publication Charges:</span>
                      <span className="font-medium text-gray-900">
                        ${manuscript.publicationCharges.totalAmount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${
                        manuscript.publicationCharges.isPaid ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {manuscript.publicationCharges.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Assigned Editors */}
            {manuscript.assignedEditors && manuscript.assignedEditors.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Assigned Editors</h2>
                <div className="space-y-3">
                  {manuscript.assignedEditors.map((assignment, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {assignment.editor?.firstName} {assignment.editor?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Assigned: {formatDate(assignment.assignedDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Download size={18} />
                  Download Manuscript
                </button>
                <Link
                  to="/author-dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Back to Dashboard
                </Link>
                {manuscript.status === 'revisions_required' && (
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    <Edit size={18} />
                    Submit Revision
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewManuscript;