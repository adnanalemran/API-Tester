# How to Build Portable Windows EXE

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the portable Windows executable**:
   ```bash
   npm run dist:win
   ```

3. **Find your EXE file**:
   - Location: `release/API Tester-1.0.0-portable.exe`
   - This is a single, portable executable file
   - No installation required - just run it!

## What Gets Built

The build process:
1. ✅ Compiles React app with Webpack (production mode)
2. ✅ Builds Tailwind CSS
3. ✅ Packages everything into a single portable `.exe` file
4. ✅ Includes all dependencies (Node.js runtime, Electron, etc.)

## Build Commands

- **`npm run dist:win`** - Build portable Windows EXE (recommended)
- **`npm run dist`** - Build for all platforms
- **`npm run pack`** - Build unpacked version (for testing)

## Portable EXE Features

- ✅ **Single file** - Everything bundled in one `.exe`
- ✅ **No installation** - Run directly from anywhere
- ✅ **Self-contained** - Includes all dependencies
- ✅ **Portable** - Copy to USB, run on any Windows PC

## File Size

The portable EXE will be approximately 100-150 MB (includes Electron runtime and all dependencies).

## Troubleshooting

### Build fails?
- Make sure all dependencies are installed: `npm install`
- Check that `dist/` folder exists with built files
- Ensure you're on Windows (or use WSL for cross-platform builds)

### EXE doesn't run?
- Make sure you're running on Windows 10/11
- Check Windows Defender isn't blocking it
- Try running as administrator if needed

### Want to customize?
- Edit `package.json` → `build` section
- Change app name, version, icon, etc.

## Icon

To add a custom icon:
1. Create `assets/icon.ico` (Windows icon format)
2. Or use `assets/icon.png` (will be converted)
3. Rebuild: `npm run dist:win`

