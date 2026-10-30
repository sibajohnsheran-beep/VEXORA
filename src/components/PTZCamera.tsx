
const COLORS = {
  darkMetal: '#161d2b',
  graphite: '#303d59',
  titanium: '#64748b',
  blackGlass: '#050c18',
  cyan: '#70d8ff',
}

function Bolt({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.035, 0.035, 0.018, 12]} />
      <meshStandardMaterial
        color="#a3b4c9"
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  )
}

function PremiumMount() {
  return (
    <group>
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.58, 0.65, 0.13, 64]} />
        <meshStandardMaterial
          color="#202a3b"
          metalness={0.85}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 1.64, 0]}>
        <cylinderGeometry args={[0.53, 0.53, 0.035, 64]} />
        <meshStandardMaterial
          color={COLORS.titanium}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.46,
              1.8,
              Math.sin(angle) * 0.46,
            ]}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.025, 12]} />
            <meshStandardMaterial
              color="#a0aec0"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        )
      })}

      <mesh position={[0, 1.43, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.46, 48]} />
        <meshStandardMaterial
          color="#394b64"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.065, 48]} />
        <meshStandardMaterial
          color="#080d15"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}

function Lens() {
  return (
    <group position={[0, -0.05, 0.68]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.43, 0.27, 64]} />
        <meshStandardMaterial
          color={COLORS.darkMetal}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0, 0.15]}>
        <torusGeometry args={[0.43, 0.035, 16, 96]} />
        <meshStandardMaterial
          color={COLORS.titanium}
          metalness={0.95}
          roughness={0.17}
        />
      </mesh>

      <mesh position={[0, 0, 0.17]}>
        <torusGeometry args={[0.34, 0.045, 16, 96]} />
        <meshStandardMaterial
          color="#05070d"
          metalness={0.65}
          roughness={0.16}
        />
      </mesh>

      <mesh position={[0, 0, 0.19]}>
        <sphereGeometry
          args={[
            0.285,
            64,
            48,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ]}
        />
        <meshPhysicalMaterial
          color={COLORS.blackGlass}
          metalness={0.35}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>

      <mesh position={[0, 0, 0.27]}>
        <circleGeometry args={[0.12, 48]} />
        <meshStandardMaterial
          color="#103b65"
          metalness={0.7}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0, 0.2]}>
        <torusGeometry args={[0.375, 0.012, 12, 96]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive="#147cb8"
          emissiveIntensity={1.4}
        />
      </mesh>
    </group>
  )
}

function CameraHead() {
  return (
    <group>
      <mesh scale={[0.92, 0.73, 1.05]}>
        <sphereGeometry args={[0.78, 64, 48]} />
        <meshStandardMaterial
          color={COLORS.graphite}
          metalness={0.72}
          roughness={0.28}
        />
      </mesh>

      <mesh
        position={[0, 0.25, -0.04]}
        scale={[0.95, 0.33, 1.06]}
      >
        <sphereGeometry args={[0.77, 64, 48]} />
        <meshStandardMaterial
          color={COLORS.titanium}
          metalness={0.85}
          roughness={0.23}
        />
      </mesh>

      <mesh
        position={[0, -0.05, 0.62]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.55, 0.55, 0.11, 64]} />
        <meshStandardMaterial
          color={COLORS.darkMetal}
          metalness={0.8}
          roughness={0.24}
        />
      </mesh>

      <Lens />

      {[-0.48, 0.48].map((x) => (
        <group key={x} position={[x, 0.23, 0.52]}>
          <mesh>
            <sphereGeometry args={[0.105, 24, 24]} />
            <meshStandardMaterial
              color="#0b1625"
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>

          <mesh position={[0, 0, 0.075]}>
            <circleGeometry args={[0.055, 24]} />
            <meshStandardMaterial
              color="#a9d9ef"
              emissive="#3379a5"
              emissiveIntensity={0.45}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -0.43, 0.57]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial
          color="#51e2bd"
          emissive="#12c89a"
          emissiveIntensity={1.5}
        />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.77, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.13, 48]} />
            <meshStandardMaterial
              color={COLORS.darkMetal}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          <Bolt position={[side * 0.075, 0, 0]} />
        </group>
      ))}
    </group>
  )
}

export default function PTZCamera() {
  return (
    <group position={[0, -0.25, 0]}>
      <PremiumMount />

      <group position={[0, 1.08, 0]}>
        <mesh>
          <cylinderGeometry args={[0.58, 0.51, 0.34, 64]} />
          <meshStandardMaterial
            color={COLORS.darkMetal}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.045, 64]} />
          <meshStandardMaterial
            color={COLORS.titanium}
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 0.91, -0.57, 0]}
              rotation={[0, 0, side * 0.07]}
            >
              <boxGeometry args={[0.18, 0.95, 0.34]} />
              <meshStandardMaterial
                color={COLORS.graphite}
                metalness={0.82}
                roughness={0.3}
              />
            </mesh>

            <mesh position={[side * 1.02, -0.55, 0.04]}>
              <boxGeometry args={[0.035, 0.68, 0.22]} />
              <meshStandardMaterial
                color={COLORS.titanium}
                metalness={0.95}
                roughness={0.22}
              />
            </mesh>

            <mesh
              position={[side * 0.91, -0.99, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.2, 0.2, 0.22, 48]} />
              <meshStandardMaterial
                color={COLORS.darkMetal}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            <mesh
              position={[side * 1.04, -0.99, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.13, 0.13, 0.025, 48]} />
              <meshStandardMaterial
                color="#8b9db5"
                metalness={0.95}
                roughness={0.18}
              />
            </mesh>
          </group>
        ))}

        <group position={[0, -0.85, 0]}>
          <CameraHead />
        </group>
      </group>
    </group>
  )
}
