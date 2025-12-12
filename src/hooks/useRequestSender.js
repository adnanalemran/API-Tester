import axios from 'axios';
import {
  getParamsObject,
  getHeadersObject,
  getBody,
  buildRequestUrl,
  setContentTypeHeader,
} from '../utils/requestUtils';

/**
 * Custom hook for sending HTTP requests
 * @param {Object} request - Request object
 * @param {Function} onUpdate - Callback to update request state
 * @param {Object} globalSettings - Global settings (base URL, global token)
 * @returns {Function} sendRequest function
 */
export const useRequestSender = (request, onUpdate, globalSettings = {}) => {
  const sendRequest = async () => {
    if (!request.url?.trim() && !globalSettings.baseUrl?.trim()) {
      alert('Please enter a URL or set a base URL in settings');
      return;
    }

    // Prepare request data
    const paramsObj = getParamsObject(request.params);
    const requestUrl = buildRequestUrl(request.url, paramsObj, globalSettings.baseUrl);
    
    // Update URL if protocol was added (but don't update if base URL was used)
    if (requestUrl !== request.url && !globalSettings.baseUrl?.trim()) {
      onUpdate(request.id, { url: requestUrl });
    }

    const tokenConfig = {
      useToken: request.useToken,
      token: request.token,
      tokenType: request.tokenType,
      useGlobalToken: request.useGlobalToken !== undefined ? request.useGlobalToken : globalSettings.useGlobalToken,
      globalToken: globalSettings.globalToken,
      globalTokenType: globalSettings.globalTokenType,
    };
    
    let requestHeaders = getHeadersObject(request.headers, tokenConfig);
    
    // Get body
    let body = null;
    try {
      body = getBody({
        bodyType: request.bodyType,
        bodyText: request.bodyText,
        formData: request.formData,
      });
    } catch (e) {
      alert(e.message);
      return;
    }

    // Set content type if needed
    requestHeaders = setContentTypeHeader(requestHeaders, request.bodyType);

    // Update loading state
    onUpdate(request.id, { loading: true, error: null, response: null });
    const startTime = Date.now();

    try {
      const config = {
        method: request.method.toLowerCase(),
        url: requestUrl,
        headers: requestHeaders,
        validateStatus: () => true, // Accept all status codes
      };

      // Add body for non-GET requests
      if (body && request.method !== 'GET') {
        if (request.bodyType === 'x-www-form-urlencoded') {
          config.data = new URLSearchParams(body).toString();
        } else {
          config.data = body;
        }
      }

      const axiosResponse = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;

      onUpdate(request.id, {
        response: axiosResponse,
        responseTime: duration,
        loading: false,
      });
    } catch (err) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      onUpdate(request.id, {
        error: err,
        responseTime: duration,
        loading: false,
      });
    }
  };

  return sendRequest;
};

