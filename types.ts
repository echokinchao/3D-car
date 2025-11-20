export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface GameState {
  status: GameStatus;
  score: number;
  speed: number;
  commentary: string;
}

export interface ObstacleData {
  id: string;
  x: number;
  z: number;
  width: number;
  height: number;
  color: string;
}

export interface Keys {
  left: boolean;
  right: boolean;
}