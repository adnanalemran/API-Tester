export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type BodyType = 'none' | 'json' | 'text' | 'form-data' | 'x-www-form-urlencoded';

export type AuthType = 'none' | 'bearer' | 'api-key';

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: AuthType;
  token: string;
  keyName?: string; // For API Key
  addTo?: 'header' | 'query'; // For API Key
}

export interface RequestBody {
  type: BodyType;
  content: string; // For JSON/Text
  formData: KeyValueItem[];
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string | null;
  size: number;
  time: number;
  error?: string;
  contentType?: string;
}

export interface ApiRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValueItem[];
  headers: KeyValueItem[];
  body: RequestBody;
  auth: AuthConfig;
  response: ResponseData | null;
  sentAt?: number;
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValueItem[];
}

export interface GlobalSettings {
  baseUrl: string;
  globalAuth: AuthConfig;
  theme: 'dark' | 'light';
  activeEnvironmentId: string | null;
}

export interface AppState {
  requests: ApiRequest[];
  activeRequestId: string | null;
  settings: GlobalSettings;
  environments: Environment[];
  history: ApiRequest[];
}