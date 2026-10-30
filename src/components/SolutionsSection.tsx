
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  ArrowRight,
  House,
  Building2,
  Factory,
  ScanEye,
  X,
  CheckCircle2,
} from 'lucide-react'
import './SolutionsSection.css'

const SOLUTIONS = [
  {
    id: '01',
    title: 'Residential',
    subtitle: 'Security',
    category: 'SMART LIVING',
    description:
      'Protect your home and loved ones with intelligent surveillance solutions designed for modern living.',
    icon: House,
    image: '/images/solutions/residential.jpg',
    features: [
      'Smart home CCTV systems',
      'Mobile surveillance access',
      'Motion detection alerts',
      '24/7 video recording',
    ],
  },
  {
    id: '02',
    title: 'Commercial',
    subtitle: 'Security',
    category: 'BUSINESS PROTECTION',
    description:
      'Advanced surveillance solutions for offices, retail spaces, hotels and commercial environments.',
    icon: Building2,
    image: '/images/solutions/commercial.jpg',
    features: [
      'Office and retail surveillance',
      'Multi-camera monitoring',
      'Remote system access',
      'Scalable security infrastructure',
    ],
  },
  {
    id: '03',
    title: 'Industrial',
    subtitle: 'Surveillance',
    category: 'INDUSTRIAL SAFETY',
    description:
      'Reliable monitoring systems built for warehouses, factories and demanding industrial environments.',
    icon: Factory,
    image: '/images/solutions/industrial.jpg',
    features: [
      'Warehouse monitoring',
      'Perimeter surveillance',
      'Large-area camera coverage',
      'Continuous security recording',
    ],
  },
  {
    id: '04',
    title: 'Smart City',
    subtitle: '& Public Safety',
    category: 'CONNECTED SECURITY',
    description:
      'Intelligent surveillance solutions for public spaces, parking facilities and connected urban environments.',
    icon: ScanEye,
    image: '/images/solutions/smart-city.jpg',
    features: [
      'Public area monitoring',
      'Traffic surveillance',
      'Parking security systems',
      'Centralized monitoring',
    ],
  },
]

type Solution = (typeof SOLUTIONS)[number]

export default function SolutionsSection() {
  const [activeSolution, setActiveSolution] =
    useState<Solution | null>(null)

  useEffect(() => {
    if (!activeSolution) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSolution(null)
    }

    window.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [activeSolution])

  const enquire = (solution: Solution) => {
    const message = encodeURIComponent(
      `Hello VEXORA, I would like to enquire about ${solution.title} ${solution.subtitle} solutions.`
    )

    window.open(
      `https://wa.me/94760041594?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section id="solutions" className="vexora-solutions">
      <div className="vexora-solutions-inner">
        <div className="vexora-solutions-header">
          <div>
            <p className="vexora-solutions-eyebrow">
              <span className="vexora-solutions-dot" />
              TAILORED SECURITY
            </p>

            <h2>
              SECURITY FOR
              <br />
              <span>EVERY ENVIRONMENT.</span>
            </h2>
          </div>

          <p className="vexora-solutions-header-text">
            From private residences to large-scale
            infrastructure, VEXORA delivers intelligent
            protection designed around your needs.
          </p>
        </div>

        <div className="vexora-solutions-grid">
          {SOLUTIONS.map((solution) => {
            const Icon = solution.icon

            return (
              <article
                className="vexora-solution-card"
                key={solution.id}
              >
                <div className="vexora-solution-image-wrap">
                  <img
                    src={solution.image}
                    alt={`${solution.title} ${solution.subtitle}`}
                    loading="lazy"
                  />

                  <div className="vexora-solution-image-shade" />

                  <span className="vexora-solution-number">
                    {solution.id} / 04
                  </span>

                  <div className="vexora-solution-image-icon">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>
                </div>

                <div className="vexora-solution-content">
                  <span className="vexora-solution-category">
                    {solution.category}
                  </span>

                  <h3>
                    {solution.title}
                    <span>{solution.subtitle}</span>
                  </h3>

                  <p>{solution.description}</p>

                  <button
                    type="button"
                    className="vexora-solution-link"
                    onClick={() => setActiveSolution(solution)}
                  >
                    Explore Solution
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="vexora-solutions-bottom">
          <span>
            BUILT FOR TODAY. READY FOR TOMORROW.
          </span>

          <a href="#contact">
            DISCUSS YOUR SECURITY NEEDS
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {activeSolution && (
        <div
          className="vexora-solution-modal-backdrop"
          onClick={() => setActiveSolution(null)}
        >
          <div
            className="vexora-solution-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vexora-solution-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="vexora-solution-close"
              onClick={() => setActiveSolution(null)}
              aria-label="Close solution details"
            >
              <X size={22} />
            </button>

            <p className="vexora-solutions-eyebrow">
              VEXORA / SECURITY SOLUTIONS
            </p>

            <h2 id="vexora-solution-modal-title">
              {activeSolution.title}{' '}
              <span>{activeSolution.subtitle}</span>
            </h2>

            <p>{activeSolution.description}</p>

            <div className="vexora-solution-features">
              {activeSolution.features.map((feature) => (
                <div key={feature}>
                  <CheckCircle2 size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="vexora-solution-enquire"
              onClick={() => enquire(activeSolution)}
            >
              Enquire on WhatsApp
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
