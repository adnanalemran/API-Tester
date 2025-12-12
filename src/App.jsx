import React, { useState } from 'react';
import { useRequests } from './hooks/useRequests';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { RequestTab } from './components/RequestTab';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { SettingsModal } from './components/SettingsModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  } = useRequests();

  const { settings: globalSettings, updateSettings } = useGlobalSettings();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-screen">
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
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            title="Global Settings"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addNewRequest}
            aria-label="Add new request"
          >
            + New Request
          </Button>
        </div>
      </header>

      {/* Request Tabs */}
      <div className="flex border-b bg-muted/50 overflow-x-auto">
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

