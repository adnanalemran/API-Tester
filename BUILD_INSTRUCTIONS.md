# Building Portable Windows Executable

## Prerequisites

1. Make sure you have Node.js and npm installed
2. Install all dependencies: `npm install`

## Building the Portable EXE

### Step 1: Install electron-builder (if not already installed)
```bash
npm install electron-builder --save-dev
```

### Step 2: Build the application
```bash
npm run dist:win
```

This will:
1. Build the React app with webpack (production mode)
2. Build the CSS with Tailwind
3. Package everything into a portable Windows executable

### Output Location

The portable `.exe` file will be created in the `release` folder:
- `release/API Tester-1.0.0-portable.exe`

## Alternative Build Commands

- **Full build (all platforms)**: `npm run dist`
- **Windows portable only**: `npm run dist:win`
- **Test build (unpacked)**: `npm run pack` (creates unpacked app for testing)

## Notes

- The portable exe is a single file that can be run without installation
- All dependencies are bundled inside the exe
- The exe can be moved to any location and run directly
- First run might take a few seconds to extract files

## Icon

Make sure you have an icon file:
- `assets/icon.ico` (for Windows) - recommended
- `assets/icon.png` (fallback)

If you don't have an icon, the build will still work but use the default Electron icon.

