
import {
  Suspense,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/models/vexora-ai-camera.glb'

type Pointer = {
  x: number
  y: number
}

type ModelProps = {
  hovered: RefObject<boolean>
  pointer: RefObject<Pointer>
}

type CameraPart = {
  object: THREE.Object3D
  originalPosition: THREE.Vector3
  offset: THREE.Vector3
}

function getExplosionOffset(name: string): THREE.Vector3 {
  const n = name.toLowerCase()
  const offset = (x: number, y: number, z: number) =>
    new THREE.Vector3(x, y, z)

  // The camera front faces negative Y in Blender.

  // FRONT FACE: keep IR emitters attached to the face.
  if (
    n.startsWith('frontface') ||
    n.startsWith('ir_emitter') ||
    n.startsWith('ir_bezel')
  ) {
    return offset(0, -0.30, 0)
  }

  // OPTICAL ASSEMBLY: separate along the optical axis.
  if (n.startsWith('frontlensbezel')) {
    return offset(0, -0.56, 0)
  }

  if (
    n.startsWith('frontlenslightring') ||
    n.startsWith('opticalglass') ||
    n.startsWith('lensreflection')
  ) {
    return offset(0, -0.64, 0)
  }

  if (n.startsWith('inneroptics')) {
    return offset(0, -0.18, 0)
  }

  if (
    n.startsWith('imagesensor') ||
    n.startsWith('sensorframe')
  ) {
    return offset(0, -0.06, 0)
  }

  // OUTER HOUSING: controlled four-way opening.
  if (
    n.startsWith('explode_tophousing') ||
    n.startsWith('toparmor') ||
    n.startsWith('topstatuslight')
  ) {
    return offset(0, 0, 0.52)
  }

  if (
    n.startsWith('explode_bottomhousing') ||
    n.startsWith('undersideplate')
  ) {
    return offset(0, 0, -0.48)
  }

  if (
    n.startsWith('explode_lefthousing') ||
    n.startsWith('leftsidepanel')
  ) {
    return offset(-0.58, 0, 0)
  }

  if (
    n.startsWith('explode_righthousing') ||
    n.startsWith('rightsidepanel')
  ) {
    return offset(0.58, 0, 0)
  }

  // PCB and its components move as one assembly.
  if (
    n.startsWith('maincircuitboard') ||
    n.startsWith('pcb_chip') ||
    n.startsWith('copperbus')
  ) {
    return offset(0, -0.08, 0.18)
  }

  // AI module and heatsink remain together.
  if (
    n.startsWith('aicomputemodule') ||
    n.startsWith('coolingfin')
  ) {
    return offset(0, 0.28, 0.12)
  }

  // REAR: screws remain attached to the end cap.
  if (
    n.startsWith('rearendcap') ||
    n.startsWith('rearscrew')
  ) {
    return offset(0, 0.72, 0)
  }

  if (n.startsWith('rearcover')) {
    return offset(0, 0.48, 0)
  }

  // MOUNT: move the complete bracket together.
  if (
    n.startsWith('mountneck') ||
    n.startsWith('mountpivot') ||
    n.startsWith('mountarm') ||
    n.startsWith('wallmountplate') ||
    n.startsWith('mountbolt')
  ) {
    return offset(0, 0.08, -0.38)
  }

  // Keep any unrecognized parts in place.
  return offset(0, 0, 0)
}

function BlenderCamera({
  hovered,
  pointer,
}: ModelProps) {
  const { scene } = useGLTF(MODEL_PATH)
  const rootRef = useRef<THREE.Group>(null)
  const explosionProgress = useRef(0)

  const model = useMemo(() => scene.clone(true), [scene])

  const parts = useMemo<CameraPart[]>(() => {
    const result: CameraPart[] = []

    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      // Safety: never show the original solid housing.
      if (object.name.toLowerCase() === 'mainhousing') {
        object.visible = false
        return
      }

      result.push({
        object,
        originalPosition: object.position.clone(),
        offset: getExplosionOffset(object.name),
      })
    })

    return result
  }, [model])

  const normalized = useMemo(() => {
    model.updateMatrixWorld(true)

    const bounds = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()

    bounds.getSize(size)
    bounds.getCenter(center)

    const maxDimension = Math.max(
      size.x,
      size.y,
      size.z,
      0.001
    )

    return {
      scale: 3.5 / maxDimension,
      center,
    }
  }, [model])

  useFrame((_, delta) => {
    const targetProgress = hovered.current ? 1 : 0

    explosionProgress.current = THREE.MathUtils.damp(
      explosionProgress.current,
      targetProgress,
      3.4,
      delta
    )

    const progress = explosionProgress.current

    // Smoothstep easing.
    const eased = progress * progress * (3 - 2 * progress)

    for (const part of parts) {
      part.object.position.set(
        part.originalPosition.x + part.offset.x * eased,
        part.originalPosition.y + part.offset.y * eased,
        part.originalPosition.z + part.offset.z * eased
      )
    }

    if (rootRef.current) {
      // Small viewing-angle movement only.
      const targetY =
        -0.35 +
        (hovered.current ? pointer.current.x * 0.045 : 0)

      const targetX =
        0.15 -
        (hovered.current ? pointer.current.y * 0.035 : 0)

      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        targetY,
        3,
        delta
      )

      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        targetX,
        3,
        delta
      )
    }
  })

  return (
    <group ref={rootRef} rotation={[0.15, -0.35, 0]}>
      <group scale={normalized.scale}>
        <group
          position={[
            -normalized.center.x,
            -normalized.center.y,
            -normalized.center.z,
          ]}
        >
          <primitive object={model} />
        </group>
      </group>
    </group>
  )
}

function LoadingCamera() {
  return (
    <mesh>
      <boxGeometry args={[1.4, 0.8, 2.2]} />
      <meshStandardMaterial
        color="#23394d"
        wireframe
      />
    </mesh>
  )
}

export default function ExplodedCamera3D() {
  const hovered = useRef(false)

  const pointer = useRef<Pointer>({
    x: 0,
    y: 0,
  })

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="technology-3d-canvas"
      onPointerEnter={() => {
        hovered.current = true
        setIsHovered(true)
      }}
      onPointerMove={(event) => {
        const rect =
          event.currentTarget.getBoundingClientRect()

        pointer.current.x =
          ((event.clientX - rect.left) / rect.width) * 2 - 1

        pointer.current.y =
          ((event.clientY - rect.top) / rect.height) * 2 - 1
      }}
      onPointerLeave={() => {
        hovered.current = false
        pointer.current.x = 0
        pointer.current.y = 0
        setIsHovered(false)
      }}
      aria-label="Interactive VEXORA AI security camera"
    >
      <Canvas
        camera={{
          position: [4, 2.5, 7.5],
          fov: 42,
        }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[4, 6, 6]}
          intensity={3.5}
          color="#e5f4ff"
        />

        <directionalLight
          position={[-4, 2, -3]}
          intensity={2}
          color="#4a9fff"
        />

        <pointLight
          position={[0, 1, 4]}
          intensity={2}
          color="#39d8ff"
        />

        <Suspense fallback={<LoadingCamera />}>
          <BlenderCamera
            hovered={hovered}
            pointer={pointer}
          />
        </Suspense>
      </Canvas>

      <span className="technology-interaction-label">
        {isHovered
          ? 'AI CAMERA / EXPLODED VIEW'
          : 'HOVER TO EXPLORE CAMERA'}
      </span>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
