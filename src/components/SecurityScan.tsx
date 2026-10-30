
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SecurityScanProps = {
  progress: React.RefObject<{ progress: number }>
}

const POINTS: [number, number, number][] = [
  [-2.04, 2.4, 1.25],
  [2.04, 2.4, 1.25],
  [-2.04, -2.35, 1.25],
  [2.04, -2.35, 1.25],
]

function SecurityMarker({
  position,
  index,
}: {
  position: [number, number, number]
  index: number
}) {
  const markerRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!markerRef.current) return

    const pulse =
      1 + Math.sin(clock.elapsedTime * 2 + index) * 0.06

    markerRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={markerRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshBasicMaterial color="#8ce4ff" />
      </mesh>

      <mesh>
        <torusGeometry args={[0.14, 0.012, 8, 48]} />
        <meshBasicMaterial
          color="#70d8ff"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        color="#4bbdff"
        intensity={0.8}
        distance={1.5}
      />
    </group>
  )
}

function CoverageBeam({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh
        position={[0, -0.52, 0.55]}
        rotation={[Math.PI / 2.8, 0, 0]}
      >
        <coneGeometry args={[0.48, 1.5, 48, 1, true]} />
        <meshBasicMaterial
          color="#3ca9f5"
          transparent
          opacity={0.075}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function ConnectionLines() {
  const geometry = useMemo(() => {
    const vertices = [
      new THREE.Vector3(...POINTS[0]),
      new THREE.Vector3(...POINTS[1]),
      new THREE.Vector3(...POINTS[3]),
      new THREE.Vector3(...POINTS[2]),
      new THREE.Vector3(...POINTS[0]),
    ]

    return new THREE.BufferGeometry().setFromPoints(vertices)
  }, [])

  return (
    <primitive object={new THREE.Line(geometry)}>
      <lineBasicMaterial
        color="#54bfff"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </primitive>
  )
}

export default function SecurityScan({
  progress,
}: SecurityScanProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const scanRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const scroll = progress.current.progress

    const activation = THREE.MathUtils.smoothstep(
      scroll,
      0.78,
      0.98
    )

    if (groupRef.current) {
      groupRef.current.visible = activation > 0.005
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.12

      ringRef.current.scale.setScalar(
        0.9 + activation * 0.1
      )

      const material =
        ringRef.current.material as THREE.MeshBasicMaterial

      material.opacity =
        activation *
        (0.4 + Math.sin(clock.elapsedTime * 2) * 0.08)
    }

    if (scanRef.current) {
      scanRef.current.position.y =
        -2.8 + activation * 5.8

      const material =
        scanRef.current.material as THREE.MeshBasicMaterial

      material.opacity = activation * 0.65
    }

    if (glowRef.current) {
      const material =
        glowRef.current.material as THREE.MeshBasicMaterial

      material.opacity = activation * 0.065
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      {/* Subtle radar ring */}
      <mesh
        ref={ringRef}
        position={[0, -3.22, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2.9, 2.95, 96]} />
        <meshBasicMaterial
          color="#54c8ff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Scanning light across facade */}
      <mesh
        ref={scanRef}
        position={[0, -2.8, 1.23]}
      >
        <planeGeometry args={[4.2, 0.045]} />
        <meshBasicMaterial
          color="#72d8ff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle ground illumination */}
      <mesh
        ref={glowRef}
        position={[0, -3.31, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[3.1, 96]} />
        <meshBasicMaterial
          color="#1679d8"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* CCTV coverage beams */}
      {POINTS.map((point, index) => (
        <group key={index}>
          <SecurityMarker
            position={point}
            index={index}
          />

          <CoverageBeam position={point} />
        </group>
      ))}

      <ConnectionLines />
    </group>
  )
}
