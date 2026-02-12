import React from 'react';

interface StudentInputAreaProps {
  type: 'lined' | 'english-notebook';
  rows?: number;
  className?: string;
}

export const StudentInputArea: React.FC<StudentInputAreaProps> = ({ type, rows = 3, className = '' }) => {
  if (type === 'english-notebook') {
    return (
      <div className={`mt-3 space-y-4 p-3 ${className}`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="relative h-10 w-full">
            <div className="absolute top-0 w-full border-t border-gray-400"></div>
            <div className="absolute top-1/2 w-full border-t border-dashed border-red-400"></div>
            <div className="absolute bottom-0 w-full border-t border-gray-400"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'lined') {
    return (
      <div className={`mt-3 space-y-8 p-3 ${className}`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="w-full border-b border-slate-400 h-6"></div>
        ))}
      </div>
    );
  }

  return null;
};
