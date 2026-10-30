
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type BulletCamera3DProps = {
  autoRotate?: boolean
}

function InfraredLight({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial
        color="#dce9ff"
        metalness={0.4}
        roughness={0.18}
        emissive="#7ba9ff"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function CameraLens() {
  return (
    <group position={[0, 0, 0.87]}>
      {/* Outer lens housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.1, 64]} />
        <meshStandardMaterial
          color="#080c13"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Metallic lens ring */}
      <mesh position={[0, 0, 0.065]}>
        <torusGeometry args={[0.235, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#8294ad"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Optical glass */}
      <mesh position={[0, 0, 0.075]}>
        <sphereGeometry
          args={[0.205, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshPhysicalMaterial
          color="#07182d"
          metalness={0.35}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Inner optical element */}
      <mesh position={[0, 0, 0.135]}>
        <circleGeometry args={[0.09, 48]} />
        <meshStandardMaterial
          color="#03070e"
          metalness={0.5}
          roughness={0.05}
        />
      </mesh>

      {/* Blue optical accent */}
      <mesh position={[0, 0, 0.095]}>
        <torusGeometry args={[0.15, 0.008, 8, 64]} />
        <meshStandardMaterial
          color="#6bbdff"
          emissive="#2465b8"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

function CameraBody() {
  const infraredPositions: [number, number, number][] = [
    [-0.36, 0.26, 0.85],
    [0.36, 0.26, 0.85],
    [-0.36, -0.26, 0.85],
    [0.36, -0.26, 0.85],
    [-0.39, 0, 0.85],
    [0.39, 0, 0.85],
  ]

  return (
    <group>
      {/* Main white body */}
      <mesh position={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.53, 0.48, 1.65, 64]} />
        <meshStandardMaterial
          color="#e2e8f1"
          metalness={0.42}
          roughness={0.28}
        />
      </mesh>

      {/* Cylinders point along Y by default.
          Rotate main body so it points forward along Z. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.53, 0.48, 1.65, 64]} />
          <meshStandardMaterial
            color="#e2e8f1"
            metalness={0.42}
            roughness={0.28}
          />
        </mesh>
      </group>

      {/* Black front face */}
      <mesh position={[0, 0, 0.79]}>
        <cylinderGeometry
          args={[0.49, 0.49, 0.09, 64]}
        />
        <meshStandardMaterial
          color="#10151d"
          metalness={0.45}
          roughness={0.22}
        />
      </mesh>

      {/* Front face aligned to Z */}
      <mesh
        position={[0, 0, 0.83]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.49, 0.49, 0.09, 64]} />
        <meshStandardMaterial
          color="#10151d"
          metalness={0.45}
          roughness={0.22}
        />
      </mesh>

      <CameraLens />

      {infraredPositions.map((position, index) => (
        <InfraredLight
          key={index}
          position={position}
        />
      ))}

      {/* Protective top hood */}
      <mesh position={[0, 0.54, 0.22]}>
        <boxGeometry args={[1.17, 0.09, 1.55]} />
        <meshStandardMaterial
          color="#edf2f8"
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>

      {/* Hood front lip */}
      <mesh position={[0, 0.49, 1.01]}>
        <boxGeometry args={[1.17, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#d5deea"
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Side decorative panels */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.49, 0, -0.15]}
        >
          <boxGeometry args={[0.04, 0.4, 1.15]} />
          <meshStandardMaterial
            color="#c5d0df"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function WallMount() {
  return (
    <group position={[0, 0, -1.4]}>
      {/* Wall mounting plate */}
      <mesh position={[0, 0, -0.35]}>
        <boxGeometry args={[0.7, 0.85, 0.13]} />
        <meshStandardMaterial
          color="#d8e0eb"
          metalness={0.45}
          roughness={0.3}
        />
      </mesh>

      {/* Mounting screws */}
      {[
        [-0.24, 0.3],
        [0.24, 0.3],
        [-0.24, -0.3],
        [0.24, -0.3],
      ].map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, -0.27]}
        >
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#77879c"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Support arm */}
      <mesh
        position={[0, 0, 0.05]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.8, 32]} />
        <meshStandardMaterial
          color="#e1e8f1"
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* Adjustable joint */}
      <mesh position={[0, 0, 0.43]}>
        <sphereGeometry args={[0.2, 32, 24]} />
        <meshStandardMaterial
          color="#b7c5d6"
          metalness={0.65}
          roughness={0.22}
        />
      </mesh>
    </group>
  )
}

export default function BulletCamera3D({
  autoRotate = false,
}: BulletCamera3DProps) {
  const cameraRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!cameraRef.current || !autoRotate) return

    const targetRotation =
      Math.sin(state.clock.elapsedTime * 0.45) * 0.35

    cameraRef.current.rotation.y =
      THREE.MathUtils.damp(
        cameraRef.current.rotation.y,
        targetRotation,
        2,
        delta
      )
  })

  return (
    <group ref={cameraRef} rotation={[0, -0.35, 0]}>
      <CameraBody />
      <WallMount />
    </group>
  )
}
