import React, { useState, useEffect, useRef } from 'react';
import { ApiRequest, GlobalSettings, Environment } from './types';
import TabSystem from './components/TabSystem';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import SettingsModal from './components/SettingsModal';
import HomePanel from './components/HomePanel';
import HistoryModal from './components/HistoryModal';
import EnvironmentModal from './components/EnvironmentModal';
import CodeSnippetModal from './components/CodeSnippetModal';
import { Toast, ToastMessage } from './components/Toast';
import { generateId, keyValueToRecord, validateImportData, processVariables, generateCodeSnippet } from './utils';
import { Settings, Download, Upload, Loader2, Zap, Box, Clock } from 'lucide-react';

const DEFAULT_SETTINGS: GlobalSettings = {
  baseUrl: '',
  globalAuth: { type: 'none', token: '' },
  theme: 'dark',
  activeEnvironmentId: null,
};

const DEFAULT_REQUEST: ApiRequest = {
  id: '1',
  name: 'New Request',
  method: 'GET',
  url: '',
  params: [{ id: 'p1', key: '', value: '', enabled: true }],
  headers: [{ id: 'h1', key: '', value: '', enabled: true }],
  body: { type: 'none', content: '', formData: [{ id: 'fd1', key: '', value: '', enabled: true }] },
  auth: { type: 'none', token: '' },
  response: null,
};

function App() {
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string>('HOME');
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [history, setHistory] = useState<ApiRequest[]>([]);
  
  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('api-master-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRequests(parsed.requests || []);
        setActiveRequestId(parsed.activeRequestId || 'HOME');
        setSettings(parsed.settings || DEFAULT_SETTINGS);
        setEnvironments(parsed.environments || []);
        setHistory(parsed.history || []);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('api-master-state', JSON.stringify({ 
      requests, activeRequestId, settings, environments, history 
    }));
  }, [requests, activeRequestId, settings, environments, history]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ id: generateId(), message, type });
  };

  const activeRequest = requests.find(r => r.id === activeRequestId);
  const activeEnvironment = environments.find(e => e.id === settings.activeEnvironmentId);

  const handleRequestChange = (updated: ApiRequest) => {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const addNewTab = (template?: ApiRequest) => {
    const newId = generateId();
    const newReq: ApiRequest = template ? { ...template, id: newId, response: null } : {
      ...DEFAULT_REQUEST,
      id: newId,
      name: 'New Request',
      params: [{ id: generateId(), key: '', value: '', enabled: true }],
      headers: [{ id: generateId(), key: '', value: '', enabled: true }],
      body: { type: 'none', content: '', formData: [{ id: generateId(), key: '', value: '', enabled: true }] },
    };
    setRequests([...requests, newReq]);
    setActiveRequestId(newId);
  };

  const closeTab = (id: string) => {
    const newRequests = requests.filter(r => r.id !== id);
    setRequests(newRequests);
    
    if (activeRequestId === id) {
      if (newRequests.length > 0) {
        setActiveRequestId(newRequests[newRequests.length - 1].id);
      } else {
        setActiveRequestId('HOME');
      }
    }
  };

  const handleRename = (id: string, name: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, name } : r));
  };

  const processText = (text: string) => {
    if (!activeEnvironment) return text;
    return processVariables(text, activeEnvironment.variables);
  };

  const handleSend = async () => {
    if (!activeRequest) return;
    setLoading(true);
    setError(undefined);
    
    let rawUrl = processText(activeRequest.url);
    if (settings.baseUrl && !rawUrl.startsWith('http')) {
        const base = processText(settings.baseUrl).replace(/\/$/, '');
        const path = rawUrl.replace(/^\//, '');
        rawUrl = `${base}/${path}`;
    }
    
    let urlObj;
    try {
        urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`);
    } catch(e) {
        setError("Invalid URL format");
        setLoading(false);
        showToast("Invalid URL format", "error");
        return;
    }

    activeRequest.params.forEach(p => {
        if (p.enabled && p.key) urlObj.searchParams.append(processText(p.key), processText(p.value));
    });

    if (activeRequest.auth.type === 'none' && settings.globalAuth.type === 'api-key' && settings.globalAuth.addTo === 'query') {
        if (settings.globalAuth.keyName) {
            urlObj.searchParams.append(processText(settings.globalAuth.keyName), processText(settings.globalAuth.token));
        }
    }

    const headers: Record<string, string> = {};
    activeRequest.headers.forEach(h => {
        if (h.enabled && h.key) headers[processText(h.key)] = processText(h.value);
    });

    let token = '';
    let authType = 'none';
    if (activeRequest.auth.type !== 'none') {
        token = processText(activeRequest.auth.token);
        authType = activeRequest.auth.type;
        if (authType === 'api-key' && activeRequest.auth.addTo === 'header' && activeRequest.auth.keyName) {
             headers[processText(activeRequest.auth.keyName)] = token;
        } else if (authType === 'bearer') {
             headers['Authorization'] = `Bearer ${token}`;
        }
    } else if (settings.globalAuth.type !== 'none') {
        token = processText(settings.globalAuth.token);
        authType = settings.globalAuth.type;
         if (authType === 'api-key' && settings.globalAuth.addTo === 'header' && settings.globalAuth.keyName) {
             headers[processText(settings.globalAuth.keyName)] = token;
        } else if (authType === 'bearer') {
             headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let body: any = null;
    if (activeRequest.method !== 'GET' && activeRequest.method !== 'HEAD') {
      if (activeRequest.body.type === 'json') {
         headers['Content-Type'] = 'application/json';
         body = processText(activeRequest.body.content);
      } else if (activeRequest.body.type === 'text') {
         headers['Content-Type'] = 'text/plain';
         body = processText(activeRequest.body.content);
      } else if (activeRequest.body.type === 'form-data') {
         const formData = new FormData();
         if (activeRequest.body.formData) {
             activeRequest.body.formData.forEach(item => {
                 if (item.enabled && item.key) formData.append(processText(item.key), processText(item.value));
             });
         }
         body = formData;
         delete headers['Content-Type']; 
      } else if (activeRequest.body.type === 'x-www-form-urlencoded') {
         const params = new URLSearchParams();
         if (activeRequest.body.formData) {
             activeRequest.body.formData.forEach(item => {
                 if (item.enabled && item.key) params.append(processText(item.key), processText(item.value));
             });
         }
         headers['Content-Type'] = 'application/x-www-form-urlencoded';
         body = params;
      }
    }

    const startTime = performance.now();
    try {
      const res = await fetch(urlObj.toString(), {
        method: activeRequest.method,
        headers,
        body,
      });
      
      const endTime = performance.now();
      const text = await res.text();
      const time = Math.round(endTime - startTime);
      const size = new TextEncoder().encode(text).length;
      
      let formattedBody = text;
      try {
        formattedBody = JSON.stringify(JSON.parse(text), null, 2);
      } catch (e) { /* not json */ }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => { responseHeaders[key] = val; });

      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: formattedBody,
        size,
        time,
      };

      const updatedRequest = { ...activeRequest, response: responseData, sentAt: Date.now() };
      handleRequestChange(updatedRequest);

      setHistory(prev => {
          const newHistory = [...prev, updatedRequest];
          if (newHistory.length > 50) newHistory.shift(); 
          return newHistory;
      });

    } catch (err: any) {
       setError(err.message || 'Network Error');
       handleRequestChange({ ...activeRequest, response: null });
       showToast(err.message || "Network Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = () => {
     if (!activeRequest) return;
     let rawUrl = processText(activeRequest.url);
     if (settings.baseUrl && !rawUrl.startsWith('http')) {
        const base = processText(settings.baseUrl).replace(/\/$/, '');
        const path = rawUrl.replace(/^\//, '');
        rawUrl = `${base}/${path}`;
     }
     
     const snippet = generateCodeSnippet(activeRequest, rawUrl);
     setCurrentCodeSnippet(snippet);
     setIsCodeModalOpen(true);
  };

  const handleExport = () => {
    try {
        const exportData = {
          version: '1.1',
          exportedAt: new Date().toISOString(),
          activeRequestId,
          settings,
          requests,
          environments,
          history
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-master-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Data exported successfully", "success");
    } catch (e) {
        showToast("Failed to export data", "error");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jsonContent = ev.target?.result as string;
        const data = JSON.parse(jsonContent);
        
        if (validateImportData(data)) {
           setRequests(data.requests || []);
           setSettings(data.settings || DEFAULT_SETTINGS);
           setEnvironments(data.environments || []);
           setHistory(data.history || []);
           
           if (data.activeRequestId && data.requests.find((r: ApiRequest) => r.id === data.activeRequestId)) {
               setActiveRequestId(data.activeRequestId);
           } else {
               setActiveRequestId('HOME');
           }
           showToast(`Import Successful`, "success");
        } else {
           showToast("Invalid JSON file.", "error");
        }
      } catch (err) {
        showToast("Failed to parse JSON file", "error");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Top Header */}
      <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4 bg-[#0f172a] shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveRequestId('HOME')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {loading ? <Loader2 className="animate-spin text-white" size={18} /> : <Zap className="text-white fill-current" size={18} />}
                </div>
                <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text hidden md:block">
                    API Master
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Environment Selector */}
           <div className="flex items-center gap-2 mr-2">
              <select 
                value={settings.activeEnvironmentId || ''}
                onChange={(e) => setSettings({ ...settings, activeEnvironmentId: e.target.value || null })}
                className="bg-gray-800 border border-gray-700 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 max-w-[150px] transition-colors"
              >
                  <option value="">No Environment</option>
                  {environments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button 
                  onClick={() => setIsEnvModalOpen(true)} 
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400 transition-colors"
                  title="Manage Environments"
              >
                  <Box size={14} />
              </button>
           </div>

           <div className="h-5 w-px bg-gray-700 mx-1"></div>

           <div className="flex items-center gap-1 bg-gray-800/50 p-1 rounded-lg border border-gray-700">
                <button 
                  onClick={() => setIsHistoryOpen(true)} 
                  className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors" 
                  title="History"
                >
                    <Clock size={18} />
                </button>

                <label className="p-2 hover:bg-gray-700 rounded-md cursor-pointer text-gray-400 hover:text-white transition-colors" title="Import JSON">
                    <input ref={fileInputRef} type="file" className="hidden" accept=".json" onChange={handleImport} />
                    <Upload size={18} />
                </label>
                
                <button onClick={handleExport} className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors" title="Export JSON">
                    <Download size={18} />
                </button>
                
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors" title="Global Settings">
                    <Settings size={18} />
                </button>
           </div>
        </div>
      </div>

      {/* Main Layout (No Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
             {/* Tabs */}
            <TabSystem
                requests={requests}
                activeRequestId={activeRequestId}
                onSelect={setActiveRequestId}
                onClose={closeTab}
                onNew={() => addNewTab()}
                onRename={handleRename}
                onHome={() => setActiveRequestId('HOME')}
            />

            {/* Main Workspace (Split View OR Home) */}
            <div className="flex-1 flex overflow-hidden relative">
                {activeRequestId === 'HOME' ? (
                <HomePanel 
                    onNewRequest={() => addNewTab()}
                    onImport={() => fileInputRef.current?.click()}
                    onSettings={() => setIsSettingsOpen(true)}
                />
                ) : (
                <>
                    {activeRequest ? (
                        <div className="flex-1 flex flex-col md:flex-row w-full h-full">
                            {/* Left: Request Config */}
                            <div className="flex-1 md:w-1/2 flex flex-col border-r border-gray-700 min-w-[300px]">
                            <RequestPanel
                                request={activeRequest}
                                globalSettings={settings}
                                onChange={handleRequestChange}
                                onSend={handleSend}
                                onGenerateCode={handleGenerateCode}
                                loading={loading}
                            />
                            </div>

                            {/* Right: Response */}
                            <div className="flex-1 md:w-1/2 flex flex-col min-w-[300px] h-1/2 md:h-full border-t md:border-t-0 border-gray-700 bg-[#1e293b]">
                            <ResponsePanel
                                response={activeRequest.response}
                                loading={loading}
                                error={error}
                            />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <button onClick={() => setActiveRequestId('HOME')} className="text-blue-400 hover:underline">Return Home</button>
                        </div>
                    )}
                </>
                )}
            </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
      
      <EnvironmentModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        environments={environments}
        setEnvironments={setEnvironments}
        activeEnvId={settings.activeEnvironmentId}
        setActiveEnvId={(id) => setSettings({ ...settings, activeEnvironmentId: id })}
      />
      
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={(req) => addNewTab(req)}
        onClearHistory={() => setHistory([])}
      />

      <CodeSnippetModal 
         isOpen={isCodeModalOpen}
         onClose={() => setIsCodeModalOpen(false)}
         code={currentCodeSnippet}
         title="Generated Code (cURL)"
      />
    </div>
  );
}

export default App;
