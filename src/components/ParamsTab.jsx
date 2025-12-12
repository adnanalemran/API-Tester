import React from 'react';

/**
 * ParamsTab component - displays query parameters tab
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 */
export const ParamsTab = ({ request, onUpdate }) => {
  const addParam = () => {
    onUpdate(request.id, { params: [...request.params, { key: '', value: '' }] });
  };

  const updateParam = (index, field, value) => {
    const newParams = [...request.params];
    newParams[index][field] = value;
    onUpdate(request.id, { params: newParams });
  };

  const removeParam = (index) => {
    onUpdate(request.id, { 
      params: request.params.filter((_, i) => i !== index) 
    });
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Query Parameters
          </label>
          <button 
            onClick={addParam} 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {request.params.map((param, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                className="input-field flex-1"
              />
              <button
                onClick={() => removeParam(index)}
                className="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl"
                aria-label="Remove parameter"
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

