import React, { useState, useEffect } from 'react';
import { Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface ManuscriptAuthor {
  user: Author;
  isCorresponding: boolean;
  order?: number;
}

interface Manuscript {
  _id: string;
  title: string;
  abstract: string;
  keywords: string[];
  domain: string;
  authors: ManuscriptAuthor[];
  correspondingAuthor: Author;
  manuscriptFile: {
    public_id: string;
    url: string;
    pages?: number;
    size?: number;
  };
  status: string;
  submissionDate: string;
}

const JournalsAndBooks: React.FC = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Fetch accepted manuscripts on mount
  useEffect(() => {
    fetchManuscripts();
  }, []);

  // Handle search (client-side filtering)
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = manuscripts.filter(manuscript =>
        manuscript.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredManuscripts(filtered);
    } else {
      setFilteredManuscripts(manuscripts);
    }
  }, [searchQuery, manuscripts]);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/manuscripts/accepted');
      setManuscripts(response.data.manuscripts || []);
      setFilteredManuscripts(response.data.manuscripts || []);
    } catch (err: any) {
      console.error('Error fetching manuscripts:', err);
      setError('Failed to load journals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (manuscript: Manuscript) => {
    try {
      setDownloadingId(manuscript._id);
      
      // Get download URL from public endpoint (no auth required)
      const response: any = await api.get(`/manuscripts/accepted/${manuscript._id}/download`);
      
      // API interceptor returns response.data directly
      if (response.success && response.downloadUrl) {
        // Open download URL in new tab or trigger download
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.download = `${manuscript.title.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to get download link. Please try again.');
      }
    } catch (err: any) {
      console.error('Error downloading manuscript:', err);
      alert('Failed to download manuscript. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-96">
          <Loader2 className="w-12 h-12 animate-spin text-brand-blue mb-4" />
          <p className="text-gray-600">Loading journals and manuscripts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Journals & Books</h1>
        <p className="text-gray-600">Browse our collection of accepted and published journals</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by manuscript name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredManuscripts.length} result{filteredManuscripts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Manuscripts List */}
      <div className="space-y-6">
        {filteredManuscripts.length > 0 ? (
          filteredManuscripts.map((manuscript) => (
            <div
              key={manuscript._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {manuscript.title}
                  </h2>

                  {/* Abstract */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {manuscript.abstract}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Authors: </span>
                      <span className="text-gray-600">
                        {manuscript.authors
                          .map((a) => a.user.name)
                          .join(', ') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Domain: </span>
                      <span className="text-gray-600">{manuscript.domain}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Published: </span>
                      <span className="text-gray-600">
                        {new Date(manuscript.submissionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Keywords: </span>
                      <span className="text-gray-600">
                        {manuscript.keywords.slice(0, 3).join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(manuscript)}
                  disabled={downloadingId === manuscript._id}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {downloadingId === manuscript._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-2">
              {searchQuery
                ? 'No journals found matching your search.'
                : 'No accepted journals available at this time.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-brand-blue hover:underline text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalsAndBooks;
