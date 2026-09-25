import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThreeThemeColors } from "@/lib/three-theme";

function Core() {
  const colors = useThreeThemeColors();
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
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={colors.accent2} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function CoreScene() {
  const colors = useThreeThemeColors();
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={colors.ambient} />
      <Core />
    </Canvas>
  );
}
