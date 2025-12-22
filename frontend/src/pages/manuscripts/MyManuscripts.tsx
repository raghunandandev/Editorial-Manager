//MyManuscripts.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { manuscriptAPI, downloadManuscriptFile } from '../../services/api';

const MyManuscripts = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const manuscriptsPerPage = 10;

  useEffect(() => {
    fetchMyManuscripts();
  }, []);

  const fetchMyManuscripts = async () => {
    try {
      const response = await manuscriptAPI.getMyManuscripts();
      if (response.success) {
        setManuscripts(response.data.manuscripts || []);
      } else {
        console.error('Error in response:', response.message);
        alert(response.message || 'Error loading manuscripts');
      }
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
      alert('Error loading manuscripts');
    } finally {
      setLoading(false);
    }
  };

  // Filter manuscripts based on search and status
  const filteredManuscripts = manuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manuscript.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || manuscript.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastManuscript = currentPage * manuscriptsPerPage;
  const indexOfFirstManuscript = indexOfLastManuscript - manuscriptsPerPage;
  const currentManuscripts = filteredManuscripts.slice(indexOfFirstManuscript, indexOfLastManuscript);
  const totalPages = Math.ceil(filteredManuscripts.length / manuscriptsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="text-blue-500" size={18} />;
      case 'under_review': return <FileText className="text-yellow-500" size={18} />;
      case 'revisions_required': return <AlertCircle className="text-orange-500" size={18} />;
      case 'accepted': return <CheckCircle className="text-green-500" size={18} />;
      case 'rejected': return <XCircle className="text-red-500" size={18} />;
      default: return <FileText className="text-gray-500" size={18} />;
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
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
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
      if (!manuscript._id) {
        alert('File not available for download');
        return;
      }
      await downloadManuscriptFile(manuscript._id, `manuscript-${manuscript._id}.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download manuscript. Please try again.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your manuscripts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Manuscripts</h1>
              <p className="mt-2 text-gray-600">
                Manage and track all your submitted research papers
              </p>
            </div>
            <Link
              to="/submit-manuscript"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Submit New Manuscript
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{manuscripts.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">
              {manuscripts.filter(m => m.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {manuscripts.filter(m => m.status === 'under_review').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-2xl font-bold text-green-600">
              {manuscripts.filter(m => m.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-2xl font-bold text-red-600">
              {manuscripts.filter(m => m.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search manuscripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="revisions_required">Revisions Required</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {currentManuscripts.length} of {filteredManuscripts.length} manuscripts
            </div>
          </div>
        </div>

        {/* Manuscripts Table */}
        <div className="rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Domain</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Submitted</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentManuscripts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="text-lg font-medium text-gray-900">No manuscripts found</h3>
                      <p className="text-gray-600">
                        {manuscripts.length === 0 
                          ? "You haven't submitted any manuscripts yet."
                          : "No manuscripts match your search criteria."
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentManuscripts.map((manuscript) => (
                    <tr key={manuscript._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{manuscript.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {manuscript.abstract?.substring(0, 100)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                          {manuscript.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(manuscript.submissionDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(manuscript.status)}`}>
                            {getStatusText(manuscript.status)}
                          </span>
                          {getStatusIcon(manuscript.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(manuscript)}
                            className="rounded p-1 text-blue-600 hover:bg-blue-50"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <Link
                            to={`/manuscript/${manuscript._id}`}
                            className="rounded p-1 text-green-600 hover:bg-green-50"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`rounded border px-3 py-1 text-sm ${
                        currentPage === page
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyManuscripts;