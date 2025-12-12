import React from 'react';
import { TOKEN_TYPES } from '../constants';

/**
 * TokenSection component - displays token input section
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 */
export const TokenSection = ({ request, onUpdate, globalSettings }) => {
  const handleTokenChange = (field, value) => {
    onUpdate(request.id, { [field]: value });
  };

  const getTokenPlaceholder = () => {
    switch (request.tokenType) {
      case TOKEN_TYPES.BEARER:
        return 'Enter Bearer token';
      case TOKEN_TYPES.API_KEY:
        return 'Enter API key';
      default:
        return 'Enter token';
    }
  };

  const hasGlobalToken = globalSettings?.useGlobalToken && globalSettings?.globalToken?.trim();

  return (
    <div className="flex items-center space-x-2 p-3 bg-white rounded border border-gray-200">
      <div className="flex items-center space-x-2 flex-1 flex-wrap">
        {hasGlobalToken && (
          <>
            <input
              type="checkbox"
              id={`useGlobalToken-${request.id}`}
              checked={request.useGlobalToken !== undefined ? request.useGlobalToken : false}
              onChange={(e) => {
                handleTokenChange('useGlobalToken', e.target.checked);
                // Uncheck useToken if using global token
                if (e.target.checked) {
                  handleTokenChange('useToken', false);
                }
              }}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label 
              htmlFor={`useGlobalToken-${request.id}`}
              className="text-sm font-medium text-gray-700"
            >
              Use Global Token
            </label>
          </>
        )}
        <input
          type="checkbox"
          id={`useToken-${request.id}`}
          checked={request.useToken}
          onChange={(e) => {
            handleTokenChange('useToken', e.target.checked);
            // Uncheck useGlobalToken if using local token
            if (e.target.checked && request.useGlobalToken) {
              handleTokenChange('useGlobalToken', false);
            }
          }}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label 
          htmlFor={`useToken-${request.id}`}
          className="text-sm font-medium text-gray-700"
        >
          Use Token
        </label>
        {request.useToken && (
          <>
            <select
              value={request.tokenType}
              onChange={(e) => handleTokenChange('tokenType', e.target.value)}
              className="input-field w-32 text-sm"
            >
              <option value={TOKEN_TYPES.BEARER}>Bearer</option>
              <option value={TOKEN_TYPES.API_KEY}>API Key</option>
              <option value={TOKEN_TYPES.CUSTOM}>Custom</option>
            </select>
            <div className="flex-1 flex items-center space-x-2">
              <input
                type={request.showToken ? "text" : "password"}
                value={request.token}
                onChange={(e) => handleTokenChange('token', e.target.value)}
                placeholder={getTokenPlaceholder()}
                className="input-field flex-1 text-sm"
              />
              <button
                type="button"
                onClick={() => handleTokenChange('showToken', !request.showToken)}
                className="text-gray-500 hover:text-gray-700 px-2 text-sm"
                title={request.showToken ? 'Hide token' : 'Show token'}
                aria-label={request.showToken ? 'Hide token' : 'Show token'}
              >
                {request.showToken ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

