export type ProductModelType =
  | 'bullet'
  | 'dome'
  | 'ptz'
  | 'wifi'
  | 'nvr'
  | 'dvr'
  | 'accessories'
  | 'solar'

const C = {
  white: '#e9eef6',
  pearl: '#cbd5e3',
  silver: '#8294ac',
  dark: '#101722',
  black: '#050a12',
  glass: '#07172b',
  blue: '#42bfff',
  navy: '#122b4d',
}

type Vec3 = [number, number, number]

function Box({
  position = [0, 0, 0],
  size,
  color = C.white,
  rotation = [0, 0, 0],
  metalness = 0.45,
  roughness = 0.28,
}: {
  position?: Vec3
  size: Vec3
  color?: string
  rotation?: Vec3
  metalness?: number
  roughness?: number
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  )
}

function Cylinder({
  position = [0, 0, 0],
  radius = 0.4,
  length = 1,
  color = C.white,
  rotation = [Math.PI / 2, 0, 0],
}: {
  position?: Vec3
  radius?: number
  length?: number
  color?: string
  rotation?: Vec3
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry
        args={[radius, radius, length, 64]}
      />
      <meshStandardMaterial
        color={color}
        metalness={0.55}
        roughness={0.24}
      />
    </mesh>
  )
}

function Lens({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: Vec3
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <Cylinder
        radius={0.3}
        length={0.12}
        color={C.black}
      />

      <mesh position={[0, 0, 0.075]}>
        <torusGeometry args={[0.25, 0.026, 16, 64]} />
        <meshStandardMaterial
          color={C.silver}
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      <mesh position={[0, 0, 0.085]}>
        <sphereGeometry args={[0.205, 48, 32]} />
        <meshPhysicalMaterial
          color={C.glass}
          metalness={0.35}
          roughness={0.035}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>

      <mesh position={[0, 0, 0.28]}>
        <torusGeometry args={[0.11, 0.012, 12, 64]} />
        <meshStandardMaterial
          color={C.blue}
          emissive={C.blue}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.12}
        />
      </mesh>
    </group>
  )
}

function IRRing({
  radius = 0.4,
  count = 8,
  z = 0,
}: {
  radius?: number
  count?: number
  z?: number
}) {
  return (
    <group>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * Math.PI * 2

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              z,
            ]}
          >
            <sphereGeometry args={[0.048, 16, 12]} />
            <meshStandardMaterial
              color="#b6c9df"
              metalness={0.7}
              roughness={0.18}
              emissive="#244e7d"
              emissiveIntensity={0.15}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function WallMount({
  position = [0, 0, -1],
}: {
  position?: Vec3
}) {
  return (
    <group position={position}>
      <Box
        position={[0, 0, -0.35]}
        size={[0.7, 0.8, 0.14]}
        color={C.pearl}
      />

      <Cylinder
        position={[0, 0, 0.04]}
        radius={0.13}
        length={0.65}
        color={C.silver}
      />

      <mesh position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.19, 32, 24]} />
        <meshStandardMaterial
          color={C.silver}
          metalness={0.8}
          roughness={0.18}
        />
      </mesh>

      {[
        [-0.25, 0.3],
        [0.25, 0.3],
        [-0.25, -0.3],
        [0.25, -0.3],
      ].map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, -0.27]}
        >
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={C.silver}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

function BulletModel() {
  return (
    <group rotation={[0, -0.25, 0]}>
      <Cylinder
        position={[0, 0, -0.1]}
        radius={0.48}
        length={1.65}
        color={C.white}
      />

      <Cylinder
        position={[0, 0, 0.72]}
        radius={0.49}
        length={0.18}
        color={C.dark}
      />

      <Lens position={[0, 0, 0.87]} scale={1.05} />
      <IRRing radius={0.38} z={0.84} />

      {/* Premium protective hood */}
      <Box
        position={[0, 0.49, 0.18]}
        size={[1.12, 0.09, 1.7]}
        color={C.pearl}
      />

      <Box
        position={[0, 0.45, 1.02]}
        size={[1.12, 0.12, 0.12]}
        color={C.white}
      />

      {/* Side trim */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          position={[side * 0.46, -0.1, -0.1]}
          size={[0.035, 0.28, 1.15]}
          color={C.silver}
        />
      ))}

      <WallMount position={[0, 0, -1.15]} />
    </group>
  )
}

function DomeModel() {
  return (
    <group>
      {/* Ceiling base */}
      <Cylinder
        position={[0, 0.55, 0]}
        radius={0.82}
        length={0.27}
        rotation={[0, 0, 0]}
        color={C.white}
      />

      <Cylinder
        position={[0, 0.35, 0]}
        radius={0.72}
        length={0.12}
        rotation={[0, 0, 0]}
        color={C.pearl}
      />

      {/* Black glass dome */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry
          args={[
            0.66,
            64,
            40,
            0,
            Math.PI * 2,
            Math.PI / 2,
            Math.PI / 2,
          ]}
        />
        <meshPhysicalMaterial
          color={C.glass}
          metalness={0.3}
          roughness={0.06}
          clearcoat={1}
          transparent
          opacity={0.95}
        />
      </mesh>

      <group position={[0, -0.12, 0.49]}>
        <Lens scale={0.82} />
        <IRRing radius={0.34} count={6} z={0.04} />
      </group>

      {/* Chrome seam */}
      <Cylinder
        position={[0, 0.37, 0]}
        radius={0.74}
        length={0.035}
        rotation={[0, 0, 0]}
        color={C.silver}
      />
    </group>
  )
}

function PTZModel() {
  return (
    <group>
      {/* Ceiling mounting plate */}
      <Cylinder
        position={[0, 1.18, 0]}
        radius={0.48}
        length={0.2}
        rotation={[0, 0, 0]}
        color={C.pearl}
      />

      <Cylinder
        position={[0, 0.88, 0]}
        radius={0.23}
        length={0.48}
        rotation={[0, 0, 0]}
        color={C.silver}
      />

      {/* Upper rotating housing */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.68, 48, 32]} />
        <meshStandardMaterial
          color={C.white}
          metalness={0.45}
          roughness={0.23}
        />
      </mesh>

      {/* Black lower camera head */}
      <mesh position={[0, -0.17, 0.08]}>
        <sphereGeometry args={[0.57, 48, 32]} />
        <meshStandardMaterial
          color={C.dark}
          metalness={0.55}
          roughness={0.15}
        />
      </mesh>

      <Lens position={[0, -0.2, 0.61]} scale={1.1} />

      <group position={[0, -0.2, 0.61]}>
        <IRRing radius={0.4} count={8} z={0.01} />
      </group>

      {/* Side pivot brackets */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            position={[side * 0.67, 0.05, 0]}
            size={[0.14, 0.7, 0.25]}
            color={C.pearl}
          />

          <mesh position={[side * 0.74, 0.05, 0]}>
            <sphereGeometry args={[0.13, 24, 16]} />
            <meshStandardMaterial
              color={C.silver}
              metalness={0.8}
              roughness={0.18}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WifiModel() {
  return (
    <group>
      {/* Main housing */}
      <Box
        size={[1.15, 0.86, 1.35]}
        color={C.white}
      />

      {/* Black front panel */}
      <Box
        position={[0, 0, 0.69]}
        size={[1.05, 0.76, 0.08]}
        color={C.dark}
      />

      <Lens position={[0, 0, 0.79]} scale={0.95} />

      <group position={[0, 0, 0.75]}>
        <IRRing radius={0.37} count={6} />
      </group>

      {/* Antennas */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Cylinder
            position={[side * 0.49, 0.87, -0.35]}
            radius={0.055}
            length={1.15}
            rotation={[0, 0, 0]}
            color={C.white}
          />

          <mesh
            position={[side * 0.49, 1.45, -0.35]}
          >
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color={C.silver} />
          </mesh>
        </group>
      ))}

      <WallMount position={[0, 0, -1]} />
    </group>
  )
}

function RecorderModel({
  isNvr,
}: {
  isNvr: boolean
}) {
  return (
    <group>
      {/* Main metal chassis */}
      <Box
        size={[2.55, 0.48, 1.75]}
        color={C.dark}
        metalness={0.75}
        roughness={0.22}
      />

      {/* Front fascia */}
      <Box
        position={[0, 0, 0.89]}
        size={[2.47, 0.39, 0.045]}
        color="#1a2637"
        metalness={0.8}
        roughness={0.18}
      />

      {/* Front branding strip */}
      <Box
        position={[-0.67, 0.02, 0.92]}
        size={[0.85, 0.025, 0.015]}
        color={C.silver}
      />

      {/* Status LEDs */}
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh
          key={index}
          position={[
            0.17 + index * 0.15,
            0.02,
            0.93,
          ]}
        >
          <sphereGeometry args={[0.033, 12, 12]} />
          <meshStandardMaterial
            color={C.blue}
            emissive={C.blue}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* USB port */}
      <Box
        position={[1.02, -0.04, 0.93]}
        size={[0.19, 0.075, 0.02]}
        color={C.black}
      />

      {/* DVR control buttons */}
      {!isNvr &&
        Array.from({ length: 8 }).map((_, index) => (
          <mesh
            key={index}
            position={[
              -0.1 + (index % 4) * 0.12,
              -0.1 + Math.floor(index / 4) * 0.11,
              0.94,
            ]}
          >
            <boxGeometry args={[0.065, 0.055, 0.025]} />
            <meshStandardMaterial
              color={C.silver}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        ))}

      {/* Ventilation slots */}
      {Array.from({ length: 9 }).map((_, index) => (
        <Box
          key={index}
          position={[
            -0.8 + index * 0.16,
            0.245,
            -0.48,
          ]}
          size={[0.06, 0.006, 0.45]}
          color={C.black}
        />
      ))}

      {/* Rubber feet */}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Box
            key={`${x}-${z}`}
            position={[x * 0.95, -0.28, z * 0.6]}
            size={[0.22, 0.08, 0.22]}
            color={C.black}
          />
        ))
      )}
    </group>
  )
}

function AccessoriesModel() {
  return (
    <group>
      {/* Monitor frame */}
      <Box
        position={[-0.55, 0.3, 0]}
        size={[1.4, 0.95, 0.12]}
        color={C.dark}
      />

      {/* Monitor display */}
      <Box
        position={[-0.55, 0.3, 0.068]}
        size={[1.24, 0.77, 0.015]}
        color={C.navy}
      />

      {/* Screen reflections */}
      <Box
        position={[-0.55, 0.3, 0.08]}
        size={[0.65, 0.65, 0.008]}
        color="#205784"
        rotation={[0, 0, 0.2]}
      />

      {/* Monitor stand */}
      <Box
        position={[-0.55, -0.35, 0]}
        size={[0.12, 0.36, 0.14]}
        color={C.silver}
      />

      <Box
        position={[-0.55, -0.53, 0.15]}
        size={[0.7, 0.06, 0.5]}
        color={C.dark}
      />

      {/* Coiled cable */}
      <mesh
        position={[0.75, 0.05, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.43, 0.09, 16, 64]} />
        <meshStandardMaterial
          color={C.black}
          roughness={0.45}
        />
      </mesh>

      {/* Power adapter */}
      <Box
        position={[0.75, -0.43, 0.3]}
        size={[0.7, 0.3, 0.45]}
        color={C.dark}
      />

      {/* Mounting bracket */}
      <Box
        position={[1.2, -0.12, -0.48]}
        size={[0.45, 0.58, 0.08]}
        color={C.silver}
      />

      {/* Connector details */}
      {[0, 1, 2].map((index) => (
        <Cylinder
          key={index}
          position={[
            0.2 + index * 0.25,
            -0.58,
            0.85,
          ]}
          radius={0.06}
          length={0.22}
          color={C.silver}
        />
      ))}
    </group>
  )
}

function SolarModel() {
  return (
    <group>
      {/* Wi-Fi camera body */}
      <group position={[0, -0.5, 0]}>
        <WifiModel />
      </group>

      {/* Solar panel */}
      <group
        position={[0, 1.65, -0.35]}
        rotation={[-0.48, 0, 0]}
      >
        <Box
          size={[2.2, 1.3, 0.1]}
          color={C.silver}
        />

        <Box
          position={[0, 0, 0.06]}
          size={[2.05, 1.15, 0.02]}
          color={C.navy}
        />

        {/* Solar cells */}
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={`vertical-${index}`}
            position={[
              -0.82 + index * 0.41,
              0,
              0.078,
            ]}
            size={[0.012, 1.15, 0.006]}
            color="#6b9cc4"
          />
        ))}

        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={`horizontal-${index}`}
            position={[
              0,
              -0.38 + index * 0.38,
              0.08,
            ]}
            size={[2.05, 0.012, 0.006]}
            color="#6b9cc4"
          />
        ))}
      </group>

      {/* Solar support arm */}
      <Cylinder
        position={[0, 0.9, -0.48]}
        radius={0.09}
        length={1.2}
        rotation={[0, 0, 0]}
        color={C.silver}
      />
    </group>
  )
}

export default function ProductModels3D({
  type,
}: {
  type: ProductModelType
}) {
  switch (type) {
    case 'bullet':
      return <BulletModel />
    case 'dome':
      return <DomeModel />
    case 'ptz':
      return <PTZModel />
    case 'wifi':
      return <WifiModel />
    case 'nvr':
      return <RecorderModel isNvr />
    case 'dvr':
      return <RecorderModel isNvr={false} />
    case 'accessories':
      return <AccessoriesModel />
    case 'solar':
      return <SolarModel />
    default:
      return null
  }
}
