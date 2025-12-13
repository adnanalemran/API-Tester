import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div 
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl border z-50 animate-in slide-in-from-right-10 duration-300 ${
      toast.type === 'success' 
        ? 'bg-emerald-900/95 border-emerald-700 text-emerald-50' 
        : 'bg-red-900/95 border-red-700 text-red-50'
    }`}>
      {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</span>
        <span className="text-xs opacity-90">{toast.message}</span>
      </div>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
