import React from 'react';
import { GameState, GameStatus } from '../types';

interface UIOverlayProps {
  gameState: GameState;
  commentary: string;
  onStart: () => void;
  onRestart: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, commentary, onStart, onRestart }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top HUD */}
      <div className="flex justify-between items-start w-full">
        <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-neonBlue p-4 rounded-br-3xl skew-x-[-10deg]">
            <h1 className="text-neonBlue text-2xl font-bold italic skew-x-[10deg]">NEON RIDER</h1>
            <div className="text-white text-sm skew-x-[10deg] opacity-80">SCORE: {Math.floor(gameState.score)}</div>
        </div>

        {/* AI Commentary Box */}
        <div className="pointer-events-auto max-w-xs md:max-w-md bg-black/50 backdrop-blur-md border-l-4 border-neonPink p-4 rounded-r-md">
            <div className="text-neonPink text-xs font-bold uppercase tracking-widest mb-1">Race Commentary AI</div>
            <p className="text-white text-sm md:text-base font-light animate-pulse">
                "{commentary}"
            </p>
        </div>
      </div>

      {/* Center Menus */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        
        {gameState.status === GameStatus.MENU && (
          <div className="bg-black/80 border-2 border-neonBlue p-8 rounded-xl text-center backdrop-blur-lg shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPink mb-6">
              READY?
            </h1>
            <p className="text-gray-300 mb-8">Use <span className="text-neonBlue font-bold">[Arrow Keys]</span> or <span className="text-neonBlue font-bold">[A/D]</span> to dodge.</p>
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-neonBlue text-black font-bold text-xl uppercase rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_#00f3ff]"
            >
              Initialize Race
            </button>
          </div>
        )}

        {gameState.status === GameStatus.GAME_OVER && (
          <div className="bg-black/90 border-2 border-red-500 p-8 rounded-xl text-center backdrop-blur-lg shadow-[0_0_50px_rgba(255,0,0,0.4)]">
            <h2 className="text-6xl font-black text-red-500 mb-2">CRASHED</h2>
            <p className="text-xl text-white mb-6">FINAL SCORE: {Math.floor(gameState.score)}</p>
            <button 
              onClick={onRestart}
              className="px-8 py-4 bg-red-600 text-white font-bold text-xl uppercase rounded hover:bg-red-500 hover:scale-105 transition-all"
            >
              Reboot System
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls (Visible only on touch) */}
      <div className="lg:hidden flex justify-between w-full pb-8 pointer-events-auto">
         <button 
            className="w-20 h-20 bg-white/10 border border-white/30 rounded-full active:bg-neonBlue/50 active:border-neonBlue text-white text-3xl backdrop-blur-sm"
            onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
            onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
         >
            ←
         </button>
         <button 
            className="w-20 h-20 bg-white/10 border border-white/30 rounded-full active:bg-neonBlue/50 active:border-neonBlue text-white text-3xl backdrop-blur-sm"
            onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
            onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))}
         >
            →
         </button>
      </div>
    </div>
  );
};