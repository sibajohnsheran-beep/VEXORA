
import { useEffect, useMemo, useState } from 'react'
import {
  MessageSquare,
  Search,
  Clock3,
  CheckCircle2,
  Send,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  Package,
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  Trash2,
  UserRound,
} from 'lucide-react'
import './Enquiries.css'

type EnquiryStatus = 'New' | 'In Progress' | 'Replied' | 'Closed'
type EnquiryType = 'Product Enquiry' | 'General Enquiry' | 'Installation' | 'Support'

type Enquiry = {
  id: string
  customer: string
  email: string
  phone: string
  subject: string
  message: string
  product: string
  type: EnquiryType
  status: EnquiryStatus
  date: string
  notes: string
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

const STORAGE_KEY = 'vexora_admin_enquiries_v1'

const demoEnquiries: Enquiry[] = [
  {
    id: 'VX-ENQ-1001',
    customer: 'Nimal Perera',
    email: 'nimal@example.com',
    phone: '0771234567',
    subject: 'AI PTZ Camera Price',
    message: 'I would like to know more about the AI PTZ camera and installation cost.',
    product: 'VEXORA AI PTZ Camera',
    type: 'Product Enquiry',
    status: 'New',
    date: '2026-11-04',
    notes: '',
  },
  {
    id: 'VX-ENQ-1002',
    customer: 'Kavindi Silva',
    email: 'kavindi@example.com',
    phone: '0712345678',
    subject: 'Office CCTV Installation',
    message: 'We need a CCTV system for our office with six cameras.',
    product: '',
    type: 'Installation',
    status: 'In Progress',
    date: '2026-11-03',
    notes: 'Prepare installation estimate.',
  },
  {
    id: 'VX-ENQ-1003',
    customer: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '0763456789',
    subject: '4K IP Camera Features',
    message: 'Does the 4K IP camera support remote monitoring?',
    product: 'VEXORA 4K IP Camera',
    type: 'Product Enquiry',
    status: 'Replied',
    date: '2026-11-02',
    notes: 'Customer contacted.',
  },
  {
    id: 'VX-ENQ-1004',
    customer: 'Fathima Rizna',
    email: 'rizna@example.com',
    phone: '0754567890',
    subject: 'Technical Support',
    message: 'I need assistance configuring my CCTV recorder.',
    product: 'VEXORA 8-Channel NVR',
    type: 'Support',
    status: 'Closed',
    date: '2026-11-01',
    notes: 'Issue resolved.',
  },
  {
    id: 'VX-ENQ-1005',
    customer: 'Dinesh Fernando',
    email: 'dinesh@example.com',
    phone: '0725678901',
    subject: 'CCTV System Quotation',
    message: 'Please send a quotation for a complete home security system.',
    product: '',
    type: 'General Enquiry',
    status: 'New',
    date: '2026-10-31',
    notes: '',
  },
]

const statuses: EnquiryStatus[] = [
  'New',
  'In Progress',
  'Replied',
  'Closed',
]

const types: EnquiryType[] = [
  'Product Enquiry',
  'General Enquiry',
  'Installation',
  'Support',
]

function loadEnquiries(): Enquiry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return demoEnquiries

    const parsed: unknown = JSON.parse(stored)
    if (Array.isArray(parsed)) return parsed as Enquiry[]
  } catch (error) {
    console.error('Unable to load enquiries:', error)
  }
  return demoEnquiries
}

function getWhatsAppUrl(phone: string, enquiry: Enquiry) {
  const digits = phone.replace(/\D/g, '')
  const international = digits.startsWith('0')
    ? `94${digits.slice(1)}`
    : digits

  const message = `Hello ${enquiry.customer}, thank you for contacting VEXORA regarding "${enquiry.subject}".`

  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(loadEnquiries)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const selected = enquiries.find((e) => e.id === selectedId) ?? null
  const deleteTarget = enquiries.find((e) => e.id === deleteId) ?? null

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries))
    } catch (error) {
      console.error('Unable to save enquiries:', error)
    }
  }, [enquiries])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()

    return enquiries.filter((enquiry) => {
      const matchesSearch = [
        enquiry.id,
        enquiry.customer,
        enquiry.email,
        enquiry.subject,
        enquiry.product,
      ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === 'All Status' || enquiry.status === statusFilter

      const matchesType =
        typeFilter === 'All Types' || enquiry.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [enquiries, search, statusFilter, typeFilter])

  const updateStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      )
    )
    setToast({
      type: 'success',
      message: `Enquiry ${id} updated to ${status}.`,
    })
  }

  const updateNotes = (id: string, notes: string) => {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, notes } : enquiry
      )
    )
  }

  const deleteEnquiry = () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    setEnquiries((current) => current.filter((e) => e.id !== id))
    setDeleteId(null)
    setSelectedId(null)
    setToast({
      type: 'success',
      message: `Enquiry ${id} deleted successfully.`,
    })
  }

  const resetDemo = () => {
    if (!window.confirm('Reset all enquiries to original demo data?')) return
    setEnquiries(demoEnquiries)
    setSelectedId(null)
    setToast({
      type: 'success',
      message: 'Demo enquiries restored.',
    })
  }

  const total = enquiries.length
  const newCount = enquiries.filter((e) => e.status === 'New').length
  const inProgress = enquiries.filter((e) => e.status === 'In Progress').length
  const replied = enquiries.filter((e) => e.status === 'Replied').length

  return (
    <div className="enquiries-page">
      {toast && (
        <div
          className={`enquiries-toast enquiries-toast-${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X size={17} />
          </button>
        </div>
      )}

      <div className="enquiries-heading">
        <div>
          <span className="enquiries-eyebrow">
            <MessageSquare size={15} />
            VEXORA / CUSTOMER COMMUNICATION
          </span>
          <h2>Enquiries Management</h2>
          <p>Manage customer requests, product enquiries and support messages.</p>
        </div>
      </div>

      <div className="enquiries-demo-banner">
        <AlertTriangle size={17} />
        Frontend demo only. Enquiries are stored locally and are not yet
        connected to the public website.
      </div>

      <div className="enquiries-stats">
        {[
          { label: 'Total Enquiries', value: total, icon: MessageSquare, color: 'blue' },
          { label: 'New Enquiries', value: newCount, icon: Mail, color: 'orange' },
          { label: 'In Progress', value: inProgress, icon: Clock3, color: 'purple' },
          { label: 'Replied', value: replied, icon: CheckCircle2, color: 'green' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div className="enquiries-stat" key={stat.label}>
              <div className={`enquiries-stat-icon ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            </div>
          )
        })}
      </div>

      <section className="enquiries-panel">
        <div className="enquiries-panel-heading">
          <div>
            <h3>All Enquiries</h3>
            <p>Showing {filtered.length} of {enquiries.length} enquiries</p>
          </div>
          <button type="button" className="enquiries-reset" onClick={resetDemo}>
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>

        <div className="enquiries-toolbar">
          <div className="enquiries-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search customer, subject or enquiry ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All Status</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option>All Types</option>
            {types.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div className="enquiries-table-scroll">
          <table className="enquiries-table">
            <thead>
              <tr>
                <th>ENQUIRY ID</th>
                <th>CUSTOMER</th>
                <th>SUBJECT</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className="enquiries-id">{enquiry.id}</td>
                  <td>
                    <div className="enquiries-customer">
                      <strong>{enquiry.customer}</strong>
                      <small>{enquiry.email}</small>
                    </div>
                  </td>
                  <td>{enquiry.subject}</td>
                  <td>{enquiry.type}</td>
                  <td>{enquiry.date}</td>
                  <td>
                    <span className={`enquiries-status status-${enquiry.status.toLowerCase().replace(' ', '-')}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td>
                    <div className="enquiries-actions">
                      <button
                        type="button"
                        className="enquiries-view"
                        onClick={() => setSelectedId(enquiry.id)}
                        title="View enquiry"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="enquiries-delete"
                        onClick={() => setDeleteId(enquiry.id)}
                        title="Delete enquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="enquiries-empty">
                      <Search size={28} />
                      <strong>No enquiries found</strong>
                      <p>Try changing your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div
          className="enquiries-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null)
          }}
        >
          <section className="enquiries-modal" role="dialog" aria-modal="true">
            <div className="enquiries-modal-heading">
              <div>
                <span className="enquiries-eyebrow">ENQUIRY DETAILS</span>
                <h2>{selected.id}</h2>
              </div>
              <button type="button" className="enquiries-close" onClick={() => setSelectedId(null)}>
                <X size={21} />
              </button>
            </div>

            <div className="enquiries-modal-body">
              <div className="enquiries-detail-grid">
                <div className="enquiries-detail-card">
                  <h3>Customer Information</h3>
                  <p><UserRound size={16} />{selected.customer}</p>
                  <p><Mail size={16} />{selected.email}</p>
                  <p><Phone size={16} />{selected.phone}</p>
                  <p><CalendarDays size={16} />{selected.date}</p>
                </div>

                <div className="enquiries-detail-card">
                  <h3>Enquiry Information</h3>
                  <p><MessageSquare size={16} />{selected.type}</p>
                  <p><Package size={16} />{selected.product || 'General Request'}</p>
                  <p><Clock3 size={16} />{selected.status}</p>
                </div>
              </div>

              <div className="enquiries-message-card">
                <h3>{selected.subject}</h3>
                <p>{selected.message}</p>
              </div>

              <div className="enquiries-editor">
                <label htmlFor="enquiry-status">ENQUIRY STATUS</label>
                <select
                  id="enquiry-status"
                  value={selected.status}
                  onChange={(event) =>
                    updateStatus(selected.id, event.target.value as EnquiryStatus)
                  }
                >
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>

                <label htmlFor="enquiry-notes">INTERNAL NOTES</label>
                <textarea
                  id="enquiry-notes"
                  rows={4}
                  value={selected.notes}
                  onChange={(event) => updateNotes(selected.id, event.target.value)}
                  placeholder="Add notes about this enquiry..."
                  maxLength={2000}
                />
                <small>Notes are automatically saved in this browser.</small>
              </div>

              <div className="enquiries-modal-footer">
                <a
                  className="enquiries-whatsapp"
                  href={getWhatsAppUrl(selected.phone, selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} />
                  Reply via WhatsApp
                </a>

                <a
                  className="enquiries-email"
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                >
                  <Send size={17} />
                  Reply via Email
                </a>
              </div>
            </div>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="enquiries-overlay enquiries-confirm-overlay">
          <section className="enquiries-confirm-dialog" role="alertdialog" aria-modal="true">
            <div className="enquiries-confirm-icon">
              <Trash2 size={25} />
            </div>
            <h2>Delete Enquiry?</h2>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.id}</strong>?
              This will remove the enquiry from local data.
            </p>
            <div className="enquiries-confirm-actions">
              <button type="button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" onClick={deleteEnquiry}>
                Delete Enquiry
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
