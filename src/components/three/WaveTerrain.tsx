import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useThreeThemeColors } from "@/lib/three-theme";

// Bio-luminescent wave terrain — a distorted plane grid seen from above
// pulses like a neural landscape. Floating particles drift above it and
// the whole scene reacts to scroll (camera dolly, amplitude, tilt).

const scroll = { p: 0 };
if (typeof window !== "undefined") {
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scroll.p = Math.min(1, Math.max(0, window.scrollY / max));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function Terrain() {
  const colors = useThreeThemeColors();
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(28, 28, 96, 96), []);
  const base = useMemo(() => {
    const arr = new Float32Array(geo.attributes.position.array.length);
    arr.set(geo.attributes.position.array as Float32Array);
    return arr;
  }, [geo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.p;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const amp = 0.9 + p * 2.2;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const d = Math.sqrt(x * x + y * y);
      const z =
        Math.sin(d * 0.55 - t * 1.1) * 0.6 * amp +
        Math.sin(x * 0.35 + t * 0.9) * 0.35 * amp +
        Math.cos(y * 0.4 + t * 0.7) * 0.3 * amp;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.03 + p * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.5, 0]}>
      <meshBasicMaterial
        color={colors.accent}
        wireframe
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Particles({ count = 220 }: { count?: number }) {
  const colors = useThreeThemeColors();
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    const attr = g.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = positions[i * 3 + 1] + Math.sin(t * 0.6 + seeds[i]) * 0.4;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    g.rotation.y = t * 0.02 + scroll.p * 0.6;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={colors.accent2}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function OrbitRing() {
  const colors = useThreeThemeColors();
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.p;
    if (!ref.current) return;
    ref.current.rotation.x = t * 0.15 + p * 1.2;
    ref.current.rotation.y = t * 0.2;
    ref.current.scale.setScalar(1 + p * 0.6);
  });
  return (
    <mesh ref={ref} position={[0, 1.5, -2]}>
      <torusGeometry args={[3.2, 0.02, 8, 128]} />
      <meshBasicMaterial
        color={colors.accent}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    const p = scroll.p;
    const pt = state.pointer;
    mouse.current.x += (pt.x - mouse.current.x) * 0.04;
    mouse.current.y += (pt.y - mouse.current.y) * 0.04;
    const targetZ = 8 - p * 2.2;
    const targetY = 1.6 + p * 2.5 + mouse.current.y * 0.6;
    const targetX = mouse.current.x * 1.2;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.lookAt(0, -0.5 + p * 0.6, 0);
  });
  return null;
}

export default function WaveTerrain() {
  const colors = useThreeThemeColors();
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={colors.ambient} />
      <pointLight position={[0, 4, 0]} color={colors.accent} intensity={20} distance={22} />
      <pointLight position={[6, 2, -3]} color={colors.accent2} intensity={12} distance={18} />
      <ScrollCamera />
      <Terrain />
      <OrbitRing />
      <Particles />
      <fog attach="fog" args={[colors.fog, 10, 28]} />
    </Canvas>
  );
}
