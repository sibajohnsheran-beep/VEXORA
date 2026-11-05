
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  OrbitControls,
  ContactShadows,
} from '@react-three/drei'

import BulletCamera3D from './BulletCamera3D'

export default function BulletProductViewer() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '18px',
        background:
          'radial-gradient(circle at center, #303d59 0%, #111522 75%)',
      }}
    >
      <Canvas
        camera={{
          position: [3, 2, 5],
          fov: 42,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={3}
          color="#e6f2ff"
        />

        <pointLight
          position={[-4, 2, 3]}
          intensity={18}
          color="#377dff"
        />

        <pointLight
          position={[2, -2, -3]}
          intensity={10}
          color="#7ddcff"
        />

        <Suspense fallback={null}>
          <group
            position={[0, 0.1, 0]}
            rotation={[0, -0.3, 0]}
            scale={1.1}
          >
            <BulletCamera3D />
          </group>

          <Environment preset="city" />

          <ContactShadows
            position={[0, -1.45, 0]}
            opacity={0.35}
            scale={8}
            blur={2.8}
            far={4}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={9}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI - 0.3}
        />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '20px',
          pointerEvents: 'none',
          color: '#98a9c4',
          fontSize: '11px',
          letterSpacing: '2px',
        }}
      >
        DRAG TO ROTATE / SCROLL TO ZOOM
      </div>
    </div>
  )
}
