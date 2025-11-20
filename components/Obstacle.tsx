import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ObstacleData } from '../types';

interface ObstacleProps {
  data: ObstacleData;
}

export const Obstacle: React.FC<ObstacleProps> = ({ data }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
      if (meshRef.current) {
          meshRef.current.rotation.x += 0.02;
          meshRef.current.rotation.y += 0.02;
      }
  });

  return (
    <group position={[data.x, data.height / 2, data.z]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[data.width, data.height, data.width]} />
        <meshStandardMaterial 
            color={data.color} 
            emissive={data.color} 
            emissiveIntensity={0.8} 
            transparent
            opacity={0.9}
        />
      </mesh>
      {/* Wireframe overlay for style */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width, data.height, data.width)]} />
        <lineBasicMaterial color="white" linewidth={2} />
      </lineSegments>
    </group>
  );
};