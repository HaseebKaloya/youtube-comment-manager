# Installation Guide

Getting started with YouTube Comment Manager is straightforward. Follow these steps based on your browser.

## Firefox Installation

### Option 1: From Firefox Add-ons (Recommended)
1. Visit [Firefox Add-ons Store](https://addons.mozilla.org/)
2. Search for "YouTube Comment Manager"
3. Click "Add to Firefox"
4. Confirm the permissions
5. You're ready to go!

### Option 2: Manual Installation (Developer Mode)

**Step 1: Download the Extension**
```bash
git clone https://github.com/HaseebKaloya/youtube-comment-manager.git
cd youtube-comment-manager
```

**Step 2: Load in Firefox**
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension folder
5. Select `manifest.json`
6. The extension icon will appear in your toolbar

**Note:** Temporary add-ons are removed when Firefox restarts. For permanent installation, you'll need to package and sign the extension through Mozilla.

## Chrome Installation

### Option 1: From Chrome Web Store (Recommended)
1. Visit [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "YouTube Comment Manager"
3. Click "Add to Chrome"
4. Confirm the permissions
5. Start using the extension!

### Option 2: Manual Installation (Developer Mode)

**Step 1: Enable Developer Mode**
1. Open Chrome and go to `chrome://extensions/`
2. Toggle "Developer mode" in the top right corner

**Step 2: Load the Extension**
1. Click "Load unpacked"
2. Navigate to the extension folder
3. Select the folder containing `manifest.json`
4. The extension will be loaded and the icon will appear in your toolbar

## Edge Installation

Microsoft Edge uses the same process as Chrome:
1. Go to `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension folder

## Verifying Installation

After installation, you should see:
- Extension icon in your browser toolbar
- Icon shows as active on YouTube pages
- Clicking the icon opens the extension popup

## First-Time Setup

1. **Navigate to YouTube**
   - Open any YouTube video page
   - The extension will automatically activate

2. **Click the Extension Icon**
   - Enter your video URL (if not already detected)
   - Add your comments (one per line)
   - Set your preferred delay between comments

3. **Test with a Few Comments**
   - Start with 2-3 test comments
   - Verify everything works correctly
   - Then scale up as needed

## Permissions Explained

The extension requires these permissions:

- **activeTab**: To interact with the current YouTube page
- **storage**: To save your settings and comments locally
- **scripting**: To inject the commenting functionality into YouTube
- **youtube.com**: To access YouTube pages only

We don't collect any data or send information anywhere. Everything stays local on your device.

## Troubleshooting Installation

### Extension Icon Not Showing
- Refresh the extensions page
- Restart your browser
- Try reinstalling the extension

### Can't Load Temporary Add-on (Firefox)
- Make sure you selected `manifest.json`
- Check that all files are present
- Verify no syntax errors in JSON files

### Chrome Says "Manifest File is Missing"
- Ensure you selected the correct folder
- The folder must contain `manifest.json` at the root level
- Check file permissions

## Updating the Extension

### From Browser Store
Updates happen automatically. You'll see a notification when a new version is available.

### Manual Installation
1. Pull the latest changes: `git pull origin main`
2. Reload the extension in your browser
3. For Firefox temporary add-ons, you'll need to reload it manually

## Uninstallation

### Firefox
1. Go to `about:addons`
2. Find "YouTube Comment Manager"
3. Click the three dots (•••)
4. Select "Remove"

### Chrome/Edge
1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find "YouTube Comment Manager"
3. Click "Remove"
4. Confirm the removal

## Next Steps

Now that you've installed the extension, check out:
- [Usage Guide](USAGE.md) - Learn how to use all features
- [Features](FEATURES.md) - Explore what the extension can do
- [Troubleshooting](TROUBLESHOOTING.md) - Solutions to common issues

## Need Help?

If you encounter any issues during installation:
- Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Open an issue on [GitHub](https://github.com/HaseebKaloya/youtube-comment-manager/issues)
- Contact: haseebkaloya@gmail.com
