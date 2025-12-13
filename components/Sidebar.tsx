import React from 'react';
import { ApiRequest } from '../types';
import { History, Clock, ChevronRight, Trash2 } from 'lucide-react';

interface SidebarProps {
  history: ApiRequest[];
  onSelectHistory: (req: ApiRequest) => void;
  onClearHistory: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelectHistory, onClearHistory, isOpen }) => {
  if (!isOpen) return null;

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-64 bg-[#0f172a] border-r border-gray-700 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-200 font-semibold">
          <History size={18} />
          <span>History</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2 p-4 text-center">
            <Clock size={24} className="opacity-50" />
            <p className="text-sm">No history yet</p>
            <p className="text-xs">Send a request to see it here</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {history.slice().reverse().map((req) => (
              <button
                key={req.id} // History IDs should be unique
                onClick={() => onSelectHistory(req)}
                className="flex flex-col gap-1 p-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors text-left group relative"
              >
                <div className="flex items-center justify-between w-full">
                   <span className={`text-[10px] font-bold ${getMethodColor(req.method)}`}>{req.method}</span>
                   <span className="text-[10px] text-gray-600 font-mono">
                     {req.sentAt ? new Date(req.sentAt).toLocaleTimeString() : ''}
                   </span>
                </div>
                <div className="text-xs text-gray-300 truncate font-mono w-full" title={req.url}>
                  {req.url || '/'}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="text-gray-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
