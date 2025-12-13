import React, { useState, useEffect } from 'react';
import { Minus, X, Maximize2, Pin, PinOff } from 'lucide-react';

/**
 * Custom Title Bar component for frameless window
 */
export const CustomTitleBar = () => {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  const getIpcRenderer = () => {
    try {
      if (window.require) {
        const electron = window.require('electron');
        return electron.ipcRenderer;
      }
    } catch (e) {
      console.error('Electron not available:', e);
    }
    return null;
  };

  useEffect(() => {
    const ipcRenderer = getIpcRenderer();
    if (ipcRenderer) {
      // Get initial always on top status
      ipcRenderer.send('get-always-on-top');
      
      // Listen for status changes
      ipcRenderer.on('always-on-top-status', (event, status) => {
        setIsAlwaysOnTop(status);
      });

      ipcRenderer.on('window-always-on-top-changed', (event, flag) => {
        setIsAlwaysOnTop(flag);
      });

      return () => {
        ipcRenderer.removeAllListeners('always-on-top-status');
        ipcRenderer.removeAllListeners('window-always-on-top-changed');
      };
    }
  }, []);

  const handleMinimize = () => {
    const ipcRenderer = getIpcRenderer();
    if (ipcRenderer) {
      ipcRenderer.send('window-minimize');
    }
  };

  const handleMaximize = () => {
    const ipcRenderer = getIpcRenderer();
    if (ipcRenderer) {
      ipcRenderer.send('window-maximize');
    }
  };

  const handleClose = () => {
    const ipcRenderer = getIpcRenderer();
    if (ipcRenderer) {
      ipcRenderer.send('window-close');
    }
  };

  const handleAlwaysOnTop = () => {
    const ipcRenderer = getIpcRenderer();
    if (ipcRenderer) {
      const newState = !isAlwaysOnTop;
      ipcRenderer.send('window-always-on-top', newState);
    }
  };

  return (
    <div className="h-8 bg-white dark:bg-gray-800 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 drag-region select-none">
      <div className="flex items-center space-x-2 px-4">
        <svg
          className="h-5 w-5 text-blue-600 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">API Tester</h1>
      </div>
      <div className="flex items-center no-drag">
        <button
          onClick={handleAlwaysOnTop}
          className={`h-8 w-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            isAlwaysOnTop ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          title={isAlwaysOnTop ? 'Disable Always on Top' : 'Enable Always on Top'}
        >
          {isAlwaysOnTop ? (
            <Pin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <PinOff className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          )}
        </button>
        <button
          onClick={handleMinimize}
          className="h-8 w-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Minimize"
        >
          <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Maximize"
        >
          <Maximize2 className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

