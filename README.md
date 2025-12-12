# API Tester

A Postman-like API testing tool built with Electron and React.

## Features

- 🚀 Multiple requests with tab management
- 🔐 Token authentication (Bearer, API Key, Custom)
- 📝 Support for multiple HTTP methods (GET, POST, PUT, PATCH, DELETE)
- 📦 Request body types (JSON, Text, Form Data, x-www-form-urlencoded)
- 📊 Response viewer with status codes, timing, and size
- 💾 Automatic persistence of requests
- 🎨 Modern UI with Tailwind CSS

## Project Structure

```
src/
├── components/          # React components
│   ├── RequestTab.jsx   # Request tab component
│   ├── TokenSection.jsx # Token input section
│   ├── ParamsTab.jsx    # Query parameters tab
│   ├── HeadersTab.jsx   # Request headers tab
│   ├── BodyTab.jsx      # Request body tab
│   ├── RequestPanel.jsx # Main request panel
│   ├── ResponsePanel.jsx # Response display panel
│   └── index.js         # Component exports
├── hooks/               # Custom React hooks
│   ├── useRequests.js   # Request management hook
│   └── useRequestSender.js # Request sending hook
├── utils/               # Utility functions
│   ├── requestUtils.js  # Request-related utilities
│   └── responseUtils.js # Response-related utilities
├── constants/           # Constants and configuration
│   └── index.js         # App constants
├── App.jsx              # Main App component
├── renderer.jsx         # Entry point
└── input.css            # Tailwind CSS input
```

## Architecture

### Components
- **RequestTab**: Individual request tab with rename and close functionality
- **TokenSection**: Token input with show/hide toggle
- **ParamsTab**: Query parameters management
- **HeadersTab**: Request headers management
- **BodyTab**: Request body configuration
- **RequestPanel**: Main request configuration panel
- **ResponsePanel**: Response display with tabs

### Hooks
- **useRequests**: Manages multiple requests state and operations
- **useRequestSender**: Handles HTTP request sending logic

### Utils
- **requestUtils**: Request building and transformation utilities
- **responseUtils**: Response formatting and display utilities

### Constants
- HTTP methods, body types, token types, status colors, etc.

## Development

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start App
```bash
npm start
```

## Technologies

- **Electron**: Desktop application framework
- **React**: UI library
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Webpack**: Module bundler
- **Babel**: JavaScript compiler

## License

MIT
