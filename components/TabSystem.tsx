import React, { useState } from 'react';
import { ApiRequest } from '../types';
import { X, Plus, Home } from 'lucide-react';

interface TabSystemProps {
  requests: ApiRequest[];
  activeRequestId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, newName: string) => void;
  onHome: () => void;
}

const TabSystem: React.FC<TabSystemProps> = ({
  requests,
  activeRequestId,
  onSelect,
  onClose,
  onNew,
  onRename,
  onHome,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleDoubleClick = (req: ApiRequest) => {
    setEditingId(req.id);
    setEditName(req.name);
  };

  const handleNameBlur = () => {
    if (editingId) {
      onRename(editingId, editName || 'Untitled Request');
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'PATCH': return 'text-orange-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const isHomeActive = activeRequestId === 'HOME';

  return (
    <div className="flex items-end w-full bg-[#0f172a] border-b border-gray-700 pt-2 px-2 overflow-x-auto no-scrollbar gap-1">
      {/* Home Tab */}
      <button
        onClick={onHome}
        className={`
           flex items-center justify-center h-9 px-3 rounded-t-lg transition-all border-t border-l border-r mb-[-1px] z-10
           ${isHomeActive 
             ? 'bg-[#1e293b] border-gray-600 text-blue-400 border-b-[#1e293b]' 
             : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50'}
        `}
        title="Home Dashboard"
      >
        <Home size={16} />
      </button>

      {/* Request Tabs */}
      {requests.map((req) => {
        const isActive = req.id === activeRequestId;
        return (
          <div
            key={req.id}
            onClick={() => onSelect(req.id)}
            className={`
              group flex items-center min-w-[140px] max-w-[220px] h-9 px-3 rounded-t-lg cursor-pointer select-none text-sm transition-all border-t border-l border-r mb-[-1px] z-10
              ${isActive 
                ? 'bg-[#1e293b] border-gray-600 text-gray-100 border-b-[#1e293b] shadow-sm' 
                : 'bg-transparent border-transparent text-gray-500 hover:bg-[#1e293b]/30 hover:text-gray-300'}
            `}
          >
            <span className={`text-[10px] font-bold mr-2 w-8 tracking-wider ${getMethodColor(req.method)}`}>{req.method.substring(0, 4)}</span>
            
            {editingId === req.id ? (
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-white w-full h-full p-0 text-xs"
              />
            ) : (
              <span 
                className="truncate flex-1 text-xs font-medium"
                onDoubleClick={() => handleDoubleClick(req)}
                title={req.name}
              >
                {req.name}
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(req.id);
              }}
              className={`ml-2 p-0.5 rounded-md hover:bg-gray-700/80 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      
      {/* New Tab Button */}
      <button
        onClick={onNew}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-1 mb-0.5"
        title="New Request"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default TabSystem;
