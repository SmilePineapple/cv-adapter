"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function DistortedBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const target = state.pointer;
    pointer.current.x += (target.x - pointer.current.x) * 0.02;
    pointer.current.y += (target.y - pointer.current.y) * 0.02;

    if (meshRef.current) {
      meshRef.current.rotation.y = pointer.current.x * 0.4;
      meshRef.current.rotation.x = -pointer.current.y * 0.3;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.6}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          color="#ff6b4a"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 4]} intensity={1.4} color="#7c6cff" />
        <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#ff6b4a" />
        <Suspense fallback={null}>
          <DistortedBlob />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
