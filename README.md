# API Tester

A modern API testing tool built with Electron and React. Test your APIs with a beautiful, intuitive interface.

## Features

- 🚀 **Multiple Requests** - Manage multiple API requests with tab-based interface
- 🔐 **Token Authentication** - Support for Bearer tokens, API keys, and custom authentication
- 📝 **HTTP Methods** - Full support for GET, POST, PUT, PATCH, DELETE
- 📦 **Request Body Types** - JSON, Text, Form Data, and x-www-form-urlencoded
- 📊 **Response Viewer** - View responses with status codes, timing, and size
- 🔍 **Find & Copy** - Search in responses and copy response data
- 💾 **Auto-Save** - All requests automatically saved to local storage
- 🌐 **Global Settings** - Set base URL and global token for all requests
- 📤 **Export/Import** - Export all requests to JSON and import them back
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui and Tailwind CSS
- 🔄 **Always on Top** - Keep the window on top while testing

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode

Run the app in development mode with hot reload:

```bash
npm run dev
```

### Start App

Build and start the application:

```bash
npm start
```

### Build for Production

Build the React app and CSS:

```bash
npm run build
npm run build-css
```

### Create Standalone EXE

Build a single standalone EXE file:

```bash
npm run dist
```

**Note**: Run PowerShell as Administrator if you see permission errors.

The standalone EXE will be in: `release/API Tester-1.0.0-Standalone.exe`

This single EXE file works independently on any Windows PC - just double-click to run!

## Project Structure

```
src/
├── components/          # React UI components
│   ├── RequestTab.jsx   # Request tab component
│   ├── RequestPanel.jsx # Main request configuration
│   ├── ResponsePanel.jsx # Response display
│   ├── TokenSection.jsx # Token authentication UI
│   ├── ParamsTab.jsx    # Query parameters
│   ├── HeadersTab.jsx   # Request headers
│   ├── BodyTab.jsx      # Request body
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
│   ├── useRequests.js   # Request state management
│   ├── useRequestSender.js # HTTP request logic
│   └── useGlobalSettings.js # Global settings
├── utils/               # Utility functions
│   ├── requestUtils.js  # Request building utilities
│   ├── responseUtils.js # Response formatting
│   └── exportImportUtils.js # Export/import functionality
├── constants/           # Application constants
│   └── index.js        # All constants
├── App.jsx              # Main App component
└── renderer.jsx         # Electron renderer entry point
```

## Technologies

- **Electron** - Desktop application framework
- **React** - UI library with Hooks
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Axios** - HTTP client
- **Webpack** - Module bundler
- **Babel** - JavaScript compiler

## Features in Detail

### Request Management
- Create multiple requests with tabs (Chrome-style)
- Rename requests by double-clicking the tab
- Close requests (except the last one)
- All requests persist automatically

### Authentication
- Per-request token configuration
- Global token option for all requests
- Support for Bearer, API Key, and Custom token types
- Show/hide token values

### Request Configuration
- HTTP method selection (GET, POST, PUT, PATCH, DELETE)
- URL input with base URL support
- Query parameters management
- Custom headers
- Multiple body types (JSON, Text, Form Data, URL-encoded)
- JSON editor with formatting and validation

### Response Display
- Status code with color coding
- Response time in milliseconds
- Response size
- Formatted response body
- Response headers
- Find/search functionality
- Copy response to clipboard

### Global Settings
- Base URL configuration
- Global token with type selection
- Settings persist across sessions

### Export/Import
- Export all requests and settings to JSON
- Import requests from JSON file
- One-click export/import

## Building

### Development Build
```bash
npm run build-dev
```

### Production Build
```bash
npm run build
npm run build-css
```

### Package for Windows
```bash
npm run dist
```

## Scripts

- `npm start` - Build and start the app
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build React app (production)
- `npm run build-dev` - Build React app (development)
- `npm run build-css` - Build Tailwind CSS
- `npm run dist` - Package app for Windows

## License

MIT

## Author

Built with ❤️ using Electron and React
