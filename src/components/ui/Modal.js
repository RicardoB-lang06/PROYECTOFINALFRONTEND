'use client';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-900 transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}