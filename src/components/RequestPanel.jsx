import React, { useState } from 'react';
import { HTTP_METHODS, REQUEST_TABS } from '../constants';
import { TokenSection } from './TokenSection';
import { ParamsTab } from './ParamsTab';
import { HeadersTab } from './HeadersTab';
import { BodyTab } from './BodyTab';
import { useRequestSender } from '../hooks/useRequestSender';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center space-x-2 mb-3">
          <Select value={request.method} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-32 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map(method => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={request.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={getUrlPlaceholder()}
            className="flex-1"
          />
          <Button
            onClick={sendRequest}
            disabled={request.loading}
          >
            {request.loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
        {globalSettings.baseUrl && (
          <div className="mb-2 text-xs text-muted-foreground">
            Base URL: <span className="font-mono">{globalSettings.baseUrl}</span>
          </div>
        )}
        <TokenSection request={request} onUpdate={onUpdate} globalSettings={globalSettings} />
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-background">
        <button
          onClick={() => setActiveTab(REQUEST_TABS.PARAMS)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeTab === REQUEST_TABS.PARAMS
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Params
        </button>
        <button
          onClick={() => setActiveTab(REQUEST_TABS.HEADERS)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeTab === REQUEST_TABS.HEADERS
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveTab(REQUEST_TABS.BODY)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeTab === REQUEST_TABS.BODY
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
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

