
import { useMemo } from 'react'

type WindowData = {
  position: [number, number, number]
  lit: boolean
  tint: string
}

const MATERIAL = {
  frame: '#34455b',
  darkFrame: '#172232',
  glass: '#173451',
  concrete: '#3b4658',
  steel: '#8a9db0',
}

function WindowPanel({
  position,
  lit,
  tint,
}: WindowData) {
  return (
    <group position={position}>
      {/* Reflective glass window */}
      <mesh>
        <boxGeometry args={[0.57, 0.55, 0.035]} />
        <meshPhysicalMaterial
          color={lit ? '#7799b6' : tint}
          metalness={0.55}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive={lit ? '#47769e' : '#020a15'}
          emissiveIntensity={lit ? 0.45 : 0.05}
        />
      </mesh>

      {/* Interior illumination */}
      {lit && (
        <mesh position={[0, 0.05, 0.023]}>
          <planeGeometry args={[0.43, 0.39]} />
          <meshBasicMaterial
            color="#a8c8dc"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Subtle window reflection */}
      <mesh position={[-0.16, 0.05, 0.025]}>
        <planeGeometry args={[0.045, 0.43]} />
        <meshBasicMaterial
          color="#d3e6f3"
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function FrontFacade() {
  const windows = useMemo<WindowData[]>(() => {
    const panels: WindowData[] = []

    for (let floor = 0; floor < 9; floor++) {
      for (let col = 0; col < 6; col++) {
        const lit = (floor * 13 + col * 7) % 9 < 3

        panels.push({
          position: [
            -1.65 + col * 0.66,
            -2.45 + floor * 0.65,
            1.065,
          ],
          lit,
          tint:
            (floor + col) % 3 === 0
              ? '#24415b'
              : (floor + col) % 3 === 1
                ? '#10283f'
                : '#1b344b',
        })
      }
    }

    return panels
  }, [])

  return (
    <group>
      {windows.map((window, i) => (
        <WindowPanel key={i} {...window} />
      ))}

      {/* Vertical aluminium mullions */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={`v-${i}`}
          position={[-1.98 + i * 0.66, 0.15, 1.12]}
        >
          <boxGeometry args={[0.055, 6.2, 0.1]} />
          <meshStandardMaterial
            color={MATERIAL.frame}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}

      {/* Horizontal floor dividers */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={`h-${i}`}
          position={[0, -2.78 + i * 0.65, 1.12]}
        >
          <boxGeometry args={[4.1, 0.055, 0.1]} />
          <meshStandardMaterial
            color={MATERIAL.frame}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}
    </group>
  )
}

function SideFacade() {
  const sideWindows = useMemo(() => {
    const panels: {
      y: number
      z: number
      lit: boolean
    }[] = []

    for (let floor = 0; floor < 9; floor++) {
      for (let col = 0; col < 3; col++) {
        panels.push({
          y: -2.45 + floor * 0.65,
          z: -0.65 + col * 0.65,
          lit: (floor * 5 + col * 3) % 7 < 2,
        })
      }
    }

    return panels
  }, [])

  return (
    <group
      position={[2.115, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      {sideWindows.map((window, i) => (
        <mesh
          key={i}
          position={[window.z, window.y, 0]}
        >
          <boxGeometry args={[0.54, 0.55, 0.035]} />
          <meshPhysicalMaterial
            color={window.lit ? '#7297b4' : '#132b43'}
            metalness={0.55}
            roughness={0.16}
            clearcoat={1}
            emissive={window.lit ? '#38638b' : '#000000'}
            emissiveIntensity={window.lit ? 0.45 : 0}
          />
        </mesh>
      ))}

      {/* Side vertical frames */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={`sv-${i}`}
          position={[-0.97 + i * 0.65, 0.15, 0.065]}
        >
          <boxGeometry args={[0.045, 6.2, 0.09]} />
          <meshStandardMaterial
            color={MATERIAL.frame}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}

      {/* Side horizontal frames */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={`sh-${i}`}
          position={[0, -2.78 + i * 0.65, 0.065]}
        >
          <boxGeometry args={[2.1, 0.05, 0.09]} />
          <meshStandardMaterial
            color={MATERIAL.frame}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}
    </group>
  )
}

function Entrance() {
  return (
    <group position={[0, -3.27, 0]}>
      {/* Ground floor lobby */}
      <mesh position={[0, 0.35, 1.08]}>
        <boxGeometry args={[3.65, 0.85, 0.12]} />
        <meshPhysicalMaterial
          color="#314d66"
          metalness={0.5}
          roughness={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glass entrance doors */}
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.33, 1.17]}>
          <boxGeometry args={[0.67, 0.7, 0.045]} />
          <meshPhysicalMaterial
            color="#14283b"
            metalness={0.6}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>
      ))}

      {/* Stainless steel door handles */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.3, 1.22]}>
          <boxGeometry args={[0.025, 0.2, 0.025]} />
          <meshStandardMaterial
            color="#b6c8d6"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      ))}

      {/* Entrance canopy */}
      <mesh position={[0, 0.83, 1.52]}>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshStandardMaterial
          color={MATERIAL.darkFrame}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {/* Canopy lighting */}
      <mesh position={[0, 0.775, 1.95]}>
        <boxGeometry args={[2.1, 0.012, 0.05]} />
        <meshStandardMaterial
          color="#b9e6ff"
          emissive="#74bfff"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

function Rooftop() {
  return (
    <group position={[0, 3.36, 0]}>
      {/* Roof slab */}
      <mesh>
        <boxGeometry args={[4.45, 0.18, 2.35]} />
        <meshStandardMaterial
          color={MATERIAL.concrete}
          metalness={0.55}
          roughness={0.5}
        />
      </mesh>

      {/* Rooftop equipment */}
      <mesh position={[-0.8, 0.24, -0.25]}>
        <boxGeometry args={[0.85, 0.42, 0.75]} />
        <meshStandardMaterial
          color="#566579"
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0.4, 0.2, -0.3]}>
        <boxGeometry args={[0.7, 0.35, 0.55]} />
        <meshStandardMaterial
          color="#44556a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[1.45, 0.6, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 1.2, 12]} />
        <meshStandardMaterial
          color={MATERIAL.steel}
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Antenna indicator */}
      <mesh position={[1.45, 1.22, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#b8e8ff"
          emissive="#2875cb"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

export default function SecurityBuilding() {
  return (
    <group>
      {/* Main building structure */}
      <mesh>
        <boxGeometry args={[4.2, 6.6, 2.1]} />
        <meshStandardMaterial
          color={MATERIAL.darkFrame}
          metalness={0.35}
          roughness={0.65}
        />
      </mesh>

      {/* Front facade backing */}
      <mesh position={[0, 0, 1.058]}>
        <boxGeometry args={[4.12, 6.3, 0.025]} />
        <meshStandardMaterial
          color={MATERIAL.glass}
          metalness={0.55}
          roughness={0.2}
        />
      </mesh>

      <FrontFacade />
      <SideFacade />

      {/* Corner support columns */}
      {[-2.08, 2.08].map((x) => (
        <mesh key={x} position={[x, 0, 1.05]}>
          <boxGeometry args={[0.13, 6.65, 0.16]} />
          <meshStandardMaterial
            color="#52657b"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
      ))}

      <Rooftop />
      <Entrance />

      {/* Building foundation */}
      <mesh position={[0, -3.43, 0.25]}>
        <boxGeometry args={[5.3, 0.25, 3.7]} />
        <meshStandardMaterial
          color="#313d4e"
          metalness={0.25}
          roughness={0.8}
        />
      </mesh>

      {/* Smaller dark ground — updated */}
      <mesh
        position={[0, -3.57, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[7.5, 6.5]} />
        <meshStandardMaterial
          color="#111522"
          metalness={0.1}
          roughness={0.95}
        />
      </mesh>

      {/* Subtle entrance lighting */}
      <pointLight
        position={[0, -2.5, 3]}
        intensity={12}
        distance={8}
        color="#8abce5"
      />

      {/* Blue architectural accent */}
      <pointLight
        position={[-2, 1, 2]}
        intensity={8}
        distance={7}
        color="#245db8"
      />
    </group>
  )
}
