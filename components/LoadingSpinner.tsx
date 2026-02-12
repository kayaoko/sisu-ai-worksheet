
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10 p-8">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold text-lg">Generating your worksheet...</p>
        <p className="text-slate-500 text-sm">This may take a moment.</p>
    </div>
  );
};
