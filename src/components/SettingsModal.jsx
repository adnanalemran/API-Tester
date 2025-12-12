import React, { useState } from 'react';
import { TOKEN_TYPES } from '../constants';

/**
 * SettingsModal component - displays global settings (base URL, global token)
 * @param {Object} props
 * @param {Object} props.settings - Global settings object
 * @param {Function} props.onUpdate - Callback to update settings
 * @param {Function} props.onClose - Callback to close modal
 */
export const SettingsModal = ({ settings, onUpdate, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings({
      baseUrl: '',
      globalToken: '',
      globalTokenType: 'Bearer',
      useGlobalToken: false,
      showGlobalToken: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Global Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Base URL Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This URL will be prepended to all request URLs (if they don't start with http:// or https://)
            </p>
            <input
              type="text"
              value={localSettings.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="https://api.example.com"
              className="input-field w-full"
            />
            {localSettings.baseUrl && (
              <p className="text-xs text-gray-500 mt-1">
                Example: {localSettings.baseUrl}/users → https://api.example.com/users
              </p>
            )}
          </div>

          {/* Global Token Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="useGlobalToken"
                checked={localSettings.useGlobalToken}
                onChange={(e) => handleChange('useGlobalToken', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="useGlobalToken" className="text-sm font-medium text-gray-700">
                Use Global Token
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Enable this to use a global token for all requests. You can override it per-request.
            </p>
            
            {localSettings.useGlobalToken && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Type
                  </label>
                  <select
                    value={localSettings.globalTokenType}
                    onChange={(e) => handleChange('globalTokenType', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value={TOKEN_TYPES.BEARER}>Bearer</option>
                    <option value={TOKEN_TYPES.API_KEY}>API Key</option>
                    <option value={TOKEN_TYPES.CUSTOM}>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={localSettings.showGlobalToken ? "text" : "password"}
                      value={localSettings.globalToken}
                      onChange={(e) => handleChange('globalToken', e.target.value)}
                      placeholder="Enter global token"
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('showGlobalToken', !localSettings.showGlobalToken)}
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-300 rounded"
                      title={localSettings.showGlobalToken ? 'Hide token' : 'Show token'}
                    >
                      {localSettings.showGlobalToken ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="btn-secondary text-sm"
          >
            Reset
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary text-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

