'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneId } from '@/lib/types';
import { zones } from '@/lib/zones';

interface Zone3DProps {
  zoneId: ZoneId;
  position: [number, number, number];
  isPrimary: boolean;
  percentage: number;
  onClick: () => void;
}

function Zone3D({ zoneId, position, isPrimary, percentage, onClick }: Zone3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const zone = zones[zoneId];
  const size = isPrimary ? 2.5 : 1 + (percentage / 100) * 1.5;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isPrimary ? 0.01 : 0.005;
      
      // Pulsing effect for primary zone
      if (isPrimary) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      }
      
      // Hover effect
      if (hovered && !isPrimary) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      } else if (!isPrimary) {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const color = new THREE.Color(zone.color);

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isPrimary ? 0.8 : hovered ? 0.6 : 0.3}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
        />
      </mesh>

      {/* Glow ring */}
      {isPrimary && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Particles around primary */}
      {isPrimary && <OrbitingParticles color={color} radius={size * 2} />}

      {/* Label - using HTML overlay instead of 3D text for reliability */}
    </group>
  );
}

function OrbitingParticles({ color, radius }: { color: THREE.Color; radius: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 30;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffb347"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface UniverseMap3DProps {
  primaryZone: ZoneId;
  topZones: Array<{ zone: ZoneId; percentage: number }>;
  onZoneClick?: (zoneId: ZoneId) => void;
}

export default function UniverseMap3D({ primaryZone, topZones, onZoneClick }: UniverseMap3DProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-crimson">
        <div className="text-center">
          <p className="text-sm mb-2">3D Universe unavailable</p>
          <p className="text-xs text-ash-dark">{error}</p>
        </div>
      </div>
    );
  }
  // Position zones in a circular formation
  const zonePositions: Record<ZoneId, [number, number, number]> = useMemo(() => {
    const radius = 10;
    const zoneIds = Object.keys(zones) as ZoneId[];
    const positions: Record<ZoneId, [number, number, number]> = {} as any;

    zoneIds.forEach((zoneId, index) => {
      const angle = (index / zoneIds.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 3;
      positions[zoneId] = [x, y, z];
    });

    // Center primary zone
    positions[primaryZone] = [0, 0, 0];

    return positions;
  }, [primaryZone]);

  const zonePercentages = useMemo(() => {
    const percentages: Record<string, number> = {};
    topZones.forEach(({ zone, percentage }) => {
      percentages[zone] = percentage;
    });
    return percentages;
  }, [topZones]);

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={10}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffb347" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#dc143c" />
        
        {/* Starfield */}
        <StarField />

        {/* Zones */}
        {Object.entries(zonePositions).map(([zoneId, position]) => (
          <Zone3D
            key={zoneId}
            zoneId={zoneId as ZoneId}
            position={position}
            isPrimary={zoneId === primaryZone}
            percentage={zonePercentages[zoneId] || 0}
            onClick={() => onZoneClick?.(zoneId as ZoneId)}
          />
        ))}

        {/* Connection lines to primary zone */}
        {topZones.slice(1, 4).map(({ zone }) => {
          const start = zonePositions[primaryZone];
          const end = zonePositions[zone];
          
          const points = [
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
          ];

          return (
            <line key={zone}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...start, ...end]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={zones[zone].color}
                transparent
                opacity={0.3}
              />
            </line>
          );
        })}
      </Canvas>
    </div>
  );
}
