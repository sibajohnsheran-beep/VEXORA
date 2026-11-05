
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  ShoppingCart,
  Wallet,
  Users,
  MessageSquare,
  CheckCircle2,
  Download,
  RefreshCw,
  CalendarDays,
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react'

import './Analytics.css'

type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

type Order = {
  id: string
  customer: string
  email: string
  date: string
  status: OrderStatus
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

type Customer = {
  id: string
  status: 'Active' | 'Inactive'
  joinedDate: string
}

type Enquiry = {
  id: string
  status: 'New' | 'In Progress' | 'Replied' | 'Closed'
  type: string
  date: string
}

type Period = 'all' | '7' | '30' | '90' | 'custom'

const ORDER_KEY = 'vexora_admin_orders_v1'
const CUSTOMER_KEY = 'vexora_admin_customers_v1'
const ENQUIRY_KEY = 'vexora_admin_enquiries_v1'

const orderStatuses: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

const enquiryStatuses = [
  'New',
  'In Progress',
  'Replied',
  'Closed',
]

function readArray<T>(key: string): T[] {
  try {
    const value = localStorage.getItem(key)

    if (!value) return []

    const parsed: unknown = JSON.parse(value)

    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function getOrderTotal(order: Order) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}

function formatMoney(amount: number) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}

function csvCell(value: string | number) {
  const text = String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const content = rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF', content], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

function getLocalDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function Analytics() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])

  const [period, setPeriod] = useState<Period>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [notice, setNotice] = useState('')

  const refreshData = () => {
    setOrders(readArray<Order>(ORDER_KEY))
    setCustomers(readArray<Customer>(CUSTOMER_KEY))
    setEnquiries(readArray<Enquiry>(ENQUIRY_KEY))
    setLastUpdated(new Date().toLocaleTimeString())
    setNotice('Analytics data refreshed successfully.')
  }

  useEffect(() => {
    setOrders(readArray<Order>(ORDER_KEY))
    setCustomers(readArray<Customer>(CUSTOMER_KEY))
    setEnquiries(readArray<Enquiry>(ENQUIRY_KEY))
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const today = getLocalDate()

  const dateRange = useMemo(() => {
    if (period === 'all') return { start: '', end: '' }

    if (period === 'custom') {
      return { start: startDate, end: endDate }
    }

    const days = Number(period)
    const date = new Date()
    date.setDate(date.getDate() - days + 1)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return {
      start: `${year}-${month}-${day}`,
      end: today,
    }
  }, [period, startDate, endDate, today])

  const invalidRange =
    period === 'custom' &&
    Boolean(startDate && endDate && startDate > endDate)

  const inRange = (date: string) => {
    if (invalidRange) return false
    if (dateRange.start && date < dateRange.start) return false
    if (dateRange.end && date > dateRange.end) return false
    return true
  }

  const filteredOrders = useMemo(
    () => orders.filter((order) => inRange(order.date)),
    [orders, dateRange.start, dateRange.end, invalidRange]
  )

  const filteredEnquiries = useMemo(
    () => enquiries.filter((enquiry) => inRange(enquiry.date)),
    [enquiries, dateRange.start, dateRange.end, invalidRange]
  )

  const filteredCustomers = useMemo(
    () => customers.filter((customer) => inRange(customer.joinedDate)),
    [customers, dateRange.start, dateRange.end, invalidRange]
  )

  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === 'Delivered'
  )

  const deliveredValue = deliveredOrders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  )

  const orderStatusData = orderStatuses.map((status) => ({
    name: status,
    count: filteredOrders.filter((order) => order.status === status).length,
  }))

  const enquiryStatusData = enquiryStatuses.map((status) => ({
    name: status,
    count: filteredEnquiries.filter((enquiry) => enquiry.status === status).length,
  }))

  const activeCustomers = filteredCustomers.filter(
    (customer) => customer.status === 'Active'
  ).length

  const monthlyData = useMemo(() => {
    const totals = new Map<string, number>()

    deliveredOrders.forEach((order) => {
      const month = order.date.slice(0, 7)
      totals.set(month, (totals.get(month) ?? 0) + getOrderTotal(order))
    })

    return [...totals.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({ month, value }))
  }, [filteredOrders])

  const maxMonthlyValue = Math.max(
    1,
    ...monthlyData.map((item) => item.value)
  )

  const maxOrderCount = Math.max(
    1,
    ...orderStatusData.map((item) => item.count)
  )

  const maxEnquiryCount = Math.max(
    1,
    ...enquiryStatusData.map((item) => item.count)
  )

  const exportReport = () => {
    if (invalidRange) {
      setNotice('Please correct the date range before exporting.')
      return
    }

    const rows: (string | number)[][] = [
      ['VEXORA ANALYTICS REPORT'],
      ['Period', period],
      ['Start Date', dateRange.start || 'All'],
      ['End Date', dateRange.end || 'All'],
      [],
      ['Metric', 'Value'],
      ['Total Orders', filteredOrders.length],
      ['Delivered Orders', deliveredOrders.length],
      ['Delivered Order Value (LKR)', deliveredValue],
      ['Customers Joined', filteredCustomers.length],
      ['Active Customers Joined', activeCustomers],
      ['Total Enquiries', filteredEnquiries.length],
      [],
      ['ORDER STATUS', 'COUNT'],
      ...orderStatusData.map((item) => [item.name, item.count]),
      [],
      ['ENQUIRY STATUS', 'COUNT'],
      ...enquiryStatusData.map((item) => [item.name, item.count]),
      [],
      ['MONTH', 'DELIVERED ORDER VALUE (LKR)'],
      ...monthlyData.map((item) => [item.month, item.value]),
    ]

    downloadCsv(`VEXORA_Analytics_${today}.csv`, rows)
    setNotice('Analytics CSV report exported successfully.')
  }

  return (
    <div className="analytics-page">
      {notice && (
        <div className="analytics-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      <div className="analytics-heading">
        <div>
          <span className="analytics-eyebrow">
            <BarChart3 size={15} />
            VEXORA / BUSINESS INTELLIGENCE
          </span>

          <h2>Analytics & Reports</h2>
          <p>Track orders, customer activity and enquiry performance.</p>
        </div>

        <div className="analytics-heading-actions">
          <button type="button" className="analytics-refresh" onClick={refreshData}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button type="button" className="analytics-export" onClick={exportReport}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="analytics-demo-banner">
        <AlertTriangle size={17} />
        Analytics uses locally saved demo records. Delivered order value
        is not verified payment revenue.
      </div>

      <section className="analytics-filter-panel">
        <div className="analytics-filter-title">
          <CalendarDays size={18} />
          <strong>Reporting Period</strong>
        </div>

        <div className="analytics-filter-controls">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            aria-label="Reporting period"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {period === 'custom' && (
            <div className="analytics-date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                aria-label="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                aria-label="End date"
              />
            </div>
          )}
        </div>

        {invalidRange && (
          <p className="analytics-date-error">
            Start date cannot be after end date.
          </p>
        )}

        <small>Last refreshed: {lastUpdated || 'Not loaded'}</small>
      </section>

      <div className="analytics-stats">
        {[
          {
            label: 'Total Orders',
            value: filteredOrders.length.toString(),
            icon: ShoppingCart,
            color: 'blue',
          },
          {
            label: 'Delivered Orders',
            value: deliveredOrders.length.toString(),
            icon: CheckCircle2,
            color: 'green',
          },
          {
            label: 'Delivered Order Value',
            value: formatMoney(deliveredValue),
            icon: Wallet,
            color: 'purple',
          },
          {
            label: 'New Customers',
            value: filteredCustomers.length.toString(),
            icon: Users,
            color: 'orange',
          },
          {
            label: 'Enquiries',
            value: filteredEnquiries.length.toString(),
            icon: MessageSquare,
            color: 'blue',
          },
        ].map((stat) => {
          const Icon = stat.icon

          return (
            <div className="analytics-stat" key={stat.label}>
              <div className={`analytics-stat-icon ${stat.color}`}>
                <Icon size={21} />
              </div>
              <div>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            </div>
          )
        })}
      </div>

      <div className="analytics-charts">
        <section className="analytics-panel analytics-revenue-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3><TrendingUp size={19} /> Monthly Delivered Order Value</h3>
              <p>Value of orders currently marked Delivered, grouped by order date.</p>
            </div>
          </div>

          {monthlyData.length ? (
            <div className="analytics-monthly-chart">
              {monthlyData.map((item) => (
                <div className="analytics-month-column" key={item.month}>
                  <strong>{formatMoney(item.value)}</strong>
                  <div className="analytics-month-track">
                    <div
                      className="analytics-month-bar"
                      style={{
                        height: `${Math.max(4, (item.value / maxMonthlyValue) * 100)}%`,
                      }}
                    />
                  </div>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty">
              <BarChart3 size={29} />
              <p>No delivered orders found for this period.</p>
            </div>
          )}
        </section>

        <section className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3><Package size={19} /> Order Status Overview</h3>
              <p>Order distribution by current status.</p>
            </div>
          </div>

          <div className="analytics-horizontal-chart">
            {orderStatusData.map((item) => (
              <div className="analytics-chart-row" key={item.name}>
                <div className="analytics-chart-label">
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="analytics-chart-track">
                  <div
                    className={`analytics-chart-fill order-${item.name.toLowerCase()}`}
                    style={{ width: `${(item.count / maxOrderCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3><MessageSquare size={19} /> Enquiry Status Overview</h3>
              <p>Customer communication progress.</p>
            </div>
          </div>

          <div className="analytics-horizontal-chart">
            {enquiryStatusData.map((item) => (
              <div className="analytics-chart-row" key={item.name}>
                <div className="analytics-chart-label">
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="analytics-chart-track">
                  <div
                    className="analytics-chart-fill enquiry-fill"
                    style={{ width: `${(item.count / maxEnquiryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3><Users size={19} /> Customer Insights</h3>
              <p>Customer records created during the selected period.</p>
            </div>
          </div>

          <div className="analytics-customer-insights">
            <div>
              <span>Customers Joined</span>
              <strong>{filteredCustomers.length}</strong>
            </div>
            <div>
              <span>Currently Active</span>
              <strong>{activeCustomers}</strong>
            </div>
            <div>
              <span>Currently Inactive</span>
              <strong>{filteredCustomers.length - activeCustomers}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
