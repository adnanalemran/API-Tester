import React, { useState } from 'react';
import { useRequests } from './hooks/useRequests';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { RequestTab } from './components/RequestTab';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { SettingsModal } from './components/SettingsModal';

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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">API Tester</h1>
          <span className="text-sm text-gray-500">v1.0.0</span>
          {(globalSettings.baseUrl || globalSettings.useGlobalToken) && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {globalSettings.baseUrl && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Base: {globalSettings.baseUrl}
                </span>
              )}
              {globalSettings.useGlobalToken && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  Global Token
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary text-sm"
            aria-label="Open settings"
            title="Global Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <button
            onClick={addNewRequest}
            className="btn-secondary text-sm"
            aria-label="Add new request"
          >
            + New Request
          </button>
        </div>
      </header>

      {/* Request Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
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
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
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

