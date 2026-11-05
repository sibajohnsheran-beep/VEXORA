
import {
  Bell,
  Menu,
  Search,
  ShieldCheck,
} from 'lucide-react'
import type { AdminPage } from './AdminSidebar'

type Props = {
  activePage: AdminPage
  onMenuClick: () => void
  onLogout: () => void
}

const pageNames: Record<AdminPage, string> = {
  dashboard: 'Dashboard Overview',
  home: 'Home / Hero',
  services: 'Services Management',
  solutions: 'Solutions Management',
  technology: 'Technology Management',
  about: 'About Us Management',
  contact: 'Contact Management',
  footer: 'Footer Management',
  products: 'Product Management',
  orders: 'Order Management',
  enquiries: 'Customer Enquiries',
  customers: 'Customer Management',
  analytics: 'Analytics & Reports',
  settings: 'Settings',
}

export default function AdminHeader({
  activePage,
  onMenuClick,
  onLogout,
}: Props) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-header-menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1>{pageNames[activePage]}</h1>
          <p>Manage your VEXORA CCTV website</p>
        </div>
      </div>

      <div className="admin-header-actions">
        <div className="admin-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search dashboard..."
            aria-label="Search dashboard"
          />
        </div>

        <div className="admin-notification">
          <Bell size={20} />
          <span />
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>Admin</strong>
            <small>Administrator</small>
          </div>
        </div>

        <button className="admin-header-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
