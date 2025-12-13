import React from 'react';
import { Plus, Upload, Settings, Zap, Shield, Globe, Code, Database, Layout } from 'lucide-react';

interface HomePanelProps {
  onNewRequest: () => void;
  onImport: () => void;
  onSettings: () => void;
  recentRequests?: any[]; // For future use
}

const HomePanel: React.FC<HomePanelProps> = ({ onNewRequest, onImport, onSettings }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0f172a] text-white custom-scrollbar">
      <div className="max-w-5xl mx-auto px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 ring-1 ring-blue-500/20">
             <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 text-transparent bg-clip-text">
            API Client Master
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A professional-grade HTTP client for testing, debugging, and documenting your APIs with speed and precision.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <button 
            onClick={onNewRequest}
            className="group relative p-8 bg-[#1e293b] hover:bg-[#253248] border border-gray-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 text-left hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus size={100} />
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">New Request</h3>
            <p className="text-sm text-gray-400">Start a fresh HTTP request from scratch to test endpoints.</p>
          </button>

          <button 
            onClick={onImport}
            className="group relative p-8 bg-[#1e293b] hover:bg-[#253248] border border-gray-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 text-left hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Upload size={100} />
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Import Collection</h3>
            <p className="text-sm text-gray-400">Load requests from a JSON file to restore your workspace.</p>
          </button>

          <button 
            onClick={onSettings}
            className="group relative p-8 bg-[#1e293b] hover:bg-[#253248] border border-gray-700 hover:border-purple-500/50 rounded-2xl transition-all duration-300 text-left hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings size={100} />
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Configure</h3>
            <p className="text-sm text-gray-400">Set global authentication, base URLs, and preferences.</p>
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureItem 
            icon={<Globe className="text-cyan-400" />}
            title="All Methods Supported"
            desc="GET, POST, PUT, PATCH, DELETE support with full control over headers and params."
          />
          <FeatureItem 
            icon={<Shield className="text-amber-400" />}
            title="Authentication"
            desc="Built-in support for Bearer Tokens and API Keys with global override capabilities."
          />
          <FeatureItem 
            icon={<Code className="text-pink-400" />}
            title="JSON & Form Data"
            desc="Advanced editor for JSON bodies and full support for Multipart/Form-Data."
          />
           <FeatureItem 
            icon={<Database className="text-indigo-400" />}
            title="Response Analysis"
            desc="Detailed breakdown of status, timing, size, and headers with syntax highlighting."
          />
           <FeatureItem 
            icon={<Layout className="text-teal-400" />}
            title="Tabbed Interface"
            desc="Manage multiple requests simultaneously with a Chrome-like tab system."
          />
           <FeatureItem 
            icon={<Upload className="text-orange-400" />}
            title="Import / Export"
            desc="Save your workspace and share it with your team easily via JSON."
          />
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>API Client Master v1.0.0 &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
    <div className="shrink-0 mt-1 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-200 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default HomePanel;
