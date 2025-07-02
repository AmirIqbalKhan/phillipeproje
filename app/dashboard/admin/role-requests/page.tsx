"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RolePromotionRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchRequests();
    // eslint-disable-next-line
  }, [status]);

  async function fetchRequests() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/role-requests");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch requests");
      setRequests(data.requests);
    } catch (err: any) {
      setError(err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionStatus(null);
    try {
      const res = await fetch(`/api/admin/role-requests/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setActionStatus(`Request ${action}d successfully.`);
      fetchRequests();
    } catch (err: any) {
      setActionStatus(err.message || "Action failed");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Role Promotion Requests</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black/60 rounded-xl border border-white/20">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-white/20">User</th>
                <th className="px-4 py-2 border-b border-white/20">Email</th>
                <th className="px-4 py-2 border-b border-white/20">Requested Role</th>
                <th className="px-4 py-2 border-b border-white/20">Status</th>
                <th className="px-4 py-2 border-b border-white/20">Requested At</th>
                <th className="px-4 py-2 border-b border-white/20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-white/10">
                  <td className="px-4 py-2">{req.user?.name || "-"}</td>
                  <td className="px-4 py-2">{req.user?.email || "-"}</td>
                  <td className="px-4 py-2">{req.requestedRole}</td>
                  <td className="px-4 py-2">{req.status}</td>
                  <td className="px-4 py-2">{new Date(req.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {req.status === "PENDING" ? (
                      <>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                          onClick={() => handleAction(req.id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleAction(req.id, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {actionStatus && <div className="mt-4 text-center text-sm text-white">{actionStatus}</div>}
    </div>
  );
} 