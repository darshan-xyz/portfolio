import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.25;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#7CF9C9" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#B8FF3A" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function CoreScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={0.6} />
      <Core />
    </Canvas>
  );
}
