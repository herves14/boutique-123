'use client'
// src/components/3d/Product3D.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

export type GarmentKind = 'tshirt' | 'jeans' | 'shoe' | 'dress' | 'coat'

// ── Formes 3D ──────────────────────────────────────────────────────

function TShirt({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.2, 0.35]} />
        <meshPhysicalMaterial color={color} roughness={0.7} sheen={1} sheenColor={color} />
      </mesh>
      <mesh position={[-0.78, 0.4, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.55, 0.4, 0.32]} />
        <meshPhysicalMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.78, 0.4, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.55, 0.4, 0.32]} />
        <meshPhysicalMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.18, 0.05, 16, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Jeans({ color }: { color: string }) {
  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.95, 0.3, 0.4]} />
        <meshPhysicalMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[-0.24, -0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 1.6, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0.24, -0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 1.6, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.86, 0.21]}>
        <boxGeometry args={[0.96, 0.06, 0.02]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Shoe({ color }: { color: string }) {
  return (
    <group rotation={[0, -0.3, 0]} position={[0, -0.2, 0]}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.6, 0.18, 0.6]} />
        <meshPhysicalMaterial color="#f5f5f5" roughness={0.6} />
      </mesh>
      <mesh position={[-0.4, 0.05, 0]}>
        <boxGeometry args={[0.7, 0.55, 0.55]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.6} />
      </mesh>
      <mesh position={[0.45, -0.1, 0]} rotation={[0, 0, -0.15]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.5]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.7} />
      </mesh>
      <mesh position={[-0.1, -0.05, 0.28]}>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.3} />
      </mesh>
    </group>
  )
}

function Dress({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.55, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.75} sheen={0.8} sheenColor={color} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.26, 0.55, 0.65, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.75} sheen={0.8} sheenColor={color} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 0.7, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.7} sheen={1} sheenColor={color} />
      </mesh>
      <mesh position={[-0.38, 0.7, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.38, 0.7, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  )
}

function Coat({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.95, 1.0, 0.42]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.88, 0.85, 0.38]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.62, 0.5, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.38, 0.9, 0.36]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.62, 0.5, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.38, 0.9, 0.36]} />
        <meshPhysicalMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0.22]}>
        <boxGeometry args={[0.85, 0.18, 0.04]} />
        <meshPhysicalMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Garment({
  kind,
  color,
  paused,
}: {
  kind: GarmentKind
  color: string
  paused: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current && !paused) ref.current.rotation.y += delta * 0.45
  })
  return (
    <group ref={ref}>
      {kind === 'tshirt' && <TShirt color={color} />}
      {kind === 'jeans'  && <Jeans  color={color} />}
      {kind === 'shoe'   && <Shoe   color={color} />}
      {kind === 'dress'  && <Dress  color={color} />}
      {kind === 'coat'   && <Coat   color={color} />}
    </group>
  )
}

export function Product3D({
  kind    = 'tshirt',
  color   = '#C9A84C',
  paused  = false,
}: {
  kind?:   GarmentKind
  color?:  string
  paused?: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 3.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, -2, -2]} intensity={0.8} color={color} />
        <Float floatIntensity={0.4} rotationIntensity={0.2} speed={1.5}>
          <Garment kind={kind} color={color} paused={paused} />
        </Float>
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.45}
          scale={5}
          blur={3}
          far={3}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}