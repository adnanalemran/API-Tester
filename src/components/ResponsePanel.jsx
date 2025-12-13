import React, { useState, useRef } from 'react';
import { RESPONSE_TABS } from '../constants';
import { formatBytes, getStatusColor, formatError, formatResponseData } from '../utils/responseUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Search, X } from 'lucide-react';

/**
 * ResponsePanel component - displays response data
 * @param {Object} props
 * @param {Object} props.request - Request object
 */
export const ResponsePanel = ({ request }) => {
  const [activeResponseTab, setActiveResponseTab] = useState(RESPONSE_TABS.RESPONSE);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const responseRef = useRef(null);

  const renderResponseHeaders = () => {
    const headers = request.response?.headers || 
                   request.error?.response?.headers || null;

    if (!headers) {
      return <div className="text-muted-foreground">No headers</div>;
    }

    return (
      <div className="space-y-2">
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex items-start space-x-4 py-2 border-b">
            <div className="font-semibold w-48">{key}</div>
            <div className="flex-1 text-muted-foreground break-words">
              {Array.isArray(value) ? value.join(', ') : value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleCopy = () => {
    const textToCopy = request.response 
      ? formatResponseData(request.response.data)
      : request.error 
        ? formatError(request.error)
        : '';
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    try {
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      );
    } catch (e) {
      return text;
    }
  };

  const renderResponseBody = () => {
    if (request.loading) {
      return <div className="text-muted-foreground">Sending request...</div>;
    }

    if (request.error) {
      const errorText = formatError(request.error);
      return (
        <div 
          ref={responseRef}
          className="whitespace-pre-wrap text-foreground bg-muted p-4 rounded-md font-mono text-sm"
        >
          {searchTerm ? highlightText(errorText, searchTerm) : errorText}
        </div>
      );
    }

    if (request.response) {
      const responseData = formatResponseData(request.response.data);
      return (
        <div 
          ref={responseRef}
          className="whitespace-pre-wrap text-foreground bg-muted p-4 rounded-md font-mono text-sm"
        >
          {searchTerm ? highlightText(responseData, searchTerm) : responseData}
        </div>
      );
    }

    return <div className="text-muted-foreground">Click "Send" to make a request</div>;
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex border-b">
        <button
          onClick={() => setActiveResponseTab(RESPONSE_TABS.RESPONSE)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeResponseTab === RESPONSE_TABS.RESPONSE
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Response
        </button>
        <button
          onClick={() => setActiveResponseTab(RESPONSE_TABS.HEADERS)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeResponseTab === RESPONSE_TABS.HEADERS
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Headers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeResponseTab === RESPONSE_TABS.RESPONSE && (
          <div>
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                {request.response ? (
                  <span className={cn("px-3 py-1 rounded text-sm font-semibold", getStatusColor(request.response.status))}>
                    {request.response.status}
                  </span>
                ) : request.error ? (
                  <span className="px-3 py-1 rounded text-sm font-semibold bg-destructive text-destructive-foreground">
                    Error
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded text-sm font-semibold bg-muted text-muted-foreground">-</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm text-muted-foreground">
                  {request.responseTime ? `${request.responseTime}ms` : '-'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Size:</span>
                <span className="text-sm text-muted-foreground">
                  {request.response 
                    ? formatBytes(JSON.stringify(request.response.data).length) 
                    : '-'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSearch(!showSearch)}
                    className="h-8"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Find
                  </Button>
                </div>
              </div>
              {showSearch && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search in response..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 h-8"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchTerm('');
                      setShowSearch(false);
                    }}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="code-block min-h-[400px]">
                {renderResponseBody()}
              </div>
            </div>
          </div>
        )}

        {activeResponseTab === RESPONSE_TABS.HEADERS && (
          renderResponseHeaders()
        )}
      </div>
    </div>
  );
};

