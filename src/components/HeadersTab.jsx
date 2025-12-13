import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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
          <Label className="text-sm font-medium">
            Request Headers
          </Label>
          <Button 
            variant="ghost"
            size="sm"
            onClick={addHeader}
          >
            + Add
          </Button>
        </div>
        <div className="space-y-2">
          {request.headers.map((header, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHeader(index)}
                aria-label="Remove header"
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
