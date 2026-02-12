import React from 'react';
import { SavedWorksheet } from '../types';

interface SavedWorksheetsPanelProps {
  worksheets: SavedWorksheet[];
  onLoad: (worksheet: SavedWorksheet) => void;
  onDelete: (id: number) => void;
}

export const SavedWorksheetsPanel: React.FC<SavedWorksheetsPanelProps> = ({ worksheets, onLoad, onDelete }) => {
  if (worksheets.length === 0) {
    return null; // Don't show anything if there are no saved worksheets
  }

  return (
    <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Saved Worksheets</h2>
      {worksheets.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {worksheets.map((ws) => (
            <div key={ws.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-semibold text-slate-800">{ws.word}</p>
                <p className="text-sm text-slate-500">Level {ws.level}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onLoad(ws)}
                  className="px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
                  aria-label={`Load worksheet for ${ws.word}`}
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(ws.id)}
                  className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                  aria-label={`Delete worksheet for ${ws.word}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">You have no saved worksheets yet. Generate one and click "Save Worksheet" to see it here.</p>
      )}
    </div>
  );
};
