import React, { useState, useRef } from 'react';
import { useRequests } from './hooks/useRequests';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { RequestTab } from './components/RequestTab';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { SettingsModal } from './components/SettingsModal';
import { CustomTitleBar } from './components/CustomTitleBar';
import { Button } from '@/components/ui/button';
import { Settings, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportToJSON, downloadJSON, readJSONFile, validateImportData } from './utils/exportImportUtils';

/**
 * Main App component
 */
function App() {
  const {
    requests,
    activeRequestId,
    activeRequest,
    setActiveRequestId,
    addNewRequest,
    closeRequest,
    updateRequest,
    renameRequest,
    importRequests,
  } = useRequests();

  const { settings: globalSettings, updateSettings } = useGlobalSettings();
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      const jsonData = exportToJSON(requests, globalSettings, activeRequestId);
      const filename = `api-tester-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(jsonData, filename);
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJSONFile(file);
      const validation = validateImportData(data);

      if (!validation.isValid) {
        alert(`Import failed:\n${validation.errors.join('\n')}`);
        return;
      }

      // Import requests
      if (data.requests && data.requests.length > 0) {
        // Pass the activeRequestId from export to restore the active tab
        importRequests(data.requests, data.activeRequestId ?? null);
      }

      // Import global settings if present
      if (data.globalSettings) {
        updateSettings(data.globalSettings);
      }

      alert(`Successfully imported ${data.requests?.length || 0} request(s)`);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Custom Title Bar */}
      <CustomTitleBar />
      {/* Header */}
      <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">API Tester</h1>
          <span className="text-sm text-muted-foreground">v1.0.0</span>
          {(globalSettings.baseUrl || globalSettings.useGlobalToken) && (
            <div className="flex items-center space-x-2 text-xs">
              {globalSettings.baseUrl && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                  Base: {globalSettings.baseUrl}
                </span>
              )}
              {globalSettings.useGlobalToken && (
                <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-md">
                  Global Token
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            aria-label="Export requests"
            title="Export all requests"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Import requests"
            title="Import requests from JSON"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            title="Global Settings"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Request Tabs */}
      <div className="flex border-b bg-muted/50 overflow-x-auto">
        {/* New Request Button - Chrome style at the beginning */}
        <button
          onClick={addNewRequest}
          aria-label="Add new request"
          className="h-auto px-4 py-2 rounded-none border-b-2 border-transparent hover:bg-muted/50 hover:border-primary/50 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="New Request"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="flex flex-1 min-w-0">
          {requests.map((request) => (
            <RequestTab
              key={request.id}
              request={request}
              isActive={request.id === activeRequestId}
              onSelect={setActiveRequestId}
              onClose={closeRequest}
              onRename={renameRequest}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Request Panel */}
        <div className="flex-1 flex flex-col border-r bg-background">
          {activeRequest && (
            <RequestPanel
              request={activeRequest}
              onUpdate={updateRequest}
              globalSettings={globalSettings}
            />
          )}
        </div>
        {/* Response Panel */}
        {activeRequest && (
          <ResponsePanel request={activeRequest} />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={globalSettings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;

