"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function EventRegisterPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [splitCost, setSplitCost] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [splitEmails, setSplitEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSplitCountChange = (count: number) => {
    setSplitCount(count);
    setSplitEmails(Array(count - 1).fill(""));
  };

  const handleSplitEmailChange = (idx: number, value: string) => {
    setSplitEmails((prev) => prev.map((e, i) => (i === idx ? value : e)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Register the user for the event and get Stripe Checkout URL
      const res = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          splitCost,
          splitCount: splitCost ? splitCount : undefined,
          splitEmails: splitCost ? splitEmails : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
        return;
      }
      setSuccess("Registration successful! (Payment logic not implemented)");
      setTimeout(() => router.push(`/event/${params.id}`), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Event Registration</h2>
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
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={splitCost}
                onChange={(e) => setSplitCost(e.target.checked)}
                className="mr-2"
                id="split-cost"
              />
              <label htmlFor="split-cost" className="text-gray-700">Split cost with others?</label>
            </div>
            {splitCost && (
              <div className="mt-2">
                <label className="block text-gray-700 font-semibold mb-1">Number of people splitting (including you)</label>
                <input
                  type="number"
                  min={2}
                  value={splitCount}
                  onChange={(e) => handleSplitCountChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500 mb-2"
                />
                {[...Array(splitCount - 1)].map((_, idx) => (
                  <input
                    key={idx}
                    type="email"
                    placeholder={`Email of person #${idx + 2}`}
                    value={splitEmails[idx] || ""}
                    onChange={(e) => handleSplitEmailChange(idx, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500 mb-2"
                  />
                ))}
                <p className="text-xs text-gray-500">(They will receive an invite to pay their share)</p>
              </div>
            )}
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register & Pay"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 