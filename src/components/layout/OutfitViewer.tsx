'use client'
import { useEffect, useRef } from 'react'

type OutfitStyle = 'dress' | 'coat' | 'palazzo' | 'skirt' | 'blazer' | 'trench'

interface Props {
  style?: OutfitStyle
  fabricColor?: number
  accentColor?: number
  shoeColor?: number
  heelColor?: number
  width?: number
  height?: number
  autoRotateSpeed?: number
  className?: string
}

export default function OutfitViewer({
  style = 'dress',
  fabricColor = 0xF0EAD8,
  accentColor = 0xC9A84C,
  shoeColor = 0x0D0D0D,
  heelColor = 0xC9A84C,
  width,
  height,
  autoRotateSpeed = 0.38,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let THREE: any
    let renderer: any, scene: any, camera: any, group: any, goldLight: any
    let animId: number, time = 0

    const init = async () => {
      THREE = (await import('three')).default ?? await import('three')

      const canvas = canvasRef.current!
      const W = width ?? containerRef.current?.clientWidth ?? 400
      const H = height ?? containerRef.current?.clientHeight ?? 560
      canvas.width = W; canvas.height = H

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
      camera.position.set(0, 0.2, 4.8)

      // Éclairage cinématique
      scene.add(new THREE.AmbientLight(0xfff5e0, 0.35))
      const key = new THREE.DirectionalLight(0xfff8ee, 2.0)
      key.position.set(3, 6, 3); key.castShadow = true; scene.add(key)
      const fill = new THREE.DirectionalLight(accentColor, 0.7)
      fill.position.set(-4, 2, -2); scene.add(fill)
      const rim = new THREE.DirectionalLight(0xffffff, 1.0)
      rim.position.set(0, 4, -5); scene.add(rim)
      goldLight = new THREE.PointLight(accentColor, 2.0, 7)
      goldLight.position.set(0, -0.5, 1.8); scene.add(goldLight)
      scene.add(new THREE.PointLight(0xffeebb, 0.8, 5)).position.set(0, -2, 0)

      // Matériaux
      const fab = new THREE.MeshStandardMaterial({ color: fabricColor, roughness: 0.88, metalness: 0.0, side: THREE.DoubleSide })
      const fab2 = new THREE.MeshStandardMaterial({ color: fabricColor, roughness: 0.55, metalness: 0.06, side: THREE.DoubleSide })
      const acc = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.15, metalness: 0.95 })
      const shoe = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.25, metalness: 0.25 })
      const heel = new THREE.MeshStandardMaterial({ color: heelColor, roughness: 0.1, metalness: 1.0 })
      const sole = new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.65 })

      group = new THREE.Group()
      scene.add(group)

      const add = (geo: any, mat: any, x: number, y: number, z: number, rx=0, ry=0, rz=0) => {
        const m = new THREE.Mesh(geo, mat)
        m.position.set(x, y, z); m.rotation.set(rx, ry, rz)
        m.castShadow = true; group.add(m); return m
      }

      // ── TENUES ──
      if (style === 'dress') {
        add(new THREE.CylinderGeometry(0.295, 0.27, 0.52, 32), fab, 0, 1.66, 0)
        add(new THREE.BoxGeometry(0.015, 0.5, 0.025), fab2, 0, 1.66, 0.295)
        add(new THREE.CylinderGeometry(0.245, 0.255, 0.12, 32), acc, 0, 1.32, 0)
        add(new THREE.BoxGeometry(0.11, 0.09, 0.05), acc, 0, 1.32, 0.26)
        add(new THREE.CylinderGeometry(0.28, 0.38, 0.34, 32), fab, 0, 1.08, 0)
        add(new THREE.CylinderGeometry(0.38, 0.58, 0.55, 40), fab, 0, 0.72, 0)
        add(new THREE.CylinderGeometry(0.58, 0.78, 0.65, 40), fab2, 0, 0.28, 0)
        add(new THREE.CylinderGeometry(0.78, 0.82, 0.18, 40), fab, 0, -0.12, 0)
        add(new THREE.CylinderGeometry(0.82, 0.80, 0.04, 40), fab2, 0, -0.215, 0)
        // Manches
        add(new THREE.CylinderGeometry(0.082, 0.072, 0.52, 16), fab, -0.42, 1.55, 0, 0,0,-0.22)
        add(new THREE.CylinderGeometry(0.072, 0.052, 0.44, 16), fab, -0.55, 1.10, 0.04, 0.08,0,-0.16)
        add(new THREE.CylinderGeometry(0.057, 0.057, 0.055, 16), acc, -0.60, 0.84, 0.07)
        add(new THREE.CylinderGeometry(0.082, 0.072, 0.52, 16), fab, 0.42, 1.55, 0, 0,0,0.22)
        add(new THREE.CylinderGeometry(0.072, 0.052, 0.44, 16), fab, 0.55, 1.10, 0.04, 0.08,0,0.16)
        add(new THREE.CylinderGeometry(0.057, 0.057, 0.055, 16), acc, 0.60, 0.84, 0.07)
        add(new THREE.SphereGeometry(0.105, 18, 12), fab, -0.345, 1.80, 0)
        add(new THREE.SphereGeometry(0.105, 18, 12), fab, 0.345, 1.80, 0)
        add(new THREE.TorusGeometry(0.135, 0.018, 8, 28), fab2, 0, 1.93, 0, Math.PI/2, 0, 0)
        add(new THREE.TorusGeometry(0.11, 0.012, 8, 28), acc, 0, 1.97, 0, Math.PI/2, 0, 0)
        add(new THREE.SphereGeometry(0.022, 12, 12), acc, 0, 1.955, 0.11)
      } else if (style === 'coat') {
        add(new THREE.CylinderGeometry(0.31, 0.29, 0.56, 28), fab, 0, 1.68, 0)
        add(new THREE.BoxGeometry(0.02, 0.52, 0.04), acc, 0, 1.68, 0.31)
        add(new THREE.CylinderGeometry(0.26, 0.31, 0.32, 28), fab, 0, 1.32, 0)
        add(new THREE.CylinderGeometry(0.33, 0.40, 0.46, 32), fab, 0, 0.96, 0)
        add(new THREE.CylinderGeometry(0.40, 0.44, 0.88, 32), fab, 0, 0.37, 0)
        add(new THREE.CylinderGeometry(0.44, 0.46, 0.50, 32), fab2, 0, -0.18, 0)
        add(new THREE.CylinderGeometry(0.46, 0.46, 0.18, 32), fab, 0, -0.48, 0)
        add(new THREE.BoxGeometry(0.67, 0.07, 0.55), fab, 0, 1.92, 0)
        add(new THREE.SphereGeometry(0.11, 14, 10), fab, -0.34, 1.82, 0)
        add(new THREE.SphereGeometry(0.11, 14, 10), fab, 0.34, 1.82, 0)
        add(new THREE.CylinderGeometry(0.08,0.07,0.52,14), fab, -0.46,1.52,0, 0,0,-0.18)
        add(new THREE.CylinderGeometry(0.08,0.07,0.52,14), fab, 0.46,1.52,0, 0,0,0.18)
        add(new THREE.CylinderGeometry(0.07,0.06,0.44,14), fab2, -0.56,1.08,0)
        add(new THREE.CylinderGeometry(0.07,0.06,0.44,14), fab2, 0.56,1.08,0)
        for (let b=0;b<4;b++) add(new THREE.SphereGeometry(0.018,8,8), acc, 0.01, 1.75-b*0.14, 0.33)
        add(new THREE.TorusGeometry(0.14, 0.014, 6, 20), fab, 0, 1.97, 0, Math.PI/2,0,0)
      } else if (style === 'blazer') {
        add(new THREE.CylinderGeometry(0.32, 0.30, 0.58, 28), fab, 0, 1.68, 0)
        add(new THREE.BoxGeometry(0.14, 0.38, 0.055), fab, -0.11, 1.72, 0.30)
        add(new THREE.BoxGeometry(0.14, 0.38, 0.055), fab, 0.11, 1.72, 0.30)
        add(new THREE.CylinderGeometry(0.27, 0.32, 0.30, 28), fab, 0, 1.33, 0)
        add(new THREE.CylinderGeometry(0.26, 0.27, 0.70, 28), fab, 0, 0.88, 0)
        add(new THREE.CylinderGeometry(0.26, 0.27, 0.55, 26), fab2, 0, 0.33, 0)
        add(new THREE.CylinderGeometry(0.27, 0.27, 0.30, 26), fab, 0, -0.04, 0)
        for (let b=0;b<3;b++) add(new THREE.SphereGeometry(0.020,8,8), acc, 0.01,1.62-b*0.16,0.32)
        add(new THREE.SphereGeometry(0.11, 14,10), fab, -0.35,1.80,0)
        add(new THREE.SphereGeometry(0.11, 14,10), fab, 0.35,1.80,0)
        add(new THREE.CylinderGeometry(0.08,0.07,0.50,14), fab, -0.47,1.52,0, 0,0,-0.19)
        add(new THREE.CylinderGeometry(0.08,0.07,0.50,14), fab, 0.47,1.52,0, 0,0,0.19)
        add(new THREE.CylinderGeometry(0.07,0.06,0.42,14), fab2, -0.56,1.08,0)
        add(new THREE.CylinderGeometry(0.07,0.06,0.42,14), fab2, 0.56,1.08,0)
      } else if (style === 'trench') {
        add(new THREE.CylinderGeometry(0.32, 0.30, 0.60, 28), fab, 0, 1.68, 0)
        add(new THREE.CylinderGeometry(0.27, 0.32, 0.34, 28), fab, 0, 1.33, 0)
        add(new THREE.TorusGeometry(0.245, 0.025, 6, 28), acc, 0, 1.26, 0, Math.PI/2,0,0)
        add(new THREE.CylinderGeometry(0.34, 0.40, 0.50, 30), fab, 0, 0.93, 0)
        add(new THREE.CylinderGeometry(0.40, 0.46, 0.70, 32), fab, 0, 0.42, 0)
        add(new THREE.CylinderGeometry(0.46, 0.50, 0.60, 32), fab2, 0, -0.10, 0)
        add(new THREE.CylinderGeometry(0.50, 0.50, 0.24, 32), fab, 0, -0.46, 0)
        add(new THREE.BoxGeometry(0.66, 0.09, 0.55), fab, 0, 1.96, 0)
        add(new THREE.BoxGeometry(0.16, 0.44, 0.058), fab, -0.10, 1.72, 0.31)
        add(new THREE.BoxGeometry(0.16, 0.44, 0.058), fab, 0.10, 1.72, 0.31)
        add(new THREE.SphereGeometry(0.12, 14,10), fab, -0.36,1.82,0)
        add(new THREE.SphereGeometry(0.12, 14,10), fab, 0.36,1.82,0)
        add(new THREE.CylinderGeometry(0.085,0.075,0.54,14), fab, -0.48,1.52,0, 0,0,-0.18)
        add(new THREE.CylinderGeometry(0.085,0.075,0.54,14), fab, 0.48,1.52,0, 0,0,0.18)
        add(new THREE.CylinderGeometry(0.075,0.065,0.44,14), fab2, -0.57,1.07,0)
        add(new THREE.CylinderGeometry(0.075,0.065,0.44,14), fab2, 0.57,1.07,0)
        for (let b=0;b<4;b++) add(new THREE.SphereGeometry(0.018,8,8), acc, 0.01,1.70-b*0.15,0.33)
      } else if (style === 'palazzo') {
        add(new THREE.CylinderGeometry(0.26, 0.24, 0.48, 26), fab, 0, 1.66, 0)
        add(new THREE.CylinderGeometry(0.20, 0.26, 0.28, 26), fab, 0, 1.32, 0)
        add(new THREE.TorusGeometry(0.215, 0.02, 6, 26), acc, 0, 1.20, 0, Math.PI/2,0,0)
        add(new THREE.CylinderGeometry(0.175,0.235,1.35,22), fab, -0.18, 0.47, 0)
        add(new THREE.CylinderGeometry(0.175,0.235,1.35,22), fab, 0.18, 0.47, 0)
        add(new THREE.CylinderGeometry(0.235,0.28,0.20,22), fab2, -0.18, -0.28, 0)
        add(new THREE.CylinderGeometry(0.235,0.28,0.20,22), fab2, 0.18, -0.28, 0)
        add(new THREE.SphereGeometry(0.10, 14,10), fab, -0.31,1.80,0)
        add(new THREE.SphereGeometry(0.10, 14,10), fab, 0.31,1.80,0)
        add(new THREE.CylinderGeometry(0.075,0.065,0.50,12), fab, -0.41,1.52,0, 0,0,-0.20)
        add(new THREE.CylinderGeometry(0.075,0.065,0.50,12), fab, 0.41,1.52,0, 0,0,0.20)
      } else { // skirt
        add(new THREE.CylinderGeometry(0.24, 0.22, 0.42, 26), fab, 0, 1.65, 0)
        add(new THREE.CylinderGeometry(0.195,0.24, 0.26, 26), fab, 0, 1.34, 0)
        add(new THREE.CylinderGeometry(0.30, 0.38, 0.40, 32), fab, 0, 0.81, 0)
        add(new THREE.CylinderGeometry(0.38, 0.52, 0.60, 34), fab2, 0, 0.35, 0)
        add(new THREE.CylinderGeometry(0.52, 0.62, 0.50, 34), fab, 0, -0.07, 0)
        add(new THREE.CylinderGeometry(0.62, 0.64, 0.14, 34), fab2, 0, -0.38, 0)
        add(new THREE.CylinderGeometry(0.012,0.012,0.40,8), fab, -0.14, 1.80, 0, 0,0,0.28)
        add(new THREE.CylinderGeometry(0.012,0.012,0.40,8), fab, 0.14, 1.80, 0, 0,0,-0.28)
        add(new THREE.TorusGeometry(0.22, 0.014, 6,24), acc, 0, 1.86, 0, Math.PI/2,0,0)
      }

      // ── STILETTOS ──
      const sy = -0.58
      ;[-0.12, 0.12].forEach(sx => {
        add(new THREE.BoxGeometry(0.115,0.052,0.27), shoe, sx, sy, 0.06)
        add(new THREE.BoxGeometry(0.115,0.058,0.08), shoe, sx, sy, -0.17)
        add(new THREE.BoxGeometry(0.115,0.017,0.30), sole, sx, sy-0.036, 0.01)
        add(new THREE.CylinderGeometry(0.007,0.012,0.30,8), heel, sx, sy-0.172, -0.19)
        add(new THREE.CylinderGeometry(0.017,0.013,0.020,8), heel, sx, sy-0.327, -0.19)
        add(new THREE.BoxGeometry(0.011,0.10,0.008), acc, sx + (sx<0?-0.055:0.055), sy+0.038, -0.12)
        add(new THREE.BoxGeometry(0.11,0.008,0.008), acc, sx, sy+0.085, -0.12)
      })

      // Socle
      add(new THREE.CylinderGeometry(0.52, 0.58, 0.055, 40),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.25, metalness: 0.6 }), 0, -1.01, 0)
      add(new THREE.CylinderGeometry(0.55, 0.55, 0.012, 40),
        new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.1, metalness: 1.0 }), 0, -0.982, 0)

      // Particules
      const geo = new THREE.BufferGeometry()
      const N = 60, pos = new Float32Array(N * 3)
      const rr: number[] = [], aa: number[] = [], sp: number[] = [], hh: number[] = []
      for (let i=0;i<N;i++) {
        rr.push(0.7+Math.random()*1.3); aa.push(Math.random()*Math.PI*2)
        sp.push(0.002+Math.random()*0.005); hh.push(-0.9+Math.random()*3.2)
        pos[i*3]=0; pos[i*3+1]=0; pos[i*3+2]=0
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: accentColor, size: 0.026, transparent: true, opacity: 0.6 }))
      scene.add(pts)

      const animate = () => {
        animId = requestAnimationFrame(animate)
        time += 0.011
        group.rotation.y = time * autoRotateSpeed
        group.position.y = Math.sin(time * 0.6) * 0.025
        const p = pts.geometry.attributes.position.array as Float32Array
        for (let i=0;i<N;i++) {
          aa[i] += sp[i]
          p[i*3]   = Math.cos(aa[i]) * rr[i]
          p[i*3+1] = hh[i] + Math.sin(time*0.45+i)*0.12 - 0.5
          p[i*3+2] = Math.sin(aa[i]) * rr[i]
        }
        pts.geometry.attributes.position.needsUpdate = true
        pts.rotation.y = -time * 0.08
        if (goldLight) goldLight.intensity = 1.6 + Math.sin(time * 1.8) * 0.5
        renderer.render(scene, camera)
      }
      animate()
    }

    init().catch(console.error)

    return () => { if (animId) cancelAnimationFrame(animId) }
  }, [style, fabricColor, accentColor, shoeColor, heelColor])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}