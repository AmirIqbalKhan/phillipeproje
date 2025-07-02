"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ProfileCreatePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [interests, setInterests] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!session?.user?.email) {
      setError("User email not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
          avatar,
          email: session.user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Interests (comma separated)</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
                placeholder="e.g. music, tech, sports"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Avatar URL (optional)</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
                placeholder="https://..."
              />
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 