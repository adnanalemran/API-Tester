import React from 'react';
import { GlobalSettings, AuthType } from '../types';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  onSave: (settings: GlobalSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof GlobalSettings>(field: K, value: GlobalSettings[K]) => {
    onSave({ ...settings, [field]: value });
  };

  const handleAuthChange = <K extends keyof GlobalSettings['globalAuth']>(field: K, value: GlobalSettings['globalAuth'][K]) => {
    onSave({ ...settings, globalAuth: { ...settings.globalAuth, [field]: value } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-lg shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Global Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Base URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Base URL</label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="https://api.example.com"
              className="w-full bg-[#0f172a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">This URL will be prepended to all request paths that don't start with http/https.</p>
          </div>

          {/* Global Auth */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
             <h3 className="text-sm font-bold text-white">Global Authentication</h3>
             
             <div className="space-y-2">
               <label className="text-sm text-gray-400">Type</label>
               <select
                 value={settings.globalAuth.type}
                 onChange={(e) => handleAuthChange('type', e.target.value as AuthType)}
                 className="w-full bg-[#0f172a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
               >
                 <option value="none">None</option>
                 <option value="bearer">Bearer Token</option>
                 <option value="api-key">API Key</option>
               </select>
             </div>

             {settings.globalAuth.type === 'bearer' && (
               <div className="space-y-2">
                 <label className="text-sm text-gray-400">Token</label>
                 <input
                   type="password"
                   value={settings.globalAuth.token}
                   onChange={(e) => handleAuthChange('token', e.target.value)}
                   className="w-full bg-[#0f172a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                 />
               </div>
             )}

             {settings.globalAuth.type === 'api-key' && (
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm text-gray-400">Key Name</label>
                   <input
                     type="text"
                     value={settings.globalAuth.keyName || ''}
                     onChange={(e) => handleAuthChange('keyName', e.target.value)}
                     className="w-full bg-[#0f172a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm text-gray-400">Value</label>
                   <input
                     type="password"
                     value={settings.globalAuth.token}
                     onChange={(e) => handleAuthChange('token', e.target.value)}
                     className="w-full bg-[#0f172a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                   />
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;