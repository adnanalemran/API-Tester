import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

const DEFAULT_SETTINGS = {
  baseUrl: '',
  globalToken: '',
  globalTokenType: 'Bearer',
  useGlobalToken: false,
  showGlobalToken: false,
};

/**
 * Custom hook for managing global settings (base URL, global token)
 * @returns {Object} Global settings state and management functions
 */
export const useGlobalSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GLOBAL_SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  /**
   * Updates global settings
   * @param {Object} updates - Settings updates
   */
  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * Resets settings to defaults
   */
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};

