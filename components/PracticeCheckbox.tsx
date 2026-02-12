
import React, { useState } from 'react';

export const PracticeCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`w-8 h-8 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 ${
        checked ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-400 hover:border-indigo-400'
      }`}
    >
      {checked && (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      )}
    </div>
  );
};
