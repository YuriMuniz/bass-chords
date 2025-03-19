import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { bassStrings } from './utils/bassNotes';
import Fretboard from './components/Fretboard';
import GameControls from './components/GameControls';
import RankingDisplay from './components/RankingDisplay';
import { FretboardState, GameState, RankingEntry } from './types';
import { RANKING_STORAGE_KEY } from './utils/constants';

function App() {
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [showRanking, setShowRanking] = useState(false);
  
  const [fretboardState, setFretboardState] = useState<FretboardState>({
    selectedPositions: [],
    isCorrect: null,
    currentNote: null,
    targetPositions: 0,
  });

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    total: 0,
    timeLeft: 120, // valor padrão
  });

  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();
      
    setSynth(newSynth);
    
    return () => {
      newSynth.dispose();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      handleGameOver();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  const generateRandomNote = () => {
    const allPositions = bassStrings.flatMap((string, stringIndex) => 
      string.notes.map((note, fretIndex) => ({
        note: note.note,
        stringIndex,
        fretIndex: fretIndex + 1,
      }))
    );

    const targetPositions = Math.floor(Math.random() * 3) + 1;
    const noteIndex = Math.floor(Math.random() * allPositions.length);
    const selectedNote = allPositions[noteIndex].note;

    return { note: selectedNote, targetPositions };
  };

  const handleGameOver = useCallback(() => {
    const playerNameInput = prompt('Digite seu nome para salvar a pontuação:');
    if (playerNameInput) {
      const ranking = JSON.parse(localStorage.getItem(RANKING_STORAGE_KEY) || '[]');
      const newEntry = {
        playerName: playerNameInput,
        score: gameState.score,
        date: new Date().toISOString(),
        timeSpent: 120 - gameState.timeLeft // Corrigindo para mostrar o tempo gasto
      };
      
      ranking.push(newEntry);
      ranking.sort((a: RankingEntry, b: RankingEntry) => b.score - a.score);
      localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(ranking));
    }
    
    stopGame();
  }, [gameState.score, gameState.timeLeft]);

  const startGame = (selectedTime: number) => {
    const { note, targetPositions } = generateRandomNote();
    setGameState({
      isPlaying: true,
      score: 0,
      total: 0,
      timeLeft: selectedTime
    });
    setFretboardState({
      selectedPositions: [],
      isCorrect: null,
      currentNote: note,
      targetPositions,
    });
  };

  const stopGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      timeLeft: prev.timeLeft // Manter o último tempo selecionado
    }));
    setFretboardState({
      selectedPositions: [],
      isCorrect: null,
      currentNote: null,
      targetPositions: 0,
    });
  };

  const playNoteSound = async (stringIndex: number, fretIndex: number) => {
    if (!synth) return;
    await Tone.start();
    const frequency = bassStrings[stringIndex].notes[fretIndex - 1].frequency;
    synth.triggerAttackRelease(frequency, '8n');
  };

  const handlePlayNote = async () => {
    if (!fretboardState.currentNote || !synth) return;
    await Tone.start();
    
    for (const string of bassStrings) {
      const noteData = string.notes.find(n => n.note === fretboardState.currentNote);
      if (noteData) {
        synth.triggerAttackRelease(noteData.frequency, '8n');
        break;
      }
    }
  };

  const handleNoteClick = async (stringIndex: number, fretIndex: number) => {
    await playNoteSound(stringIndex, fretIndex);

    if (!gameState.isPlaying) return;

    setFretboardState(prev => {
      const existingSelectionIndex = prev.selectedPositions.findIndex(
        pos => pos.stringIndex === stringIndex && pos.fretIndex === fretIndex
      );

      let newSelectedPositions;
      if (existingSelectionIndex >= 0) {
        // Remove a seleção se já estiver selecionada
        newSelectedPositions = prev.selectedPositions.filter((_, index) => index !== existingSelectionIndex);
      } else if (prev.selectedPositions.length < prev.targetPositions) {
        // Adiciona nova seleção se ainda não atingiu o limite
        newSelectedPositions = [...prev.selectedPositions, { stringIndex, fretIndex }];
      } else {
        // Substitui a primeira seleção se já atingiu o limite
        newSelectedPositions = [...prev.selectedPositions.slice(1), { stringIndex, fretIndex }];
      }

      return {
        ...prev,
        selectedPositions: newSelectedPositions,
        isCorrect: null,
      };
    });
  };

  const handleConfirmAnswer = () => {
    if (fretboardState.selectedPositions.length === 0) return;

    const selectedNotes = fretboardState.selectedPositions.map(pos => 
      bassStrings[pos.stringIndex].notes[pos.fretIndex - 1].note
    );

    const isCorrect = selectedNotes.every(note => note === fretboardState.currentNote) && 
                     selectedNotes.length === fretboardState.targetPositions;

    setGameState(prev => ({
      ...prev,
      total: prev.total + 1,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setFretboardState(prev => ({
      ...prev,
      isCorrect,
    }));

    setTimeout(() => {
      const { note, targetPositions } = generateRandomNote();
      setFretboardState({
        selectedPositions: [],
        isCorrect: null,
        currentNote: note,
        targetPositions,
      });
    }, 1500);
  };

  const handleShowRanking = () => {
    setShowRanking(true);
  };

  const handleCloseRanking = () => {
    setShowRanking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="max-w-[90rem] mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 overflow-x-auto">
          <Fretboard
            strings={bassStrings}
            fretboardState={fretboardState}
            onNoteClick={handleNoteClick}
            showAllNotes={!gameState.isPlaying}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
          <div className="max-w-6xl mx-auto p-4">
            <GameControls
              onStartGame={startGame}
              onStopGame={stopGame}
              onPlayNote={handlePlayNote}
              onConfirmAnswer={handleConfirmAnswer}
              onShowRanking={handleShowRanking}
              gameState={gameState}
              fretboardState={fretboardState}
            />
          </div>
        </div>

        <RankingDisplay
          isOpen={showRanking}
          onClose={handleCloseRanking}
          currentScore={gameState.score}
          timeSpent={gameState.timeLeft}
        />
      </div>
    </div>
  );
}

export default App;