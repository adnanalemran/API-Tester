import React, { useState } from 'react';
import { RESPONSE_TABS } from '../constants';
import { formatBytes, getStatusColor, formatError, formatResponseData } from '../utils/responseUtils';

/**
 * ResponsePanel component - displays response data
 * @param {Object} props
 * @param {Object} props.request - Request object
 */
export const ResponsePanel = ({ request }) => {
  const [activeResponseTab, setActiveResponseTab] = useState(RESPONSE_TABS.RESPONSE);

  const renderResponseHeaders = () => {
    const headers = request.response?.headers || 
                   request.error?.response?.headers || null;

    if (!headers) {
      return <div className="text-gray-500">No headers</div>;
    }

    return (
      <div className="space-y-2">
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex items-start space-x-4 py-2 border-b border-gray-200">
            <div className="font-semibold text-gray-700 w-48">{key}</div>
            <div className="flex-1 text-gray-600 break-words">
              {Array.isArray(value) ? value.join(', ') : value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResponseBody = () => {
    if (request.loading) {
      return <div className="text-gray-400">Sending request...</div>;
    }

    if (request.error) {
      return (
        <pre className="whitespace-pre-wrap text-red-400">
          {formatError(request.error)}
        </pre>
      );
    }

    if (request.response) {
      return (
        <pre className="whitespace-pre-wrap">
          {formatResponseData(request.response.data)}
        </pre>
      );
    }

    return <div className="text-gray-500">Click "Send" to make a request</div>;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveResponseTab(RESPONSE_TABS.RESPONSE)}
          className={`response-tab-btn px-6 py-3 text-sm font-medium ${
            activeResponseTab === RESPONSE_TABS.RESPONSE
              ? 'text-gray-700 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Response
        </button>
        <button
          onClick={() => setActiveResponseTab(RESPONSE_TABS.HEADERS)}
          className={`response-tab-btn px-6 py-3 text-sm font-medium ${
            activeResponseTab === RESPONSE_TABS.HEADERS
              ? 'text-gray-700 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Headers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeResponseTab === RESPONSE_TABS.RESPONSE && (
          <div>
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                {request.response ? (
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(request.response.status)}`}>
                    {request.response.status}
                  </span>
                ) : request.error ? (
                  <span className="px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-800">
                    Error
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded text-sm font-semibold bg-gray-200">-</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Time:</span>
                <span className="text-sm text-gray-600">
                  {request.responseTime ? `${request.responseTime}ms` : '-'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Size:</span>
                <span className="text-sm text-gray-600">
                  {request.response 
                    ? formatBytes(JSON.stringify(request.response.data).length) 
                    : '-'}
                </span>
              </div>
            </div>
            <div className="code-block min-h-[400px]">
              {renderResponseBody()}
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

