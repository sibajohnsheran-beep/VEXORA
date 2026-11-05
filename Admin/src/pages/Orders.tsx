
import { useEffect, useMemo, useState } from 'react'
import {
  ShoppingBag,
  Search,
  Clock3,
  Truck,
  CheckCircle2,
  Wallet,
  Eye,
  X,
  Package,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import './Orders.css'

type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  customer: string
  email: string
  phone: string
  address: string
  date: string
  status: OrderStatus
  items: OrderItem[]
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

const STORAGE_KEY = 'vexora_admin_orders_v1'

const demoOrders: Order[] = [
  {
    id: 'VX-ORD-1001',
    customer: 'Nimal Perera',
    email: 'nimal@example.com',
    phone: '077 123 4567',
    address: 'Colombo, Sri Lanka',
    date: '2026-11-04',
    status: 'Pending',
    items: [
      { name: 'VEXORA AI PTZ Camera', quantity: 1, price: 125000 },
      { name: 'VEXORA Smart Dome Camera', quantity: 1, price: 55000 },
    ],
  },
  {
    id: 'VX-ORD-1002',
    customer: 'Kavindi Silva',
    email: 'kavindi@example.com',
    phone: '071 234 5678',
    address: 'Negombo, Sri Lanka',
    date: '2026-11-03',
    status: 'Processing',
    items: [
      { name: 'VEXORA Bullet Camera', quantity: 2, price: 48000 },
    ],
  },
  {
    id: 'VX-ORD-1003',
    customer: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '076 345 6789',
    address: 'Jaffna, Sri Lanka',
    date: '2026-11-02',
    status: 'Shipped',
    items: [
      { name: 'VEXORA 4K IP Camera', quantity: 1, price: 72000 },
    ],
  },
  {
    id: 'VX-ORD-1004',
    customer: 'Fathima Rizna',
    email: 'rizna@example.com',
    phone: '075 456 7890',
    address: 'Kandy, Sri Lanka',
    date: '2026-11-01',
    status: 'Delivered',
    items: [
      { name: 'VEXORA Mini Dome', quantity: 2, price: 39000 },
    ],
  },
  {
    id: 'VX-ORD-1005',
    customer: 'Dinesh Fernando',
    email: 'dinesh@example.com',
    phone: '072 567 8901',
    address: 'Gampaha, Sri Lanka',
    date: '2026-10-31',
    status: 'Cancelled',
    items: [
      { name: 'VEXORA 8-Channel NVR', quantity: 1, price: 95000 },
    ],
  },
  {
    id: 'VX-ORD-1006',
    customer: 'Tharushi Jayasinghe',
    email: 'tharushi@example.com',
    phone: '070 678 9012',
    address: 'Galle, Sri Lanka',
    date: '2026-10-30',
    status: 'Delivered',
    items: [
      { name: 'VEXORA Night Vision Bullet', quantity: 1, price: 59000 },
    ],
  },
]

const statusOptions: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

function formatMoney(amount: number) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}

function getTotal(order: Order) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}

function loadOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return demoOrders

    const parsed: unknown = JSON.parse(saved)
    if (Array.isArray(parsed)) return parsed as Order[]
  } catch (error) {
    console.error('Failed to load orders:', error)
  }

  return demoOrders
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(loadOrders)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Orders')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null

  const cancelTarget =
    orders.find((order) => order.id === cancelTargetId) ?? null

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (error) {
      console.error('Failed to save orders:', error)
    }
  }, [orders])

  useEffect(() => {
    if (!toast) return

    const timeout = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim()

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)

      const matchesFilter =
        filter === 'All Orders' || order.status === filter

      return matchesSearch && matchesFilter
    })
  }, [orders, search, filter])

  const totalOrders = orders.length
  const pendingOrders = orders.filter(
    (order) => order.status === 'Pending'
  ).length
  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length

  const revenue = orders
    .filter((order) => order.status === 'Delivered')
    .reduce((total, order) => total + getTotal(order), 0)

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const current = orders.find((order) => order.id === orderId)

    if (!current) return

    if (current.status === newStatus) return

    if (current.status === 'Cancelled') {
      setToast({
        type: 'error',
        message: 'Cancelled orders cannot be modified.',
      })
      return
    }

    if (current.status === 'Delivered') {
      setToast({
        type: 'error',
        message: 'Delivered orders cannot be modified.',
      })
      return
    }

    if (newStatus === 'Cancelled') {
      setCancelTargetId(orderId)
      return
    }

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      Pending: ['Processing'],
      Processing: ['Shipped'],
      Shipped: ['Delivered'],
      Delivered: [],
      Cancelled: [],
    }

    if (!allowed[current.status].includes(newStatus)) {
      setToast({
        type: 'error',
        message: `Invalid status change: ${current.status} to ${newStatus}.`,
      })
      return
    }

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    )

    setToast({
      type: 'success',
      message: `${orderId} status updated to ${newStatus}.`,
    })
  }

  const confirmCancellation = () => {
    if (!cancelTarget) return

    const orderId = cancelTarget.id

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: 'Cancelled' }
          : order
      )
    )

    setCancelTargetId(null)
    setToast({
      type: 'success',
      message: `${orderId} has been cancelled.`,
    })
  }

  const resetOrders = () => {
    if (!window.confirm('Reset all orders to the original demo data?')) {
      return
    }

    setOrders(demoOrders)
    setSelectedOrderId(null)
    setCancelTargetId(null)
    setToast({
      type: 'success',
      message: 'Demo orders restored successfully.',
    })
  }

  return (
    <div className="orders-page">
      {toast && (
        <div
          className={`orders-toast orders-toast-${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="orders-heading">
        <div>
          <span className="orders-eyebrow">
            <ShoppingBag size={15} />
            VEXORA / ORDER CONTROL
          </span>
          <h2>Orders Management</h2>
          <p>Monitor customer orders and manage fulfilment.</p>
        </div>
      </div>

      <div className="orders-demo-banner">
        <AlertTriangle size={17} />
        Demo orders only. These records are stored in this browser,
        not connected to real customer purchases or payments.
      </div>

      <div className="orders-stats">
        <div className="orders-stat">
          <div className="orders-stat-icon blue">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p>Total Orders</p>
            <strong>{totalOrders}</strong>
          </div>
        </div>

        <div className="orders-stat">
          <div className="orders-stat-icon orange">
            <Clock3 size={22} />
          </div>
          <div>
            <p>Pending</p>
            <strong>{pendingOrders}</strong>
          </div>
        </div>

        <div className="orders-stat">
          <div className="orders-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p>Delivered</p>
            <strong>{deliveredOrders}</strong>
          </div>
        </div>

        <div className="orders-stat">
          <div className="orders-stat-icon purple">
            <Wallet size={22} />
          </div>
          <div>
            <p>Delivered Order Value</p>
            <strong className="orders-money">{formatMoney(revenue)}</strong>
          </div>
        </div>
      </div>

      <section className="orders-panel">
        <div className="orders-panel-heading">
          <div>
            <h3>All Orders</h3>
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <button
            type="button"
            className="orders-reset"
            onClick={resetOrders}
          >
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>

        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order ID, customer or email..."
              aria-label="Search orders"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter orders by status"
          >
            <option>All Orders</option>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="orders-table-scroll">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong className="orders-order-id">{order.id}</strong>
                  </td>
                  <td>
                    <div className="orders-customer">
                      <strong>{order.customer}</strong>
                      <small>{order.email}</small>
                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    {order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{' '}
                    items
                  </td>
                  <td className="orders-total">
                    {formatMoney(getTotal(order))}
                  </td>
                  <td>
                    <span
                      className={`orders-status status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="orders-view-button"
                      onClick={() => setSelectedOrderId(order.id)}
                      title="View order"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="orders-empty">
                      <Search size={28} />
                      <strong>No orders found</strong>
                      <p>Try another search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="orders-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrderId(null)
            }
          }}
        >
          <section
            className="orders-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="orders-detail-title"
          >
            <div className="orders-modal-heading">
              <div>
                <span className="orders-eyebrow">
                  ORDER DETAILS
                </span>
                <h2 id="orders-detail-title">{selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                className="orders-close"
                onClick={() => setSelectedOrderId(null)}
                aria-label="Close order details"
              >
                <X size={21} />
              </button>
            </div>

            <div className="orders-modal-body">
              <div className="orders-detail-grid">
                <div className="orders-detail-card">
                  <h3>Customer Information</h3>
                  <p>
                    <Package size={16} />
                    {selectedOrder.customer}
                  </p>
                  <p>
                    <Mail size={16} />
                    {selectedOrder.email}
                  </p>
                  <p>
                    <Phone size={16} />
                    {selectedOrder.phone}
                  </p>
                  <p>
                    <MapPin size={16} />
                    {selectedOrder.address}
                  </p>
                </div>

                <div className="orders-detail-card">
                  <h3>Order Information</h3>
                  <p>
                    <CalendarDays size={16} />
                    {selectedOrder.date}
                  </p>
                  <p>
                    <Truck size={16} />
                    {selectedOrder.status}
                  </p>
                  <p>
                    <Wallet size={16} />
                    {formatMoney(getTotal(selectedOrder))}
                  </p>
                </div>
              </div>

              <h3 className="orders-items-title">Ordered Products</h3>

              <div className="orders-items-list">
                {selectedOrder.items.map((item, index) => (
                  <div
                    className="orders-item"
                    key={`${item.name}-${index}`}
                  >
                    <div className="orders-item-icon">
                      <Package size={19} />
                    </div>
                    <div className="orders-item-name">
                      <strong>{item.name}</strong>
                      <small>Quantity: {item.quantity}</small>
                    </div>
                    <strong>
                      {formatMoney(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="orders-grand-total">
                <span>Order Total</span>
                <strong>{formatMoney(getTotal(selectedOrder))}</strong>
              </div>

              <div className="orders-status-editor">
                <label htmlFor="order-status">UPDATE ORDER STATUS</label>
                <select
                  id="order-status"
                  value={selectedOrder.status}
                  disabled={
                    selectedOrder.status === 'Cancelled' ||
                    selectedOrder.status === 'Delivered'
                  }
                  onChange={(event) =>
                    updateStatus(
                      selectedOrder.id,
                      event.target.value as OrderStatus
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <small>
                  Workflow: Pending → Processing → Shipped → Delivered.
                  Cancellation requires confirmation.
                </small>
              </div>
            </div>
          </section>
        </div>
      )}

      {cancelTarget && (
        <div className="orders-overlay orders-confirm-overlay">
          <section
            className="orders-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="orders-cancel-title"
          >
            <div className="orders-confirm-icon">
              <AlertTriangle size={26} />
            </div>
            <h2 id="orders-cancel-title">Cancel Order?</h2>
            <p>
              Are you sure you want to cancel{' '}
              <strong>{cancelTarget.id}</strong>?
            </p>
            <div className="orders-confirm-actions">
              <button
                type="button"
                onClick={() => setCancelTargetId(null)}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
              >
                Confirm Cancellation
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
