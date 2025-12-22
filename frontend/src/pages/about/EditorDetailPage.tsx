import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Building, Globe, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const EditorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [editor, setEditor] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/editor-profile/${id}`);
        if (!res.ok) throw new Error('Editor not found');
        const json = await res.json();
        setEditor(json.data);
        // initialize edit data and allow image fallback from navigation state
        setEditData({ ...(json.data.profile || {}), image: (json.data.profile?.image || (location.state as any)?.image || '') });
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    if (id) loadEditor();
  }, [id]);

  const isOwnProfile = currentUser?._id === id;
  const canEdit = isOwnProfile && (editor?.roles?.editor || editor?.roles?.editorInChief);

  const handleSave = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiUrl}/api/editor-profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile: editData })
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const json = await res.json();
      setEditor(json.data);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!editor) return <div className="p-8 text-center">Editor not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/editorial-board')}
          className="flex items-center gap-2 text-brand-blue hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Editorial Board
        </button>

        {/* Editor Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {`${editor.firstName} ${editor.lastName}`}
              </h1>
              <p className="text-brand-orange font-semibold mt-1">
                {editor.roles?.editorInChief ? 'Editor-in-Chief' : 'Associate Editor'}
              </p>
            </div>
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Image */}
          {((editor.profile?.image) || (location.state as any)?.image || editData.image) && (
            <div className="mb-6 flex justify-center">
              <img
                src={isEditing ? editData.image : (editor.profile?.image || (location.state as any)?.image || '')}
                alt={`${editor.firstName} ${editor.lastName}`}
                className="w-40 h-40 rounded-full object-cover border-4 border-brand-blue"
              />
            </div>
          )}

          {/* Image edit field */}
          {isEditing && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editData.image || ''}
                  onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, image: '' })}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter an image URL to use as the profile picture. Use Remove to clear the image.</p>
            </div>
          )}

          {/* Editable Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              ) : (
                <p className="text-gray-600">{editor.profile?.title || 'N/A'}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.department || ''}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              ) : (
                <p className="text-gray-600">{editor.profile?.department || 'N/A'}</p>
              )}
            </div>

            {/* Affiliation */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Building size={16} />
                Affiliation / Institution
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.affiliation || ''}
                  onChange={(e) => setEditData({ ...editData, affiliation: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              ) : (
                <p className="text-gray-600">{editor.profile?.affiliation || 'N/A'}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Mail size={16} />
                Email
              </label>
              <p className="text-gray-600">{editor.email}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              ) : (
                <p className="text-gray-600">{editor.profile?.phone || 'N/A'}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Globe size={16} />
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={editData.website || ''}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="https://example.com"
                />
              ) : (
                <p className="text-gray-600">
                  {editor.profile?.website ? (
                    <a href={editor.profile.website} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                      {editor.profile.website}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Biography
              </label>
              {isEditing ? (
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue h-24"
                  placeholder="Write a short biography..."
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">{editor.profile?.bio || 'No biography provided'}</p>
              )}
            </div>

            {/* Expertise */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fields of Expertise
              </label>
              {isEditing ? (
                <textarea
                  value={(editData.expertise || []).join(', ')}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      expertise: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })
                  }
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue h-16"
                  placeholder="Enter expertise areas separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editor.profile?.expertise && editor.profile.expertise.length > 0 ? (
                    editor.profile.expertise.map((exp: string, idx: number) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {exp}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No expertise areas specified</p>
                  )}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3">Social & Professional Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Twitter</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: { ...editData.socialLinks, twitter: e.target.value }
                        })
                      }
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="@username"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {editor.profile?.socialLinks?.twitter ? (
                        <a
                          href={`https://twitter.com/${editor.profile.socialLinks.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          {editor.profile.socialLinks.twitter}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: { ...editData.socialLinks, linkedin: e.target.value }
                        })
                      }
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Profile URL"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {editor.profile?.socialLinks?.linkedin ? (
                        <a
                          href={editor.profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">ResearchGate</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.socialLinks?.researchGate || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: { ...editData.socialLinks, researchGate: e.target.value }
                        })
                      }
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Profile URL"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {editor.profile?.socialLinks?.researchGate ? (
                        <a
                          href={editor.profile.socialLinks.researchGate}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          ResearchGate
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-8 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData(editor.profile || {});
                }}
                className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorDetailPage;
