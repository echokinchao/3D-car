import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

// A constructed tron-style bike using primitives
export const PlayerBike = forwardRef<THREE.Group, {}>((props, ref) => {
  return (
    <group ref={ref} position={[0, 0, 0]} {...props}>
      {/* Main Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.5, 2]} />
        <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Neon Strip Top */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[0.2, 0.1, 1.8]} />
        <meshBasicMaterial color={COLORS.neonBlue} toneMapped={false} />
      </mesh>

      {/* Rear Wheel */}
      <mesh position={[0, 0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Rear Wheel Glow */}
       <mesh position={[0, 0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 32]} />
        <meshBasicMaterial color={COLORS.neonPink} toneMapped={false} />
      </mesh>

      {/* Front Wheel */}
      <mesh position={[0, 0.4, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Front Wheel Glow */}
      <mesh position={[0, 0.4, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 32]} />
        <meshBasicMaterial color={COLORS.neonBlue} toneMapped={false} />
      </mesh>

      {/* Light Trail Emitter (Visual only) */}
      <pointLight position={[0, 0.5, 1]} distance={5} intensity={2} color={COLORS.neonPink} />
    </group>
  );
});

PlayerBike.displayName = "PlayerBike";