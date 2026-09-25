import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useThreeThemeColors } from "@/lib/three-theme";

function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    pts.push(new THREE.Vector3(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius));
  }
  return pts;
}

function Cloud({ words }: { words: string[] }) {
  const colors = useThreeThemeColors();
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(words.length, 2.4), [words.length]);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });
  return (
    <group ref={group}>
      {words.map((w, i) => (
        <Billboard key={w + i} position={positions[i]}>
          <Text
            fontSize={0.18}
            color={i % 5 === 0 ? colors.accent2 : colors.highlight}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor={colors.accent}
          >
            {w}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

export default function SkillsCloud({ words }: { words: string[] }) {
  const colors = useThreeThemeColors();
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={colors.ambient} />
      <Cloud words={words} />
    </Canvas>
  );
}
