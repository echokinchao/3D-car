import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GameScene } from './components/GameScene';
import { UIOverlay } from './components/UIOverlay';
import { GameState, GameStatus } from './types';
import { generateRaceCommentary } from './services/geminiService';

const INITIAL_STATE: GameState = {
  status: GameStatus.MENU,
  score: 0,
  speed: 0,
  commentary: "Welcome to Neon Rider 3000. System Online.",
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [commentary, setCommentary] = useState<string>(INITIAL_STATE.commentary);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);

  const handleStart = () => {
    setGameState({
      status: GameStatus.PLAYING,
      score: 0,
      speed: 20,
      commentary: "Race initialized. Good luck, rider.",
    });
    fetchCommentary("Race Start");
  };

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState((prev) => ({
      ...prev,
      status: GameStatus.GAME_OVER,
      score: finalScore,
      speed: 0,
    }));
    fetchCommentary("Crash/Game Over", finalScore);
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setGameState((prev) => ({ ...prev, score: newScore }));
    if (newScore > 0 && newScore % 1000 === 0) {
        fetchCommentary("Milestone Reached", newScore);
    }
  }, []);

  const fetchCommentary = async (event: string, score?: number) => {
    if (isGeneratingInfo) return;
    setIsGeneratingInfo(true);
    try {
      const text = await generateRaceCommentary(event, score || 0);
      setCommentary(text);
    } catch (error) {
      console.error("Commentary system offline:", error);
    } finally {
      setIsGeneratingInfo(false);
    }
  };

  return (
    <div className="w-full h-screen relative bg-darkBg">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <color attach="background" args={['#050510']} />
          <fog attach="fog" args={['#050510', 10, 50]} />
          <GameScene 
            status={gameState.status} 
            onGameOver={handleGameOver} 
            onScoreUpdate={handleScoreUpdate}
          />
        </Canvas>
      </div>

      {/* UI Layer */}
      <UIOverlay 
        gameState={gameState} 
        commentary={commentary}
        onStart={handleStart}
        onRestart={handleStart}
      />
    </div>
  );
};

export default App;