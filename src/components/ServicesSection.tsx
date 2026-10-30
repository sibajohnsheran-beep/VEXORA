
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  ClipboardCheck,
  Wrench,
  Monitor,
  RadioTower,
  X,
  CheckCircle2,
} from 'lucide-react'
import './ServicesSection.css'

const SERVICES = [
  {
    number: '01',
    title: 'Site Assessment',
    subtitle: '& Consultation',
    description:
      'We analyze your space, identify security needs, and provide expert recommendations.',
    icon: ClipboardCheck,
    features: [
      'On-site security evaluation',
      'Camera placement recommendations',
      'Security risk assessment',
      'Professional consultation',
    ],
  },
  {
    number: '02',
    title: 'System Design',
    subtitle: '& Installation',
    description:
      'Customized CCTV system design with professional installation for optimal performance.',
    icon: Monitor,
    features: [
      'Customized CCTV system planning',
      'Professional camera installation',
      'Network and recording setup',
      'System testing and configuration',
    ],
  },
  {
    number: '03',
    title: 'Maintenance',
    subtitle: '& Support',
    description:
      'Ongoing maintenance, system updates, and technical support to ensure uninterrupted security.',
    icon: Wrench,
    features: [
      'Routine system inspections',
      'Camera maintenance',
      'Software and firmware updates',
      'Technical troubleshooting',
    ],
  },
  {
    number: '04',
    title: 'Remote Monitoring',
    subtitle: '& Analytics',
    description:
      '24/7 monitoring with intelligent analytics to detect threats and respond efficiently.',
    icon: RadioTower,
    features: [
      'Remote surveillance access',
      'Monitoring system configuration',
      'Smart security notifications',
      'Surveillance analytics integration',
    ],
  },
]

const CAMERAS = [
  {
    id: '01',
    src: '/videos/cctv/cam-01.mp4',
    label: 'Parking Area',
  },
  {
    id: '02',
    src: '/videos/cctv/cam-02.mp4',
    label: 'Office Lobby',
  },
  {
    id: '03',
    src: '/videos/cctv/cam-03.mp4',
    label: 'Warehouse',
  },
  {
    id: '04',
    src: '/videos/cctv/cam-04.mp4',
    label: 'Corridor',
  },
  {
    id: '05',
    src: '/videos/cctv/cam-05.mp4',
    label: 'Parking Garage',
  },
  {
    id: '06',
    src: '/videos/cctv/cam-06.mp4',
    label: 'Outdoor Road',
  },
]

type Service = (typeof SERVICES)[number]

function ControlRoomVideos() {
  return (
    <div
      className="vexora-control-stage"
      aria-hidden="true"
    >
      <img
        className="vexora-control-stage-image"
        src="/images/services/control-room.png"
        alt=""
        draggable={false}
      />

      <div className="vexora-control-video-layer">
        {CAMERAS.map((camera) => (
          <div
            className={`vexora-monitor-video vexora-monitor-${camera.id}`}
            key={camera.id}
          >
            <video
              src={camera.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-label={camera.label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [selectedService, setSelectedService] =
    useState<Service | null>(null)

  useEffect(() => {
    if (!selectedService) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedService(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [selectedService])

  const openWhatsApp = (service: Service) => {
    const message = encodeURIComponent(
      `Hello VEXORA, I would like to enquire about ${service.title} ${service.subtitle}.`
    )

    window.open(
      `https://wa.me/94760041594?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section
      id="services"
      className="vexora-services-section"
    >
      <div className="vexora-services-showcase">
        {/* LEFT — SECURITY CONTROL ROOM */}
        <div className="vexora-services-control">
          <div className="vexora-services-control-image" />

          <div className="vexora-services-control-shade" />

          <div className="vexora-services-heading">
            <p className="vexora-services-eyebrow">
              <span className="vexora-services-blue-dot" />
              OUR SERVICES
              <span className="vexora-services-eyebrow-line" />
            </p>

            <h2>
              COMPLETE
              <br />
              SECURITY <span>SOLUTIONS.</span>
            </h2>

            <p className="vexora-services-intro">
              From planning to deployment, we deliver
              end-to-end surveillance solutions for
              modern spaces.
            </p>
          </div>
        </div>

        {/* RIGHT — SMART BUILDING */}
        <div className="vexora-services-right">
          <div className="vexora-services-building">
            <div
              className="vexora-services-building-image"
              role="img"
              aria-label="Smart building with CCTV surveillance coverage"
            />

            <div className="vexora-services-building-shade" />

            {/* Existing Smart Building animations */}
            <div
              className="vexora-smart-effects"
              aria-hidden="true"
            >
              <div className="vexora-smart-scan" />

              <div className="vexora-smart-pulse pulse-one" />
              <div className="vexora-smart-pulse pulse-two" />
              <div className="vexora-smart-pulse pulse-three" />

              <div className="vexora-smart-glow" />
            </div>
          </div>

          {/* FOUR SERVICES */}
          <div className="vexora-services-grid">
            {SERVICES.map((service) => {
              const Icon = service.icon

              return (
                <article
                  className="vexora-service-card"
                  key={service.number}
                >
                  <div className="vexora-service-card-top">
                    <span>{service.number} / 04</span>
                    <ArrowUpRight size={15} />
                  </div>

                  <div className="vexora-service-icon">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>

                  <h3>
                    {service.title}
                    <span>{service.subtitle}</span>
                  </h3>

                  <p>{service.description}</p>

                  <button
                    type="button"
                    className="vexora-service-learn"
                    onClick={() =>
                      setSelectedService(service)
                    }
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <span>Learn More</span>

                    <span className="vexora-service-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* SERVICE DETAILS MODAL */}
      {selectedService && (
        <div
          className="vexora-service-modal-backdrop"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="vexora-service-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vexora-service-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="vexora-service-modal-close"
              aria-label="Close service details"
              onClick={() => setSelectedService(null)}
            >
              <X size={22} />
            </button>

            <p className="vexora-services-eyebrow">
              VEXORA / OUR SERVICES
            </p>

            <h2 id="vexora-service-modal-title">
              {selectedService.title}{' '}
              <span>{selectedService.subtitle}</span>
            </h2>

            <p>{selectedService.description}</p>

            <div className="vexora-service-modal-features">
              {selectedService.features.map((feature) => (
                <div key={feature}>
                  <CheckCircle2 size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="vexora-service-enquire"
              onClick={() => openWhatsApp(selectedService)}
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
