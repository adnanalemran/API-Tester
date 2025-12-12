import React from 'react';
import { BODY_TYPES } from '../constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

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
          <Label className="text-sm font-medium">Body Type:</Label>
          <Select
            value={request.bodyType}
            onValueChange={handleBodyTypeChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BODY_TYPES.NONE}>None</SelectItem>
              <SelectItem value={BODY_TYPES.JSON}>JSON</SelectItem>
              <SelectItem value={BODY_TYPES.TEXT}>Text</SelectItem>
              <SelectItem value={BODY_TYPES.FORM_DATA}>Form Data</SelectItem>
              <SelectItem value={BODY_TYPES.FORM_URLENCODED}>x-www-form-urlencoded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {request.bodyType === BODY_TYPES.NONE && (
            <div className="text-muted-foreground text-sm">
              No body for this request type
            </div>
          )}
          {(request.bodyType === BODY_TYPES.JSON || request.bodyType === BODY_TYPES.TEXT) && (
            <textarea
              value={request.bodyText}
              onChange={(e) => onUpdate(request.id, { bodyText: e.target.value })}
              rows="12"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder={request.bodyType === BODY_TYPES.JSON ? '{"key": "value"}' : "Enter text..."}
            />
          )}
          {(request.bodyType === BODY_TYPES.FORM_DATA || request.bodyType === BODY_TYPES.FORM_URLENCODED) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Form Data</Label>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={addFormDataRow}
                >
                  + Add
                </Button>
              </div>
              <div className="space-y-2">
                {request.formData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) => updateFormData(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => updateFormData(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFormData(index)}
                      aria-label="Remove form data"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
