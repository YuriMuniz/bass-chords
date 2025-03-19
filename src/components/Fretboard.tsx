import React from 'react';
import { StringData, FretboardState } from '../types';
import { Music } from 'lucide-react';

interface FretboardProps {
  strings: StringData[];
  fretboardState: FretboardState;
  onNoteClick: (stringIndex: number, fretIndex: number) => void;
  showAllNotes: boolean;
}

const Fretboard: React.FC<FretboardProps> = ({ 
  strings, 
  fretboardState, 
  onNoteClick,
  showAllNotes 
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center overflow-y-auto">
        <div className="w-full h-full flex items-center justify-center">
          <div className="transform scale-[0.6] md:scale-[0.85] lg:scale-100 origin-center">
            <div className="min-w-[1200px]">
              <div className="relative p-8">
                {strings.map((string, stringIndex) => (
                  <div
                    key={stringIndex}
                    className="flex items-center border-b-[3px] border-gray-400 h-16"
                  >
                    <div className="w-12 h-full flex items-center justify-center bg-gray-100">
                      <Music className="w-6 h-6 text-gray-600" />
                    </div>
                    {string.notes.map((note, fretIndex) => {
                      const currentFret = fretIndex + 1;
                      const isSelected = fretboardState.selectedPositions.some(
                        pos => pos.stringIndex === stringIndex && pos.fretIndex === currentFret
                      );
                      const showFeedback = isSelected && fretboardState.isCorrect !== null;
                      const selectionIndex = fretboardState.selectedPositions.findIndex(
                        pos => pos.stringIndex === stringIndex && pos.fretIndex === currentFret
                      );

                      return (
                        <button
                          key={fretIndex}
                          type="button"
                          onClick={() => onNoteClick(stringIndex, currentFret)}
                          className={`
                            relative flex-1 h-full min-w-[80px] border-r-2 border-gray-400
                            flex items-center justify-center cursor-pointer
                            hover:bg-gray-100 transition-colors
                            ${isSelected ? 'bg-blue-100' : ''}
                            ${showFeedback && fretboardState.isCorrect ? 'bg-green-100' : ''}
                            ${showFeedback && !fretboardState.isCorrect ? 'bg-red-100' : ''}
                          `}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {(showAllNotes || showFeedback || (isSelected && fretboardState.isCorrect !== null)) && (
                              <span className="text-sm font-medium">
                                {note.note}
                              </span>
                            )}
                          </div>

                          {/* Indicador de ordem de seleção */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center shadow-md">
                              {selectionIndex + 1}
                            </div>
                          )}

                          {/* Feedback de acerto/erro com a nota */}
                          {showFeedback && (
                            <div className={`
                              absolute bottom-1 left-1 px-2 py-1 rounded text-xs font-medium
                              ${fretboardState.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                            `}>
                              {note.note}
                            </div>
                          )}

                          {currentFret === 3 || currentFret === 5 || currentFret === 7 || currentFret === 9 && (
                            <div className="absolute -top-2 w-full flex justify-center">
                              <div className="w-4 h-4 rounded-full bg-gray-300" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fretboard;