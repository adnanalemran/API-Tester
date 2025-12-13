/**
 * Creates a new request object with default values
 * @param {number} id - Unique identifier for the request
 * @returns {Object} New request object
 */
export const createNewRequest = (id) => ({
  id,
  name: `Request ${id}`,
  method: 'GET',
  url: '',
  params: [{ key: '', value: '' }],
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  bodyType: 'none',
  bodyText: '',
  formData: [{ key: '', value: '' }],
  token: '',
  tokenType: 'Bearer',
  useToken: false,
  showToken: false,
  response: null,
  error: null,
  loading: false,
  responseTime: null,
});

/**
 * Converts params array to object
 * @param {Array} params - Array of {key, value} objects
 * @returns {Object} Params object
 */
export const getParamsObject = (params) => {
  const paramsObj = {};
  params.forEach(param => {
    if (param.key?.trim()) {
      paramsObj[param.key.trim()] = param.value?.trim() || '';
    }
  });
  return paramsObj;
};

/**
 * Converts headers array to object, including token if enabled
 * @param {Array} headers - Array of {key, value} objects
 * @param {Object} tokenConfig - Token configuration {useToken, token, tokenType, useGlobalToken, globalToken, globalTokenType}
 * @returns {Object} Headers object
 */
export const getHeadersObject = (headers, tokenConfig = {}) => {
  const headersObj = {};
  
  // Add regular headers
  headers.forEach(header => {
    if (header.key?.trim()) {
      headersObj[header.key.trim()] = header.value?.trim() || '';
    }
  });
  
  // Determine which token to use (request-specific or global)
  const { 
    useToken, 
    token, 
    tokenType,
    useGlobalToken,
    globalToken,
    globalTokenType 
  } = tokenConfig;
  
  const shouldUseToken = useToken || useGlobalToken;
  const tokenToUse = useGlobalToken && globalToken?.trim() ? globalToken : token;
  const tokenTypeToUse = useGlobalToken && globalToken?.trim() ? globalTokenType : tokenType;
  
  // Add token to headers if enabled
  if (shouldUseToken && tokenToUse?.trim()) {
    if (tokenTypeToUse === 'Bearer') {
      headersObj['Authorization'] = `Bearer ${tokenToUse.trim()}`;
    } else if (tokenTypeToUse === 'API Key') {
      if (!headersObj['X-API-Key'] && !headersObj['x-api-key'] && !headersObj['api-key']) {
        headersObj['X-API-Key'] = tokenToUse.trim();
      }
    } else if (tokenTypeToUse === 'Custom') {
      if (!headersObj['Authorization'] && !headersObj['authorization']) {
        headersObj['Authorization'] = tokenToUse.trim();
      }
    }
  }
  
  return headersObj;
};

/**
 * Converts body data based on body type
 * @param {Object} bodyConfig - Body configuration {bodyType, bodyText, formData}
 * @returns {*} Body data (object, string, or null)
 * @throws {Error} If JSON is invalid
 */
export const getBody = (bodyConfig) => {
  const { bodyType, bodyText, formData } = bodyConfig;
  
  if (bodyType === 'none') {
    return null;
  } else if (bodyType === 'json') {
    if (!bodyText?.trim()) return null;
    try {
      return JSON.parse(bodyText);
    } catch (e) {
      throw new Error('Invalid JSON in body');
    }
  } else if (bodyType === 'text') {
    return bodyText || null;
  } else if (bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') {
    const formDataObj = {};
    formData?.forEach(item => {
      if (item.key?.trim()) {
        formDataObj[item.key.trim()] = item.value?.trim() || '';
      }
    });
    return Object.keys(formDataObj).length > 0 ? formDataObj : null;
  }
  
  return null;
};

/**
 * Builds the full request URL with query parameters and base URL
 * @param {string} url - Request URL (can be relative or absolute)
 * @param {Object} params - Query parameters object
 * @param {string} baseUrl - Optional base URL to prepend
 * @returns {string} Full URL with query string
 */
export const buildRequestUrl = (url, params, baseUrl = '') => {
  let requestUrl = url.trim();
  const base = baseUrl?.trim() || '';
  
  // If base URL is provided and request URL is relative
  if (base && requestUrl && !requestUrl.startsWith('http://') && !requestUrl.startsWith('https://')) {
    // Remove leading slash from request URL if base URL ends with slash
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanUrl = requestUrl.startsWith('/') ? requestUrl : '/' + requestUrl;
    requestUrl = cleanBase + cleanUrl;
  } else if (requestUrl && !requestUrl.startsWith('http://') && !requestUrl.startsWith('https://')) {
    // Add protocol if missing and no base URL
    requestUrl = 'https://' + requestUrl;
  }
  
  // Add query parameters
  const queryString = new URLSearchParams(params).toString();
  if (queryString) {
    requestUrl += (requestUrl.includes('?') ? '&' : '?') + queryString;
  }
  
  return requestUrl;
};

/**
 * Sets Content-Type header based on body type if not already set
 * @param {Object} headers - Headers object
 * @param {string} bodyType - Type of body
 * @returns {Object} Updated headers object
 */
export const setContentTypeHeader = (headers, bodyType) => {
  if (bodyType === 'json' && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  } else if (bodyType === 'x-www-form-urlencoded' && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return headers;
};

