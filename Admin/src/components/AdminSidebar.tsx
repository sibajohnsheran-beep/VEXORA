
import {
  LayoutDashboard,
  PanelsTopLeft,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  ChartNoAxesCombined,
  Settings,
  ChevronDown,
  House,
  Wrench,
  Shield,
  Cpu,
  Building2,
  Phone,
  PanelBottom,
  LogOut,
  X,
} from 'lucide-react'
import { useState } from 'react'

export type AdminPage =
  | 'dashboard'
  | 'home'
  | 'services'
  | 'solutions'
  | 'technology'
  | 'about'
  | 'contact'
  | 'footer'
  | 'products'
  | 'orders'
  | 'enquiries'
  | 'customers'
  | 'analytics'
  | 'settings'

type Props = {
  activePage: AdminPage
  onNavigate: (page: AdminPage) => void
  onLogout: () => void
  mobileOpen: boolean
  onClose: () => void
}

const contentItems = [
  { id: 'home', label: 'Home / Hero', icon: House },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'solutions', label: 'Solutions', icon: Shield },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'about', label: 'About Us', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'footer', label: 'Footer', icon: PanelBottom },
] as const

const menuItems = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

export default function AdminSidebar({
  activePage,
  onNavigate,
  onLogout,
  mobileOpen,
  onClose,
}: Props) {
  const [contentOpen, setContentOpen] = useState(true)

  const navigate = (page: AdminPage) => {
    onNavigate(page)
    onClose()
  }

  return (
    <>
      {mobileOpen && (
        <button
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div>
            <div className="admin-sidebar-logo">
              VE<span>X</span>ORA<span>.</span>
            </div>
            <p>ADMIN CONTROL CENTER</p>
          </div>

          <button
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-scroll">
          <p className="admin-menu-label">MAIN MENU</p>

          <button
            className={`admin-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="admin-nav-item admin-nav-parent"
            onClick={() => setContentOpen(!contentOpen)}
            aria-expanded={contentOpen}
          >
            <PanelsTopLeft size={19} />
            <span>Website Content</span>
            <ChevronDown
              size={16}
              className={contentOpen ? 'rotate' : ''}
            />
          </button>

          {contentOpen && (
            <div className="admin-submenu">
              {contentItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`admin-submenu-item ${activePage === id ? 'active' : ''}`}
                  onClick={() => navigate(id)}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          )}

          <p className="admin-menu-label admin-menu-label-second">
            MANAGEMENT
          </p>

          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`admin-nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-system">
            <Shield size={20} />
            <div>
              <strong>VEXORA</strong>
              <small>Security Management</small>
            </div>
          </div>

          <button className="admin-logout" onClick={onLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
