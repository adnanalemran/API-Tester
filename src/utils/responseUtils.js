/**
 * Formats bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Gets status color class based on HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
  if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
  if (status >= 400) return 'bg-red-100 text-red-800';
  return 'bg-gray-200 text-gray-800';
};

/**
 * Formats error message for display
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
export const formatError = (error) => {
  if (error.response) {
    return `Error ${error.response.status}: ${error.response.statusText}\n\n${JSON.stringify(error.response.data, null, 2)}`;
  }
  return error.message || 'An unknown error occurred';
};

/**
 * Formats response data for display
 * @param {*} data - Response data
 * @returns {string} Formatted JSON string
 */
export const formatResponseData = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
};

