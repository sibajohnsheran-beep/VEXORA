
import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

import AdminSidebar from './components/AdminSidebar'
import type { AdminPage } from './components/AdminSidebar'

import AdminHeader from './components/AdminHeader'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Enquiries from './pages/Enquiries'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

import './App.css'

export default function App() {
  // =====================================
  // LOGIN STATES
  // =====================================

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  // =====================================
  // DASHBOARD STATES
  // =====================================

  const [activePage, setActivePage] =
    useState<AdminPage>('dashboard')

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  // =====================================
  // LOGIN FUNCTION
  // =====================================

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Frontend-only demo login.
    // Real authentication will be added with the backend.
    setLoggedIn(true)
    setActivePage('dashboard')
    setMobileMenuOpen(false)
  }

  // =====================================
  // LOGOUT FUNCTION
  // =====================================

  const handleLogout = () => {
    setLoggedIn(false)
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setError('')
    setActivePage('dashboard')
    setMobileMenuOpen(false)
  }

  // =====================================
  // DASHBOARD NAVIGATION
  // =====================================

  const handleNavigate = (page: AdminPage) => {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  // =====================================
  // ADMIN DASHBOARD
  // =====================================

  if (loggedIn) {
    return (
      <div className="admin-shell">
        {/* Sidebar Navigation */}
        <AdminSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Dashboard */}
        <div className="admin-main">
          {/* Top Header */}
          <AdminHeader
            activePage={activePage}
            onMenuClick={() => setMobileMenuOpen(true)}
            onLogout={handleLogout}
          />

          {/* Page Content */}
          <main className="admin-main-content">
            {activePage === 'dashboard' ? (
              <Dashboard onNavigate={handleNavigate} />
            ) : activePage === 'products' ? (
              <Products />
            ) : activePage === 'orders' ? (
              <Orders />
            ) : activePage === 'enquiries' ? (
              <Enquiries />
            ) : activePage === 'customers' ? (
              <Customers />
            ) : activePage === 'analytics' ? (
              <Analytics />
            ) : activePage === 'settings' ? (
              <Settings />
            ) : (
              <section className="admin-panel admin-placeholder">
                <h2>
                  {activePage
                    .replace(/-/g, ' ')
                    .toUpperCase()}
                </h2>

                <p>
                  This management page will be developed
                  in the next phase.
                </p>

                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                >
                  Back to Dashboard
                </button>
              </section>
            )}
          </main>
        </div>
      </div>
    )
  }

  // =====================================
  // ADMIN LOGIN PAGE
  // =====================================

  return (
    <main className="login-page">
      {/* Background Glow */}
      <div className="login-background-glow glow-one" />
      <div className="login-background-glow glow-two" />

      {/* LEFT SIDE - BRAND SHOWCASE */}
      <section className="login-showcase">
        <div className="brand">
          VE<span>X</span>ORA
          <span className="brand-dot">.</span>

          <small>ADMIN CONTROL CENTER</small>
        </div>

        <div className="showcase-content">
          <div className="security-badge">
            <ShieldCheck size={16} />
            INTELLIGENT SECURITY MANAGEMENT
          </div>

          <h1>
            COMMAND YOUR
            <span> SECURITY.</span>
          </h1>

          <p>
            One powerful workspace to manage your products,
            website content, customer enquiries and operations.
          </p>

          <div className="showcase-line" />

          <div className="showcase-footer">
            <span className="status-dot" />
            VEXORA ADMIN SYSTEM
          </div>
        </div>

        <div className="showcase-bottom">
          © {new Date().getFullYear()} VEXORA.
          ALL RIGHTS RESERVED.
        </div>
      </section>

      {/* RIGHT SIDE - LOGIN FORM */}
      <section className="login-section">
        <div className="login-card">
          <div className="login-icon">
            <LockKeyhole size={27} />
          </div>

          <p className="login-eyebrow">
            ADMINISTRATOR ACCESS
          </p>

          <h2>Welcome back.</h2>

          <p className="login-subtitle">
            Enter your details to access your dashboard.
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <label htmlFor="email">
              EMAIL ADDRESS
            </label>

            <div className="input-group">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <label htmlFor="password">
              PASSWORD
            </label>

            <div className="input-group">
              <LockKeyhole size={18} />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Validation Error */}
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              className="login-button"
              type="submit"
            >
              ACCESS DASHBOARD
              <ArrowRight size={19} />
            </button>
          </form>

          {/* Demo Information */}
          <p className="demo-note">
            Frontend demo only. Any valid email format
            and non-empty password will open the preview.
          </p>

          <div className="login-card-footer">
            <ShieldCheck size={15} />
            VEXORA / ADMIN INTERFACE
          </div>
        </div>
      </section>
    </main>
  )
}
