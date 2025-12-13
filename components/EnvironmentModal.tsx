import React, { useState } from 'react';
import { Environment, KeyValueItem } from '../types';
import { X, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { generateId } from '../utils';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  environments: Environment[];
  setEnvironments: (envs: Environment[]) => void;
  activeEnvId: string | null;
  setActiveEnvId: (id: string | null) => void;
}

const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ 
  isOpen, onClose, environments, setEnvironments, activeEnvId, setActiveEnvId 
}) => {
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddEnv = () => {
    const newEnv: Environment = {
      id: generateId(),
      name: 'New Environment',
      variables: [{ id: generateId(), key: 'baseUrl', value: 'https://api.example.com', enabled: true }]
    };
    setEnvironments([...environments, newEnv]);
    setEditingEnvId(newEnv.id);
  };

  const handleDeleteEnv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEnvironments(environments.filter(env => env.id !== id));
    if (activeEnvId === id) setActiveEnvId(null);
    if (editingEnvId === id) setEditingEnvId(null);
  };

  const updateEnv = (id: string, updates: Partial<Environment>) => {
    setEnvironments(environments.map(env => env.id === id ? { ...env, ...updates } : env));
  };

  const updateVariable = (envId: string, varIndex: number, field: keyof KeyValueItem, value: any) => {
    const env = environments.find(e => e.id === envId);
    if (!env) return;
    
    const newVars = [...env.variables];
    newVars[varIndex] = { ...newVars[varIndex], [field]: value };
    
    if (varIndex === newVars.length - 1 && (newVars[varIndex].key || newVars[varIndex].value)) {
        newVars.push({ id: generateId(), key: '', value: '', enabled: true });
    }

    updateEnv(envId, { variables: newVars });
  };

  const removeVariable = (envId: string, varIndex: number) => {
      const env = environments.find(e => e.id === envId);
      if (!env) return;
      const newVars = env.variables.filter((_, i) => i !== varIndex);
      if (newVars.length === 0) newVars.push({ id: generateId(), key: '', value: '', enabled: true });
      updateEnv(envId, { variables: newVars });
  };

  const editingEnv = environments.find(e => e.id === editingEnvId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0f172a]">
          <h2 className="text-lg font-bold text-white">Manage Environments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar List */}
          <div className="w-1/3 border-r border-gray-700 bg-[#0f172a] flex flex-col">
            <div className="p-3">
              <button 
                onClick={handleAddEnv}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Plus size={16} /> New Environment
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
               <div 
                 className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-800 ${activeEnvId === null && !editingEnvId ? 'bg-gray-800 border-l-2 border-blue-500' : ''}`}
                 onClick={() => { setActiveEnvId(null); setEditingEnvId(null); }}
               >
                 <span className="text-sm font-medium text-gray-300">No Environment</span>
                 {activeEnvId === null && <Check size={16} className="text-green-500" />}
               </div>
               
               {environments.map(env => (
                 <div 
                   key={env.id}
                   className={`p-3 cursor-pointer flex items-center justify-between group hover:bg-gray-800 border-b border-gray-800 ${editingEnvId === env.id ? 'bg-[#1e293b]' : ''}`}
                   onClick={() => setEditingEnvId(env.id)}
                 >
                   <div className="flex flex-col">
                     <span className={`text-sm font-medium ${activeEnvId === env.id ? 'text-green-400' : 'text-gray-200'}`}>
                        {env.name}
                     </span>
                     <span className="text-xs text-gray-500">{env.variables.length - 1} variables</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      {activeEnvId === env.id && <div className="text-[10px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">Active</div>}
                      <button 
                        onClick={(e) => handleDeleteEnv(env.id, e)}
                        className="p-1.5 hover:bg-red-900/50 text-gray-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Main Edit Area */}
          <div className="flex-1 bg-[#1e293b] flex flex-col">
             {editingEnv ? (
               <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-[#1e293b]">
                     <input 
                       type="text" 
                       value={editingEnv.name}
                       onChange={(e) => updateEnv(editingEnv.id, { name: e.target.value })}
                       className="bg-transparent text-xl font-bold text-white focus:outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                     />
                     
                     <button 
                       onClick={() => setActiveEnvId(editingEnv.id)}
                       disabled={activeEnvId === editingEnv.id}
                       className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeEnvId === editingEnv.id ? 'bg-green-600 text-white cursor-default' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                     >
                       {activeEnvId === editingEnv.id ? 'Active' : 'Set Active'}
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                     <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase">
                        <div></div>
                        <div>Variable</div>
                        <div>Initial Value</div>
                        <div></div>
                     </div>
                     
                     {editingEnv.variables.map((v, idx) => (
                       <div key={v.id} className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2 items-center group">
                          <input 
                            type="checkbox" 
                            checked={v.enabled}
                            onChange={(e) => updateVariable(editingEnv.id, idx, 'enabled', e.target.checked)}
                            className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-0"
                          />
                          <input 
                            type="text" 
                            value={v.key}
                            placeholder="Key"
                            onChange={(e) => updateVariable(editingEnv.id, idx, 'key', e.target.value)}
                            className="bg-[#0f172a] border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                          />
                          <input 
                            type="text" 
                            value={v.value}
                            placeholder="Value"
                            onChange={(e) => updateVariable(editingEnv.id, idx, 'value', e.target.value)}
                            className="bg-[#0f172a] border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                          />
                          <button 
                            onClick={() => removeVariable(editingEnv.id, idx)}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                     <Edit2 size={24} />
                  </div>
                  <p>Select an environment to edit</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentModal;
