
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Technology', href: '#technology' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const WHATSAPP_NUMBER = '94760041594'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const whatsappMessage = encodeURIComponent(
    'Hello VEXORA! I would like to enquire about your security solutions.'
  )

  return (
    <header
      className={`vexora-navbar ${
        scrolled ? 'vexora-navbar-scrolled' : ''
      }`}
    >
      <div className="vexora-navbar-inner">
        <a
          href="#home"
          className="vexora-navbar-logo"
          onClick={closeMenu}
          aria-label="VEXORA Home"
        >
          VE<span>X</span>ORA
          <span className="vexora-logo-glow" />
        </a>

        <nav
          id="vexora-primary-navigation"
          className={`vexora-navbar-links ${
            menuOpen ? 'vexora-navbar-links-open' : ''
          }`}
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="vexora-navbar-cta"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire Now
          <ArrowUpRight size={16} />
        </a>

        <button
          type="button"
          className="vexora-navbar-menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="vexora-primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
