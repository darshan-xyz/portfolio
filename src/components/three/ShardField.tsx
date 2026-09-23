import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Fractured shard field — angular low-poly polygons floating in deep water,
// mint edge glow, parallax on cursor + scroll-driven camera + dispersion.

const SHARD_COUNT = 44;

type ShardData = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  drift: number;
  color: THREE.Color;
  dispersion: THREE.Vector3;
};

// Shared scroll progress (0..1 over full document)
const scroll = { p: 0, v: 0 };
if (typeof window !== "undefined") {
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scroll.p = Math.min(1, Math.max(0, window.scrollY / max));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function makeShardGeometry(seed: number) {
  const g =
    seed % 3 === 0
      ? new THREE.TetrahedronGeometry(1, 0)
      : seed % 3 === 1
        ? new THREE.OctahedronGeometry(1, 0)
        : new THREE.ConeGeometry(0.7, 1.6, 3, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) * (0.6 + Math.random() * 0.9),
      pos.getY(i) * (0.6 + Math.random() * 1.4),
      pos.getZ(i) * (0.6 + Math.random() * 0.9),
    );
  }
  g.computeVertexNormals();
  return g;
}

function Shard({ data, geo }: { data: ShardData; geo: THREE.BufferGeometry }) {
  const mesh = useRef<THREE.Mesh>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 15), [geo]);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.p;
    // eased scroll for dispersion
    const spread = p * p * 6.0;
    mesh.current.rotation.x = data.rotation.x + Math.sin(t * data.drift) * 0.25 + p * Math.PI;
    mesh.current.rotation.y = data.rotation.y + t * data.drift * 0.35 + p * Math.PI * 1.5;
    mesh.current.rotation.z = data.rotation.z + p * data.drift * 3;
    mesh.current.position.set(
      data.position.x + data.dispersion.x * spread,
      data.position.y +
        Math.sin(t * data.drift + data.position.x) * 0.35 +
        data.dispersion.y * spread,
      data.position.z + data.dispersion.z * spread,
    );
    // fade shards subtly as they scatter
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    if (mat && mat.opacity !== undefined) {
      mat.opacity = 0.14 + (1 - p) * 0.08;
    }
  });
  return (
    <mesh ref={mesh} position={data.position} rotation={data.rotation} scale={data.scale}>
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial
        color={data.color}
        transparent
        opacity={0.18}
        roughness={0.15}
        metalness={0.9}
        emissive={data.color}
        emissiveIntensity={0.45}
        flatShading
        side={THREE.DoubleSide}
      />
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={data.color}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </mesh>
  );
}

function Field() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const mint = useMemo(() => new THREE.Color("#7CF9C9"), []);
  const lime = useMemo(() => new THREE.Color("#B8FF3A"), []);
  const teal = useMemo(() => new THREE.Color("#3EE0B0"), []);

  const shards = useMemo<ShardData[]>(() => {
    const arr: ShardData[] = [];
    for (let i = 0; i < SHARD_COUNT; i++) {
      const r = 3 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 2,
        Math.cos(phi),
      ).normalize();
      arr.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          (Math.random() - 0.5) * 5,
          r * Math.cos(phi) - 2,
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        scale: 0.3 + Math.random() * 0.95,
        drift: 0.08 + Math.random() * 0.35,
        color: i % 7 === 0 ? lime : i % 3 === 0 ? teal : mint,
        dispersion: dir,
      });
    }
    return arr;
  }, [mint, lime, teal]);

  const geometries = useMemo(() => shards.map((_, i) => makeShardGeometry(i)), [shards]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scroll.p;
    group.current.rotation.y += delta * (0.04 + p * 0.15);
    const pt = state.pointer;
    mouse.current.x += (pt.x * 0.6 - mouse.current.x) * 0.05;
    mouse.current.y += (-pt.y * 0.4 - mouse.current.y) * 0.05;
    group.current.rotation.x = mouse.current.y + p * 0.6;
    group.current.position.x = mouse.current.x * 0.6;
    group.current.position.y = -p * 1.5;
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <Shard key={i} data={s} geo={geometries[i]} />
      ))}
    </group>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  useFrame(() => {
    const p = scroll.p;
    // camera dolly + slight tilt on scroll
    const targetZ = 7 + p * 5.5;
    const targetY = -p * 1.2;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.lookAt(0, -p * 0.5, 0);
  });
  return null;
}

function CausticGlow() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.p;
    if (l1.current) {
      l1.current.position.x = 3 + Math.sin(t * 0.4) * 2;
      l1.current.intensity = 12 + p * 8;
    }
    if (l2.current) {
      l2.current.position.y = -2 + Math.cos(t * 0.3) * 2 - p * 3;
    }
  });
  return (
    <>
      <pointLight ref={l1} position={[3, 2, 4]} color="#7CF9C9" intensity={12} distance={18} />
      <pointLight ref={l2} position={[-4, -2, 2]} color="#B8FF3A" intensity={6} distance={14} />
      <ambientLight intensity={0.2} />
    </>
  );
}

export default function ShardField() {
  // ensure scroll position is fresh on mount
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <CausticGlow />
      <ScrollCamera />
      <Field />
      <fog attach="fog" args={["#040914", 8, 22]} />
    </Canvas>
  );
}
