
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Phone,
  Code2,
  ChevronUp,
} from 'lucide-react'

import './Footer.css'

const exploreLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
]

const companyLinks = [
  { label: 'Technology', href: '#technology' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="vexora-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-container">

        {/* TOP CTA */}
        <div className="footer-cta">
          <div className="footer-cta-content">
            <span className="footer-eyebrow">
              <span className="footer-status-dot" />
              YOUR SECURITY PARTNER
            </span>

            <h2>
              READY TO SECURE
              <span> YOUR WORLD?</span>
            </h2>

            <p>
              Discover smarter surveillance solutions
              designed around your security needs.
            </p>
          </div>

          <a href="#contact" className="footer-cta-button">
            START AN ENQUIRY
            <ArrowUpRight size={19} />
          </a>
        </div>

        {/* MAIN FOOTER */}
        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              VE<span>X</span>ORA
              <span className="footer-logo-dot">.</span>
            </a>

            <p className="footer-brand-description">
              Redefining modern surveillance through
              intelligent technology, precision engineering,
              and smarter security solutions.
            </p>

            <div className="footer-brand-badge">
              <ShieldCheck size={17} />
              ENGINEERED FOR PROTECTION
            </div>
          </div>

          {/* EXPLORE */}
          <div className="footer-links-column">
            <h3>EXPLORE</h3>

            <nav aria-label="Footer explore navigation">
              {exploreLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </nav>
          </div>

          {/* COMPANY */}
          <div className="footer-links-column">
            <h3>COMPANY</h3>

            <nav aria-label="Footer company navigation">
              {companyLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="footer-contact-column">
            <h3>LET'S CONNECT</h3>

            <p>
              Have a project in mind?
              Connect with us and discuss your
              security requirements.
            </p>

            <div className="footer-location">
              <MapPin size={17} />
              <span>Sri Lanka</span>
            </div>

            <a
              href="#contact"
              className="footer-whatsapp-button"
            >
              <MessageCircle size={19} />
              WHATSAPP ENQUIRY
              <ArrowRight size={17} />
            </a>

            {/* DEVELOPER DETAILS */}
            <div className="footer-developer">
              <div className="footer-developer-credit">
                <Code2 size={19} />
                <span>
                  Developed by{' '}
                  <strong>Neirah Tech</strong>
                </span>
              </div>

              <a
                href="tel:+94760041594"
                className="footer-developer-phone"
              >
                <Phone size={17} />
                <span>+94 760041594</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} VEXORA.
            <span> ALL RIGHTS RESERVED.</span>
          </div>

          <div className="footer-bottom-center">
            INTELLIGENT SECURITY / SRI LANKA
          </div>

          <button
            type="button"
            className="footer-back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            BACK TO TOP
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  )
}
