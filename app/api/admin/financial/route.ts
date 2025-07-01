import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET: Fetch financial data (transactions, payouts, refunds, reports)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // transactions, payouts, refunds, reports
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const status = searchParams.get('status')

  try {
    let data: any = {}

    switch (type) {
      case 'transactions':
        const whereTransactions: any = {}
        if (startDate && endDate) {
          whereTransactions.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }
        if (status && status !== 'ALL') {
          whereTransactions.status = status
        }

        data.transactions = await prisma.payment.findMany({
          where: whereTransactions,
          include: {
            user: { select: { name: true, email: true } },
            event: { select: { name: true, organizer: { select: { name: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        })
        break

      case 'payouts':
        const wherePayouts: any = {}
        if (status && status !== 'ALL') {
          wherePayouts.organizerPayoutStatus = status
        }

        data.payouts = await prisma.payment.findMany({
          where: {
            ...wherePayouts,
            organizerPayoutAmount: { gt: 0 }
          },
          include: {
            event: { 
              select: { 
                name: true, 
                organizer: { select: { name: true, email: true } } 
              } 
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        break

      case 'refunds':
        const whereRefunds: any = {}
        if (startDate && endDate) {
          whereRefunds.refundedAt = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }

        data.refunds = await prisma.payment.findMany({
          where: {
            ...whereRefunds,
            refundAmount: { gt: 0 }
          },
          include: {
            user: { select: { name: true, email: true } },
            event: { select: { name: true } }
          },
          orderBy: { refundedAt: 'desc' }
        })
        break

      case 'reports':
        // Financial summary
        const totalRevenue = await prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true }
        })

        const totalRefunds = await prisma.payment.aggregate({
          where: { refundAmount: { gt: 0 } },
          _sum: { refundAmount: true }
        })

        const pendingPayouts = await prisma.payment.aggregate({
          where: { 
            organizerPayoutStatus: 'PENDING',
            organizerPayoutAmount: { gt: 0 }
          },
          _sum: { organizerPayoutAmount: true }
        })

        const totalCommission = await prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { commissionAmount: true }
        })

        data.reports = {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalRefunds: totalRefunds._sum.refundAmount || 0,
          pendingPayouts: pendingPayouts._sum.organizerPayoutAmount || 0,
          totalCommission: totalCommission._sum.commissionAmount || 0,
          netRevenue: (totalRevenue._sum.amount || 0) - (totalRefunds._sum.refundAmount || 0)
        }
        break

      default:
        // Return all financial data
        const [transactions, payouts, refunds, reports] = await Promise.all([
          prisma.payment.findMany({
            include: {
              user: { select: { name: true, email: true } },
              event: { select: { name: true, organizer: { select: { name: true } } } }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
          }),
          prisma.payment.findMany({
            where: { organizerPayoutAmount: { gt: 0 } },
            include: {
              event: { 
                select: { 
                  name: true, 
                  organizer: { select: { name: true, email: true } } 
                } 
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          }),
          prisma.payment.findMany({
            where: { refundAmount: { gt: 0 } },
            include: {
              user: { select: { name: true, email: true } },
              event: { select: { name: true } }
            },
            orderBy: { refundedAt: 'desc' },
            take: 20
          }),
          (async () => {
            const totalRevenue = await prisma.payment.aggregate({
              where: { status: 'COMPLETED' },
              _sum: { amount: true }
            })
            const totalRefunds = await prisma.payment.aggregate({
              where: { refundAmount: { gt: 0 } },
              _sum: { refundAmount: true }
            })
            return {
              totalRevenue: totalRevenue._sum.amount || 0,
              totalRefunds: totalRefunds._sum.refundAmount || 0,
              netRevenue: (totalRevenue._sum.amount || 0) - (totalRefunds._sum.refundAmount || 0)
            }
          })()
        ])

        data = { transactions, payouts, refunds, reports }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching financial data:', error)
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 })
  }
}

// PUT: Update payout status, process refunds, update commission rates
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { 
    paymentId, 
    payoutStatus, 
    refundAmount, 
    refundReason,
    commissionRate 
  } = await req.json()

  try {
    let updateData: any = {}

    if (payoutStatus) {
      updateData.organizerPayoutStatus = payoutStatus
      if (payoutStatus === 'PROCESSED') {
        updateData.organizerPayoutDate = new Date()
      }
    }

    if (typeof refundAmount === 'number' && refundAmount > 0) {
      updateData.refundAmount = refundAmount
      updateData.refundReason = refundReason
      updateData.refundedAt = new Date()
      updateData.status = refundAmount === updateData.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED'
    }

    if (typeof commissionRate === 'number') {
      // Update commission for this payment
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: { amount: true }
      })
      
      if (payment) {
        updateData.commissionAmount = payment.amount * (commissionRate / 100)
        updateData.organizerPayoutAmount = payment.amount - updateData.commissionAmount
      }
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { name: true, organizer: { select: { name: true } } } }
      }
    })

    return NextResponse.json({ payment: updatedPayment })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
  }
}

// POST: Bulk payout processing, export reports
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, paymentIds, format } = await req.json()

  try {
    switch (action) {
      case 'process_payouts':
        if (!paymentIds || !Array.isArray(paymentIds)) {
          return NextResponse.json({ error: 'Missing payment IDs' }, { status: 400 })
        }

        const updatedPayments = await prisma.payment.updateMany({
          where: { id: { in: paymentIds } },
          data: {
            organizerPayoutStatus: 'PROCESSED',
            organizerPayoutDate: new Date()
          }
        })

        return NextResponse.json({ 
          success: true, 
          processed: updatedPayments.count 
        })

      case 'export_report':
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1) // Last 30 days

        const transactions = await prisma.payment.findMany({
          where: {
            createdAt: { gte: startDate }
          },
          include: {
            user: { select: { name: true, email: true } },
            event: { select: { name: true, organizer: { select: { name: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        })

        // Convert to CSV format
        const csvData = transactions.map(t => ({
          Date: t.createdAt.toISOString().split('T')[0],
          'Transaction ID': t.id,
          'Event Name': t.event.name,
          'Organizer': t.event.organizer.name,
          'Customer': t.user.name,
          'Customer Email': t.user.email,
          'Amount': t.amount,
          'Commission': t.commissionAmount,
          'Organizer Payout': t.organizerPayoutAmount,
          'Status': t.status,
          'Refund Amount': t.refundAmount || 0
        }))

        return NextResponse.json({ 
          success: true, 
          data: csvData,
          format: format || 'json'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing bulk action:', error)
    return NextResponse.json({ error: 'Failed to process bulk action' }, { status: 500 })
  }
} 