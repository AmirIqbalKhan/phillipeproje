
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Shield, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface RoleWithPermissions {
  role: string;
  permissions: string[];
}

export default function AdminRolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
    fetchRoles();
  }, [status, router, session]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setRoles(data.roles || []);
        setAllPermissions(data.allPermissions || []);
      }
    } catch (err) {
      setError('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (roleName: string, permission: string, isChecked: boolean) => {
    setRoles(currentRoles =>
      currentRoles.map(role => {
        if (role.role === roleName) {
          const newPermissions = isChecked
            ? [...role.permissions, permission]
            : role.permissions.filter(p => p !== permission);
          return { ...role, permissions: newPermissions };
        }
        return role;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      for (const role of roles) {
        const res = await fetch('/api/admin/roles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(role),
        });
        const data = await res.json();
        if (data.error) throw new Error(`Failed to save permissions for ${role.role}`);
      }
      setSuccess('All role permissions saved successfully!');
    } catch (err: any) { 
      setError(err.message || 'An unknown error occurred while saving.');
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold">Role & Permission Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRoles} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition-all disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save All Changes'}
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

      {/* Roles and Permissions Grid */}
      <div className="space-y-8">
        {roles.map(role => (
          <div key={role.role} className="bg-black/40 rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              {role.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPermissions.map(permission => (
                <label key={permission} className="flex items-center gap-2 p-3 bg-black/30 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 bg-black/50 border-white/30 rounded text-purple-500 focus:ring-purple-500"
                    checked={role.permissions.includes(permission)}
                    onChange={e => handlePermissionChange(role.role, permission, e.target.checked)}
                  />
                  <span className="text-white/80 text-sm font-mono">{permission}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
