export interface Note {
  note: string;
  frequency: number;
  position: number;
}

export interface StringData {
  openNote: string;
  notes: Note[];
}

export interface FretboardState {
  selectedPositions: Array<{
    stringIndex: number;
    fretIndex: number;
  }>;
  isCorrect: boolean | null;
  currentNote: string | null;
  targetPositions: number;
}

export interface RankingEntry {
  playerName: string;
  score: number;
  date: string;
  timeSpent: number;  // tempo gasto em segundos
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  total: number;
  timeLeft: number;  // em segundos
  playerName: string;
}

export interface GameControlsProps {
  onStartGame: (time: number) => void;
  onStopGame: () => void;
  onPlayNote: () => void;
  onConfirmAnswer: () => void;
  onShowRanking: () => void;
  gameState: GameState;
  fretboardState: FretboardState;
}