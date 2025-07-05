
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Users, Trash2, RefreshCw, AlertTriangle, CheckCircle, Plus, UserPlus, Shield } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const EMPLOYEE_ROLES = [
  'SUPPORT_STAFF',
  'EVENT_MODERATOR',
  'FINANCE_TEAM',
  'MARKETING_TEAM',
  'TECHNICAL_STAFF',
];

export default function AdminStaffPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState(EMPLOYEE_ROLES[0]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
    fetchData();
  }, [status, router, session]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [staffRes, usersRes] = await Promise.all([
        fetch('/api/admin/staff'),
        fetch('/api/admin/users'),
      ]);
      const staffData = await staffRes.json();
      const usersData = await usersRes.json();

      if (staffData.error) setError(staffData.error);
      else setStaff(staffData.staff || []);

      if (usersData.error) setError(usersData.error);
      else setAllUsers(usersData.users || []);

    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedRole) {
      setError('Please select a user and a role.');
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, role: selectedRole }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Successfully added staff member.');
      setShowAddModal(false);
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this staff member? This will revoke their employee permissions.')) return;
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Successfully removed staff member.');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to remove staff member.');
    } finally {
      setActionLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>;
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Access Denied. Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20">
            <Home className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Staff Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all">
            <UserPlus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Error/Success Display */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-black/40 rounded-xl border border-white/20 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/60 border-b border-white/20">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-white/60">No staff members found.</td>
              </tr>
            )}
            {staff.map(member => (
              <tr key={member.id} className="border-b border-white/10 hover:bg-black/20">
                <td className="px-6 py-4 text-white">{member.name}</td>
                <td className="px-6 py-4 text-white/80 font-mono">{member.email}</td>
                <td className="px-6 py-4 text-white/80">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-400">
                    {member.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleRemoveStaff(member.id)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-2 rounded-lg hover:bg-red-600/30 transition-all disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Add Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-1 block">User</label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Select a User --</option>
                  {allUsers.filter(u => !staff.some(s => s.id === u.id)).map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm font-medium mb-1 block">Assign Role</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  {EMPLOYEE_ROLES.map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-all">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50">
                  {actionLoading ? 'Adding...' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
