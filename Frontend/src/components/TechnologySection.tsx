
import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  ScanEye,
  Video,
} from 'lucide-react'

import ExplodedCamera3D from './ExplodedCamera3D'
import './TechnologySection.css'

const technologies = [
  {
    icon: BrainCircuit,
    title: 'AI Analytics',
    description:
      'Intelligent monitoring powered by advanced AI technology.',
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description:
      'Access and manage your security system from anywhere.',
  },
  {
    icon: ScanEye,
    title: 'Smart Detection',
    description:
      'Advanced motion detection for smarter surveillance.',
  },
  {
    icon: Video,
    title: 'High-Definition Imaging',
    description:
      'Capture every detail with crystal-clear video quality.',
  },
]

export default function TechnologySection() {
  return (
    <section id="technology" className="technology-section">
      <div className="technology-background-glow" />

      <div className="technology-container">
        <div className="technology-intro">
          <p className="technology-eyebrow">
            VEXORA / ADVANCED TECHNOLOGY
          </p>

          <h2>
            POWERED BY
            <span> INNOVATION.</span>
          </h2>

          <p className="technology-description">
            Experience the next generation of intelligent
            surveillance, built with advanced technology
            for smarter and more reliable protection.
          </p>

          <a href="#contact" className="technology-button">
            EXPLORE TECHNOLOGY
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="technology-visual">
          <div className="technology-visual-glow" />

          <ExplodedCamera3D />

          <div className="technology-visual-caption">
            <span>VEXORA / OPTICAL SYSTEM</span>
            <span>3D INTERACTIVE VIEW</span>
          </div>
        </div>

        <div className="technology-features">
          {technologies.map((item, index) => {
            const Icon = item.icon

            return (
              <article
                className="technology-feature"
                key={item.title}
              >
                <div className="technology-feature-icon">
                  <Icon size={23} strokeWidth={1.6} />
                </div>

                <div className="technology-feature-content">
                  <span className="technology-feature-number">
                    0{index + 1}
                  </span>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
