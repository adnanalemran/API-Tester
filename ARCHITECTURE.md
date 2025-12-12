# Architecture Documentation

## Overview

This API Tester application follows a modular, component-based architecture using React and Electron. The codebase is organized into clear separation of concerns with reusable components, custom hooks, utility functions, and constants.

## Folder Structure

```
src/
├── components/          # React UI components
│   ├── RequestTab.jsx   # Tab component for each request
│   ├── TokenSection.jsx # Token authentication UI
│   ├── ParamsTab.jsx    # Query parameters management
│   ├── HeadersTab.jsx   # Request headers management
│   ├── BodyTab.jsx      # Request body configuration
│   ├── RequestPanel.jsx # Main request configuration panel
│   ├── ResponsePanel.jsx # Response display panel
│   └── index.js         # Component barrel exports
│
├── hooks/               # Custom React hooks
│   ├── useRequests.js   # Request state management
│   └── useRequestSender.js # HTTP request sending logic
│
├── utils/               # Pure utility functions
│   ├── requestUtils.js  # Request building utilities
│   └── responseUtils.js # Response formatting utilities
│
├── constants/           # Application constants
│   └── index.js         # All constants in one place
│
├── App.jsx              # Root App component
├── renderer.jsx         # Electron renderer entry point
└── input.css            # Tailwind CSS source
```

## Component Architecture

### Component Hierarchy

```
App
├── Header
├── RequestTabs (multiple RequestTab)
└── Main Content
    ├── RequestPanel
    │   ├── Method/URL Input
    │   ├── TokenSection
    │   └── Tab Content
    │       ├── ParamsTab
    │       ├── HeadersTab
    │       └── BodyTab
    └── ResponsePanel
        ├── Response Tab
        └── Headers Tab
```

### Component Responsibilities

#### App.jsx
- Root component
- Manages request state via `useRequests` hook
- Renders header, tabs, and main panels
- Coordinates between request and response panels

#### RequestTab.jsx
- Displays individual request tab
- Handles tab selection, renaming, and closing
- Manages its own rename state

#### RequestPanel.jsx
- Main request configuration container
- Manages active tab state (Params/Headers/Body)
- Integrates TokenSection and tab components
- Uses `useRequestSender` hook for sending requests

#### ResponsePanel.jsx
- Displays response data
- Shows status, timing, and size information
- Handles response and headers tabs
- Uses utility functions for formatting

## State Management

### Request State Structure

Each request object contains:
```javascript
{
  id: number,
  name: string,
  method: string,
  url: string,
  params: Array<{key: string, value: string}>,
  headers: Array<{key: string, value: string}>,
  bodyType: string,
  bodyText: string,
  formData: Array<{key: string, value: string}>,
  token: string,
  tokenType: string,
  useToken: boolean,
  showToken: boolean,
  response: Object | null,
  error: Error | null,
  loading: boolean,
  responseTime: number | null
}
```

### State Flow

1. **Request Creation**: `useRequests` hook manages array of requests
2. **Request Updates**: Components call `updateRequest` to modify request state
3. **Request Sending**: `useRequestSender` hook handles HTTP requests
4. **Response Handling**: Response data stored in request object
5. **Persistence**: Requests automatically saved to localStorage

## Custom Hooks

### useRequests
**Purpose**: Manages multiple requests state and operations

**Returns**:
- `requests`: Array of all requests
- `activeRequestId`: Currently active request ID
- `activeRequest`: Currently active request object
- `addNewRequest()`: Creates a new request
- `closeRequest(id)`: Closes a request
- `updateRequest(id, updates)`: Updates request properties
- `renameRequest(id, newName)`: Renames a request

**Features**:
- Automatic localStorage persistence
- ID generation and management
- Active request tracking

### useRequestSender
**Purpose**: Handles HTTP request sending logic

**Parameters**:
- `request`: Request object
- `onUpdate`: Callback to update request state

**Returns**:
- `sendRequest()`: Async function to send HTTP request

**Features**:
- URL building with query parameters
- Header management including token injection
- Body transformation based on body type
- Error handling and response storage

## Utility Functions

### requestUtils.js
- `createNewRequest(id)`: Creates new request object
- `getParamsObject(params)`: Converts params array to object
- `getHeadersObject(headers, tokenConfig)`: Converts headers array to object with token
- `getBody(bodyConfig)`: Transforms body based on type
- `buildRequestUrl(url, params)`: Builds URL with query string
- `setContentTypeHeader(headers, bodyType)`: Sets Content-Type header

### responseUtils.js
- `formatBytes(bytes)`: Formats byte size to human-readable
- `getStatusColor(status)`: Returns CSS classes for status code
- `formatError(error)`: Formats error for display
- `formatResponseData(data)`: Formats response data as JSON

## Constants

All constants are centralized in `constants/index.js`:
- HTTP methods
- Body types
- Token types
- Request/Response tab names
- Status colors
- Storage keys
- Default values

## Data Flow

1. **User Input** → Component updates local state
2. **Component** → Calls `onUpdate` callback
3. **App** → Updates request in `useRequests` hook
4. **Hook** → Updates requests array and localStorage
5. **Component** → Re-renders with new state

## HTTP Request Flow

1. User clicks "Send" button
2. `RequestPanel` calls `sendRequest()` from `useRequestSender`
3. Hook prepares request data using utility functions
4. Axios sends HTTP request
5. Response/error stored in request object
6. `ResponsePanel` displays formatted response

## Best Practices

1. **Separation of Concerns**: Components handle UI, hooks handle logic, utils handle transformations
2. **Single Responsibility**: Each component/hook/utility has one clear purpose
3. **Reusability**: Components and utilities are designed to be reusable
4. **Type Safety**: JSDoc comments document function parameters and returns
5. **Error Handling**: Errors are caught and displayed appropriately
6. **Performance**: React hooks optimize re-renders
7. **Accessibility**: ARIA labels and semantic HTML used

## Future Improvements

- Add TypeScript for type safety
- Add unit tests for utilities and hooks
- Add E2E tests for critical flows
- Add request collections/workspaces
- Add environment variables support
- Add request history sidebar
- Add import/export functionality
- Add request templates

