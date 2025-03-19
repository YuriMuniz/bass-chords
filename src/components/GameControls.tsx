import React, { useState } from 'react';
import { Play, Square, RotateCw, Check, Trophy } from 'lucide-react';
import { GameState, FretboardState } from '../types';
import { bassStrings } from '../utils/bassNotes';

interface GameControlsProps {
  onStartGame: (time: number) => void;
  onStopGame: () => void;
  onPlayNote: () => void;
  onConfirmAnswer: () => void;
  onShowRanking: () => void;
  gameState: GameState;
  fretboardState: FretboardState;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStartGame,
  onStopGame,
  onPlayNote,
  onConfirmAnswer,
  onShowRanking,
  gameState,
  fretboardState,
}) => {
  const [selectedTime, setSelectedTime] = useState(120);
  const timeOptions = [
    { value: 10, label: '10 segundos' },
    { value: 20, label: '20 segundos' },
    { value: 30, label: '30 segundos' },
    { value: 60, label: '1 minuto' },
    { value: 120, label: '2 minutos' },
    { value: 180, label: '3 minutos' },
    { value: 300, label: '5 minutos' },
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!gameState.isPlaying) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onStartGame(selectedTime)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Play className="w-5 h-5" />
            <span>Iniciar Jogo</span>
          </button>
          <button
            onClick={onShowRanking}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            <span>Ranking</span>
          </button>
        </div>
      </div>
    );
  }

  const hasSelection = fretboardState.selectedPositions.length > 0;
  const hasCompleteSelection = fretboardState.selectedPositions.length === fretboardState.targetPositions;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
        {fretboardState.currentNote && (
          <div className="text-center">
            <div>
              Encontre a nota {fretboardState.currentNote} em {fretboardState.targetPositions} {fretboardState.targetPositions === 1 ? 'posição' : 'posições'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Selecionadas: {fretboardState.selectedPositions.length} de {fretboardState.targetPositions}
            </div>
            {fretboardState.isCorrect !== null && fretboardState.selectedPositions.length > 0 && (
              <div className="text-sm text-gray-600 mt-2">
                Notas selecionadas: {fretboardState.selectedPositions.map((pos, index) => (
                  <span key={index} className={`inline-flex items-center justify-center px-2 py-1 mx-1 rounded ${
                    bassStrings[pos.stringIndex].notes[pos.fretIndex - 1].note === fretboardState.currentNote
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                    {index + 1}º: {bassStrings[pos.stringIndex].notes[pos.fretIndex - 1].note}
                  </span>
                ))}
              </div>
            )}
            {fretboardState.isCorrect !== null && (
              <div className={`text-sm mt-2 font-medium ${fretboardState.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {fretboardState.isCorrect ? '✓ Correto!' : '✗ Incorreto!'}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-800 text-sm sm:text-base">
          Tempo: <span className="font-bold text-blue-600">{formatTime(gameState.timeLeft)}</span>
        </div>

        <button
          onClick={onPlayNote}
          disabled={!fretboardState.currentNote}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base
            ${fretboardState.currentNote 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Tocar Som</span>
        </button>

        {hasSelection && hasCompleteSelection && fretboardState.isCorrect === null && (
          <button
            onClick={onConfirmAnswer}
            className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Check className="w-5 h-5" />
            <span>Confirmar Resposta</span>
          </button>
        )}

        <button
          onClick={onStopGame}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <Square className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Parar</span>
        </button>

        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-800 text-sm sm:text-base">
          Pontuação: <span className="font-bold text-green-600">{gameState.score}</span> / <span className="text-gray-600">{gameState.total}</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;