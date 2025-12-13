import React, { useState } from 'react';
import { TOKEN_TYPES } from '../constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Global Settings</DialogTitle>
          <DialogDescription>
            Configure base URL and global token for all requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Base URL Section */}
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Base URL</Label>
            <p className="text-xs text-muted-foreground">
              This URL will be prepended to all request URLs (if they don't start with http:// or https://)
            </p>
            <Input
              id="baseUrl"
              type="text"
              value={localSettings.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="https://api.example.com"
            />
            {localSettings.baseUrl && (
              <p className="text-xs text-muted-foreground">
                Example: {localSettings.baseUrl}/users → https://api.example.com/users
              </p>
            )}
          </div>

          {/* Global Token Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useGlobalToken"
                checked={localSettings.useGlobalToken}
                onCheckedChange={(checked) => handleChange('useGlobalToken', checked)}
              />
              <Label htmlFor="useGlobalToken" className="cursor-pointer">
                Use Global Token
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Enable this to use a global token for all requests. You can override it per-request.
            </p>
            
            {localSettings.useGlobalToken && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="globalTokenType">Token Type</Label>
                  <Select
                    value={localSettings.globalTokenType}
                    onValueChange={(value) => handleChange('globalTokenType', value)}
                  >
                    <SelectTrigger id="globalTokenType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TOKEN_TYPES.BEARER}>Bearer</SelectItem>
                      <SelectItem value={TOKEN_TYPES.API_KEY}>API Key</SelectItem>
                      <SelectItem value={TOKEN_TYPES.CUSTOM}>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="globalToken">Token</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="globalToken"
                      type={localSettings.showGlobalToken ? "text" : "password"}
                      value={localSettings.globalToken}
                      onChange={(e) => handleChange('globalToken', e.target.value)}
                      placeholder="Enter global token"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleChange('showGlobalToken', !localSettings.showGlobalToken)}
                      title={localSettings.showGlobalToken ? 'Hide token' : 'Show token'}
                    >
                      {localSettings.showGlobalToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
