
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

// VEXORA — CINEMATIC SECURITY OPERATIONS CENTER

type Vector3 = [number, number, number]

// -------------------------------------------
// MATERIALS
// -------------------------------------------

const METAL = '#25364c'
const DARK_METAL = '#111d2d'
const CYAN = '#42cfff'
const BLUE = '#1479c8'

// -------------------------------------------
// SIMULATED CCTV SURVEILLANCE FEED
// -------------------------------------------

function SurveillanceFeed({
  type,
}: {
  type: number
}) {
  const scanRef = useRef<THREE.Mesh>(null)
  const indicatorRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (scanRef.current) {
      scanRef.current.position.y =
        ((time * 0.16) % 0.48) - 0.24
    }

    if (indicatorRef.current) {
      indicatorRef.current.visible =
        Math.sin(time * 3) > -0.2
    }
  })

  return (
    <group>
      <mesh>
        <planeGeometry args={[0.99, 0.59]} />
        <meshBasicMaterial color="#0c263b" />
      </mesh>

      {/* Simulated camera environment */}
      {type === 0 && (
        <>
          {/* Building entrance */}
          <mesh position={[-0.17, -0.02, 0.005]}>
            <planeGeometry args={[0.45, 0.4]} />
            <meshBasicMaterial color="#285779" />
          </mesh>

          <mesh position={[-0.17, -0.1, 0.01]}>
            <planeGeometry args={[0.15, 0.23]} />
            <meshBasicMaterial color="#07192b" />
          </mesh>

          <mesh position={[0.3, -0.09, 0.006]}>
            <planeGeometry args={[0.22, 0.23]} />
            <meshBasicMaterial color="#174461" />
          </mesh>
        </>
      )}

      {type === 1 && (
        <>
          {/* Parking area */}
          <mesh position={[0, -0.14, 0.005]}>
            <planeGeometry args={[0.94, 0.25]} />
            <meshBasicMaterial color="#203b52" />
          </mesh>

          {[-0.25, 0.25].map((x) => (
            <group key={x} position={[x, -0.12, 0.01]}>
              <mesh>
                <planeGeometry args={[0.32, 0.13]} />
                <meshBasicMaterial color="#477b9c" />
              </mesh>

              <mesh position={[0, 0.08, 0.002]}>
                <planeGeometry args={[0.18, 0.08]} />
                <meshBasicMaterial color="#20445e" />
              </mesh>
            </group>
          ))}
        </>
      )}

      {type === 2 && (
        <>
          {/* Warehouse */}
          <mesh position={[0, -0.01, 0.005]}>
            <planeGeometry args={[0.72, 0.43]} />
            <meshBasicMaterial color="#28516c" />
          </mesh>

          {[-0.23, 0, 0.23].map((x) => (
            <mesh
              key={x}
              position={[x, -0.09, 0.012]}
            >
              <planeGeometry args={[0.16, 0.25]} />
              <meshBasicMaterial color="#102a3e" />
            </mesh>
          ))}
        </>
      )}

      {type === 3 && (
        <>
          {/* Road monitoring */}
          <mesh position={[0, -0.08, 0.005]}>
            <planeGeometry args={[0.95, 0.37]} />
            <meshBasicMaterial color="#233b4f" />
          </mesh>

          {[-0.25, 0, 0.25].map((x) => (
            <mesh
              key={x}
              position={[x, -0.07, 0.012]}
            >
              <planeGeometry args={[0.13, 0.015]} />
              <meshBasicMaterial color="#67b5d4" />
            </mesh>
          ))}
        </>
      )}

      {/* HUD crosshair */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[0.085, 0.088, 32]} />
        <meshBasicMaterial
          color="#4cd6ff"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Animated scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.023]}>
        <planeGeometry args={[0.96, 0.008]} />
        <meshBasicMaterial
          color="#4ccfff"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Recording indicator */}
      <mesh
        ref={indicatorRef}
        position={[-0.43, 0.24, 0.025]}
      >
        <circleGeometry args={[0.022, 12]} />
        <meshBasicMaterial color="#ff5b69" />
      </mesh>
    </group>
  )
}

// -------------------------------------------
// PROFESSIONAL CCTV MONITOR
// -------------------------------------------

function SecurityMonitor({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: Vector3
  rotation?: Vector3
  scale?: number
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Metallic monitor frame */}
      <RoundedBox
        args={[2.4, 1.55, 0.15]}
        radius={0.045}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#1d2c3f"
          metalness={0.75}
          roughness={0.28}
        />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0, 0.079]}>
        <planeGeometry args={[2.28, 1.42]} />
        <meshBasicMaterial color="#06131f" />
      </mesh>

      {/* Four different camera feeds */}
      {[-1, 1].flatMap((x, xi) =>
        [-1, 1].map((y, yi) => (
          <group
            key={`${x}-${y}`}
            position={[
              x * 0.57,
              y * 0.35,
              0.087,
            ]}
          >
            <SurveillanceFeed
              type={(xi * 2 + yi) % 4}
            />
          </group>
        ))
      )}

      {/* Status LED */}
      <mesh position={[1.07, -0.73, 0.083]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshBasicMaterial color="#42edb7" />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, -0.92, -0.02]}>
        <boxGeometry args={[0.12, 0.32, 0.12]} />
        <meshStandardMaterial
          color={DARK_METAL}
          metalness={0.7}
        />
      </mesh>

      <mesh position={[0, -1.09, 0.05]}>
        <boxGeometry args={[0.8, 0.06, 0.42]} />
        <meshStandardMaterial
          color={METAL}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}

// -------------------------------------------
// CONTROL DESK + EQUIPMENT
// -------------------------------------------

function ControlConsole() {
  return (
    <group position={[0, -1.35, 0.9]}>
      {/* Desktop */}
      <RoundedBox
        args={[6.4, 0.16, 1.55]}
        radius={0.04}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#2b3d52"
          metalness={0.55}
          roughness={0.35}
        />
      </RoundedBox>

      {/* Front console */}
      <mesh position={[0, -0.55, 0.62]}>
        <boxGeometry args={[6.1, 0.92, 0.12]} />
        <meshStandardMaterial
          color="#142236"
          metalness={0.45}
          roughness={0.5}
        />
      </mesh>

      {/* LED lighting */}
      <mesh position={[0, -0.11, 0.8]}>
        <boxGeometry args={[6.15, 0.025, 0.025]} />
        <meshBasicMaterial color={CYAN} />
      </mesh>

      {/* Keyboard */}
      <group position={[0, 0.13, 0.32]}>
        <RoundedBox
          args={[1.6, 0.06, 0.48]}
          radius={0.025}
          smoothness={3}
        >
          <meshStandardMaterial color="#101d2d" />
        </RoundedBox>

        {Array.from({ length: 11 }, (_, i) =>
          Array.from({ length: 3 }, (_, j) => (
            <mesh
              key={`${i}-${j}`}
              position={[
                -0.68 + i * 0.135,
                0.036,
                -0.13 + j * 0.13,
              ]}
            >
              <boxGeometry args={[0.09, 0.012, 0.075]} />
              <meshBasicMaterial color="#42789b" />
            </mesh>
          ))
        )}
      </group>

      {/* Mouse */}
      <mesh position={[1.15, 0.13, 0.32]}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial
          color="#192b40"
          metalness={0.5}
        />
      </mesh>

      {/* Equipment racks */}
      {[-2.35, 2.35].map((x) => (
        <group key={x} position={[x, 0.14, -0.1]}>
          <mesh>
            <boxGeometry args={[0.85, 0.18, 0.55]} />
            <meshStandardMaterial
              color="#101b2c"
              metalness={0.7}
            />
          </mesh>

          {[0, 0.16, 0.32].map((offset) => (
            <mesh
              key={offset}
              position={[
                -0.28 + offset,
                0.025,
                0.28,
              ]}
            >
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshBasicMaterial color={CYAN} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// -------------------------------------------
// CONTROL ROOM ARCHITECTURE
// -------------------------------------------

function ControlRoom() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 0.1, -2.6]}>
        <boxGeometry args={[11, 5.8, 0.16]} />
        <meshStandardMaterial
          color="#152439"
          roughness={0.82}
        />
      </mesh>

      {/* Wall panels */}
      {[-3.6, -1.8, 0, 1.8, 3.6].map((x) => (
        <mesh
          key={x}
          position={[x, 0.2, -2.48]}
        >
          <boxGeometry args={[1.65, 3.9, 0.035]} />
          <meshStandardMaterial
            color="#1b2e45"
            metalness={0.35}
            roughness={0.65}
          />
        </mesh>
      ))}

      {/* Subtle LED strips */}
      {[-4.6, 4.6].map((x) => (
        <mesh
          key={x}
          position={[x, 0.2, -2.43]}
        >
          <boxGeometry args={[0.025, 3.7, 0.03]} />
          <meshBasicMaterial color={BLUE} />
        </mesh>
      ))}

      {/* Floor */}
      <mesh
        position={[0, -2.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#142238"
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Ceiling LED lights */}
      {[-2.5, 0, 2.5].map((x) => (
        <mesh
          key={x}
          position={[x, 2.4, -0.8]}
        >
          <boxGeometry args={[1.3, 0.04, 0.09]} />
          <meshBasicMaterial color="#4aabdb" />
        </mesh>
      ))}
    </group>
  )
}

// -------------------------------------------
// SUBTLE HOLOGRAPHIC PARTICLES
// -------------------------------------------

function AmbientParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: Math.sin(i * 12.7) * 3,
        y: Math.cos(i * 8.3) * 1.5,
        z: 0.7 + Math.sin(i * 5.1) * 0.4,
      })),
    []
  )

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.04
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, p.z]}
        >
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// -------------------------------------------
// COMPLETE ANIMATED 3D SCENE
// -------------------------------------------

function SecurityOperationsCenter() {
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    state.camera.position.x =
      THREE.MathUtils.damp(
        state.camera.position.x,
        Math.sin(time * 0.15) * 0.25,
        1.2,
        delta
      )

    state.camera.position.y =
      THREE.MathUtils.damp(
        state.camera.position.y,
        1.05 + Math.sin(time * 0.18) * 0.08,
        1.2,
        delta
      )

    state.camera.lookAt(0, -0.1, 0)
  })

  return (
    <group>
      <ControlRoom />

      {/* Main monitor */}
      <SecurityMonitor
        position={[0, 0.5, -1.1]}
        scale={1.25}
      />

      {/* Left monitor */}
      <SecurityMonitor
        position={[-2.4, 0.3, -1.35]}
        rotation={[0, 0.18, 0]}
        scale={0.85}
      />

      {/* Right monitor */}
      <SecurityMonitor
        position={[2.4, 0.3, -1.35]}
        rotation={[0, -0.18, 0]}
        scale={0.85}
      />

      <ControlConsole />
      <AmbientParticles />

      <Text
        position={[0, 2.08, -1.4]}
        fontSize={0.19}
        color="#79d7ff"
        anchorX="center"
      >
        VEXORA / SECURITY OPERATIONS
      </Text>
    </group>
  )
}

// -------------------------------------------
// MAIN CANVAS
// -------------------------------------------

export default function Services3D() {
  return (
    <Canvas
      camera={{
        position: [0, 1.05, 9.4],
        fov: 42,
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
      <ambientLight
        intensity={1.7}
        color="#c6e1ff"
      />

      <directionalLight
        position={[3, 6, 5]}
        intensity={3.2}
        color="#ffffff"
      />

      <pointLight
        position={[-3, 2, 3]}
        intensity={18}
        distance={12}
        color="#238dff"
      />

      <pointLight
        position={[3, 1, 3]}
        intensity={14}
        distance={10}
        color="#65cfff"
      />

      <pointLight
        position={[0, -1, 4]}
        intensity={9}
        distance={8}
        color="#3d7fd9"
      />

      <Suspense fallback={null}>
        <SecurityOperationsCenter />
      </Suspense>
    </Canvas>
  )
}
