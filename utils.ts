import { ApiRequest, KeyValueItem } from "./types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export const headersToKeyValue = (headers: Headers): KeyValueItem[] => {
  const items: KeyValueItem[] = [];
  headers.forEach((value, key) => {
    items.push({ id: generateId(), key, value, enabled: true });
  });
  return items;
};

export const keyValueToRecord = (items: KeyValueItem[]): Record<string, string> => {
  return items
    .filter(i => i.enabled && i.key)
    .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
};

export const validateImportData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.requests)) return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  return true;
};

export const generateCodeSnippet = (req: ApiRequest, actualUrl: string): string => {
  const headers = keyValueToRecord(req.headers);
  if (req.body.type === 'json') headers['Content-Type'] = 'application/json';
  
  // Basic cURL generation
  let curl = `curl -X ${req.method} '${actualUrl}'`;
  
  Object.entries(headers).forEach(([k, v]) => {
    curl += ` \\\n  -H '${k}: ${v}'`;
  });

  if (req.auth.type === 'bearer' && req.auth.token) {
    curl += ` \\\n  -H 'Authorization: Bearer ${req.auth.token}'`;
  }

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (req.body.type === 'json' && req.body.content) {
      curl += ` \\\n  -d '${req.body.content.replace(/'/g, "'\\''")}'`;
    }
  }

  return curl;
};

export const getContentType = (headers: Record<string, string>): string => {
  const type = Object.keys(headers).find(k => k.toLowerCase() === 'content-type');
  return type ? headers[type] : '';
};