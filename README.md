# LocalhostManager

Extension to easily manage your different localhost servers for multi-project web development.

## Features

- 🚀 Quick addition of localhost servers with custom port
- 🏷️ Server naming for better organization
- 🔒 HTTP and HTTPS support
- 🎯 Automatic server status detection (online/offline)
- 📝 JSON editor for advanced configuration
- 💾 Export configuration
- ⚡ Quick one-click opening

## Installation

### Development Mode

1. Clone this repository
2. Open Firefox
3. Type `about:debugging` in the address bar
4. Click on "This Firefox"
5. Click on "Load Temporary Add-on"
6. Select the `manifest.json` file

### Icons

SVG files are provided in the `icons/` folder. To convert them to PNG:

- Use a tool like ImageMagick: `magick convert 128x128.svg 128x128.png`
- Or an online converter like https://cloudconvert.com/svg-to-png

## Usage

1. Click on the extension icon in the toolbar
2. Click on "+ New" to add a server
3. Fill in the information:
   - Host (localhost by default, or 127.0.0.1)
   - Server name (e.g., "API Backend")
   - Port (e.g., 3000)
   - Check HTTPS if needed
4. Click "Add"
5. Your servers appear in the list
6. Click on a server to open it in a new tab
7. Click "Edit JSON" to modify the configuration directly
8. Export your configuration to save it as a file

## Project Structure

```
LocalhostManager/
├── manifest.json          # Extension configuration
├── popup/
│   ├── popup.html        # User interface
│   ├── popup.css         # Styles
│   └── popup.js          # Application logic
├── icons/                # Extension icons
│   ├── 16x16.svg
│   ├── 48x48.svg
│   └── 128x128.svg
└── README.md
```

## Technologies

- Manifest V3
- Vanilla JavaScript
- CSS3 with animations
- Browser Storage API
- Dark/Light theme support

## License

MIT
