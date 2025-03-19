import React, { useState, useEffect } from 'react';
import { RankingEntry } from '../types';
import { RANKING_STORAGE_KEY } from '../utils/constants';

interface RankingDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore?: number;
  timeSpent?: number;
}

const RankingDisplay: React.FC<RankingDisplayProps> = ({ isOpen, onClose, currentScore, timeSpent }) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedRankings = localStorage.getItem(RANKING_STORAGE_KEY);
      if (savedRankings) {
        setRankings(JSON.parse(savedRankings));
      }
    }
  }, [isOpen]);

  const saveRanking = () => {
    if (!playerName.trim() || !currentScore || !timeSpent) return;

    const newRanking: RankingEntry = {
      playerName: playerName.trim(),
      score: currentScore,
      date: new Date().toISOString(),
      timeSpent,
    };

    const updatedRankings = [...rankings, newRanking]
      .sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent)
      .slice(0, 10); // Keep only top 10

    setRankings(updatedRankings);
    localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(updatedRankings));
    setPlayerName('');
    onClose();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setPlayerName(rankings[index].playerName);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (editingIndex === null || !playerName.trim()) return;

    const updatedRankings = rankings.map((rank, index) =>
      index === editingIndex ? { ...rank, playerName: playerName.trim() } : rank
    );

    setRankings(updatedRankings);
    localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(updatedRankings));
    setIsEditing(false);
    setEditingIndex(null);
    setPlayerName('');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Ranking</h2>
        
        {!isEditing && currentScore !== undefined && (
          <div className="mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
              disabled
            />
            <button
              onClick={saveRanking}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Score
            </button>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Name</th>
                <th className="text-left">Score</th>
                <th className="text-left">Time</th>
                <th className="text-left">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, index) => (
                <tr key={index} className="border-b">
                  <td>{index + 1}</td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-20 p-1 border rounded"
                        disabled
                      />
                    ) : (
                      rank.playerName
                    )}
                  </td>
                  <td>{rank.score}</td>
                  <td>{formatTime(rank.timeSpent)}</td>
                  <td>{new Date(rank.date).toLocaleDateString()}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RankingDisplay; 