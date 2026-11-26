import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, RoundedBox, ContactShadows, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

const RED = '#ff2020'

/* ---------- scrolling code texture for monitors ---------- */
const CODE = [
  [['k', 'import '], ['t', '{ Canvas } '], ['k', 'from '], ['s', "'@react-three/fiber'"]],
  [['k', 'export default function '], ['f', 'Ranger'], ['t', '() {']],
  [['t', '  '], ['k', 'const '], ['t', '[mode, setMode] = '], ['f', 'useState'], ['t', '(dark)']],
  [['t', '  '], ['f', 'useGSAP'], ['t', '(() => {']],
  [['t', '    gsap.'], ['f', 'from'], ['t', "('.hero', { y: 120 })"]],
  [['t', '  }, [])']],
  [['t', '  '], ['k', 'return '], ['g', '<Scene '], ['f', 'glow'], ['t', '={'], ['s', "'#ff2020'"], ['t', '} '], ['g', '/>']],
  [['t', '}']],
  [['c', '// smooth scroll + scrolltrigger']],
  [['k', 'const '], ['t', 'lenis = '], ['k', 'new '], ['f', 'Lenis'], ['t', '()']],
  [['t', 'lenis.'], ['f', 'on'], ['t', "('scroll', ScrollTrigger.update)"]],
  [['k', 'const '], ['t', 'bot = '], ['k', 'new '], ['f', 'Bot'], ['t', '(TOKEN)']],
  [['t', 'bot.'], ['f', 'command'], ['t', '('], ['s', "'start'"], ['t', ', ctx => ctx.'], ['f', 'reply'], ['t', '('], ['s', "'Salom!'"], ['t', '))']],
  [['c', '// ship it 🚀']],
]
const COLORS: Record<string, string> = { k: '#ff5c7a', f: '#7cc4ff', s: '#f2c46d', c: '#5a6474', t: '#d0d6dd', g: '#8ee6a2' }

function makeCodeTexture(seed: number) {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 1024
  const g = c.getContext('2d')!
  g.fillStyle = '#070a12'; g.fillRect(0, 0, c.width, c.height)
  g.font = '500 17px "JetBrains Mono", monospace'
  for (let line = 0; line < 44; line++) {
    const tokens = CODE[(line + seed * 5) % CODE.length]
    let x = 22
    const y = 30 + line * 23
    g.fillStyle = '#2a3140'; g.fillText(String(line + 1).padStart(2, ' '), 4, y)
    tokens.forEach(([k, text]) => { g.fillStyle = COLORS[k]; g.fillText(text, x + 14, y); x += g.measureText(text).width })
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 0.42)
  tex.anisotropy = 4
  return tex
}

function Monitor({ position, rotation = [0, 0, 0], size = [1.45, 0.85], seed = 0, speed = 0.02 }: { position: [number, number, number]; rotation?: [number, number, number]; size?: [number, number]; seed?: number; speed?: number }) {
  const tex = useMemo(() => makeCodeTexture(seed), [seed])
  useEffect(() => () => tex.dispose(), [tex])
  useFrame((_, dt) => { tex.offset.y -= dt * speed })
  const [w, h] = size
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w + 0.08, h + 0.08, 0.06]} radius={0.02} castShadow>
        <meshStandardMaterial color="#0d0d10" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.22, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.04]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} color="#5a8cff" intensity={0.35} distance={1.6} />
    </group>
  )
}

/* ---------- extruded "</>" symbol ---------- */
function useChevronGeometry() {
  return useMemo(() => {
    const t = 0.11
    const chev = (dir: 1 | -1, ox: number) => {
      const s = new THREE.Shape()
      s.moveTo(ox, 0.35); s.lineTo(ox - dir * 0.32, 0); s.lineTo(ox, -0.35)
      s.lineTo(ox + dir * t, -0.35); s.lineTo(ox - dir * 0.32 + dir * t, 0); s.lineTo(ox + dir * t, 0.35)
      return s
    }
    const slash = new THREE.Shape()
    slash.moveTo(0.06, 0.42); slash.lineTo(0.16, 0.42); slash.lineTo(-0.06, -0.42); slash.lineTo(-0.16, -0.42)
    const geo = new THREE.ExtrudeGeometry([chev(1, -0.2), chev(-1, 0.2), slash], { depth: 0.08, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 })
    geo.center()
    return geo
  }, [])
}

function Symbol3D({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const geo = useChevronGeometry()
  const ref = useRef<THREE.Mesh>(null)
  useFrame((s) => { if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.6 * speed) * 0.6 })
  return (
    <Float speed={1.6 * speed} rotationIntensity={0.3} floatIntensity={0.9}>
      <mesh ref={ref} geometry={geo} position={position} scale={scale}>
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </Float>
  )
}

function Brace({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh position={position} scale={scale}>
        <torusGeometry args={[0.22, 0.035, 16, 48]} />
        <meshStandardMaterial color="#ffffff" emissive="#ff6b6b" emissiveIntensity={0.6} metalness={0.4} roughness={0.2} />
      </mesh>
    </Float>
  )
}

/* ---------- developer (stylised, seen from behind) ---------- */
function Developer() {
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Mesh>(null)
  const armR = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (head.current) head.current.rotation.y = Math.sin(t * 0.5) * 0.12
    if (armL.current) armL.current.rotation.x = -1.15 + Math.sin(t * 14) * 0.03
    if (armR.current) armR.current.rotation.x = -1.15 + Math.cos(t * 12) * 0.03
  })
  const hoodie = <meshStandardMaterial color="#1e1e24" roughness={0.75} />
  return (
    <group position={[0, 0, 1.15]}>
      {/* chair */}
      <RoundedBox args={[0.8, 0.85, 0.12]} radius={0.08} position={[0, 0.72, 0.45]} rotation={[0.12, 0, 0]} castShadow>
        <meshStandardMaterial color="#0c0c0e" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0.98, 0.53]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.02]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <RoundedBox args={[0.9, 0.12, 0.8]} radius={0.04} position={[0, 0.3, 0.05]} castShadow>
        <meshStandardMaterial color="#0c0c0e" roughness={0.6} />
      </RoundedBox>
      {/* body */}
      <mesh position={[0, 0.82, 0.1]} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        {hoodie}
      </mesh>
      <mesh ref={armL} position={[-0.34, 0.95, -0.05]} castShadow>
        <capsuleGeometry args={[0.085, 0.5, 6, 12]} />
        {hoodie}
      </mesh>
      <mesh ref={armR} position={[0.34, 0.95, -0.05]} castShadow>
        <capsuleGeometry args={[0.085, 0.5, 6, 12]} />
        {hoodie}
      </mesh>
      {/* head + hood */}
      <group ref={head} position={[0, 1.42, 0.08]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#1a1110" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.02, 0.06]} scale={[1.08, 1.05, 1]} castShadow>
          <sphereGeometry args={[0.215, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          {hoodie}
        </mesh>
      </group>
    </group>
  )
}

function Workspace() {
  const fanRefs = useRef<THREE.Mesh[]>([])
  useFrame((_, dt) => fanRefs.current.forEach((f, i) => f && (f.rotation.z += dt * (2 + i))))
  const strip = <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={3} toneMapped={false} />
  return (
    <group position={[0, -1.1, 0]}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#060404" roughness={0.95} />
      </mesh>
      {/* desk */}
      <RoundedBox args={[4.4, 0.1, 1.5]} radius={0.03} position={[0, 1.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#111014" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 1.0, 0.76]}><boxGeometry args={[4.3, 0.02, 0.02]} />{strip}</mesh>
      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow><boxGeometry args={[0.08, 1, 1.3]} /><meshStandardMaterial color="#0b0b0d" /></mesh>
      ))}
      {/* monitors */}
      <Monitor position={[0, 1.95, -0.35]} size={[1.55, 0.9]} seed={0} speed={0.018} />
      <Monitor position={[-1.62, 1.9, -0.15]} rotation={[0, 0.42, 0]} size={[1.35, 0.8]} seed={1} speed={0.025} />
      <Monitor position={[1.62, 1.9, -0.15]} rotation={[0, -0.42, 0]} size={[1.35, 0.8]} seed={2} speed={0.014} />
      {/* keyboard + mouse */}
      <RoundedBox args={[1.1, 0.04, 0.34]} radius={0.015} position={[0, 1.12, 0.35]} castShadow>
        <meshStandardMaterial color="#141418" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 1.145, 0.35]}><boxGeometry args={[1.02, 0.01, 0.26]} /><meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.9} toneMapped={false} transparent opacity={0.55} /></mesh>
      <mesh position={[0.78, 1.13, 0.38]} scale={[1, 0.5, 1.4]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#141418" /></mesh>
      {/* PC tower */}
      <group position={[2.65, 1.05 + 0.75, -0.2]}>
        <RoundedBox args={[0.55, 1.5, 1.1]} radius={0.04} castShadow>
          <meshStandardMaterial color="#0b0b0e" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        {[0.45, 0, -0.45].map((y, i) => (
          <mesh key={y} position={[-0.28, y, 0]} rotation={[0, -Math.PI / 2, 0]} ref={(m) => { if (m) fanRefs.current[i] = m }}>
            <torusGeometry args={[0.17, 0.022, 12, 40, Math.PI * 1.7]} />
            {strip}
          </mesh>
        ))}
        <pointLight position={[-0.6, 0, 0]} color={RED} intensity={2.2} distance={2.5} />
      </group>
      {/* shelf + neon */}
      <mesh position={[-0.6, 3.15, -1.2]}><boxGeometry args={[1.6, 0.05, 0.35]} /><meshStandardMaterial color="#160505" /></mesh>
      <mesh position={[-0.6, 3.12, -1.03]}><boxGeometry args={[1.6, 0.02, 0.02]} />{strip}</mesh>
      <Developer />
    </group>
  )
}

/* ---------- camera rig: pointer parallax + slow drift ---------- */
function Rig() {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0.6, 0), [])
  useFrame((s, dt) => {
    const k = 1 - Math.pow(0.002, dt)
    camera.position.x += (s.pointer.x * 1.1 + Math.sin(s.clock.elapsedTime * 0.2) * 0.15 - camera.position.x) * k
    camera.position.y += (2.9 + s.pointer.y * 0.45 - camera.position.y) * k
    camera.lookAt(target)
  })
  return null
}

export default function Workspace3D() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(1.5)

  // Stop rendering when the hero is off-screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full [mask-image:radial-gradient(ellipse_72%_68%_at_50%_48%,#000_55%,transparent_100%)]">
      <Canvas
        shadows
        dpr={dpr}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 2.9, 7.2], fov: 36 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        aria-label="3D developer workspace with monitors showing code"
        role="img"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <AdaptiveDpr pixelated />
        <fog attach="fog" args={['#050505', 7, 14]} />
        <ambientLight intensity={0.25} />
        <spotLight position={[2.5, 6, 4]} angle={0.45} penumbra={0.8} intensity={60} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
        <pointLight position={[0, 1.6, -1.2]} color={RED} intensity={14} distance={6} />
        <pointLight position={[-3, 1, 1]} color={RED} intensity={6} distance={6} />
        <pointLight position={[0, 1.2, 3]} color="#ff6b6b" intensity={2} distance={5} />
        <Workspace />
        <Symbol3D position={[1.7, 1.85, -0.9]} scale={0.8} />
        <Symbol3D position={[-2.6, 1.4, 0.3]} scale={0.55} speed={1.3} />
        <Brace position={[-1.9, 2.2, -0.6]} scale={0.8} />
        <Brace position={[2.9, -0.2, 1.2]} scale={0.6} />
        <Sparkles count={70} scale={[8, 4, 4]} position={[0, 0.8, 0]} size={2.4} speed={0.35} color={RED} opacity={0.8} />
        <ContactShadows position={[0, -1.1, 0]} opacity={0.6} scale={10} blur={2.6} far={3} />
        <Rig />
      </Canvas>
    </div>
  )
}
