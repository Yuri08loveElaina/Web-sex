import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.5;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.3;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.7) * 0.3;
      meshRef.current.position.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 2;
      meshRef.current.position.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

function BackgroundScene() {
  return (
    <>
      <color attach="background" args={['#f8fafc']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <FloatingCube />
      <FloatingSphere />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <BackgroundScene />
      </Canvas>
    </div>
  );
}
