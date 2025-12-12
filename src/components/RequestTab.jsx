import React, { useState } from 'react';

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
      className={`flex items-center space-x-2 px-4 py-2 border-b-2 cursor-pointer ${
        isActive
          ? 'border-primary-600 bg-white text-gray-700'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(request.id)}
    >
      {isRenaming ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm px-2 py-1 border border-primary-600 rounded"
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(request.id);
            }}
            className="text-gray-400 hover:text-red-600 text-lg leading-none"
            title="Close"
            aria-label="Close request"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

