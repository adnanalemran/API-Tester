import React from 'react';
import { TOKEN_TYPES } from '../constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TokenSection component - displays token input section
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {Function} props.onUpdate - Callback to update request
 * @param {Object} props.globalSettings - Global settings
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
    <div className="flex items-center space-x-2 p-3 bg-card rounded-md border">
      <div className="flex items-center space-x-2 flex-1 flex-wrap gap-2">
        {hasGlobalToken && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`useGlobalToken-${request.id}`}
                checked={request.useGlobalToken !== undefined ? request.useGlobalToken : false}
                onCheckedChange={(checked) => {
                  handleTokenChange('useGlobalToken', checked);
                  if (checked) {
                    handleTokenChange('useToken', false);
                  }
                }}
              />
              <Label 
                htmlFor={`useGlobalToken-${request.id}`}
                className="text-sm font-medium cursor-pointer"
              >
                Use Global Token
              </Label>
            </div>
          </>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`useToken-${request.id}`}
            checked={request.useToken}
            onCheckedChange={(checked) => {
              handleTokenChange('useToken', checked);
              if (checked && request.useGlobalToken) {
                handleTokenChange('useGlobalToken', false);
              }
            }}
          />
          <Label 
            htmlFor={`useToken-${request.id}`}
            className="text-sm font-medium cursor-pointer"
          >
            Use Token
          </Label>
        </div>
        {request.useToken && (
          <>
            <Select
              value={request.tokenType}
              onValueChange={(value) => handleTokenChange('tokenType', value)}
            >
              <SelectTrigger className="w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOKEN_TYPES.BEARER}>Bearer</SelectItem>
                <SelectItem value={TOKEN_TYPES.API_KEY}>API Key</SelectItem>
                <SelectItem value={TOKEN_TYPES.CUSTOM}>Custom</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 flex items-center space-x-2 min-w-[200px]">
              <Input
                type={request.showToken ? "text" : "password"}
                value={request.token}
                onChange={(e) => handleTokenChange('token', e.target.value)}
                placeholder={getTokenPlaceholder()}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleTokenChange('showToken', !request.showToken)}
                title={request.showToken ? 'Hide token' : 'Show token'}
              >
                {request.showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
