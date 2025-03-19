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

export interface GameState {
  isPlaying: boolean;
  score: number;
  total: number;
}