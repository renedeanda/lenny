'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  mouseX: number;
  mouseY: number;
}

function WarmEmbers({ mouseX, mouseY }: ParticleProps) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [particles] = useState(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);

    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      // Distribute particles across the view
      positions[i3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i3 + 2] = Math.random() * 2 - 1;

      // Warm orange/yellow colors
      colors[i3] = 1.0; // R
      colors[i3 + 1] = 0.4 + Math.random() * 0.3; // G (0.4-0.7)
      colors[i3 + 2] = 0.2 + Math.random() * 0.2; // B (0.2-0.4)
    }

    return { positions, colors };
  });

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;

      // Slow rise like embers
      positions[i3 + 1] += 0.002;

      // Gentle sway
      positions[i3] += Math.sin(time + i) * 0.0005;

      // Reset if particle goes off screen
      if (positions[i3 + 1] > viewport.height) {
        positions[i3 + 1] = -viewport.height;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;

    // Gentle parallax with mouse
    const targetX = mouseX * 0.02;
    const targetY = -mouseY * 0.02;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;
  });

  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function BackgroundGlow({ mouseX, mouseY }: ParticleProps) {
  const ref = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 4;
      positions[i3 + 2] = -Math.random() * 2;
    }
    return positions;
  });

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();
    ref.current.rotation.z = time * 0.02;

    // Very subtle parallax
    const targetX = mouseX * 0.01;
    const targetY = -mouseY * 0.01;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.03;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff8c42"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function CampfireParticles() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-cream">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <BackgroundGlow mouseX={mousePos.x} mouseY={mousePos.y} />
        <WarmEmbers mouseX={mousePos.x} mouseY={mousePos.y} />
      </Canvas>

      {/* Subtle warm vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-cream-dark/30 pointer-events-none" />
    </div>
  );
}
