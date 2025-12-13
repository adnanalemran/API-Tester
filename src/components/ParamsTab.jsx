import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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
          <Label className="text-sm font-medium">
            Query Parameters
          </Label>
          <Button 
            variant="ghost"
            size="sm"
            onClick={addParam}
          >
            + Add
          </Button>
        </div>
        <div className="space-y-2">
          {request.params.map((param, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParam(index)}
                aria-label="Remove parameter"
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
