import { useState, useEffect } from 'react';
import { createNewRequest } from '../utils/requestUtils';
import { STORAGE_KEYS } from '../constants';

/**
 * Custom hook for managing multiple requests
 * @returns {Object} Requests state and management functions
 */
export const useRequests = () => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_REQUESTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [createNewRequest(1)];
      } catch {
        return [createNewRequest(1)];
      }
    }
    return [createNewRequest(1)];
  });

  const [activeRequestId, setActiveRequestId] = useState(requests[0]?.id || 1);
  const [nextId, setNextId] = useState(() => {
    const maxId = requests.reduce((max, req) => Math.max(max, req.id || 0), 0);
    return maxId + 1;
  });

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  const activeRequest = requests.find(r => r.id === activeRequestId) || requests[0];

  /**
   * Adds a new request
   */
  const addNewRequest = () => {
    const newRequest = createNewRequest(nextId);
    setRequests(prev => [...prev, newRequest]);
    setActiveRequestId(newRequest.id);
    setNextId(prev => prev + 1);
  };

  /**
   * Closes a request by ID
   * @param {number} id - Request ID to close
   */
  const closeRequest = (id) => {
    if (requests.length === 1) {
      alert('Cannot close the last request. Create a new one first.');
      return;
    }
    const newRequests = requests.filter(r => r.id !== id);
    setRequests(newRequests);
    if (activeRequestId === id) {
      setActiveRequestId(newRequests[0].id);
    }
  };

  /**
   * Updates a request by ID
   * @param {number} id - Request ID
   * @param {Object} updates - Updates to apply
   */
  const updateRequest = (id, updates) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  /**
   * Renames a request
   * @param {number} id - Request ID
   * @param {string} newName - New name for the request
   */
  const renameRequest = (id, newName) => {
    updateRequest(id, { name: newName });
  };

  /**
   * Imports requests from an array
   * @param {Array} importedRequests - Array of request objects to import
   * @param {number} preferredActiveId - Optional original ID of request that should be active after import
   * @returns {Array} Array of newly imported requests with their new IDs
   */
  const importRequests = (importedRequests, preferredActiveId = null) => {
    if (!Array.isArray(importedRequests) || importedRequests.length === 0) {
      throw new Error('Invalid requests data');
    }

    // Find the maximum ID from existing requests
    const maxId = requests.reduce((max, req) => Math.max(max, req.id || 0), 0);
    
    // Create a map of original IDs to new IDs
    const idMap = new Map();
    
    // Assign new IDs to imported requests to avoid conflicts
    const newRequests = importedRequests.map((req, index) => {
      const newId = maxId + index + 1;
      const originalId = req.id;
      idMap.set(originalId, newId);
      
      return {
        ...req,
        id: newId,
        // Ensure all fields are properly set with defaults
        params: req.params || [{ key: '', value: '' }],
        headers: req.headers || [{ key: 'Content-Type', value: 'application/json' }],
        bodyType: req.bodyType || 'none',
        bodyText: req.bodyText || '',
        formData: req.formData || [{ key: '', value: '' }],
        token: req.token || '',
        tokenType: req.tokenType || 'Bearer',
        useToken: req.useToken !== undefined ? req.useToken : false,
        showToken: req.showToken !== undefined ? req.showToken : false,
        useGlobalToken: req.useGlobalToken !== undefined ? req.useGlobalToken : false,
        // Reset response/error state
        response: null,
        error: null,
        loading: false,
        responseTime: null,
      };
    });

    setRequests(prev => [...prev, ...newRequests]);
    setNextId(prev => prev + newRequests.length);
    
    // Determine which request should be active
    let activeId = null;
    if (preferredActiveId !== null && idMap.has(preferredActiveId)) {
      // Use the preferred active ID if it exists in the imported requests
      activeId = idMap.get(preferredActiveId);
    } else if (newRequests.length > 0) {
      // Otherwise, activate the first imported request
      activeId = newRequests[0].id;
    }
    
    if (activeId !== null) {
      setActiveRequestId(activeId);
    }
    
    return newRequests;
  };

  return {
    requests,
    activeRequestId,
    activeRequest,
    setActiveRequestId,
    addNewRequest,
    closeRequest,
    updateRequest,
    renameRequest,
    importRequests,
  };
};

