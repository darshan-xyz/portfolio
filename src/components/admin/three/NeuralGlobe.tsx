import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { VisitorSessionRecord } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Radio, Navigation, Eye, Zap } from "lucide-react";
import { cyberAudio } from "@/lib/admin/cyber-audio";
import { useThreeThemeColors } from "@/lib/three-theme";

interface NeuralGlobeProps {
  visitors: VisitorSessionRecord[];
}

// Fixed Server Origin Node (Bangalore, India: 12.9716° N, 77.5946° E)
const SERVER_ORIGIN = {
  lat: 12.9716,
  lon: 77.5946,
  label: "BLR-ORIGIN (HOST)",
};

// Known approximate lat/long coordinates for major world cities/countries to map real visitor GeoIP
const GEO_COORDINATES: Record<string, [number, number]> = {
  IN: [12.9716, 77.5946], // India
  US: [37.7749, -122.4194], // US / San Francisco
  GB: [51.5074, -0.1278], // UK / London
  DE: [52.52, 13.405], // Germany / Berlin
  FR: [48.8566, 2.3522], // France / Paris
  JP: [35.6762, 139.6503], // Japan / Tokyo
  SG: [1.3521, 103.8198], // Singapore
  CA: [43.6532, -79.3832], // Canada / Toronto
  AU: [-33.8688, 151.2093], // Australia / Sydney
  NL: [52.3676, 4.9041], // Netherlands / Amsterdam
  BR: [-23.5505, -46.6333], // Brazil / Sao Paulo
  AE: [25.2048, 55.2708], // UAE / Dubai
};

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobeSphere({ radius = 2.4 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors = useThreeThemeColors();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Tactical Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 36, 36]} />
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.22} />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, 32, 32]} />
        <meshBasicMaterial color={colors.fog} />
      </mesh>

      {/* Equator and Meridian rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.01, radius + 0.03, 64]} />
        <meshBasicMaterial
          color={colors.accent}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function ArcLine({
  start,
  end,
  radius = 2.4,
  isPulsing = false,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius?: number;
  isPulsing?: boolean;
}) {
  const curve = useMemo(() => {
    // Elevate middle point above radius to create a dramatic curved ray
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(radius + distance * 0.35);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end, radius]);

  const points = useMemo(() => curve.getPoints(40), [curve]);
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={lineGeo}>
      <lineBasicMaterial
        color={isPulsing ? "#B8FF3A" : "#38bdf8"}
        transparent
        opacity={isPulsing ? 0.9 : 0.65}
        linewidth={isPulsing ? 2 : 1}
      />
    </line>
  );
}

function VisitorBeacon({
  position,
  label,
  isOrigin = false,
  onClick,
}: {
  position: THREE.Vector3;
  label: string;
  isOrigin?: boolean;
  onClick?: () => void;
}) {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      beaconRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[isOrigin ? 0.08 : 0.05, 16, 16]} />
        <meshBasicMaterial color={isOrigin ? "#B8FF3A" : "#7CF9C9"} />
      </mesh>
      <group ref={beaconRef}>
        <mesh>
          <ringGeometry args={[0.07, 0.1, 16]} />
          <meshBasicMaterial
            color={isOrigin ? "#B8FF3A" : "#7CF9C9"}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

export function NeuralGlobe({ visitors = [] }: NeuralGlobeProps) {
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorSessionRecord | null>(null);
  const colors = useThreeThemeColors();
  const radius = 2.4;

  const originVec = useMemo(
    () => latLongToVector3(SERVER_ORIGIN.lat, SERVER_ORIGIN.lon, radius),
    [radius],
  );

  // Map real visitors to 3D Cartesian coordinates
  const visitorNodes = useMemo(() => {
    return visitors.map((v) => {
      const coords = GEO_COORDINATES[v.countryCode] || [20, 0];
      const vec = latLongToVector3(coords[0], coords[1], radius);
      return {
        session: v,
        position: vec,
        coords,
      };
    });
  }, [visitors, radius]);

  const handleSelectVisitor = (v: VisitorSessionRecord) => {
    setSelectedVisitor(v);
    const coords = GEO_COORDINATES[v.countryCode] || [0, 0];
    cyberAudio.playPacketChirp(coords[1]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            <h2 className="font-mono text-base font-semibold tracking-wider text-foreground">
              NEURAL 3D GEOSPATIAL GLOBE // REAL-TIME TRANSIT RAYS
            </h2>
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 font-mono text-[10px] text-accent"
            >
              3D ORBIT ENGINE ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Interactive holographic 3D WebGL sphere tracing inbound geodesic packet rays from
            verified visitor locations to origin node.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            HOST: BANGALORE (IN)
          </Badge>
          <Badge className="border-accent/30 bg-accent/10 text-accent">
            {visitorNodes.length} BEACONS PLOTTED
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 3D WebGL Canvas */}
        <Card className="border-border bg-surface/60 backdrop-blur-md lg:col-span-8 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>SPATIAL WEBGL RADAR PROJECTION (DRAG TO ROTATE)</span>
            </CardTitle>
            <div className="font-mono text-[10px] text-muted-foreground">
              R3F · QUADRATIC BEZIER RAYS
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[480px] w-full bg-background">
              <Canvas camera={{ position: [0, 2.5, 6], fov: 45 }}>
                <color attach="background" args={[colors.fog]} />
                <ambientLight intensity={colors.ambient} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />

                {/* 3D Earth Globe Sphere */}
                <GlobeSphere radius={radius} />

                {/* Server Origin Beacon (Bangalore) */}
                <VisitorBeacon position={originVec} label={SERVER_ORIGIN.label} isOrigin />

                {/* Visitor Beacons & Geodesic Arc Lines */}
                {visitorNodes.map(({ session, position }) => {
                  const isSelected = selectedVisitor?.id === session.id;
                  return (
                    <group key={session.id}>
                      <VisitorBeacon
                        position={position}
                        label={`${session.city}, ${session.countryCode}`}
                        onClick={() => handleSelectVisitor(session)}
                      />
                      <ArcLine
                        start={position}
                        end={originVec}
                        radius={radius}
                        isPulsing={isSelected}
                      />
                    </group>
                  );
                })}

                <OrbitControls
                  enableZoom
                  enablePan={false}
                  minDistance={4}
                  maxDistance={10}
                  autoRotate
                  autoRotateSpeed={0.8}
                />
              </Canvas>

              {/* Tactical reticle HUD overlay */}
              <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] text-muted-foreground">
                <span className="text-accent">●</span> LAT/LON GEODESIC PROJECTION ACTIVE
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Dossier Panel */}
        <Card className="border-border bg-surface/60 backdrop-blur-md lg:col-span-4 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-xs text-muted-foreground">
              GEOSPATIAL INVENTORY ({visitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 max-h-[420px] overflow-y-auto">
            {visitors.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-muted-foreground">
                [ ZERO ACTIVE SENSORS REPORTING ]
              </div>
            ) : (
              visitors.map((v) => {
                const isSelected = selectedVisitor?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVisitor(v)}
                    className={`cursor-pointer rounded-lg border p-3 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-foreground">
                        {v.city || "Direct"}, {v.countryCode}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-accent/40 text-accent">
                        {v.deviceType}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{v.ip}</span>
                      <span>Dwell: {v.activeDwellSeconds}s</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
