
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Settings as SettingsIcon,
  UserRound,
  Building2,
  Globe2,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react'

import './Settings.css'

type SettingsTab =
  | 'profile'
  | 'business'
  | 'website'
  | 'notifications'
  | 'security'

type SettingsData = {
  adminName: string
  adminEmail: string
  adminRole: string
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  businessDescription: string
  websiteTitle: string
  websiteDescription: string
  currency: string
  language: string
  maintenanceMode: boolean
  emailNotifications: boolean
  orderNotifications: boolean
  enquiryNotifications: boolean
  systemNotifications: boolean
}

const STORAGE_KEY = 'vexora_admin_settings_v1'

const defaultSettings: SettingsData = {
  adminName: 'VEXORA Administrator',
  adminEmail: 'admin@vexora.example',
  adminRole: 'Super Administrator',
  businessName: 'VEXORA Security',
  businessEmail: 'contact@vexora.example',
  businessPhone: '+94 77 123 4567',
  businessAddress: 'Colombo, Sri Lanka',
  businessDescription:
    'Intelligent surveillance and advanced security solutions.',
  websiteTitle: 'VEXORA | Intelligent Security Solutions',
  websiteDescription:
    'Discover advanced CCTV cameras and intelligent surveillance solutions.',
  currency: 'LKR',
  language: 'English',
  maintenanceMode: false,
  emailNotifications: true,
  orderNotifications: true,
  enquiryNotifications: true,
  systemNotifications: true,
}

function loadSettings(): SettingsData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return { ...defaultSettings }

    const parsed: unknown = JSON.parse(saved)

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        ...defaultSettings,
        ...(parsed as Partial<SettingsData>),
      }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }

  return { ...defaultSettings }
}

const tabs = [
  { id: 'profile', label: 'Admin Profile', icon: UserRound },
  { id: 'business', label: 'Business Information', icon: Building2 },
  { id: 'website', label: 'Website Preferences', icon: Globe2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
] as const

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [settings, setSettings] = useState<SettingsData>(loadSettings)
  const [savedSettings, setSavedSettings] = useState<SettingsData>(loadSettings)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [showPassword, setShowPassword] = useState(false)

  const isDirty =
    JSON.stringify(settings) !== JSON.stringify(savedSettings)

  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(() => setMessage(''), 4000)
    return () => window.clearTimeout(timer)
  }, [message])

  const updateField = <K extends keyof SettingsData>(
    field: K,
    value: SettingsData[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!settings.adminName.trim() || !settings.businessName.trim()) {
      setMessageType('error')
      setMessage('Admin name and business name are required.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !emailPattern.test(settings.adminEmail) ||
      !emailPattern.test(settings.businessEmail)
    ) {
      setMessageType('error')
      setMessage('Please enter valid email addresses.')
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSavedSettings({ ...settings })
      setMessageType('success')
      setMessage('Settings saved successfully.')
    } catch {
      setMessageType('error')
      setMessage('Unable to save settings in this browser.')
    }
  }

  const resetSettings = () => {
    if (
      !window.confirm(
        'Reset all settings to their original demo values?'
      )
    ) {
      return
    }

    const restored = { ...defaultSettings }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored))
      setSettings(restored)
      setSavedSettings(restored)
      setMessageType('success')
      setMessage('Default settings restored.')
    } catch {
      setMessageType('error')
      setMessage('Unable to reset settings in this browser.')
    }
  }

  const discardChanges = () => {
    setSettings({ ...savedSettings })
    setMessageType('success')
    setMessage('Unsaved changes discarded.')
  }

  return (
    <div className="settings-page">
      {message && (
        <div
          className={`settings-toast settings-toast-${messageType}`}
          role={messageType === 'error' ? 'alert' : 'status'}
        >
          {messageType === 'success' ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertTriangle size={19} />
          )}
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="settings-heading">
        <div>
          <span className="settings-eyebrow">
            <SettingsIcon size={15} />
            VEXORA / SYSTEM CONFIGURATION
          </span>
          <h2>Settings Management</h2>
          <p>Manage your administrator profile and business preferences.</p>
        </div>

        <button
          type="button"
          className="settings-reset-btn"
          onClick={resetSettings}
        >
          <RotateCcw size={16} />
          Reset Defaults
        </button>
      </div>

      <div className="settings-demo-banner">
        <Info size={17} />
        Frontend demo settings only. Changes are saved in this browser
        and do not yet update the public website or backend.
      </div>

      <div className="settings-layout">
        <aside className="settings-tabs">
          <div className="settings-tabs-heading">
            <span>CONFIGURATION</span>
          </div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`settings-tab ${
                activeTab === id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          <div className="settings-sidebar-note">
            <ShieldCheck size={20} />
            <div>
              <strong>VEXORA Control Center</strong>
              <small>Local configuration preview</small>
            </div>
          </div>
        </aside>

        <form className="settings-content" onSubmit={handleSave}>
          {activeTab === 'profile' && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <UserRound size={23} />
                </div>
                <div>
                  <h3>Administrator Profile</h3>
                  <p>Manage administrator contact information.</p>
                </div>
              </div>

              <div className="settings-fields">
                <label>
                  FULL NAME
                  <input
                    value={settings.adminName}
                    onChange={(event) =>
                      updateField('adminName', event.target.value)
                    }
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  EMAIL ADDRESS
                  <div className="settings-input-icon">
                    <Mail size={17} />
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(event) =>
                        updateField('adminEmail', event.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label>
                  ADMIN ROLE
                  <input
                    value={settings.adminRole}
                    readOnly
                    className="settings-readonly"
                  />
                </label>
              </div>

              <div className="settings-info-card">
                <Info size={18} />
                <p>
                  Profile details are for display only until secure
                  administrator accounts are connected.
                </p>
              </div>
            </>
          )}

          {activeTab === 'business' && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <Building2 size={23} />
                </div>
                <div>
                  <h3>Business Information</h3>
                  <p>Configure your company details.</p>
                </div>
              </div>

              <div className="settings-fields">
                <label>
                  BUSINESS NAME
                  <input
                    value={settings.businessName}
                    onChange={(event) =>
                      updateField('businessName', event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  BUSINESS EMAIL
                  <div className="settings-input-icon">
                    <Mail size={17} />
                    <input
                      type="email"
                      value={settings.businessEmail}
                      onChange={(event) =>
                        updateField('businessEmail', event.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label>
                  BUSINESS PHONE
                  <div className="settings-input-icon">
                    <Phone size={17} />
                    <input
                      type="tel"
                      value={settings.businessPhone}
                      onChange={(event) =>
                        updateField('businessPhone', event.target.value)
                      }
                    />
                  </div>
                </label>

                <label>
                  BUSINESS ADDRESS
                  <div className="settings-input-icon">
                    <MapPin size={17} />
                    <input
                      value={settings.businessAddress}
                      onChange={(event) =>
                        updateField('businessAddress', event.target.value)
                      }
                    />
                  </div>
                </label>

                <label className="settings-full-width">
                  BUSINESS DESCRIPTION
                  <textarea
                    rows={4}
                    value={settings.businessDescription}
                    onChange={(event) =>
                      updateField('businessDescription', event.target.value)
                    }
                    maxLength={500}
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === 'website' && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <Globe2 size={23} />
                </div>
                <div>
                  <h3>Website Preferences</h3>
                  <p>Configure your website presentation preferences.</p>
                </div>
              </div>

              <div className="settings-fields">
                <label className="settings-full-width">
                  WEBSITE TITLE
                  <input
                    value={settings.websiteTitle}
                    onChange={(event) =>
                      updateField('websiteTitle', event.target.value)
                    }
                  />
                </label>

                <label className="settings-full-width">
                  META DESCRIPTION
                  <textarea
                    rows={4}
                    value={settings.websiteDescription}
                    onChange={(event) =>
                      updateField('websiteDescription', event.target.value)
                    }
                    maxLength={300}
                  />
                </label>

                <label>
                  CURRENCY
                  <select
                    value={settings.currency}
                    onChange={(event) =>
                      updateField('currency', event.target.value)
                    }
                  >
                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </label>

                <label>
                  WEBSITE LANGUAGE
                  <select
                    value={settings.language}
                    onChange={(event) =>
                      updateField('language', event.target.value)
                    }
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Sinhala">Sinhala</option>
                  </select>
                </label>
              </div>

              <div className="settings-toggle-card">
                <div>
                  <strong>Maintenance Mode</strong>
                  <p>
                    Demo preference only. Does not disable the live website.
                  </p>
                </div>

                <label className="settings-switch">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(event) =>
                      updateField(
                        'maintenanceMode',
                        event.target.checked
                      )
                    }
                    aria-label="Maintenance mode"
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <Bell size={23} />
                </div>
                <div>
                  <h3>Notification Preferences</h3>
                  <p>Choose which notifications you want enabled.</p>
                </div>
              </div>

              {[
                {
                  key: 'emailNotifications',
                  title: 'Email Notifications',
                  description: 'Receive general notification emails.',
                },
                {
                  key: 'orderNotifications',
                  title: 'Order Updates',
                  description: 'Notifications about order status changes.',
                },
                {
                  key: 'enquiryNotifications',
                  title: 'Customer Enquiries',
                  description: 'Notifications when new enquiries arrive.',
                },
                {
                  key: 'systemNotifications',
                  title: 'System Alerts',
                  description: 'Important administrative system alerts.',
                },
              ].map((item) => {
                const key = item.key as
                  | 'emailNotifications'
                  | 'orderNotifications'
                  | 'enquiryNotifications'
                  | 'systemNotifications'

                return (
                  <div className="settings-toggle-card" key={key}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>

                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        checked={settings[key]}
                        onChange={(event) =>
                          updateField(key, event.target.checked)
                        }
                        aria-label={item.title}
                      />
                      <span className="settings-switch-slider" />
                    </label>
                  </div>
                )
              })}

              <div className="settings-info-card">
                <Info size={18} />
                <p>
                  These toggles save your preferences only.
                  Actual notification delivery requires backend integration.
                </p>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <h3>Security Settings</h3>
                  <p>Administrator access and security configuration.</p>
                </div>
              </div>

              <div className="settings-security-card">
                <div className="settings-security-icon">
                  <LockKeyhole size={24} />
                </div>

                <h4>Password Management</h4>
                <p>
                  Secure password management will be available
                  when backend authentication is implemented.
                </p>

                <div className="settings-security-preview">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value="DemoOnly"
                    readOnly
                    aria-label="Demo password preview"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide preview' : 'Show preview'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <small>
                  This is a demonstration placeholder, not your
                  actual administrator password.
                </small>
              </div>

              <div className="settings-info-card">
                <AlertTriangle size={18} />
                <p>
                  Current login is a frontend preview only.
                  Production access requires authenticated sessions,
                  password hashing and server-side authorization.
                </p>
              </div>
            </>
          )}

          {activeTab !== 'security' && (
            <div className="settings-form-footer">
              {isDirty && (
                <span className="settings-unsaved">
                  <AlertTriangle size={15} />
                  Unsaved changes
                </span>
              )}

              <button
                type="button"
                className="settings-discard-btn"
                onClick={discardChanges}
                disabled={!isDirty}
              >
                Discard
              </button>

              <button
                type="submit"
                className="settings-save-btn"
                disabled={!isDirty}
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
