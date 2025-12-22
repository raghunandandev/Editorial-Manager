// User & system management
//AdminDashboard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../services/api';
import { queriesAPI } from '../services/api';
import { Shield, Users, FileText, Loader2, CheckCircle, XCircle, Send, UserCog, AlertCircle, RefreshCw, Plus, Pencil } from 'lucide-react';

type StatKey = 'totalUsers' | 'activeReviewers' | 'pendingManuscripts' | 'decisionsThisWeek';

interface DashboardStats {
  totalUsers: number;
  activeReviewers: number;
  pendingManuscripts: number;
  decisionsThisWeek: number;
}

type ManuscriptStatus = 'submitted' | 'under_review' | 'revisions_required' | 'accepted' | 'rejected' | 'selected';

interface PendingManuscript {
  id: string;
  title: string;
  author: string;
  domain: string;
  submittedOn: string;
  status: ManuscriptStatus;
  reviewer?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: Record<string, boolean>;
}

const defaultStats: DashboardStats = {
  totalUsers: 0,
  activeReviewers: 0,
  pendingManuscripts: 0,
  decisionsThisWeek: 0,
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [pendingManuscripts, setPendingManuscripts] = useState<PendingManuscript[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviewers, setReviewers] = useState<{ id: string; name: string; expertise: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignForm, setAssignForm] = useState({ manuscriptId: '', reviewerId: '' });
  const [assigning, setAssigning] = useState(false);
  const [roleSaving, setRoleSaving] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingQueriesList, setPendingQueriesList] = useState<any[]>([]);
  const [answeredQueriesList, setAnsweredQueriesList] = useState<any[]>([]);
  const [openQueryId, setOpenQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const loadDashboard = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const [dashboardRes, pendingRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getPendingManuscripts(),
      ]);

      if (dashboardRes.success) {
        const data = dashboardRes.data || {};
        const statsData = data.stats || {};
        setStats((prev) => ({
          ...prev,
          ...statsData,
          activeReviewers: statsData.totalReviewers ?? prev.activeReviewers,
          pendingManuscripts: statsData.pendingManuscripts ?? prev.pendingManuscripts,
        }));
        setUsers(data.users || []);
        setReviewers(data.reviewers || []);
      }

      if (pendingRes.success) {
        setPendingManuscripts(pendingRes.data?.manuscripts || []);
      }
      // Load queries (if available)
      try {
        const qres = await queriesAPI.getPending();
        if (qres.success) {
          const allQueries = qres.data?.queries || [];
          setPendingQueriesList(allQueries.filter((q: any) => q.status === 'pending'));
          setAnsweredQueriesList(allQueries.filter((q: any) => q.status === 'answered'));
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      setStatusMessage('Using local data while API is unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateStat = (key: StatKey, value: number) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.manuscriptId || !assignForm.reviewerId) return;

    setAssigning(true);
    setStatusMessage(null);
    try {
      await adminAPI.assignReviewer({
        manuscriptId: assignForm.manuscriptId,
        reviewerId: assignForm.reviewerId,
        // allow backend default dueDate
      });

      setPendingManuscripts((prev) =>
        prev.map((item) =>
          item.id === assignForm.manuscriptId
            ? { ...item, status: 'under_review', reviewer: reviewers.find((r) => r.id === assignForm.reviewerId)?.name }
            : item
        )
      );
      setStatusMessage('Reviewer assigned successfully.');
    } catch (error) {
      setStatusMessage('Reviewer assignment failed, kept local change only.');
    } finally {
      setAssigning(false);
    }
  };

  const toggleUserRole = (userId: string, role: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, roles: { ...user.roles, [role]: !user.roles[role] } } : user
      )
    );
  };

  const handleStatusUpdate = async (id: string, status: ManuscriptStatus) => {
    try {
      await adminAPI.setManuscriptStatus(id, status);
      setPendingManuscripts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      setStatusMessage('Manuscript status updated.');
    } catch (error) {
      setStatusMessage('Failed to update status.');
    }
  };

  const saveUserRoles = async (user: AdminUser) => {
    setRoleSaving((prev) => ({ ...prev, [user.id]: true }));
    setStatusMessage(null);
    try {
      await adminAPI.updateUserRoles({ userId: user.id, roles: user.roles });
      setStatusMessage(`Roles updated for ${user.name}.`);
    } catch (error) {
      setStatusMessage('Update failed, roles kept locally.');
    } finally {
      setRoleSaving((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const addDummyPending = () => {
    const id = `m-${Math.floor(Math.random() * 1000)}`;
    const newItem: PendingManuscript = {
      id,
      title: 'New Dummy Manuscript',
      author: 'Temp Author',
      domain: 'General',
      submittedOn: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    setPendingManuscripts((prev) => [newItem, ...prev]);
    setStats((prev) => ({ ...prev, pendingManuscripts: prev.pendingManuscripts + 1 }));
  };

  const availableManuscripts = useMemo(
    () => pendingManuscripts.filter((m) => m.status === 'submitted'),
    [pendingManuscripts]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Editorial manager controls for Admin / Editor-in-Chief</p>
          </div>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh from API
          </button>
        </div>

        {statusMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            <AlertCircle size={16} /> {statusMessage}
          </div>
        )}

        {/* Stats & quick edits */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {([
            { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'bg-blue-100 text-blue-700' },
            { key: 'activeReviewers', label: 'Active Reviewers', icon: Shield, color: 'bg-green-100 text-green-700' },
            { key: 'pendingManuscripts', label: 'Pending Manuscripts', icon: FileText, color: 'bg-yellow-100 text-yellow-700' },
            { key: 'decisionsThisWeek', label: 'Decisions This Week', icon: CheckCircle, color: 'bg-purple-100 text-purple-700' },
          ] as { key: StatKey; label: string; icon: any; color: string }[]).map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats[key]}</p>
                </div>
                <span className={`rounded-full p-2 ${color}`}>
                  <Icon size={20} />
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  value={stats[key]}
                  onChange={(e) => updateStat(key, Number(e.target.value))}
                  className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                />
                <Pencil size={14} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Pending manuscripts */}
        <div className="mb-8 rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Manuscripts</h2>
              <p className="text-sm text-gray-500">Assign reviewers directly from the queue</p>
            </div>
            <button
              onClick={addDummyPending}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add dummy manuscript
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingManuscripts.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-5 md:items-center">
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">By {item.author} • {item.domain}</p>
                </div>
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'accepted' || item.status === 'selected'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'under_review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  {item.reviewer && <p className="mt-1 text-xs text-gray-600">Reviewer: {item.reviewer}</p>}
                  <div className="mt-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item.id, e.target.value as ManuscriptStatus)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
                    >
                      {['submitted', 'under_review', 'revisions_required', 'accepted', 'rejected', 'selected'].map((status) => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Submitted on <span className="font-medium">{item.submittedOn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAssignForm((prev) => ({ ...prev, manuscriptId: item.id }))}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Send size={14} /> Assign
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAssignReviewer} className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Manuscript</label>
                <select
                  value={assignForm.manuscriptId}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, manuscriptId: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select manuscript</option>
                  {availableManuscripts.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Reviewer</label>
                <select
                  value={assignForm.reviewerId}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, reviewerId: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select reviewer</option>
                  {reviewers.map((rev) => (
                    <option key={rev.id} value={rev.id}>{rev.name} — {rev.expertise}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={assigning}
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {assigning ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {assigning ? 'Assigning...' : 'Assign Reviewer'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* User roles */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">User Roles</h2>
            <p className="text-sm text-gray-500">Update roles and sync with backend</p>
          </div>

          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-3 md:items-center">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['author', 'reviewer', 'editor', 'editorInChief'].map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!user.roles[role]}
                        onChange={() => toggleUserRole(user.id, role)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {role === 'editorInChief' ? 'Editor-in-Chief' : role}
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveUserRoles(user)}
                    disabled={roleSaving[user.id]}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {roleSaving[user.id] ? <Loader2 size={16} className="animate-spin" /> : <UserCog size={16} />}
                    {roleSaving[user.id] ? 'Saving...' : 'Save roles'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queries (Editor-in-Chief) */}
        <div className="mt-6 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Queries</h2>
            <p className="text-sm text-gray-500">Pending queries submitted by users</p>
          </div>

          <div className="divide-y divide-gray-100">
            {pendingQueriesList.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">No pending queries</div>
            ) : pendingQueriesList.map((q) => (
              <div key={q._id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{q.name} — <span className="text-sm text-gray-600">{q.email}</span></p>
                    <p className="mt-1 text-sm text-gray-600">Submitted: {new Date(q.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setOpenQueryId(openQueryId === q._id ? null : q._id)} className="rounded-md bg-gray-100 px-3 py-2 text-sm">{openQueryId === q._id ? 'Close' : 'Open'}</button>
                  </div>
                </div>

                {openQueryId === q._id && (
                  <div className="mt-4">
                    <div className="mb-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">{q.message}</div>
                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Enter your reply" />
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={async () => {
                        if (!replyText.trim()) return setStatusMessage('Reply cannot be empty');
                        try {
                          await queriesAPI.replyQuery(q._id, replyText.trim());
                          setPendingQueriesList((prev) => prev.filter(item => item._id !== q._id));
                          setReplyText('');
                          setOpenQueryId(null);
                          setStatusMessage('Reply sent successfully');
                        } catch (err) {
                          setStatusMessage('Failed to send reply');
                        }
                      }} className="rounded-md bg-blue-600 px-4 py-2 text-white">Send Reply</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Answered Queries History */}
        <div className="mt-6 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Query History</h2>
            <p className="text-sm text-gray-500">Answered queries and responses</p>
          </div>

          <div className="divide-y divide-gray-100">
            {answeredQueriesList.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">No answered queries yet</div>
            ) : answeredQueriesList.map((q) => (
              <div key={q._id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{q.name} — <span className="text-sm text-gray-600">{q.email}</span></p>
                    <p className="mt-1 text-sm text-gray-600">Submitted: {new Date(q.createdAt).toLocaleString()}</p>
                    {q.repliedAt && <p className="text-sm text-green-600">Replied: {new Date(q.repliedAt).toLocaleString()}</p>}
                  </div>
                  <div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Answered</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">User Query:</p>
                    <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">{q.message}</p>
                  </div>
                  {q.reply && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Your Response:</p>
                      <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-gray-700">{q.reply}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;