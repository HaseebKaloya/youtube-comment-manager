# Troubleshooting Guide

Having issues? This guide will help you resolve common problems quickly.

## Quick Diagnostic

**Before diving into specific issues, try these general fixes:**

1. **Refresh the page** - Solves 50% of issues
2. **Reload the extension** - Fixes loading problems
3. **Clear browser cache** - Resolves storage issues
4. **Update to latest version** - Bug fixes included
5. **Try private/incognito mode** - Identifies conflict sources

## Common Issues & Solutions

### 1. Extension Icon Not Showing

**Problem:** Can't find the extension icon in toolbar

**Solutions:**

✅ **Check if extension is installed**
- Firefox: Go to `about:addons`
- Chrome: Go to `chrome://extensions/`
- Look for "YouTube Comment Manager"

✅ **Pin the extension**
- Right-click on the extensions icon in toolbar
- Find "YouTube Comment Manager"
- Click "Pin"

✅ **Refresh extensions page**
```
1. Go to extensions page
2. Press F5 or click refresh
3. Check if icon appears
```

✅ **Reinstall the extension**
- Uninstall completely
- Restart browser
- Install again

---

### 2. Comments Not Posting

**Problem:** Extension runs but comments don't appear

**Possible Causes & Fixes:**

#### A. Not Logged Into YouTube
**Symptom:** Can't post any comments manually either

**Solution:**
```
1. Log into your YouTube account
2. Refresh the page
3. Try posting a comment manually
4. Then use the extension
```

#### B. Comments Disabled on Video
**Symptom:** Comment section not visible

**Check:**
- Look for "Comments are turned off" message
- Try another video
- Check if video is for kids (comments disabled by default)

#### C. Comment Box Not Detected
**Symptom:** Extension runs but can't find comment box

**Solutions:**
- Scroll down to comment section manually first
- Wait 2-3 seconds for page to fully load
- Refresh page and try again
- Check console for error messages

#### D. YouTube Layout Changed
**Symptom:** Worked before, now doesn't

**Solution:**
```
1. Check for extension updates
2. If no update available, report on GitHub
3. Temporary fix: Use desktop mode on mobile
```

---

### 3. Extension Popup Doesn't Open

**Problem:** Clicking icon does nothing

**Solutions:**

✅ **Reload the extension**
- Go to extensions page
- Find YouTube Comment Manager
- Click reload/refresh icon

✅ **Check for JavaScript errors**
```
1. Right-click extension icon
2. Select "Inspect popup" (Chrome) or "Debug Add-on" (Firefox)
3. Check console for errors
4. Report errors on GitHub
```

✅ **Clear extension storage**
```javascript
// In browser console
chrome.storage.local.clear()  // Chrome
browser.storage.local.clear()  // Firefox
```

✅ **Reinstall**
- Sometimes a fresh install fixes corruption

---

### 4. Task Doesn't Resume After Closing Popup

**Problem:** Progress lost when reopening

**Diagnosis:**
```
Expected: "Task running in background" message
Actual: Extension reset to start state
```

**Fixes:**

✅ **Check if task actually stopped**
- Look at comment section
- See if new comments are appearing
- Task may have completed

✅ **Storage may be disabled**
```
1. Check browser privacy settings
2. Ensure extensions can use local storage
3. Disable "Clear storage on exit" if enabled
```

✅ **Browser extension bug**
- Try Firefox if using Chrome
- Try Chrome if using Firefox
- Report issue with browser version details

---

### 5. Slow Performance / Lagging

**Problem:** Extension feels slow or unresponsive

**Solutions:**

✅ **Too many browser extensions**
- Disable other extensions temporarily
- Check if performance improves
- Identify conflicting extensions

✅ **Low system resources**
- Close unnecessary tabs
- Close resource-heavy programs
- Check task manager for memory usage

✅ **YouTube page too heavy**
- Disable autoplay
- Turn off HD quality temporarily
- Use lighter themes

✅ **Clear cache and cookies**
```
1. Browser settings → Privacy
2. Clear browsing data
3. Select cache and cookies
4. Restart browser
```

---

### 6. Rate Limit Errors

**Problem:** "Error: Rate limit reached" or comments rejected

**This Means:** YouTube detected too many comments too fast

**Immediate Fix:**
```
1. STOP commenting immediately
2. Wait 30-60 minutes
3. Use longer delays next time (10-15 seconds)
4. Enable randomization
```

**Prevention:**
- Use minimum 5-second delays
- Always enable random variation
- Post max 30 comments per session
- Take breaks between sessions
- Don't comment on too many videos in a row

**Recovery:**
```
Wait Times:
- First warning: 30 minutes
- Second: 2 hours  
- Third: 24 hours
- Multiple violations: Longer restrictions
```

---

### 7. Statistics Not Updating

**Problem:** Dashboard shows 0 or outdated numbers

**Quick Fixes:**

✅ **Refresh popup**
- Close and reopen
- Should restore from storage

✅ **Storage corruption**
```javascript
// Check storage
browser.storage.local.get(null).then(console.log)

// If values look wrong, clear:
browser.storage.local.clear()
```

✅ **Message passing failed**
- Reload extension
- Refresh YouTube page
- Try again

---

### 8. Timer Shows Wrong Time

**Problem:** Elapsed/remaining time is incorrect

**Causes & Fixes:**

✅ **System time changed**
- Extension uses timestamps
- Changing system time causes issues
- Restart task for accurate timing

✅ **Popup was closed during task**
- Timer continues in background
- May look odd when reopened
- This is normal behavior

✅ **Average speed calculation**
- Remaining time is an estimate
- Based on current speed
- Becomes accurate after 5+ comments

---

### 9. Log Export Not Working

**Problem:** Can't download log file

**Solutions:**

✅ **Browser blocking downloads**
- Check browser settings
- Allow downloads from extensions
- Disable strict download protection temporarily

✅ **No logs to export**
- Need at least one log entry
- Start a task first
- Then export

✅ **File permission issues**
- Check download folder permissions
- Try different download location
- Run browser as administrator (Windows)

---

### 10. Can't Install Extension

**Problem:** Installation fails or shows errors

#### Firefox Issues

**"This add-on could not be installed because it appears to be corrupt"**
- Re-download the extension
- Check ZIP file integrity
- Try different download source

**"This add-on is not compatible with your version of Firefox"**
- Update Firefox to version 109.0 or higher
- Check manifest requirements
- Use Firefox Developer Edition

#### Chrome Issues

**"Package is invalid"**
- Make sure you selected the correct folder
- Folder must contain manifest.json
- Check for syntax errors in JSON files

**"Manifest version not supported"**
- Update Chrome to latest version
- Extension uses Manifest V3
- Requires Chrome 88+

---

## Browser-Specific Issues

### Firefox

**Issue: Temporary add-on keeps getting removed**
- This is normal for temporary add-ons
- They're removed on browser restart
- For permanent install: Submit to AMO or sign it

**Issue: Extension works but icon is gray**
- Gray icon on non-YouTube pages is normal
- Icon becomes active on YouTube only

### Chrome

**Issue: "Extensions developer mode is not supported"**
- Your Chrome is managed (work/school)
- Ask admin for permissions
- Or use personal Chrome installation

**Issue: Extension updates break functionality**
- Chrome auto-updates extensions
- May break temporarily
- Reload extension after updates

### Edge

**Issue: Extension from Chrome Store not working**
- Prefer Edge Add-ons store version
- Chrome Store version may have compatibility issues
- Report issue if Edge-specific problems

---

## Error Messages Explained

### "Failed to communicate with YouTube page"
**Meaning:** Content script didn't load

**Fix:**
```
1. Refresh YouTube page
2. Reload extension
3. Check if page loaded completely
```

### "Please open a YouTube video page first"
**Meaning:** Not on a valid YouTube video URL

**Fix:**
```
1. Navigate to any YouTube video
2. Make sure URL contains /watch?v= or youtu.be/
3. Then open extension
```

### "Invalid video URL"
**Meaning:** URL format not recognized

**Valid Formats:**
```
✓ https://www.youtube.com/watch?v=VIDEO_ID
✓ https://youtu.be/VIDEO_ID
✓ https://m.youtube.com/watch?v=VIDEO_ID
✗ https://youtube.com/channel/...
✗ https://youtube.com/playlist?list=...
```

### "Comments must be at least 1 character"
**Meaning:** Empty comment in your list

**Fix:**
```
1. Check for blank lines
2. Remove empty entries
3. Ensure each line has text
```

---

## Advanced Troubleshooting

### Checking Browser Console

**How to Open:**
- Firefox: `Ctrl + Shift + K` (Windows) or `Cmd + Option + K` (Mac)
- Chrome: `Ctrl + Shift + J` (Windows) or `Cmd + Option + J` (Mac)

**What to Look For:**
```
🔴 Red errors - Something broke
🟡 Yellow warnings - May cause issues
🔵 Blue logs - Normal operation
```

**Common Error Patterns:**
```
"Cannot read property of undefined" - Code bug
"Network error" - Connection issue
"Permission denied" - Browser blocking
"Storage quota exceeded" - Too much data
```

### Collecting Debug Information

**When Reporting Issues:**

1. **Browser Info**
   ```
   Browser: Firefox/Chrome
   Version: [check in about:browser]
   OS: Windows/Mac/Linux
   ```

2. **Extension Info**
   ```
   Version: [check in extensions page]
   Installed from: Store/Manual
   Developer mode: Yes/No
   ```

3. **Error Details**
   ```
   What you did: [steps]
   What happened: [result]
   Expected: [what should happen]
   Console errors: [copy paste]
   ```

4. **Screenshots**
   - Extension popup
   - Console errors
   - YouTube page state

### Testing in Safe Mode

**Firefox:**
```
1. Help → Restart with Add-ons Disabled
2. Test if issue persists
3. Helps identify conflicts
```

**Chrome:**
```
1. Open incognito mode (Ctrl + Shift + N)
2. Enable extension in incognito
3. Test there
```

---

## Still Having Issues?

### Self-Help Resources

1. **Check Documentation**
   - [Installation Guide](INSTALLATION.md)
   - [Usage Guide](USAGE.md)
   - [Features Overview](FEATURES.md)

2. **Search Existing Issues**
   - Visit [GitHub Issues](https://github.com/HaseebKaloya/youtube-comment-manager/issues)
   - Someone may have faced same problem
   - Check closed issues too

3. **Update Everything**
   - Update browser to latest version
   - Update extension to latest version
   - Update operating system

### Getting Support

**GitHub Issues (Preferred)**
```
1. Go to: https://github.com/HaseebKaloya/youtube-comment-manager/issues
2. Click "New Issue"
3. Use bug report template
4. Provide all requested information
5. Attach screenshots/logs
```

**Email Support**
```
To: haseebkaloya@gmail.com
Subject: YouTube Comment Manager - [Brief Issue]

Include:
- Browser and version
- Extension version
- Detailed description
- Steps to reproduce
- Screenshots if relevant
```

**Response Time:**
- GitHub: 24-48 hours
- Email: 48-72 hours
- Urgent issues: Tag as "bug" on GitHub

---

## Prevention Tips

**To avoid future issues:**

1. ✓ Keep browser updated
2. ✓ Keep extension updated
3. ✓ Use recommended settings
4. ✓ Take regular breaks
5. ✓ Don't abuse the tool
6. ✓ Use reasonable delays
7. ✓ Back up your comment templates
8. ✓ Export logs regularly

**Red Flags to Watch:**
- Comments failing repeatedly
- "Rate limit" messages
- Extension crashes frequently
- YouTube warnings
- Performance degradation

**When in Doubt:**
- Stop using immediately
- Wait 24 hours
- Review settings
- Start with small batches
- Contact support if persists

---

Remember: This tool should enhance your YouTube experience, not cause stress. If something doesn't work, it's usually an easy fix!

Need more help? Don't hesitate to reach out via [GitHub Issues](https://github.com/HaseebKaloya/youtube-comment-manager/issues) or email: haseebkaloya@gmail.com
