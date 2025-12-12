import React from 'react';
import { BODY_TYPES } from '../constants';

/**
 * BodyTab component - displays request body tab
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 */
export const BodyTab = ({ request, onUpdate }) => {
  const handleBodyTypeChange = (bodyType) => {
    const updates = { bodyType };
    if (bodyType === BODY_TYPES.FORM_DATA || bodyType === BODY_TYPES.FORM_URLENCODED) {
      updates.formData = [{ key: '', value: '' }];
    }
    onUpdate(request.id, updates);
  };

  const addFormDataRow = () => {
    onUpdate(request.id, { 
      formData: [...request.formData, { key: '', value: '' }] 
    });
  };

  const updateFormData = (index, field, value) => {
    const newFormData = [...request.formData];
    newFormData[index][field] = value;
    onUpdate(request.id, { formData: newFormData });
  };

  const removeFormData = (index) => {
    onUpdate(request.id, { 
      formData: request.formData.filter((_, i) => i !== index) 
    });
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <label className="text-sm font-medium text-gray-700">Body Type:</label>
          <select
            value={request.bodyType}
            onChange={(e) => handleBodyTypeChange(e.target.value)}
            className="input-field w-40"
          >
            <option value={BODY_TYPES.NONE}>None</option>
            <option value={BODY_TYPES.JSON}>JSON</option>
            <option value={BODY_TYPES.TEXT}>Text</option>
            <option value={BODY_TYPES.FORM_DATA}>Form Data</option>
            <option value={BODY_TYPES.FORM_URLENCODED}>x-www-form-urlencoded</option>
          </select>
        </div>
        <div>
          {request.bodyType === BODY_TYPES.NONE && (
            <div className="text-gray-500 text-sm">
              No body for this request type
            </div>
          )}
          {(request.bodyType === BODY_TYPES.JSON || request.bodyType === BODY_TYPES.TEXT) && (
            <textarea
              value={request.bodyText}
              onChange={(e) => onUpdate(request.id, { bodyText: e.target.value })}
              rows="12"
              className="input-field font-mono text-sm"
              placeholder={request.bodyType === BODY_TYPES.JSON ? '{"key": "value"}' : "Enter text..."}
            />
          )}
          {(request.bodyType === BODY_TYPES.FORM_DATA || request.bodyType === BODY_TYPES.FORM_URLENCODED) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Form Data</label>
                <button 
                  onClick={addFormDataRow} 
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {request.formData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) => updateFormData(index, 'key', e.target.value)}
                      className="input-field flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => updateFormData(index, 'value', e.target.value)}
                      className="input-field flex-1"
                    />
                    <button
                      onClick={() => removeFormData(index)}
                      className="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl"
                      aria-label="Remove form data"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

