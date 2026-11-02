
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

import PTZCamera from './components/PTZCamera'
import SecurityBuilding from './components/SecurityBuilding'
import SecurityScan from './components/SecurityScan'
import AutoRotateProductViewer from './components/AutoRotateProductViewer'
import ProductDetailsModal from './components/ProductDetailsModal'
import type { ProductDetail } from './components/ProductDetailsModal'
import Navbar from './components/Navbar'
import ServicesSection from './components/ServicesSection'
import SolutionsSection from './components/SolutionsSection'
import TechnologySection from './components/TechnologySection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

type StoryValues = {
  progress: number
}

type SceneName = 'camera' | 'building' | 'final'

const PRODUCTS: ProductDetail[] = [
  {
    id: '01',
    name: 'Bullet Cameras',
    description: 'Precision outdoor surveillance',
    model: 'bullet',
  },
  {
    id: '02',
    name: 'Dome Cameras',
    description: 'Discreet indoor protection',
    model: 'dome',
  },
  {
    id: '03',
    name: 'PTZ Cameras',
    description: 'Intelligent 360° monitoring',
    model: 'ptz',
  },
  {
    id: '04',
    name: 'Wi-Fi Cameras',
    description: 'Connected security solutions',
    model: 'wifi',
  },
  {
    id: '05',
    name: 'NVR Systems',
    description: 'Advanced network recording',
    model: 'nvr',
  },
  {
    id: '06',
    name: 'DVR Systems',
    description: 'Reliable video management',
    model: 'dvr',
  },
  {
    id: '07',
    name: 'Accessories',
    description: 'Complete security essentials',
    model: 'accessories',
  },
  {
    id: '08',
    name: 'Solar Cameras',
    description: 'Independent smart protection',
    model: 'solar',
  },
]

function CinematicScene({
  story,
}: {
  story: React.RefObject<StoryValues>
}) {
  const ptzRef = useRef<THREE.Group>(null)
  const buildingRef = useRef<THREE.Group>(null)

  const cameraLightRef = useRef<THREE.SpotLight>(null)
  const buildingLightRef = useRef<THREE.PointLight>(null)

  useFrame((state, delta) => {
    const p = story.current.progress

    const reveal = THREE.MathUtils.smoothstep(
      p,
      0,
      0.25
    )

    const lensZoom = THREE.MathUtils.smoothstep(
      p,
      0.24,
      0.48
    )

    const cameraExit = THREE.MathUtils.smoothstep(
      p,
      0.47,
      0.61
    )

    const buildingReveal = THREE.MathUtils.smoothstep(
      p,
      0.52,
      0.7
    )

    const finalScene = THREE.MathUtils.smoothstep(
      p,
      0.83,
      0.98
    )

    // EXISTING PTZ CAMERA ANIMATION
    if (ptzRef.current) {
      const group = ptzRef.current

      const targetX = THREE.MathUtils.lerp(
        -cameraExit * 6,
        -1.1,
        finalScene
      )

      const targetY = THREE.MathUtils.lerp(
        0,
        -0.65,
        finalScene
      )

      const targetZ = THREE.MathUtils.lerp(
        0,
        2.4,
        finalScene
      )

      const targetScale = THREE.MathUtils.lerp(
        1 - cameraExit * 0.65,
        0.66,
        finalScene
      )

      group.visible =
        cameraExit < 0.99 || finalScene > 0.01

      group.position.x = THREE.MathUtils.damp(
        group.position.x,
        targetX,
        5,
        delta
      )

      group.position.y = THREE.MathUtils.damp(
        group.position.y,
        targetY,
        5,
        delta
      )

      group.position.z = THREE.MathUtils.damp(
        group.position.z,
        targetZ,
        5,
        delta
      )

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        -0.5 +
          reveal * 0.45 +
          lensZoom * 0.35 -
          finalScene * 0.35,
        5,
        delta
      )

      group.scale.setScalar(
        THREE.MathUtils.damp(
          group.scale.x,
          targetScale,
          5,
          delta
        )
      )
    }

    // EXISTING BUILDING ANIMATION
    if (buildingRef.current) {
      const group = buildingRef.current

      group.visible = p > 0.48

      const targetX = THREE.MathUtils.lerp(
        3.5 * (1 - buildingReveal),
        1.65,
        finalScene
      )

      const targetScale = THREE.MathUtils.lerp(
        0.3 + buildingReveal * 0.55,
        0.54,
        finalScene
      )

      group.position.x = THREE.MathUtils.damp(
        group.position.x,
        targetX,
        5,
        delta
      )

      group.position.y = THREE.MathUtils.damp(
        group.position.y,
        -0.25,
        5,
        delta
      )

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        -0.55 + buildingReveal * 0.35,
        5,
        delta
      )

      group.scale.setScalar(
        THREE.MathUtils.damp(
          group.scale.x,
          targetScale,
          5,
          delta
        )
      )
    }

    // EXISTING CINEMATIC CAMERA VIEWPOINT
    const buildingCameraX = THREE.MathUtils.lerp(
      3.5 - lensZoom * 2.8,
      2.5,
      buildingReveal
    )

    const buildingCameraY = THREE.MathUtils.lerp(
      1.8 - lensZoom * 1.5,
      1.7,
      buildingReveal
    )

    const buildingCameraZ = THREE.MathUtils.lerp(
      5.5 - lensZoom * 3,
      11,
      buildingReveal
    )

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      THREE.MathUtils.lerp(
        buildingCameraX,
        1.0,
        finalScene
      ),
      5,
      delta
    )

    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      THREE.MathUtils.lerp(
        buildingCameraY,
        1.2,
        finalScene
      ),
      5,
      delta
    )

    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      THREE.MathUtils.lerp(
        buildingCameraZ,
        10.5,
        finalScene
      ),
      5,
      delta
    )

    state.camera.lookAt(0, 0.2, 0)

    // EXISTING LIGHTING
    if (cameraLightRef.current) {
      cameraLightRef.current.intensity =
        THREE.MathUtils.damp(
          cameraLightRef.current.intensity,
          (2 + reveal * 28) *
            (1 - cameraExit + finalScene * 0.8),
          5,
          delta
        )
    }

    if (buildingLightRef.current) {
      buildingLightRef.current.intensity =
        THREE.MathUtils.damp(
          buildingLightRef.current.intensity,
          buildingReveal * 50,
          5,
          delta
        )
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />

      <spotLight
        ref={cameraLightRef}
        position={[3, 5, 5]}
        angle={0.7}
        penumbra={1}
        intensity={2}
        color="#c8e7ff"
      />

      <pointLight
        position={[-3, 1, 2]}
        intensity={8}
        color="#2557c9"
      />

      <pointLight
        ref={buildingLightRef}
        position={[2, 5, 5]}
        intensity={0}
        color="#8acbff"
      />

      <group ref={ptzRef}>
        <PTZCamera />
      </group>

      <group
        ref={buildingRef}
        position={[3.5, -0.25, 0]}
        scale={0.3}
        visible={false}
      >
        <SecurityBuilding />
        <SecurityScan progress={story} />
      </group>
    </>
  )
}

function App() {
  const storyRef = useRef<HTMLElement>(null)

  const story = useRef<StoryValues>({
    progress: 0,
  })

  const [scene, setScene] =
    useState<SceneName>('camera')

  // EXISTING PRODUCT DETAILS STATE
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>(null)

  const closeProductDetails = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  // EXISTING CINEMATIC SCROLL ANIMATION
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: storyRef.current,
      start: 'top top',
      end: '+=5600',
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        const p = self.progress
        story.current.progress = p

        const nextScene: SceneName =
          p >= 0.88
            ? 'final'
            : p >= 0.57
              ? 'building'
              : 'camera'

        setScene((current) =>
          current === nextScene ? current : nextScene
        )
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <main className="vexora-app">
      {/* EXISTING PREMIUM GLASS NAVBAR */}
      <Navbar />

      {/* EXISTING CINEMATIC STORY */}
      <section
        id="home"
        ref={storyRef}
        className={`story-section scene-${scene}`}
      >
        <div className="story-canvas">
          <Canvas
            camera={{
              position: [3.5, 1.8, 5.5],
              fov: 42,
            }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: false,
            }}
          >
            <color
              attach="background"
              args={['#111522']}
            />

            <Suspense fallback={null}>
              <CinematicScene story={story} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* PTZ CAMERA HEADING */}
        <div
          className={`story-copy ${
            scene !== 'camera' ? 'is-hidden' : ''
          }`}
        >
          <p className="eyebrow">
            VEXORA / INTELLIGENT SECURITY
          </p>

          <h1>SECURITY, REIMAGINED.</h1>

          <p className="description">
            Advanced surveillance. Intelligent protection.
            A new perspective on security.
          </p>

          <p className="scroll-indicator">
            SCROLL TO EXPLORE
            <ArrowDown size={14} />
          </p>
        </div>

        {/* BUILDING HEADING */}
        <div
          className={`building-copy ${
            scene === 'building' ? 'is-visible' : ''
          }`}
        >
          <p className="eyebrow">
            VEXORA / SMART SURVEILLANCE
          </p>

          <h2>INTELLIGENT PROTECTION.</h2>

          <p>
            Protecting modern spaces with advanced
            security technology.
          </p>
        </div>

        {/* FINAL CINEMATIC HEADING */}
        <div
          className={`final-copy ${
            scene === 'final' ? 'is-visible' : ''
          }`}
        >
          <p className="eyebrow">
            VEXORA / THE FUTURE OF SECURITY
          </p>

          <h2>PROTECTION WITHOUT LIMITS.</h2>

          <p>
            One intelligent ecosystem. Complete visibility.
            Total confidence.
          </p>

          <a
            href="#products"
            className="explore-button"
          >
            EXPLORE PRODUCTS
            <ArrowRight size={17} />
          </a>
        </div>

        {/* BOTTOM LABELS */}
        <div className="bottom-label">
          <span>
            {scene === 'camera'
              ? 'PTZ / 001'
              : scene === 'building'
                ? 'SMART SECURITY / 002'
                : 'VEXORA / 003'}
          </span>

          <span>ENGINEERED FOR PROTECTION</span>
        </div>
      </section>

      {/* EXISTING 8 AUTOMATIC 3D PRODUCTS */}
      <section
        id="products"
        className="products-section"
      >
        <div className="products-heading">
          <p className="eyebrow">
            VEXORA / OUR COLLECTION
          </p>

          <h2>
            BUILT FOR EVERY
            <span> PERSPECTIVE.</span>
          </h2>

          <p>
            Discover a complete range of intelligent
            surveillance solutions.
          </p>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <article
              className="product-card"
              key={product.id}
            >
              <div className="product-card-top">
                <span>{product.id} / 08</span>
                <ShieldCheck size={18} />
              </div>

              {/* EXISTING AUTOMATIC 360° 3D VIEWER */}
              <div className="product-3d-viewer">
                <AutoRotateProductViewer
                  type={product.model}
                />
              </div>

              <div className="product-card-bottom">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <button
                  type="button"
                  className="product-details-trigger"
                  onClick={() => setSelectedProduct(product)}
                  aria-label={`View details for ${product.name}`}
                >
                  VIEW DETAILS
                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EXISTING SERVICES SECTION */}
      <ServicesSection />

      {/* EXISTING SOLUTIONS SECTION */}
      <SolutionsSection />

      {/* EXISTING TECHNOLOGY SECTION */}
      <TechnologySection />

      {/* EXISTING ABOUT US SECTION */}
      <AboutSection />

      {/* EXISTING WHATSAPP CONTACT SECTION */}
      <ContactSection />

      {/* NEW PREMIUM FOOTER */}
      <Footer />

      {/* EXISTING PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={closeProductDetails}
      />
    </main>
  )
}

export default App
