import React from 'react';
import { ApiRequest } from '../types';
import { X, Clock, ChevronRight, Trash2, Search } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ApiRequest[];
  onSelectHistory: (req: ApiRequest) => void;
  onClearHistory: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, onClose, history, onSelectHistory, onClearHistory 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

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

  const filteredHistory = history.filter(h => 
    h.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-lg h-[80vh] rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0f172a]">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Clock size={20} />
            <span>Request History</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-3 border-b border-gray-700 bg-[#1e293b] flex gap-2">
            <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search history..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
            </div>
            {history.length > 0 && (
                <button 
                    onClick={onClearHistory}
                    className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-md text-sm transition-colors flex items-center gap-2"
                >
                    <Trash2 size={14} /> Clear
                </button>
            )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-8 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <Clock size={32} className="opacity-50" />
              </div>
              <div>
                  <p className="font-medium">No history yet</p>
                  <p className="text-sm mt-1">Sent requests will appear here automatically.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-800">
              {filteredHistory.slice().reverse().map((req) => (
                <button
                  key={req.id + req.sentAt} 
                  onClick={() => {
                      onSelectHistory(req);
                      onClose();
                  }}
                  className="flex flex-col gap-1 p-4 hover:bg-gray-800/50 transition-colors text-left group relative"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                     <div className="flex items-center gap-2">
                         <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 ${getMethodColor(req.method)}`}>
                             {req.method}
                         </span>
                         <span className="text-xs text-gray-400 font-mono">
                           {req.sentAt ? new Date(req.sentAt).toLocaleTimeString() : ''}
                         </span>
                     </div>
                  </div>
                  <div className="text-sm text-gray-200 truncate font-mono w-[90%]" title={req.url}>
                    {req.url || '/'}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
