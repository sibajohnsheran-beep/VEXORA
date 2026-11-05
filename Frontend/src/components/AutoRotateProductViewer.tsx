
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'

import ProductModels3D from './ProductModels3D'
import type { ProductModelType } from './ProductModels3D'

// One complete rotation takes 20 seconds.
const ROTATION_DURATION = 20
const ROTATION_SPEED = (Math.PI * 2) / ROTATION_DURATION

type ProductViewerProps = {
  type: ProductModelType
}

type ProductSettings = {
  scale: number
  position: [number, number, number]
  cameraPosition: [number, number, number]
  target: [number, number, number]
}

const PRODUCT_SETTINGS: Record<
  ProductModelType,
  ProductSettings
> = {
  bullet: {
    scale: 1.15,
    position: [0, 0, 0],
    cameraPosition: [3.2, 1.8, 4.8],
    target: [0, 0, 0],
  },

  dome: {
    scale: 1.35,
    position: [0, 0, 0],
    cameraPosition: [3.1, 1.9, 4.7],
    target: [0, 0, 0],
  },

  ptz: {
    scale: 1.18,
    position: [0, -0.08, 0],
    cameraPosition: [3.2, 2, 4.9],
    target: [0, 0, 0],
  },

  wifi: {
    scale: 1.05,
    position: [0, -0.1, 0],
    cameraPosition: [3.2, 2, 5],
    target: [0, 0.1, 0],
  },

  nvr: {
    scale: 1.2,
    position: [0, 0, 0],
    cameraPosition: [3.4, 2.3, 4.9],
    target: [0, 0, 0],
  },

  dvr: {
    scale: 1.2,
    position: [0, 0, 0],
    cameraPosition: [3.4, 2.3, 4.9],
    target: [0, 0, 0],
  },

  accessories: {
    scale: 1.15,
    position: [0, 0, 0],
    cameraPosition: [3.5, 2.3, 5],
    target: [0, 0, 0],
  },

  solar: {
    scale: 0.85,
    position: [0, -0.12, 0],
    cameraPosition: [3.5, 2.4, 5.5],
    target: [0, 0.1, 0],
  },
}

function RotatingProduct({
  type,
}: ProductViewerProps) {
  const rotationRef = useRef<THREE.Group>(null)
  const settings = PRODUCT_SETTINGS[type]

  useFrame((state) => {
    if (!rotationRef.current) return

    // Smooth automatic rotation.
    // Does not depend on mouse or hover.
    rotationRef.current.rotation.y =
      state.clock.elapsedTime * ROTATION_SPEED
  })

  return (
    <group
      ref={rotationRef}
      position={settings.position}
      scale={settings.scale}
    >
      <ProductModels3D type={type} />
    </group>
  )
}

function CameraSetup({
  type,
}: ProductViewerProps) {
  const settings = PRODUCT_SETTINGS[type]

  useFrame(({ camera }) => {
    camera.lookAt(...settings.target)
  })

  return null
}

export default function AutoRotateProductViewer({
  type,
}: ProductViewerProps) {
  const settings = PRODUCT_SETTINGS[type]

  return (
    <Canvas
      camera={{
        position: settings.cameraPosition,
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <CameraSetup type={type} />

      <ambientLight
        intensity={1.5}
        color="#dce3ef"
      />

      <directionalLight
        position={[4, 6, 5]}
        intensity={3}
        color="#ffffff"
      />

      <pointLight
        position={[-3, 2, -2]}
        intensity={18}
        distance={10}
        color="#4a9eff"
      />

      <pointLight
        position={[1, 1, 4]}
        intensity={12}
        distance={9}
        color="#c6e6ff"
      />

      <pointLight
        position={[0, -3, 1]}
        intensity={7}
        distance={8}
        color="#3165c8"
      />

      <Suspense fallback={null}>
        <RotatingProduct type={type} />

        <Environment preset="city" />

        <ContactShadows
          position={[0, -1.65, 0]}
          opacity={0.28}
          scale={6}
          blur={2.8}
          far={3}
          color="#08101e"
        />
      </Suspense>
    </Canvas>
  )
}
