import { useState } from 'react';
import { Shield } from 'lucide-react';

const ROLE_ORDER = [
  'USER',
  'ORGANIZER',
  'SUPPORT_STAFF',
  'EVENT_MODERATOR',
  'FINANCE_TEAM',
  'MARKETING_TEAM',
  'TECHNICAL_STAFF',
  'ADMIN',
];

const ROLE_LABELS: Record<string, string> = {
  USER: 'User',
  ORGANIZER: 'Organizer',
  SUPPORT_STAFF: 'Support Staff',
  EVENT_MODERATOR: 'Event Moderator',
  FINANCE_TEAM: 'Finance Team',
  MARKETING_TEAM: 'Marketing Team',
  TECHNICAL_STAFF: 'Technical Staff',
  ADMIN: 'Admin',
};

export default function PromotionTab({ currentRole }: { currentRole: string }) {
  const [promotionRole, setPromotionRole] = useState('');
  const [promotionStatus, setPromotionStatus] = useState<string | null>(null);
  const [promotionLoading, setPromotionLoading] = useState(false);

  // Only show roles higher than current
  const currentIdx = ROLE_ORDER.indexOf(currentRole?.toUpperCase() || 'USER');
  const availableRoles = ROLE_ORDER.slice(currentIdx + 1);

  async function handlePromotionRequest(e: React.FormEvent) {
    e.preventDefault();
    setPromotionStatus(null);
    setPromotionLoading(true);
    try {
      const res = await fetch('/api/user/role-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedRole: promotionRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');
      setPromotionStatus('Request submitted! You will be notified by email.');
      setPromotionRole('');
    } catch (err: any) {
      setPromotionStatus(err.message || 'Failed to submit request');
    } finally {
      setPromotionLoading(false);
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 drop-shadow-lg">
        <Shield className="w-5 h-5 text-orange-400" />
        Request Role Promotion
      </h2>
      <form onSubmit={handlePromotionRequest} className="flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={promotionRole}
          onChange={e => setPromotionRole(e.target.value)}
          className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white"
          required
        >
          <option value="">Select a role</option>
          {availableRoles.map(role => (
            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-purple-600 text-white font-bold px-4 py-2 rounded hover:bg-purple-700 transition"
          disabled={promotionLoading}
        >
          {promotionLoading ? 'Submitting...' : 'Request Promotion'}
        </button>
      </form>
      {promotionStatus && <div className="mt-2 text-center text-sm text-white">{promotionStatus}</div>}
    </div>
  );
} 