
import { useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Clock3,
  Send,
  CheckCircle2,
} from 'lucide-react'
import './ContactSection.css'

// Replace with your WhatsApp number.
// Example: 94771234567 (no + or spaces)
const WHATSAPP_NUMBER = '947XXXXXXXX'

const services = [
  'CCTV Installation',
  'Security System Upgrade',
  'Camera Maintenance',
  'Smart Surveillance Solutions',
  'Product Enquiry',
  'Other',
]

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      alert('Please configure the VEXORA WhatsApp number first.')
      return
    }

    const text = [
      '*New Enquiry — VEXORA*',
      '',
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      `*Service:* ${form.service}`,
      '',
      '*Message:*',
      form.message.trim(),
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

    window.location.href = url
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-topline">
          <span>
            <span className="contact-live-dot" />
            VEXORA / CONTACT
          </span>
          <span>LET'S CONNECT</span>
        </div>

        <header className="contact-heading">
          <div>
            <p className="contact-eyebrow">
              YOUR SECURITY STARTS HERE
            </p>
            <h2>
              LET'S TALK
              <span>SECURITY.</span>
            </h2>
          </div>
          <p>
            Have a question or a project in mind?
            Tell us what you need and connect directly
            with our team through WhatsApp.
          </p>
        </header>

        <div className="contact-layout">
          <div className="contact-info-panel">
            <div className="contact-info-top">
              <span>DIRECT COMMUNICATION</span>
              <MessageCircle size={20} />
            </div>

            <div className="contact-info-main">
              <div className="contact-info-icon">
                <ShieldCheck size={35} strokeWidth={1.3} />
              </div>

              <h3>
                SMARTER SECURITY.
                <span> ONE CONVERSATION AWAY.</span>
              </h3>

              <p>
                Whether you're exploring a new CCTV
                installation or upgrading your existing
                security system, we're here to discuss
                your requirements.
              </p>
            </div>

            <div className="contact-benefits">
              <div>
                <CheckCircle2 size={17} />
                Direct WhatsApp enquiries
              </div>
              <div>
                <CheckCircle2 size={17} />
                Product and installation assistance
              </div>
              <div>
                <CheckCircle2 size={17} />
                Personalized security discussions
              </div>
            </div>

            <div className="contact-info-bottom">
              <div>
                <MapPin size={19} />
                <span>SRI LANKA</span>
              </div>
              <div>
                <Clock3 size={19} />
                <span>MESSAGE US ANYTIME</span>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            <div className="contact-form-top">
              <div>
                <span>ENQUIRY FORM / 001</span>
                <h3>Tell us about your project.</h3>
              </div>
              <ArrowUpRight size={24} />
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <label>
                  FULL NAME
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                    maxLength={100}
                  />
                </label>

                <label>
                  PHONE NUMBER
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                    maxLength={25}
                  />
                </label>
              </div>

              <label>
                REQUIRED SERVICE
                <select
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                YOUR MESSAGE
                <textarea
                  rows={5}
                  placeholder="Tell us about your security requirements..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  maxLength={2000}
                />
              </label>

              <button type="submit" className="contact-submit">
                <span>
                  <MessageCircle size={20} />
                  SEND VIA WHATSAPP
                </span>
                <Send size={19} />
              </button>

              <p className="contact-form-note">
                WhatsApp will open with your enquiry
                pre-filled. Review and press Send to
                deliver your message.
              </p>
            </form>
          </div>
        </div>

        <div className="contact-bottom">
          <span>VEXORA / INTELLIGENT SECURITY</span>
          <span>YOUR PROTECTION. OUR PRIORITY.</span>
        </div>
      </div>
    </section>
  )
}
