import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * JsonEditor component - JSON editor with formatting and syntax highlighting
 * @param {Object} props
 * @param {string} props.value - JSON string value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text
 */
export const JsonEditor = ({ value, onChange, placeholder = '{"key": "value"}' }) => {
  const [isFormatted, setIsFormatted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  const formatJSON = () => {
    try {
      if (!value || !value.trim()) {
        onChange('{}');
        setIsFormatted(true);
        setError(null);
        return;
      }
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      setIsFormatted(true);
      setError(null);
      setShowPreview(true);
    } catch (e) {
      setError('Invalid JSON');
      setIsFormatted(false);
      setShowPreview(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsFormatted(false);
    setShowPreview(false);
    
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
    navigator.clipboard.writeText(value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidJSON = !error && value && value.trim();

  // Sync scroll between textarea and preview
  useEffect(() => {
    if (showPreview && textareaRef.current && previewRef.current) {
      const handleScroll = () => {
        if (previewRef.current) {
          previewRef.current.scrollTop = textareaRef.current.scrollTop;
          previewRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
      };
      textareaRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (textareaRef.current) {
          textareaRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [showPreview]);

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
          {value && (
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
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          rows="12"
          className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none relative z-10"
          placeholder={placeholder}
          spellCheck="false"
          style={{
            color: showPreview ? 'transparent' : 'inherit',
            caretColor: showPreview ? 'inherit' : 'inherit',
          }}
        />
        
        {/* Syntax highlighted preview overlay */}
        {showPreview && isValidJSON && (
          <div 
            ref={previewRef}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-md"
            style={{
              padding: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
            }}
          >
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: 'inherit',
                lineHeight: 'inherit',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                  fontSize: 'inherit',
                }
              }}
            >
              {value}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};
