import React, { useState, useMemo } from 'react';
import { ResponseData } from '../types';
import { formatBytes } from '../utils';
import { Copy, Check, Search, AlertCircle, Download, Clock, Database, FileText, Code, Eye } from 'lucide-react';

interface ResponsePanelProps {
  response: ResponseData | null;
  loading: boolean;
  error?: string;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, loading, error }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'preview'>('body');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!response?.body) return;
    const blob = new Blob([response.body], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const highlightJson = (json: string) => {
    if (!json) return '';
    try {
        const str = json
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
        return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-amber-300'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-blue-300'; // key
                } else {
                    cls = 'text-emerald-300'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-purple-300'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-gray-500'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        });
    } catch (e) {
        return json;
    }
  };

  const highlightedBody = useMemo(() => {
    if (!response?.body) return null;
    if (activeTab !== 'body') return null;
    return highlightJson(response.body);
  }, [response?.body, activeTab]);

  const contentType = useMemo(() => {
     if (!response) return '';
     return Object.keys(response.headers).find(k => k.toLowerCase() === 'content-type') 
            ? response.headers[Object.keys(response.headers).find(k => k.toLowerCase() === 'content-type')!] 
            : '';
  }, [response]);

  const isImage = contentType.includes('image');
  const isHtml = contentType.includes('html');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e293b] text-gray-400 flex-col gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <div className="text-center">
            <p className="font-medium text-gray-300">Sending Request...</p>
            <p className="text-xs text-gray-500 mt-1">Waiting for response</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-[#1e293b] text-red-400 p-8 text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-100">Request Failed</h3>
              <p className="text-red-300/70 max-w-md">{error}</p>
          </div>
      )
  }

  if (!response) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e293b] text-gray-500 p-8 text-center">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
           <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to send</h3>
        <p className="text-sm max-w-xs mx-auto">Enter the URL and click Send to get a response</p>
      </div>
    );
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  
  return (
    <div className="h-full flex flex-col bg-[#1e293b] text-gray-100 border-l border-gray-700">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#0f172a] shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-md ${isSuccess ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
            <span className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {response.status} {response.statusText}
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="text-xs text-gray-400 flex gap-4">
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-500"/> <span className="text-gray-200 font-mono">{response.time}ms</span></span>
            <span className="flex items-center gap-1.5"><Database size={12} className="text-gray-500"/> <span className="text-gray-200 font-mono">{formatBytes(response.size)}</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
             <button onClick={handleDownload} className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors" title="Download Response">
                 <Download size={16} />
             </button>
             <button onClick={handleCopy} className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors" title="Copy Body">
                 {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 px-4 gap-4 text-sm bg-[#1e293b]">
        <button
          onClick={() => setActiveTab('body')}
          className={`py-3 relative flex items-center gap-2 ${activeTab === 'body' ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Code size={14} /> Body
          {activeTab === 'body' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-3 relative flex items-center gap-2 ${activeTab === 'preview' ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Eye size={14} /> Preview
          {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`py-3 relative flex items-center gap-2 ${activeTab === 'headers' ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <FileText size={14} /> Headers
          {activeTab === 'headers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
      </div>

       {/* Search Bar for Body */}
       {activeTab === 'body' && (
           <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2 bg-[#1e293b]">
               <Search size={14} className="text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search in response..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-transparent border-none text-xs text-white focus:ring-0 w-full focus:outline-none placeholder-gray-600"
               />
           </div>
       )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#1e293b]">
        {activeTab === 'body' && (
          <pre 
            className="font-mono text-xs leading-5 text-gray-300 whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: highlightedBody || response.body || '' }}
          />
        )}
        
        {activeTab === 'preview' && (
            <div className="h-full w-full bg-white rounded-md overflow-hidden">
                {isImage ? (
                    <div className="flex items-center justify-center h-full bg-gray-900">
                        <img src={response.url /* You might need to pass the URL or base64 */} alt="Response Preview" className="max-w-full max-h-full" />
                    </div>
                ) : (
                    <iframe 
                      srcDoc={response.body || ''} 
                      className="w-full h-full border-none" 
                      title="Response Preview"
                      sandbox="allow-scripts"
                    />
                )}
            </div>
        )}

        {activeTab === 'headers' && (
          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
            {Object.entries(response.headers).map(([key, value]) => (
              <React.Fragment key={key}>
                <div className="font-medium text-gray-400 text-right">{key}</div>
                <div className="text-gray-200 break-all font-mono text-xs flex items-center">{value}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
