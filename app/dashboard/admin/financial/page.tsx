"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  DollarSign, 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  Clock,
  User,
  MapPin
} from 'lucide-react'

export default function AdminFinancialPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState<any>({})
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/financial')
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setFinancialData(data)
      }
    } catch (err) {
      setError('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }

  const handlePayoutAction = async (paymentId: string, action: string) => {
    setUpdating(paymentId)
    try {
      const response = await fetch('/api/admin/financial', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId, 
          payoutStatus: action === 'approve' ? 'PROCESSED' : 'HOLD'
        })
      })
      const data = await response.json()
      if (data.payment) {
        fetchFinancialData()
      }
    } catch (err) {
      setError('Failed to update payout status')
    } finally {
      setUpdating(null)
    }
  }

  const handleRefund = async (paymentId: string, refundAmount: number, reason: string) => {
    setUpdating(paymentId)
    try {
      const response = await fetch('/api/admin/financial', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId, 
          refundAmount,
          refundReason: reason
        })
      })
      const data = await response.json()
      if (data.payment) {
        fetchFinancialData()
      }
    } catch (err) {
      setError('Failed to process refund')
    } finally {
      setUpdating(null)
    }
  }

  const handleBulkPayout = async () => {
    if (selectedPayments.length === 0) return
    
    setUpdating('bulk')
    try {
      const response = await fetch('/api/admin/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'process_payouts',
          paymentIds: selectedPayments
        })
      })
      const data = await response.json()
      if (data.success) {
        setSelectedPayments([])
        fetchFinancialData()
      }
    } catch (err) {
      setError('Failed to process bulk payouts')
    } finally {
      setUpdating(null)
    }
  }

  const exportReport = async (format: string = 'csv') => {
    try {
      const response = await fetch('/api/admin/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'export_report',
          format
        })
      })
      const data = await response.json()
      if (data.success) {
        const csvContent = data.data.map((row: any) => 
          Object.values(row).join(',')
        ).join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Failed to export report')
    }
  }

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/admin" 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20"
          >
            <Home className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Financial Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchFinancialData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={() => exportReport()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 mb-6">
        <div className="flex border-b border-white/20">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'payouts', label: 'Payouts', icon: DollarSign },
            { id: 'refunds', label: 'Refunds', icon: RefreshCw }
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center text-white/60">Loading financial data...</div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white/60 text-sm">Total Revenue</h3>
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${financialData.reports?.totalRevenue?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white/60 text-sm">Net Revenue</h3>
                        <DollarSign className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${financialData.reports?.netRevenue?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white/60 text-sm">Pending Payouts</h3>
                        <Clock className="w-5 h-5 text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${financialData.reports?.pendingPayouts?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white/60 text-sm">Total Refunds</h3>
                        <RefreshCw className="w-5 h-5 text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${financialData.reports?.totalRefunds?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                      <div className="space-y-3">
                        {financialData.transactions?.slice(0, 5).map((tx: any) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
                            <div>
                              <p className="text-white font-medium text-sm">{tx.event.name}</p>
                              <p className="text-white/60 text-xs">{tx.user.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">${tx.amount}</p>
                              <p className="text-white/60 text-xs">{tx.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4">Pending Payouts</h3>
                      <div className="space-y-3">
                        {financialData.payouts?.slice(0, 5).map((payout: any) => (
                          <div key={payout.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
                            <div>
                              <p className="text-white font-medium text-sm">{payout.event.name}</p>
                              <p className="text-white/60 text-xs">{payout.event.organizer.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">${payout.organizerPayoutAmount}</p>
                              <p className="text-white/60 text-xs">{payout.organizerPayoutStatus}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">All Transactions</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/60 border-b border-white/20">
                          <tr>
                            <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Event</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Commission</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialData.transactions?.map((tx: any) => (
                            <tr key={tx.id} className="border-b border-white/10 hover:bg-black/20">
                              <td className="px-6 py-4 text-white/60 text-sm">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{tx.event.name}</p>
                                  <p className="text-white/60 text-xs">{tx.event.organizer.name}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{tx.user.name}</p>
                                  <p className="text-white/60 text-xs">{tx.user.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white font-medium">${tx.amount}</td>
                              <td className="px-6 py-4 text-white/60">${tx.commissionAmount || 0}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  tx.status === 'COMPLETED' ? 'bg-green-600/20 text-green-400' :
                                  tx.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                                  'bg-red-600/20 text-red-400'
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleRefund(tx.id, tx.amount, 'Admin refund')}
                                    disabled={updating === tx.id}
                                    className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                                    title="Refund"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Payouts Tab */}
              {activeTab === 'payouts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Organizer Payouts</h3>
                    {selectedPayments.length > 0 && (
                      <button
                        onClick={handleBulkPayout}
                        disabled={updating === 'bulk'}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50"
                      >
                        Process {selectedPayments.length} Payouts
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-black/40 rounded-lg border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/60 border-b border-white/20">
                          <tr>
                            <th className="px-6 py-4 text-left text-white font-semibold">
                              <input
                                type="checkbox"
                                checked={selectedPayments.length === financialData.payouts?.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPayments(financialData.payouts.map((p: any) => p.id))
                                  } else {
                                    setSelectedPayments([])
                                  }
                                }}
                                className="rounded border-white/20"
                              />
                            </th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Event</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Organizer</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialData.payouts?.map((payout: any) => (
                            <tr key={payout.id} className="border-b border-white/10 hover:bg-black/20">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedPayments.includes(payout.id)}
                                  onChange={() => togglePaymentSelection(payout.id)}
                                  className="rounded border-white/20"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-white font-medium">{payout.event.name}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{payout.event.organizer.name}</p>
                                  <p className="text-white/60 text-xs">{payout.event.organizer.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white font-medium">${payout.organizerPayoutAmount}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  payout.organizerPayoutStatus === 'PROCESSED' ? 'bg-green-600/20 text-green-400' :
                                  payout.organizerPayoutStatus === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                                  'bg-red-600/20 text-red-400'
                                }`}>
                                  {payout.organizerPayoutStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {payout.organizerPayoutStatus === 'PENDING' && (
                                    <>
                                      <button
                                        onClick={() => handlePayoutAction(payout.id, 'approve')}
                                        disabled={updating === payout.id}
                                        className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-all"
                                        title="Approve Payout"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handlePayoutAction(payout.id, 'hold')}
                                        disabled={updating === payout.id}
                                        className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                                        title="Hold Payout"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Refunds Tab */}
              {activeTab === 'refunds' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Refund History</h3>
                  
                  <div className="bg-black/40 rounded-lg border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/60 border-b border-white/20">
                          <tr>
                            <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Event</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Original Amount</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Refund Amount</th>
                            <th className="px-6 py-4 text-left text-white font-semibold">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialData.refunds?.map((refund: any) => (
                            <tr key={refund.id} className="border-b border-white/10 hover:bg-black/20">
                              <td className="px-6 py-4 text-white/60 text-sm">
                                {new Date(refund.refundedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-white font-medium">{refund.event.name}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{refund.user.name}</p>
                                  <p className="text-white/60 text-xs">{refund.user.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/60">${refund.amount}</td>
                              <td className="px-6 py-4 text-red-400 font-medium">-${refund.refundAmount}</td>
                              <td className="px-6 py-4 text-white/60 text-sm">{refund.refundReason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 