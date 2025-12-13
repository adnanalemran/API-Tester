/**
 * Utility functions for exporting and importing requests
 */

/**
 * Exports all requests, global settings, and active tab to JSON
 * @param {Array} requests - Array of request objects
 * @param {Object} globalSettings - Global settings object
 * @param {number} activeRequestId - Currently active request ID
 * @returns {string} JSON string
 */
export const exportToJSON = (requests, globalSettings, activeRequestId) => {
  const exportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    activeRequestId: activeRequestId,
    requests: requests.map(req => ({
      id: req.id,
      name: req.name,
      method: req.method,
      url: req.url,
      params: req.params || [{ key: '', value: '' }],
      headers: req.headers || [{ key: 'Content-Type', value: 'application/json' }],
      bodyType: req.bodyType || 'none',
      bodyText: req.bodyText || '',
      formData: req.formData || [{ key: '', value: '' }],
      token: req.token || '',
      tokenType: req.tokenType || 'Bearer',
      useToken: req.useToken || false,
      showToken: req.showToken || false,
      useGlobalToken: req.useGlobalToken || false,
    })),
    globalSettings: globalSettings || {},
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Downloads data as JSON file
 * @param {string} jsonString - JSON string to download
 * @param {string} filename - Filename for the download
 */
export const downloadJSON = (jsonString, filename = 'api-tester-export.json') => {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Reads a JSON file and returns parsed data
 * @param {File} file - File object to read
 * @returns {Promise<Object>} Parsed JSON data
 */
export const readJSONFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Validates imported data structure
 * @param {Object} data - Imported data object
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateImportData = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid file format');
    return { isValid: false, errors };
  }

  if (!Array.isArray(data.requests)) {
    errors.push('Missing or invalid requests array');
  } else {
    data.requests.forEach((req, index) => {
      if (!req.method) {
        errors.push(`Request ${index + 1}: Missing method`);
      }
      if (req.url === undefined || req.url === null) {
        errors.push(`Request ${index + 1}: Missing URL`);
      }
      if (!req.name) {
        errors.push(`Request ${index + 1}: Missing name`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

