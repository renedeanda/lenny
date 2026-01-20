'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random';

interface InteractiveStarsProps {
  mouseX: number;
  mouseY: number;
}

function InteractiveStars({ mouseX, mouseY }: InteractiveStarsProps) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create multiple layers of stars at different depths
  const [positions] = useState(() => {
    const positions = new Float32Array(10000 * 3);
    for (let i = 0; i < 10000; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 2.5 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) * 0.8; // Flatten z a bit
    }
    return positions;
  });

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();

    // Rotate stars slowly
    ref.current.rotation.x = time * 0.02;
    ref.current.rotation.y = time * 0.03;

    // React to mouse with parallax effect
    const targetX = mouseX * 0.15;
    const targetY = -mouseY * 0.15;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffb347"
        size={0.004}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function DeepStars({ mouseX, mouseY }: InteractiveStarsProps) {
  const ref = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const arr = random.inSphere(new Float32Array(3000 * 3), { radius: 4 });
    return new Float32Array(arr);
  });

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = -time * 0.01;
    ref.current.rotation.y = -time * 0.015;

    // Slower parallax for depth
    const targetX = mouseX * 0.05;
    const targetY = -mouseY * 0.05;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.03;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#cc7a00"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Mouse trail removed - was too distracting

export default function InteractiveSpace() {
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
    <div className="fixed inset-0 z-0 bg-void">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <DeepStars mouseX={mousePos.x} mouseY={mousePos.y} />
        <InteractiveStars mouseX={mousePos.x} mouseY={mousePos.y} />
      </Canvas>

      {/* Dark scrim for text readability */}
      <div className="absolute inset-0 bg-void/60 pointer-events-none" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-void pointer-events-none" />
    </div>
  );
}
