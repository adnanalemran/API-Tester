import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RequestTab component - displays a single request tab
 * @param {Object} props
 * @param {Object} props.request - Request object
 * @param {boolean} props.isActive - Whether this tab is active
 * @param {Function} props.onSelect - Callback when tab is selected
 * @param {Function} props.onClose - Callback when tab is closed
 * @param {Function} props.onRename - Callback when tab is renamed
 */
export const RequestTab = ({ request, isActive, onSelect, onClose, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(request.name);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(request.id, newName.trim());
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(request.name);
      setIsRenaming(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-2 px-4 py-2 border-b-2 cursor-pointer transition-colors",
        isActive
          ? 'border-primary bg-background text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      onClick={() => onSelect(request.id)}
    >
      {isRenaming ? (
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm h-7"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <span
            className="text-sm font-medium flex-1 truncate"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
          >
            {request.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onClose(request.id);
            }}
            title="Close"
            aria-label="Close request"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

