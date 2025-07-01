import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET: Fetch comprehensive platform analytics
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // overview, users, events, revenue, geography
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

  try {
    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : (() => {
      const date = new Date()
      switch (period) {
        case '7d': date.setDate(date.getDate() - 7); break
        case '30d': date.setDate(date.getDate() - 30); break
        case '90d': date.setDate(date.getDate() - 90); break
        case '1y': date.setFullYear(date.getFullYear() - 1); break
        default: date.setDate(date.getDate() - 30)
      }
      return date
    })()

    let data: any = {}

    switch (type) {
      case 'overview':
        // Comprehensive overview metrics
        const [
          totalUsers,
          newUsers,
          totalEvents,
          activeEvents,
          totalRevenue,
          totalRSVPs,
          userGrowth,
          eventGrowth,
          revenueGrowth
        ] = await Promise.all([
          // Total users
          prisma.user.count(),
          
          // New users in period
          prisma.user.count({
            where: { createdAt: { gte: start, lte: end } }
          }),
          
          // Total events
          prisma.event.count(),
          
          // Active events (approved and not completed)
          prisma.event.count({
            where: { 
              status: 'APPROVED',
              date: { gte: new Date() }
            }
          }),
          
          // Total revenue
          prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
          }),
          
          // Total RSVPs
          prisma.rSVP.count(),
          
          // User growth trend (daily for last 30 days)
          prisma.user.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: start, lte: end } },
            _count: { id: true },
            orderBy: { createdAt: 'asc' }
          }),
          
          // Event growth trend
          prisma.event.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: start, lte: end } },
            _count: { id: true },
            orderBy: { createdAt: 'asc' }
          }),
          
          // Revenue growth trend
          prisma.payment.groupBy({
            by: ['createdAt'],
            where: { 
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end }
            },
            _sum: { amount: true },
            orderBy: { createdAt: 'asc' }
          })
        ])

        data.overview = {
          totalUsers,
          newUsers,
          totalEvents,
          activeEvents,
          totalRevenue: totalRevenue._sum.amount || 0,
          totalRSVPs,
          userGrowth,
          eventGrowth,
          revenueGrowth: revenueGrowth.map((r: any) => ({
            date: r.createdAt,
            amount: r._sum.amount || 0
          }))
        }
        break

      case 'users':
        // User analytics
        const [
          userStats,
          userActivity,
          topUsers,
          userDemographics
        ] = await Promise.all([
          // User statistics
          prisma.user.groupBy({
            by: ['role'],
            _count: { id: true }
          }),
          
          // User activity (logins, RSVPs, events created)
          prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              _count: {
                select: {
                  rsvps: true,
                  events: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          }),
          
          // Top users by activity
          prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              _count: {
                select: {
                  rsvps: true,
                  events: true
                }
              }
            },
            orderBy: [
              { rsvps: { _count: 'desc' } },
              { events: { _count: 'desc' } }
            ],
            take: 10
          }),
          
          // User demographics (registration by month)
          prisma.user.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: start, lte: end } },
            _count: { id: true },
            orderBy: { createdAt: 'asc' }
          })
        ])

        data.users = {
          userStats,
          userActivity,
          topUsers,
          userDemographics
        }
        break

      case 'events':
        // Event analytics
        const [
          eventStats,
          eventPerformance,
          topEvents,
          eventCategories
        ] = await Promise.all([
          // Event statistics by status
          prisma.event.groupBy({
            by: ['status'],
            _count: { id: true }
          }),
          
          // Event performance (RSVPs, revenue)
          prisma.event.findMany({
            select: {
              id: true,
              name: true,
              date: true,
              status: true,
              price: true
            },
            orderBy: { date: 'desc' },
            take: 20
          }),
          
          // Top performing events
          prisma.event.findMany({
            select: {
              id: true,
              name: true,
              date: true,
              price: true
            },
            orderBy: { date: 'desc' },
            take: 10
          }),
          
          // Events by category/type
          prisma.event.groupBy({
            by: ['category'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } }
          })
        ])

        data.events = {
          eventStats,
          eventPerformance,
          topEvents,
          eventCategories
        }
        break

      case 'revenue':
        // Revenue analytics
        const [
          revenueStats,
          revenueTrends,
          topRevenueEvents,
          commissionData
        ] = await Promise.all([
          // Revenue statistics
          prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { 
              amount: true,
              commissionAmount: true,
              organizerPayoutAmount: true
            },
            _avg: { amount: true },
            _count: { id: true }
          }),
          
          // Revenue trends by day
          prisma.payment.groupBy({
            by: ['createdAt'],
            where: { 
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end }
            },
            _sum: { amount: true },
            orderBy: { createdAt: 'asc' }
          }),
          
          // Top revenue generating events
          prisma.event.findMany({
            select: {
              id: true,
              name: true,
              date: true
            },
            orderBy: { date: 'desc' },
            take: 10
          }),
          
          // Commission data
          prisma.payment.aggregate({
            where: { 
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end }
            },
            _sum: { commissionAmount: true }
          })
        ])

        data.revenue = {
          revenueStats,
          revenueTrends: revenueTrends.map((r: any) => ({
            date: r.createdAt,
            amount: r._sum.amount || 0
          })),
          topRevenueEvents,
          commissionData
        }
        break

      case 'geography':
        // Geographic analytics
        const [
          locationStats,
          topLocations,
          userLocations
        ] = await Promise.all([
          // Events by location
          prisma.event.groupBy({
            by: ['location'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 20
          }),
          
          // Top locations by RSVPs
          prisma.event.findMany({
            select: {
              location: true
            },
            orderBy: { location: 'asc' },
            take: 10
          }),
          
          // User distribution (if we had location data)
          prisma.user.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: start, lte: end } },
            _count: { id: true },
            orderBy: { createdAt: 'asc' }
          })
        ])

        data.geography = {
          locationStats,
          topLocations,
          userLocations
        }
        break

      default:
        // Return all analytics data
        const [overview, users, events, revenue, geography] = await Promise.all([
          fetch('/api/admin/platform-analytics?type=overview').then(r => r.json()),
          fetch('/api/admin/platform-analytics?type=users').then(r => r.json()),
          fetch('/api/admin/platform-analytics?type=events').then(r => r.json()),
          fetch('/api/admin/platform-analytics?type=revenue').then(r => r.json()),
          fetch('/api/admin/platform-analytics?type=geography').then(r => r.json())
        ])

        data = { overview, users, events, revenue, geography }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// POST: Export analytics reports
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, format, startDate, endDate } = await req.json()

  try {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    let reportData: any = {}

    switch (type) {
      case 'user_report':
        const users = await prisma.user.findMany({
          where: { createdAt: { gte: start, lte: end } },
          orderBy: { createdAt: 'desc' }
        })

        reportData = users.map((user: any) => ({
          'User ID': user.id,
          'Name': user.name,
          'Email': user.email,
          'Role': user.role,
          'Created Date': user.createdAt.toISOString().split('T')[0],
          'Total RSVPs': 0,
          'Events Created': 0
        }))
        break

      case 'event_report':
        const events = await prisma.event.findMany({
          where: { createdAt: { gte: start, lte: end } },
          include: {
            organizer: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        })

        reportData = events.map((event: any) => ({
          'Event ID': event.id,
          'Name': event.name,
          'Organizer': event.organizer.name,
          'Organizer Email': event.organizer.email,
          'Date': event.date.toISOString().split('T')[0],
          'Location': event.location,
          'Price': event.price,
          'Status': event.status,
          'RSVPs': 0
        }))
        break

      case 'revenue_report':
        const payments = await prisma.payment.findMany({
          where: { 
            createdAt: { gte: start, lte: end },
            status: 'COMPLETED'
          },
          include: {
            user: { select: { name: true, email: true } },
            event: { 
              select: { 
                name: true, 
                organizer: { select: { name: true } } 
              } 
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        reportData = payments.map((payment: any) => ({
          'Transaction ID': payment.id,
          'Date': payment.createdAt.toISOString().split('T')[0],
          'Event': payment.event.name,
          'Organizer': payment.event.organizer.name,
          'Customer': payment.user.name,
          'Customer Email': payment.user.email,
          'Amount': payment.amount,
          'Commission': payment.commissionAmount,
          'Organizer Payout': payment.organizerPayoutAmount,
          'Status': payment.status
        }))
        break

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    if (format === 'csv') {
      const csvContent = [
        Object.keys(reportData[0]).join(','),
        ...reportData.map((row: any) => Object.values(row).join(','))
      ].join('\n')

      return NextResponse.json({ 
        success: true, 
        data: csvContent,
        format: 'csv',
        filename: `${type}_${new Date().toISOString().split('T')[0]}.csv`
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: reportData,
      format: 'json'
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
} 