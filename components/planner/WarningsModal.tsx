import React from "react";

interface Props {
  warnings: string[];
  onClose: () => void;
  onProceed: () => void;
}

export default function WarningsModal({ warnings, onClose, onProceed }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#3a3428] rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-2">Schedule Warnings</h3>
            <p className="text-white/80 text-sm mb-4">Some places on your route may be closed when you arrive:</p>
          </div>
        </div>
        <div className="bg-[#5d4e37] rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
          <ul className="space-y-2">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-white text-sm flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-[#8b6f47] text-white rounded-lg hover:bg-[#9d7f57]">
            Adjust Route
          </button>
          <button onClick={onProceed} className="flex-1 px-4 py-3 bg-[#d4af37] text-[#3a3428] rounded-lg hover:bg-[#e5bf47]">
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
