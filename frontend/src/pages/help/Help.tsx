import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const u = JSON.parse(user);
        setName(`${u.firstName || ''} ${u.lastName || ''}`.trim());
        setEmail(u.email || '');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const validate = () => {
    const e: any = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Invalid email';
    if (!message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    try {
      await api.post('/queries', { name, email, message });
      setStatus('Your query has been submitted. The Editor-in-Chief will be notified.');
      setMessage('');
    } catch (err: any) {
      setStatus(err?.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Help / Queries</h1>
          <p className="text-gray-600">Use this form to contact the Editor-in-Chief. We will notify them and follow up by email.</p>
        </div>
        <button onClick={() => navigate('/my-queries')} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300">
          View My Queries
        </button>
      </div>

      {status && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800">{status}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Query / Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          {errors.message && <div className="mt-1 text-sm text-red-600">{errors.message}</div>}
        </div>

        <div>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">Submit Query</button>
        </div>
      </form>
    </div>
  );
};

export default HelpPage;
