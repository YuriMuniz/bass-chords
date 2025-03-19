import React from 'react';
import { RankingEntry } from '../types';

interface RankingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Ranking: React.FC<RankingProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const ranking: RankingEntry[] = JSON.parse(localStorage.getItem('bassRanking') || '[]');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleNameEdit = (index: number) => {
    const entry = ranking[index];
    const newName = prompt('Digite o novo nome:', entry.playerName);
    if (newName) {
      ranking[index] = { ...entry, playerName: newName };
      localStorage.setItem('bassRanking', JSON.stringify(ranking));
      // Force re-render
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Ranking</h2>
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="p-2">Posição</th>
                <th className="p-2">Nome</th>
                <th className="p-2">Pontuação</th>
                <th className="p-2">Data</th>
                <th className="p-2">Tempo</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-center">{index + 1}º</td>
                  <td className="p-2">{entry.playerName}</td>
                  <td className="p-2 text-center">{entry.score}</td>
                  <td className="p-2">{formatDate(entry.date)}</td>
                  <td className="p-2">{entry.timeSpent}s</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleNameEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Ranking; 