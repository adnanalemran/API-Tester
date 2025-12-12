import React, { useState } from 'react';
import { HTTP_METHODS, REQUEST_TABS } from '../constants';
import { TokenSection } from './TokenSection';
import { ParamsTab } from './ParamsTab';
import { HeadersTab } from './HeadersTab';
import { BodyTab } from './BodyTab';
import { useRequestSender } from '../hooks/useRequestSender';

/**
 * RequestPanel component - main request configuration panel
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 * @param {Object} props.globalSettings - Global settings (base URL, global token)
 */
export const RequestPanel = ({ request, onUpdate, globalSettings = {} }) => {
  const [activeTab, setActiveTab] = useState(REQUEST_TABS.PARAMS);
  const sendRequest = useRequestSender(request, onUpdate, globalSettings);
  
  const getUrlPlaceholder = () => {
    if (globalSettings.baseUrl) {
      return `Relative path (e.g., /users) or full URL`;
    }
    return 'https://api.example.com/users';
  };

  const handleMethodChange = (method) => {
    onUpdate(request.id, { method });
  };

  const handleUrlChange = (url) => {
    onUpdate(request.id, { url });
  };

  return (
    <>
      {/* Request Method and URL */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={request.method}
            onChange={(e) => handleMethodChange(e.target.value)}
            className="input-field w-32 font-semibold"
          >
            {HTTP_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <input
            type="text"
            value={request.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={getUrlPlaceholder()}
            className="input-field flex-1"
          />
          <button
            onClick={sendRequest}
            disabled={request.loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {request.loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {globalSettings.baseUrl && (
          <div className="mb-2 text-xs text-gray-500">
            Base URL: <span className="font-mono">{globalSettings.baseUrl}</span>
          </div>
        )}
        <TokenSection request={request} onUpdate={onUpdate} globalSettings={globalSettings} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab(REQUEST_TABS.PARAMS)}
          className={`tab-btn px-6 py-3 text-sm font-medium ${
            activeTab === REQUEST_TABS.PARAMS
              ? 'text-gray-700 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Params
        </button>
        <button
          onClick={() => setActiveTab(REQUEST_TABS.HEADERS)}
          className={`tab-btn px-6 py-3 text-sm font-medium ${
            activeTab === REQUEST_TABS.HEADERS
              ? 'text-gray-700 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveTab(REQUEST_TABS.BODY)}
          className={`tab-btn px-6 py-3 text-sm font-medium ${
            activeTab === REQUEST_TABS.BODY
              ? 'text-gray-700 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Body
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === REQUEST_TABS.PARAMS && (
          <ParamsTab request={request} onUpdate={onUpdate} />
        )}
        {activeTab === REQUEST_TABS.HEADERS && (
          <HeadersTab request={request} onUpdate={onUpdate} />
        )}
        {activeTab === REQUEST_TABS.BODY && (
          <BodyTab request={request} onUpdate={onUpdate} />
        )}
      </div>
    </>
  );
};

