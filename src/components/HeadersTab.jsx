import React from 'react';

/**
 * HeadersTab component - displays request headers tab
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 */
export const HeadersTab = ({ request, onUpdate }) => {
  const addHeader = () => {
    onUpdate(request.id, { 
      headers: [...request.headers, { key: '', value: '' }] 
    });
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...request.headers];
    newHeaders[index][field] = value;
    onUpdate(request.id, { headers: newHeaders });
  };

  const removeHeader = (index) => {
    onUpdate(request.id, { 
      headers: request.headers.filter((_, i) => i !== index) 
    });
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Request Headers
          </label>
          <button 
            onClick={addHeader} 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {request.headers.map((header, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                className="input-field flex-1"
              />
              <button
                onClick={() => removeHeader(index)}
                className="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl"
                aria-label="Remove header"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

