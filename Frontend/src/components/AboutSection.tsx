
import {
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Target,
  Lightbulb,
  CheckCircle2,
  MoveUpRight,
  ScanEye,
  Radio,
} from 'lucide-react'

import './AboutSection.css'

const values = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'Security First',
    description:
      'Protection and reliability are at the center of everything we design.',
    tag: 'PROTECTION',
  },
  {
    icon: Eye,
    number: '02',
    title: 'Intelligent Vision',
    description:
      'Modern surveillance solutions built for clarity and awareness.',
    tag: 'INTELLIGENCE',
  },
  {
    icon: Lightbulb,
    number: '03',
    title: 'Driven by Innovation',
    description:
      'Exploring smarter technologies for tomorrow’s security needs.',
    tag: 'INNOVATION',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-background" aria-hidden="true" />

      <div className="about-container">
        {/* SECTION TOPLINE */}
        <div className="about-topline">
          <span>
            <span className="about-status-dot" />
            VEXORA / WHO WE ARE
          </span>

          <span>BUILT AROUND YOUR PEACE OF MIND</span>
        </div>

        {/* HEADING */}
        <header className="about-heading">
          <div className="about-heading-main">
            <p className="about-eyebrow">
              A NEW PERSPECTIVE ON SECURITY
            </p>

            <h2>
              BEYOND
              <span>SURVEILLANCE.</span>
            </h2>
          </div>

          <p className="about-heading-description">
            At VEXORA, we believe security should be
            intelligent, intuitive, and designed for the
            world we live in today.
          </p>
        </header>

        {/* MAIN SHOWCASE */}
        <div className="about-showcase">
          {/* CINEMATIC SECURITY IMAGE */}
          <div className="about-showcase-image">
            <div className="about-image-overlay" />

            <div className="about-image-top">
              <span>
                <ScanEye size={15} />
                VEXORA / SECURITY TECHNOLOGY
              </span>

              <span>VISUAL / 001</span>
            </div>

            <div className="about-image-center">
              <div className="about-image-target">
                <Target size={30} strokeWidth={1.3} />
              </div>

              <span>INTELLIGENT MONITORING</span>
            </div>

            <div className="about-image-bottom">
              <div>
                <span>OUR APPROACH</span>

                <strong>
                  SMARTER SYSTEMS.
                  <br />
                  STRONGER PROTECTION.
                </strong>
              </div>

              <div className="about-image-arrow">
                <MoveUpRight size={23} />
              </div>
            </div>
          </div>

          {/* COMPANY STORY */}
          <div className="about-story">
            <div className="about-story-top">
              <span>THE VEXORA STORY</span>
              <span>
                <Radio size={13} />
                CONNECTED SECURITY
              </span>
            </div>

            <div className="about-story-content">
              <div className="about-story-icon">
                <ShieldCheck
                  size={30}
                  strokeWidth={1.5}
                />
              </div>

              <h3>
                Technology that
                <span> protects what matters.</span>
              </h3>

              <p>
                VEXORA is focused on bringing together
                modern surveillance technology, thoughtful
                design, and practical security solutions.
              </p>

              <p>
                From intelligent monitoring to connected
                protection, our goal is to make advanced
                security more accessible, dependable,
                and easy to manage.
              </p>

              <div className="about-story-divider" />

              <div className="about-story-points">
                <span>
                  <CheckCircle2 size={16} />
                  Intelligent solutions
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Modern technology
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Customer-focused approach
                </span>
              </div>
            </div>

            <a href="#contact" className="about-story-link">
              CONNECT WITH VEXORA
              <ArrowUpRight size={19} />
            </a>
          </div>
        </div>

        {/* VALUES HEADING */}
        <div className="about-values-heading">
          <div>
            <p>OUR FOUNDATION</p>

            <h3>
              What drives <span>VEXORA.</span>
            </h3>
          </div>

          <span>THOUGHTFUL SECURITY / MODERN THINKING</span>
        </div>

        {/* PREMIUM FEATURE CARDS */}
        <div className="about-values">
          {values.map((value) => {
            const Icon = value.icon

            return (
              <article
                className="about-value-card"
                key={value.number}
              >
                <div className="about-value-card-glow" />

                <div className="about-value-top">
                  <span>{value.number} / 03</span>
                  <ArrowUpRight size={19} />
                </div>

                <div className="about-value-icon">
                  <Icon size={30} strokeWidth={1.5} />
                </div>

                <div className="about-value-content">
                  <span className="about-value-tag">
                    {value.tag}
                  </span>

                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              </article>
            )
          })}
        </div>

        {/* FINAL CTA */}
        <div className="about-bottom-banner">
          <div>
            <span>THE FUTURE IS MORE SECURE</span>

            <h3>
              LET'S BUILD A
              <br />
              SAFER TOMORROW.
            </h3>
          </div>

          <a href="#contact" className="about-bottom-button">
            GET IN TOUCH
            <ArrowUpRight size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
