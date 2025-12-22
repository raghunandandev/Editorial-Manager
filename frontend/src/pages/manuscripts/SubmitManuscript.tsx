//SubmitManuscripts.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { manuscriptAPI } from '../../services/api';

const SubmitManuscript = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    domain: ''
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Please select a manuscript file');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('abstract', formData.abstract);
      submitData.append('keywords', formData.keywords);
      submitData.append('domain', formData.domain);
      submitData.append('manuscript', file);

      const response = await manuscriptAPI.submitManuscript(submitData);
      
      if (response.success) {
        alert('Manuscript submitted successfully!');
        navigate('/author-dashboard');
      } else {
        setError(response.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Submit New Manuscript</h1>
            <p className="text-gray-600">Submit your research paper for publication</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields same as before */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Manuscript Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter manuscript title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Research Domain *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Domain</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Abstract *
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter abstract"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Manuscript File (PDF) *
              </label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="manuscript-file"
                />
                <label htmlFor="manuscript-file" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                  <p className="mb-1 text-lg font-medium text-gray-900">
                    {file ? file.name : 'Click to upload PDF'}
                  </p>
                  <p className="text-sm text-gray-500">PDF format only</p>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/author-dashboard')}
                className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Manuscript'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitManuscript;