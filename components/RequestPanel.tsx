import React, { useState, useEffect } from 'react';
import { ApiRequest, HttpMethod, KeyValueItem, BodyType, AuthType, GlobalSettings } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Eye, EyeOff, Play, Save, GripVertical, Code } from 'lucide-react';

interface RequestPanelProps {
  request: ApiRequest;
  globalSettings: GlobalSettings;
  onChange: (updated: ApiRequest) => void;
  onSend: () => void;
  onGenerateCode: () => void;
  loading: boolean;
}

const RequestPanel: React.FC<RequestPanelProps> = ({ request, globalSettings, onChange, onSend, onGenerateCode, loading }) => {
  const [activeTab, setActiveTab] = useState<'params' | 'auth' | 'headers' | 'body'>('params');

  const updateField = <K extends keyof ApiRequest>(field: K, value: ApiRequest[K]) => {
    onChange({ ...request, [field]: value });
  };

  const handleKeyValueChange = (
    list: KeyValueItem[],
    onChangeList: (l: KeyValueItem[]) => void,
    index: number,
    field: keyof KeyValueItem,
    value: any
  ) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    if (index === newList.length - 1 && (newList[index].key || newList[index].value)) {
      newList.push({ id: generateId(), key: '', value: '', enabled: true });
    }
    onChangeList(newList);
  };

  const removeKeyValue = (list: KeyValueItem[], onChangeList: (l: KeyValueItem[]) => void, index: number) => {
    const newList = list.filter((_, i) => i !== index);
    if (newList.length === 0) newList.push({ id: generateId(), key: '', value: '', enabled: true });
    onChangeList(newList);
  };

  useEffect(() => {
    if (request.params.length === 0) updateField('params', [{ id: generateId(), key: '', value: '', enabled: true }]);
    if (request.headers.length === 0) updateField('headers', [{ id: generateId(), key: '', value: '', enabled: true }]);
    if (!request.body.formData || request.body.formData.length === 0) {
       updateField('body', { ...request.body, formData: [{ id: generateId(), key: '', value: '', enabled: true }]});
    }
  }, []);

  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const KeyValueEditor = ({ items, onChangeItems }: { items: KeyValueItem[], onChangeItems: (items: KeyValueItem[]) => void }) => (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase select-none">
        <div className="text-center"></div>
        <div>Key</div>
        <div>Value</div>
        <div></div>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 group items-center">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleKeyValueChange(items, onChangeItems, index, 'enabled', e.target.checked)}
              className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
            />
          </div>
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => handleKeyValueChange(items, onChangeItems, index, 'key', e.target.value)}
            className="bg-[#0f172a] border border-gray-700 rounded px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none transition-colors text-gray-200 placeholder-gray-600"
          />
          <div className="relative">
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) => handleKeyValueChange(items, onChangeItems, index, 'value', e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none transition-colors text-gray-200 placeholder-gray-600"
              />
              {/* Variable highlighting hint could go here */}
          </div>
          <button
            onClick={() => removeKeyValue(items, onChangeItems, index)}
            className="flex items-center justify-center text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#1e293b] text-gray-100">
      {/* URL Bar */}
      <div className="p-4 border-b border-gray-700 flex gap-2 shadow-sm z-10 bg-[#1e293b]">
        <select
          value={request.method}
          onChange={(e) => updateField('method', e.target.value as HttpMethod)}
          className="bg-[#0f172a] border border-gray-600 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
          style={{
            color: request.method === 'GET' ? '#4ade80' : 
                   request.method === 'POST' ? '#60a5fa' : 
                   request.method === 'DELETE' ? '#f87171' : '#fbbf24'
          }}
        >
          {methods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        <div className="flex-1 flex relative group">
          <input
            type="text"
            value={request.url}
            onChange={(e) => updateField('url', e.target.value)}
            placeholder={globalSettings.baseUrl ? `Enter path (Base: ${globalSettings.baseUrl})` : "https://api.example.com/v1/users"}
            className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          onClick={onGenerateCode}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          title="Generate Code"
        >
           <Code size={18} />
        </button>

        <button
          onClick={onSend}
          disabled={loading}
          className={`
            bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/20'}
          `}
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play size={16} fill="currentColor" />}
          Send
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 px-4 gap-6 text-sm bg-[#1e293b]">
        {(['params', 'auth', 'headers', 'body'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 relative capitalize font-medium transition-colors ${activeTab === tab ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {tab}
            {tab === 'params' && request.params.filter(p => p.key).length > 0 && <span className="ml-2 text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{request.params.filter(p => p.key).length}</span>}
            {tab === 'headers' && request.headers.filter(p => p.key).length > 0 && <span className="ml-2 text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{request.headers.filter(p => p.key).length}</span>}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_6px_rgba(59,130,246,0.5)]" />}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#1e293b]">
        
        {/* Params Editor */}
        {activeTab === 'params' && (
          <KeyValueEditor 
            items={request.params} 
            onChangeItems={(items) => updateField('params', items)} 
          />
        )}

        {/* Headers Editor */}
        {activeTab === 'headers' && (
           <KeyValueEditor 
             items={request.headers} 
             onChangeItems={(items) => updateField('headers', items)} 
           />
        )}

        {/* Body Editor */}
        {activeTab === 'body' && (
          <div className="h-full flex flex-col">
            <div className="flex flex-wrap gap-4 mb-4 text-xs">
              {(['none', 'json', 'text', 'form-data', 'x-www-form-urlencoded'] as BodyType[]).map((t) => (
                 <label key={t} className="flex items-center gap-2 cursor-pointer group">
                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${request.body.type === t ? 'border-blue-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                      {request.body.type === t && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                   </div>
                   <input
                     type="radio"
                     name="bodyType"
                     className="hidden"
                     checked={request.body.type === t}
                     onChange={() => updateField('body', { ...request.body, type: t })}
                   />
                   <span className={`uppercase font-medium ${request.body.type === t ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`}>
                     {t === 'x-www-form-urlencoded' ? 'x-www-form' : t.replace('-', ' ')}
                   </span>
                 </label>
              ))}
            </div>
            
            {request.body.type === 'none' && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                   <EyeOff size={24} className="opacity-50" />
                </div>
                <span className="text-sm">No body content</span>
              </div>
            )}

            {(request.body.type === 'json' || request.body.type === 'text') && (
              <div className="flex-1 flex flex-col relative group">
                <textarea
                  value={request.body.content}
                  onChange={(e) => updateField('body', { ...request.body, content: e.target.value })}
                  className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none text-gray-200 leading-relaxed custom-scrollbar"
                  placeholder={request.body.type === 'json' ? "{\n  \"key\": \"value\"\n}" : "Enter text here..."}
                  spellCheck={false}
                />
                 {request.body.type === 'json' && (
                  <button 
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(request.body.content);
                        updateField('body', { ...request.body, content: JSON.stringify(parsed, null, 2) });
                      } catch(e) { /* ignore */ }
                    }}
                    className="absolute top-3 right-3 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2 py-1.5 rounded text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Prettify JSON
                  </button>
                )}
              </div>
            )}

            {(request.body.type === 'form-data' || request.body.type === 'x-www-form-urlencoded') && (
                <div className="flex-1 flex flex-col">
                  <div className="p-3 mb-2 bg-blue-900/10 border border-blue-900/30 rounded text-xs text-blue-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {request.body.type === 'form-data' 
                      ? 'Multipart Form Data' 
                      : 'URL Encoded Form Data'}
                  </div>
                  <KeyValueEditor 
                    items={request.body.formData || []}
                    onChangeItems={(items) => updateField('body', { ...request.body, formData: items })}
                  />
                </div>
            )}
          </div>
        )}

        {/* Auth Editor */}
        {activeTab === 'auth' && (
          <div className="flex flex-col gap-6 max-w-xl mx-auto mt-4">
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-gray-300">Authorization Type</label>
               <select
                 value={request.auth.type}
                 onChange={(e) => updateField('auth', { ...request.auth, type: e.target.value as AuthType })}
                 className="bg-[#0f172a] border border-gray-700 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
               >
                 <option value="none">No Auth</option>
                 <option value="bearer">Bearer Token</option>
                 <option value="api-key">API Key</option>
               </select>
            </div>

            {request.auth.type === 'bearer' && (
               <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                 <label className="text-sm font-medium text-gray-300">Token</label>
                 <div className="relative">
                   <input
                     type="password"
                     value={request.auth.token}
                     onChange={(e) => updateField('auth', { ...request.auth, token: e.target.value })}
                     placeholder="Bearer Token"
                     className="w-full bg-[#0f172a] border border-gray-700 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                   />
                 </div>
               </div>
            )}

            {request.auth.type === 'api-key' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-300">Key</label>
                   <input
                     type="text"
                     value={request.auth.keyName || ''}
                     onChange={(e) => updateField('auth', { ...request.auth, keyName: e.target.value })}
                     placeholder="Key (e.g. X-API-Key)"
                     className="bg-[#0f172a] border border-gray-700 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                   />
                  </div>
                  <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-300">Value</label>
                   <input
                     type="password"
                     value={request.auth.token}
                     onChange={(e) => updateField('auth', { ...request.auth, token: e.target.value })}
                     placeholder="Value"
                     className="bg-[#0f172a] border border-gray-700 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                   />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Add To</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="authAddTo"
                        checked={request.auth.addTo !== 'query'} 
                        onChange={() => updateField('auth', { ...request.auth, addTo: 'header' })}
                        className="text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                      />
                      <span className="text-sm text-gray-300">Header</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="authAddTo"
                        checked={request.auth.addTo === 'query'} 
                        onChange={() => updateField('auth', { ...request.auth, addTo: 'query' })}
                        className="text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                      />
                      <span className="text-sm text-gray-300">Query Params</span>
                    </label>
                  </div>
                </div>
               </div>
            )}
             <div className="p-3 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-400 flex gap-2">
               <div className="mt-0.5">ℹ️</div>
               <div>Global auth settings can be configured in the main settings menu. Per-request auth overrides global settings.</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;
