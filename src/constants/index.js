export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const BODY_TYPES = {
  NONE: 'none',
  JSON: 'json',
  TEXT: 'text',
  FORM_DATA: 'form-data',
  FORM_URLENCODED: 'x-www-form-urlencoded',
};

export const TOKEN_TYPES = {
  BEARER: 'Bearer',
  API_KEY: 'API Key',
  CUSTOM: 'Custom',
};

export const REQUEST_TABS = {
  PARAMS: 'params',
  HEADERS: 'headers',
  BODY: 'body',
};

export const RESPONSE_TABS = {
  RESPONSE: 'response',
  HEADERS: 'headers',
};

export const STATUS_COLORS = {
  SUCCESS: 'bg-green-100 text-green-800',
  REDIRECT: 'bg-yellow-100 text-yellow-800',
  ERROR: 'bg-red-100 text-red-800',
  DEFAULT: 'bg-gray-200 text-gray-800',
};

export const STORAGE_KEYS = {
  SAVED_REQUESTS: 'savedRequests',
  REQUEST_HISTORY: 'requestHistory',
  GLOBAL_SETTINGS: 'globalSettings',
};

export const DEFAULT_HEADERS = [
  { key: 'Content-Type', value: 'application/json' }
];

export const DEFAULT_REQUEST_NAME_PREFIX = 'Request';

