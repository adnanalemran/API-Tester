import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Copy, Check } from 'lucide-react';

/**
 * JsonEditor component - JSON editor with formatting and syntax highlighting
 * @param {Object} props
 * @param {string} props.value - JSON string value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text
 */
export const JsonEditor = ({ value = '', onChange, placeholder = '{"key": "value"}' }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  const jsonValue = value || '';

  const formatJSON = () => {
    try {
      if (!jsonValue || !jsonValue.trim()) {
        onChange('{}');
        setError(null);
        return;
      }
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      setError(null);
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate JSON on change
    if (newValue.trim()) {
      try {
        JSON.parse(newValue);
        setError(null);
      } catch (e) {
        setError('Invalid JSON');
      }
    } else {
      setError(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonValue || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidJSON = !error && jsonValue && jsonValue.trim();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJSON}
            className="h-8"
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Format
          </Button>
          {jsonValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        {error && (
          <span className="text-xs text-destructive font-medium">{error}</span>
        )}
        {isValidJSON && !error && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Valid JSON</span>
        )}
      </div>
      
      <textarea
        value={jsonValue}
        onChange={handleChange}
        rows="12"
        className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none"
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};
