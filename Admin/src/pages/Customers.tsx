
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Wallet,
} from 'lucide-react'

import './Customers.css'

type CustomerStatus = 'Active' | 'Inactive'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: CustomerStatus
  totalOrders: number
  totalSpent: number
  joinedDate: string
}

type CustomerForm = {
  name: string
  email: string
  phone: string
  address: string
  status: CustomerStatus
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

const STORAGE_KEY = 'vexora_admin_customers_v1'

const demoCustomers: Customer[] = [
  {
    id: 'VX-CUS-1001',
    name: 'Nimal Perera',
    email: 'nimal@example.com',
    phone: '0771234567',
    address: 'Colombo, Sri Lanka',
    status: 'Active',
    totalOrders: 3,
    totalSpent: 145000,
    joinedDate: '2026-09-12',
  },
  {
    id: 'VX-CUS-1002',
    name: 'Kavindi Silva',
    email: 'kavindi@example.com',
    phone: '0712345678',
    address: 'Negombo, Sri Lanka',
    status: 'Active',
    totalOrders: 2,
    totalSpent: 89500,
    joinedDate: '2026-09-20',
  },
  {
    id: 'VX-CUS-1003',
    name: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '0763456789',
    address: 'Jaffna, Sri Lanka',
    status: 'Active',
    totalOrders: 1,
    totalSpent: 42500,
    joinedDate: '2026-10-03',
  },
  {
    id: 'VX-CUS-1004',
    name: 'Fathima Rizna',
    email: 'rizna@example.com',
    phone: '0754567890',
    address: 'Kandy, Sri Lanka',
    status: 'Inactive',
    totalOrders: 1,
    totalSpent: 32000,
    joinedDate: '2026-10-08',
  },
  {
    id: 'VX-CUS-1005',
    name: 'Dinesh Fernando',
    email: 'dinesh@example.com',
    phone: '0725678901',
    address: 'Gampaha, Sri Lanka',
    status: 'Active',
    totalOrders: 4,
    totalSpent: 210000,
    joinedDate: '2026-10-15',
  },
]

const emptyForm: CustomerForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'Active',
}

function loadCustomers(): Customer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return demoCustomers

    const parsed: unknown = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      return parsed as Customer[]
    }
  } catch (error) {
    console.error('Unable to load customers:', error)
  }

  return demoCustomers
}

function formatCurrency(amount: number) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<CustomerForm>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedId) ?? null

  const deleteTarget =
    customers.find((customer) => customer.id === deleteId) ?? null

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
    } catch (error) {
      console.error('Unable to save customers:', error)
    }
  }, [customers])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), 4000)

    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim()

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.id,
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
      ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === 'All Status' ||
        customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, search, statusFilter])

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(
    (customer) => customer.status === 'Active'
  ).length
  const inactiveCustomers = totalCustomers - activeCustomers
  const totalSpent = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  )

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormOpen(true)
  }

  const openEdit = (customer: Customer) => {
    setEditingId(customer.id)
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
    })
    setFormOpen(true)
    setSelectedId(null)
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()
    const address = form.address.trim()

    if (!name || !email || !phone || !address) {
      setToast({
        type: 'error',
        message: 'Please fill in all customer details.',
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({
        type: 'error',
        message: 'Please enter a valid email address.',
      })
      return
    }

    if (!/^\+?[\d\s-]{9,16}$/.test(phone)) {
      setToast({
        type: 'error',
        message: 'Please enter a valid phone number.',
      })
      return
    }

    const duplicate = customers.some(
      (customer) =>
        customer.email.toLowerCase() === email &&
        customer.id !== editingId
    )

    if (duplicate) {
      setToast({
        type: 'error',
        message: 'A customer with this email already exists.',
      })
      return
    }

    if (editingId) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingId
            ? {
                ...customer,
                name,
                email,
                phone,
                address,
                status: form.status,
              }
            : customer
        )
      )

      setToast({
        type: 'success',
        message: 'Customer updated successfully.',
      })
    } else {
      const nextNumber =
        Math.max(
          1000,
          ...customers.map((customer) => {
            const number = Number(customer.id.split('-').pop())
            return Number.isFinite(number) ? number : 1000
          })
        ) + 1

      const newCustomer: Customer = {
        id: `VX-CUS-${nextNumber}`,
        name,
        email,
        phone,
        address,
        status: form.status,
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
      }

      setCustomers((current) => [newCustomer, ...current])

      setToast({
        type: 'success',
        message: 'Customer added successfully.',
      })
    }

    setFormOpen(false)
    setEditingId(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    const id = deleteTarget.id

    setCustomers((current) =>
      current.filter((customer) => customer.id !== id)
    )

    setDeleteId(null)
    setSelectedId(null)

    setToast({
      type: 'success',
      message: `Customer ${id} deleted successfully.`,
    })
  }

  const resetDemo = () => {
    if (!window.confirm('Reset all customers to original demo data?')) {
      return
    }

    setCustomers(demoCustomers)
    setSelectedId(null)
    setFormOpen(false)
    setDeleteId(null)

    setToast({
      type: 'success',
      message: 'Demo customer data restored.',
    })
  }

  return (
    <div className="customers-page">
      {toast && (
        <div
          className={`customers-toast customers-toast-${toast.type}`}
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

      <div className="customers-heading">
        <div>
          <span className="customers-eyebrow">
            <Users size={15} />
            VEXORA / CUSTOMER MANAGEMENT
          </span>

          <h2>Customers Management</h2>
          <p>View and manage your customer records in one place.</p>
        </div>

        <button
          type="button"
          className="customers-add-btn"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="customers-demo-banner">
        <AlertTriangle size={17} />
        Frontend demo only. Customer records are stored in this
        browser and are not yet synced with Orders.
      </div>

      <div className="customers-stats">
        {[
          {
            label: 'Total Customers',
            value: totalCustomers.toString(),
            icon: Users,
            color: 'blue',
          },
          {
            label: 'Active Customers',
            value: activeCustomers.toString(),
            icon: UserCheck,
            color: 'green',
          },
          {
            label: 'Inactive Customers',
            value: inactiveCustomers.toString(),
            icon: UserX,
            color: 'orange',
          },
          {
            label: 'Customer Spending',
            value: formatCurrency(totalSpent),
            icon: Wallet,
            color: 'purple',
          },
        ].map((stat) => {
          const Icon = stat.icon

          return (
            <div className="customers-stat" key={stat.label}>
              <div className={`customers-stat-icon ${stat.color}`}>
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

      <section className="customers-panel">
        <div className="customers-panel-heading">
          <div>
            <h3>All Customers</h3>
            <p>
              Showing {filteredCustomers.length} of {customers.length}
            </p>
          </div>

          <button
            type="button"
            className="customers-reset"
            onClick={resetDemo}
          >
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>

        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, email, phone or ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter customer status"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="customers-table-scroll">
          <table className="customers-table">
            <thead>
              <tr>
                <th>CUSTOMER ID</th>
                <th>CUSTOMER</th>
                <th>PHONE</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customers-id">{customer.id}</td>

                  <td>
                    <div className="customers-customer">
                      <strong>{customer.name}</strong>
                      <small>{customer.email}</small>
                    </div>
                  </td>

                  <td>{customer.phone}</td>
                  <td>{customer.totalOrders}</td>
                  <td>{formatCurrency(customer.totalSpent)}</td>

                  <td>
                    <span
                      className={`customers-status ${
                        customer.status === 'Active'
                          ? 'status-active'
                          : 'status-inactive'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <div className="customers-actions">
                      <button
                        type="button"
                        className="customers-view"
                        onClick={() => setSelectedId(customer.id)}
                        title="View customer"
                        aria-label={`View ${customer.name}`}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        className="customers-edit"
                        onClick={() => openEdit(customer)}
                        title="Edit customer"
                        aria-label={`Edit ${customer.name}`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="customers-delete"
                        onClick={() => setDeleteId(customer.id)}
                        title="Delete customer"
                        aria-label={`Delete ${customer.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="customers-empty">
                      <Search size={28} />
                      <strong>No customers found</strong>
                      <p>Try another search or filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedCustomer && (
        <div
          className="customers-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedId(null)
            }
          }}
        >
          <section
            className="customers-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Customer details"
          >
            <div className="customers-modal-heading">
              <div>
                <span className="customers-eyebrow">CUSTOMER DETAILS</span>
                <h2>{selectedCustomer.name}</h2>
              </div>

              <button
                type="button"
                className="customers-close"
                onClick={() => setSelectedId(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="customers-modal-body">
              <div className="customers-detail-list">
                <p><Users size={16} /> {selectedCustomer.id}</p>
                <p><Mail size={16} /> {selectedCustomer.email}</p>
                <p><Phone size={16} /> {selectedCustomer.phone}</p>
                <p><MapPin size={16} /> {selectedCustomer.address}</p>
                <p><ShoppingCart size={16} /> {selectedCustomer.totalOrders} orders</p>
                <p><Wallet size={16} /> {formatCurrency(selectedCustomer.totalSpent)}</p>
              </div>

              <div className="customers-modal-footer">
                <button
                  type="button"
                  className="customers-add-btn"
                  onClick={() => openEdit(selectedCustomer)}
                >
                  <Pencil size={16} />
                  Edit Customer
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {formOpen && (
        <div className="customers-overlay">
          <section
            className="customers-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editingId ? 'Edit customer' : 'Add customer'}
          >
            <div className="customers-modal-heading">
              <div>
                <span className="customers-eyebrow">CUSTOMER RECORD</span>
                <h2>{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
              </div>

              <button
                type="button"
                className="customers-close"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="customers-form" onSubmit={handleSave}>
              <label>
                FULL NAME
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                EMAIL ADDRESS
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="customer@example.com"
                  maxLength={150}
                  required
                />
              </label>

              <label>
                PHONE NUMBER
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="0771234567"
                  maxLength={16}
                  required
                />
              </label>

              <label>
                ADDRESS
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Customer address"
                  maxLength={300}
                  required
                />
              </label>

              <label>
                CUSTOMER STATUS
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as CustomerStatus,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="customers-form-actions">
                <button
                  type="button"
                  className="customers-cancel-btn"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="customers-add-btn">
                  <CheckCircle2 size={17} />
                  {editingId ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="customers-overlay customers-confirm-overlay">
          <section
            className="customers-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete customer confirmation"
          >
            <div className="customers-confirm-icon">
              <Trash2 size={24} />
            </div>

            <h2>Delete Customer?</h2>

            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget.name}</strong>?
              This action removes the customer from local records.
            </p>

            <div className="customers-confirm-actions">
              <button type="button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button type="button" onClick={handleDelete}>
                Delete Customer
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
