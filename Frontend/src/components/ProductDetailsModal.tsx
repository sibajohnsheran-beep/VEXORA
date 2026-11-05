
import { useEffect } from 'react'
import {
  ArrowRight,
  ShieldCheck,
  X,
  MessageCircle,
} from 'lucide-react'

import AutoRotateProductViewer from './AutoRotateProductViewer'
import type { ProductModelType } from './ProductModels3D'

export type ProductDetail = {
  id: string
  name: string
  description: string
  model: ProductModelType
}

type ProductDetailsModalProps = {
  product: ProductDetail | null
  onClose: () => void
}

// VEXORA official WhatsApp number
// Sri Lanka country code: +94
const WHATSAPP_NUMBER = '94760041594'

const PRODUCT_FEATURES: Record<
  ProductModelType,
  string[]
> = {
  bullet: [
    'Outdoor surveillance',
    'Night vision support',
    'Weather-resistant design',
    'Motion detection',
  ],

  dome: [
    'Discreet camera design',
    'Wide-area monitoring',
    'Indoor security',
    'Night vision support',
  ],

  ptz: [
    'Pan, tilt and zoom',
    '360° surveillance coverage',
    'Remote camera control',
    'Intelligent monitoring',
  ],

  wifi: [
    'Wireless connectivity',
    'Mobile monitoring',
    'Flexible installation',
    'Smart security integration',
  ],

  nvr: [
    'Network video recording',
    'Multi-camera management',
    'Video playback',
    'Centralized monitoring',
  ],

  dvr: [
    'Digital video recording',
    'Analog camera integration',
    'Local video storage',
    'Playback management',
  ],

  accessories: [
    'Camera mounting equipment',
    'Power accessories',
    'Cables and connectors',
    'Monitoring essentials',
  ],

  solar: [
    'Solar-powered operation',
    'Outdoor monitoring',
    'Flexible deployment',
    'Energy-efficient security',
  ],
}

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  useEffect(() => {
    if (!product) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [product, onClose])

  if (!product) return null

  const features = PRODUCT_FEATURES[product.model]

  // Automatically create a product-specific message.
  const whatsappMessage =
    `Hello VEXORA! I'm interested in your ${product.name}. ` +
    `Could you please share the price, specifications, ` +
    `and availability? Thank you.`

  // Open WhatsApp with the selected product message.
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(whatsappMessage)

  return (
    <div
      className="product-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="product-modal-close"
          aria-label="Close product details"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* LEFT SIDE — 3D PRODUCT */}
        <div className="product-modal-visual">
          <span className="product-modal-number">
            VEXORA / {product.id}
          </span>

          <div className="product-modal-viewer">
            <AutoRotateProductViewer
              type={product.model}
            />
          </div>

          <span className="product-modal-rotation">
            AUTOMATIC 360° PRODUCT VIEW
          </span>
        </div>

        {/* RIGHT SIDE — PRODUCT DETAILS */}
        <div className="product-modal-content">
          <p className="eyebrow">
            VEXORA / SECURITY COLLECTION
          </p>

          <h2 id="product-modal-title">
            {product.name}
          </h2>

          <p
            id="product-modal-description"
            className="product-modal-description"
          >
            {product.description}
          </p>

          <div className="product-modal-divider" />

          <h3>KEY FEATURES</h3>

          <ul className="product-modal-features">
            {features.map((feature) => (
              <li key={feature}>
                <ShieldCheck size={18} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* WHATSAPP ENQUIRY */}
          <div className="product-modal-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="product-modal-enquire"
            >
              <MessageCircle size={19} />

              ENQUIRE VIA WHATSAPP

              <ArrowRight size={18} />
            </a>

            <p>
              Contact our team for product
              specifications, pricing and availability.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
