import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { GameStatus, ObstacleData, Keys } from '../types';
import { TRACK_WIDTH, COLORS, PLAYER_SIZE } from '../constants';
import { PlayerBike } from './PlayerBike';
import { Obstacle } from './Obstacle';

interface GameSceneProps {
  status: GameStatus;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

export const GameScene: React.FC<GameSceneProps> = ({ status, onGameOver, onScoreUpdate }) => {
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const playerRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0);
  const scoreRef = useRef(0);
  const keys = useRef<Keys>({ left: false, right: false });
  const lastSpawnZ = useRef(-50);
  const frameCount = useRef(0);

  // Reset game state when status changes to playing
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      setObstacles([]);
      speedRef.current = 0.5; // Base speed unit
      scoreRef.current = 0;
      lastSpawnZ.current = -50;
      if (playerRef.current) {
        playerRef.current.position.x = 0;
        playerRef.current.rotation.z = 0;
      }
    }
  }, [status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) return;

    frameCount.current++;

    // Increase speed gradually
    speedRef.current = Math.min(speedRef.current + 0.0005, 1.5);
    const moveDistance = speedRef.current * 60 * delta;

    // Move Player (Left/Right)
    if (playerRef.current) {
      const speed = 15 * delta;
      if (keys.current.left) {
          playerRef.current.position.x -= speed;
          playerRef.current.rotation.z = THREE.MathUtils.lerp(playerRef.current.rotation.z, 0.5, 0.1);
      } else if (keys.current.right) {
          playerRef.current.position.x += speed;
          playerRef.current.rotation.z = THREE.MathUtils.lerp(playerRef.current.rotation.z, -0.5, 0.1);
      } else {
          playerRef.current.rotation.z = THREE.MathUtils.lerp(playerRef.current.rotation.z, 0, 0.1);
      }
      
      // Clamp position
      playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -TRACK_WIDTH / 2 + 1, TRACK_WIDTH / 2 - 1);
    }

    // Manage Obstacles
    setObstacles(prev => {
      const nextObstacles: ObstacleData[] = [];
      let collided = false;

      prev.forEach(obs => {
        obs.z += moveDistance;

        // Collision Detection (AABB)
        if (playerRef.current) {
            const px = playerRef.current.position.x;
            // Player is at z=0. Size approx width=1
            const pWidth = PLAYER_SIZE.width * 0.8;
            
            // Check Z overlap (obstacle passes through 0)
            if (obs.z > -PLAYER_SIZE.depth && obs.z < PLAYER_SIZE.depth) {
                 // Check X overlap
                 const dx = Math.abs(px - obs.x);
                 if (dx < (obs.width / 2 + pWidth / 2)) {
                     collided = true;
                 }
            }
        }

        if (obs.z < 10) { // Keep if not passed camera too far
          nextObstacles.push(obs);
        }
      });

      if (collided) {
          onGameOver(Math.floor(scoreRef.current));
      }

      return nextObstacles;
    });

    if (status !== GameStatus.PLAYING) return;

    // Scoring
    scoreRef.current += speedRef.current;
    if (frameCount.current % 10 === 0) {
        onScoreUpdate(Math.floor(scoreRef.current));
    }

    // Spawning Logic
    if (Math.random() < 0.05 * speedRef.current) {
        const xPos = (Math.random() * (TRACK_WIDTH - 2)) - (TRACK_WIDTH / 2 - 1);
        setObstacles(prev => [
            ...prev, 
            {
                id: Math.random().toString(36),
                x: xPos,
                z: -100, // Spawn far away
                width: 2,
                height: 2,
                color: COLORS.obstacle
            }
        ]);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.neonBlue} />
      <directionalLight position={[0, 10, -5]} intensity={0.8} color={COLORS.neonPink} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Player */}
      <PlayerBike ref={playerRef} />

      {/* Obstacles */}
      {obstacles.map(obs => (
        <Obstacle key={obs.id} data={obs} />
      ))}

      {/* Moving Floor/Grid Effect */}
      <MovingGrid speed={status === GameStatus.PLAYING ? speedRef.current : 0} />
    </>
  );
};

// Helper for infinite grid illusion
const MovingGrid = ({ speed }: { speed: number }) => {
    const gridRef = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (gridRef.current) {
            gridRef.current.position.z += speed * 60 * delta;
            if (gridRef.current.position.z > 10) {
                gridRef.current.position.z = 0;
            }
        }
    });

    return (
        <group ref={gridRef} position={[0, -1, 0]}>
            <Grid 
                position={[0, 0, -50]} 
                args={[TRACK_WIDTH, 200]} 
                cellSize={2} 
                cellThickness={1} 
                cellColor={COLORS.neonBlue} 
                sectionSize={10} 
                sectionThickness={1.5} 
                sectionColor={COLORS.neonPink} 
                fadeDistance={80} 
            />
            {/* Floor reflection plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry args={[100, 200]} />
                <meshBasicMaterial color="#000" transparent opacity={0.8} />
            </mesh>
        </group>
    )
}