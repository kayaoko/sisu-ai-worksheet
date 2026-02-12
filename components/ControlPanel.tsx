
import React from 'react';
import { Level } from '../types';

interface ControlPanelProps {
  word: string;
  setWord: (word: string) => void;
  level: Level;
  setLevel: (level: Level) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ word, setWord, level, setLevel, onGenerate, isLoading }) => {
  const levels: Level[] = [Level.L1, Level.L2, Level.L3, Level.L4];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="word-input" className="block text-sm font-medium text-slate-700 mb-1">
            Enter an English Word
          </label>
          <input
            id="word-input"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g., 'serendipity'"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || !word.trim()}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Worksheet'}
        </button>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Level
        </label>
        <div className="flex space-x-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              disabled={isLoading}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                level === l
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              } disabled:opacity-50`}
            >
              Level {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
