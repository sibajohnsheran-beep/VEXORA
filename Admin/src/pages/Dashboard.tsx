
import {
  Package,
  ShoppingCart,
  MessageSquare,
  Wallet,
  ArrowUpRight,
  Plus,
  FilePenLine,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import StatCard from '../components/StatCard'
import type { AdminPage } from '../components/AdminSidebar'

type Props = {
  onNavigate: (page: AdminPage) => void
}

const chartData = [
  { month: 'Jun', orders: 8, revenue: 110000 },
  { month: 'Jul', orders: 14, revenue: 165000 },
  { month: 'Aug', orders: 11, revenue: 225000 },
  { month: 'Sep', orders: 19, revenue: 290000 },
  { month: 'Oct', orders: 23, revenue: 360000 },
  { month: 'Nov', orders: 32, revenue: 485000 },
]

const orders = [
  {
    id: 'VX-1024',
    customer: 'Kavin Raj',
    product: 'PTZ Camera',
    amount: 'LKR 125,000',
    status: 'Completed',
  },
  {
    id: 'VX-1023',
    customer: 'Nimesh Silva',
    product: 'Dome Camera',
    amount: 'LKR 55,000',
    status: 'Processing',
  },
  {
    id: 'VX-1022',
    customer: 'Dilshan Perera',
    product: 'Bullet Camera',
    amount: 'LKR 48,000',
    status: 'Completed',
  },
  {
    id: 'VX-1021',
    customer: 'Tharushi M.',
    product: 'NVR System',
    amount: 'LKR 95,000',
    status: 'Pending',
  },
]

export default function Dashboard({ onNavigate }: Props) {
  return (
    <div className="admin-dashboard-page">
      <div className="admin-demo-banner">
        <Activity size={16} />
        Frontend preview — Orders, revenue and enquiries are demonstration data.
      </div>

      <div className="admin-stats-grid">
        <StatCard
          title="Total Products"
          value="8"
          icon={Package}
          change="Website collection"
          color="blue"
        />

        <StatCard
          title="Total Orders"
          value="24"
          icon={ShoppingCart}
          change="Demo records"
          color="purple"
        />

        <StatCard
          title="Total Enquiries"
          value="17"
          icon={MessageSquare}
          change="Demo records"
          color="cyan"
        />

        <StatCard
          title="Revenue (LKR)"
          value="485,000"
          icon={Wallet}
          change="Demo revenue"
          color="orange"
        />
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-chart-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Order & Revenue Analytics</h2>
              <p>Performance overview — sample data</p>
            </div>
            <span className="admin-panel-period">Last 6 Months</span>
          </div>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c7ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c7ff" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#21334c"
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: '#8fa9c4', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: '#8fa9c4', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: '#102139',
                    border: '1px solid #274361',
                    borderRadius: 12,
                    color: '#e8f2ff',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#22c7ff"
                  strokeWidth={3}
                  fill="url(#ordersGradient)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="admin-chart-caption">
            Showing sample monthly order counts. Revenue figures are not plotted on this axis.
          </p>
        </section>

        <section className="admin-panel admin-feature-panel">
          <div className="admin-feature-icon">
            <ShieldCheck size={26} />
          </div>

          <p className="admin-feature-eyebrow">VEXORA / CONTROL CENTER</p>
          <h2>
            SECURITY
            <span> REIMAGINED.</span>
          </h2>

          <p>
            Manage your CCTV products, website content and customer
            operations from one premium workspace.
          </p>

          <button onClick={() => onNavigate('products')}>
            MANAGE PRODUCTS
            <ArrowUpRight size={18} />
          </button>
        </section>

        <section className="admin-panel admin-orders-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest demonstration transactions</p>
            </div>

            <button
              className="admin-text-link"
              onClick={() => onNavigate('orders')}
            >
              View All
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin-order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span
                        className={`admin-order-status status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel admin-quick-panel">
          <div className="admin-panel-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="admin-quick-grid">
            <button onClick={() => onNavigate('products')}>
              <Package size={25} />
              <span>Manage Products</span>
            </button>

            <button onClick={() => onNavigate('home')}>
              <FilePenLine size={25} />
              <span>Edit Website Content</span>
            </button>

            <button onClick={() => onNavigate('orders')}>
              <ShoppingCart size={25} />
              <span>View Orders</span>
            </button>

            <button onClick={() => onNavigate('enquiries')}>
              <MessageSquare size={25} />
              <span>View Enquiries</span>
            </button>
          </div>

          <div className="admin-quick-note">
            <Plus size={15} />
            Management pages will be added in the next phase.
          </div>
        </section>
      </div>
    </div>
  )
}
