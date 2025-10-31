# Contributing to YouTube Comment Manager

Thank you for considering contributing to YouTube Comment Manager! This document will guide you through the contribution process.

## Ways to Contribute

### 1. Report Bugs
Found a bug? Help us fix it!

**Before submitting:**
- Check if the issue already exists
- Test on the latest version
- Try in a clean browser profile

**How to report:**
1. Go to [GitHub Issues](https://github.com/HaseebKaloya/youtube-comment-manager/issues)
2. Click "New Issue"
3. Select "Bug Report" template
4. Fill in all sections
5. Add screenshots if helpful

### 2. Suggest Features
Have an idea for improvement?

**Good feature requests include:**
- Clear description of the feature
- Why it would be useful
- How it should work
- Examples of similar features

### 3. Improve Documentation
Help others understand the project better!

**What you can do:**
- Fix typos and grammar
- Add more examples
- Clarify confusing sections
- Translate to other languages
- Create video tutorials

### 4. Submit Code
Ready to contribute code? Awesome!

## Development Setup

### Prerequisites
- Git installed
- Firefox or Chrome browser
- Text editor (VS Code recommended)
- Basic knowledge of JavaScript and browser extensions

### Getting Started

**1. Fork and Clone**
```bash
# Fork the repository on GitHub first
git clone https://github.com/YOUR_USERNAME/youtube-comment-manager.git
cd youtube-comment-manager
```

**2. Create a Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**3. Load Extension in Browser**

**Firefox:**
```
1. Open Firefox
2. Go to about:debugging
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select manifest.json
```

**Chrome:**
```
1. Open Chrome
2. Go to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension folder
```

### Project Structure

```
youtube-comment-manager/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and controls
├── content.js            # YouTube page interaction
├── background.js         # Background service worker
├── styles.css            # All styling
├── icons/                # Extension icons
├── docs/                 # Documentation
│   ├── INSTALLATION.md
│   ├── USAGE.md
│   ├── FEATURES.md
│   ├── TROUBLESHOOTING.md
│   ├── CHANGELOG.md
│   └── CONTRIBUTING.md
├── LICENSE               # MIT License
├── README.md             # Main documentation
└── package.json          # Project metadata
```

### Key Files Explained

**manifest.json**
- Extension metadata and permissions
- Browser compatibility settings
- Content script and background script definitions

**popup.js**
- Main UI logic
- Event handlers for buttons
- Storage management
- Statistics and timer functions

**content.js**
- Runs on YouTube pages
- Handles comment posting
- Comment box detection
- Submit button interaction

**background.js**
- Service worker for background tasks
- Message passing coordination
- State management

**styles.css**
- All visual styling
- Animations and transitions
- Responsive design

## Coding Standards

### JavaScript Style

**Use ES6+ features:**
```javascript
// Good
const videoUrl = document.getElementById('videoUrl');
const comments = commentsTextarea.value.split('\n').filter(c => c.trim());

// Avoid
var videoUrl = document.getElementById('videoUrl');
var comments = [];
for (var i = 0; i < lines.length; i++) {
  if (lines[i].trim()) comments.push(lines[i]);
}
```

**Use async/await:**
```javascript
// Good
async function saveData() {
  try {
    await browserAPI.storage.local.set({ data });
  } catch (error) {
    console.error('Save failed:', error);
  }
}

// Avoid
function saveData() {
  browserAPI.storage.local.set({ data }).then(() => {
    // ...
  }).catch((error) => {
    // ...
  });
}
```

**Error handling:**
```javascript
// Always use try-catch with async functions
async function startTask() {
  try {
    const result = await doSomething();
    return result;
  } catch (error) {
    console.error('Task failed:', error);
    showError('An error occurred');
  }
}
```

### Code Organization

**Function naming:**
```javascript
// Clear, descriptive names
function updateStatisticsDisplay() { }
function startTimer() { }
function exportLogs() { }

// Avoid
function update() { }
function start() { }
function export() { }
```

**Comments:**
```javascript
// Good: Explain why, not what
// Use caching to avoid repeated DOM queries (60% faster)
const cachedButton = document.querySelector('.submit-button');

// Avoid: Stating the obvious
// Get the button
const button = document.querySelector('.submit-button');
```

**Constants:**
```javascript
// Use UPPER_CASE for constants
const MAX_RETRIES = 3;
const CACHE_DURATION = 5000;
const DEFAULT_DELAY = 5;
```

### CSS Style

**Use meaningful class names:**
```css
/* Good */
.stats-panel { }
.stat-item { }
.stat-value { }

/* Avoid */
.sp { }
.item { }
.val { }
```

**Organize by component:**
```css
/* Statistics Panel */
.stats-panel {
  display: grid;
  /* ... */
}

.stat-item {
  background: white;
  /* ... */
}

/* Progress Info */
.progress-info {
  background: white;
  /* ... */
}
```

**Use CSS variables for consistency:**
```css
:root {
  --primary-color: #667eea;
  --success-color: #22c55e;
  --error-color: #ef4444;
}
```

## Testing Your Changes

### Manual Testing Checklist

Before submitting, test these scenarios:

**Basic Functionality:**
- [ ] Extension loads without errors
- [ ] Popup opens correctly
- [ ] All buttons work
- [ ] Comments post successfully
- [ ] Progress updates correctly

**State Persistence:**
- [ ] Close popup during task
- [ ] Reopen popup
- [ ] Task continues correctly
- [ ] All data restored

**Error Handling:**
- [ ] Test with empty comments
- [ ] Test with invalid URL
- [ ] Test when not logged in
- [ ] Test with comments disabled video

**Cross-Browser:**
- [ ] Test in Firefox
- [ ] Test in Chrome
- [ ] Check console for errors
- [ ] Verify all features work

**Performance:**
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Fast response times

### Testing Tools

**Browser Console:**
```javascript
// Check for errors
console.log('Testing feature X');

// Verify storage
browser.storage.local.get(null).then(console.log);

// Test functions
// (Access via popup inspect)
```

**Performance Testing:**
```javascript
// Measure function performance
console.time('functionName');
functionName();
console.timeEnd('functionName');
```

## Submitting Changes

### Pull Request Process

**1. Commit Your Changes**
```bash
git add .
git commit -m "Add feature: description of your feature"
```

**Commit Message Format:**
```
Type: Brief description

Longer explanation if needed.

- Key point 1
- Key point 2
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Build/tooling changes

**Examples:**
```
feat: Add dark mode support

Added theme toggle in popup with dark/light options.
Uses CSS variables for easy theme switching.

- New toggle button in settings
- Dark theme CSS classes
- Persists theme choice
```

**2. Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

**3. Create Pull Request**
1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the template:
   - What does this PR do?
   - Why is this change needed?
   - How to test it?
   - Screenshots if UI changes

**4. Wait for Review**
- Maintainer will review your PR
- May request changes
- Make requested changes
- Push changes to same branch (PR updates automatically)

### Review Process

**What we look for:**
- Code quality and style
- Proper error handling
- No breaking changes
- Documentation updated
- Tests pass

**Review time:**
- Usually 2-5 days
- Complex changes may take longer
- Bug fixes prioritized

## Development Tips

### Debugging

**Console Logging:**
```javascript
// Structured logging
console.group('Comment Posting');
console.log('Video URL:', videoUrl);
console.log('Comments:', comments.length);
console.log('Delay:', delay);
console.groupEnd();
```

**Extension Debugging:**
```
Firefox:
1. about:debugging
2. Inspect Add-on
3. Console tab for errors

Chrome:
1. Right-click extension icon
2. "Inspect popup"
3. Console tab for errors
```

**Common Issues:**
- Cached old version: Reload extension
- Changes not showing: Hard refresh (Ctrl+Shift+R)
- Console errors: Check syntax and typos
- Storage issues: Clear extension storage

### Performance Tips

**Optimize DOM queries:**
```javascript
// Cache elements
const button = document.getElementById('myButton');
// Use multiple times

// Not this
document.getElementById('myButton').addEventListener(...);
document.getElementById('myButton').classList.add(...);
```

**Use event delegation:**
```javascript
// Good: One listener for many elements
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e.target);
  }
});

// Avoid: Multiple listeners
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick);
});
```

**Debounce frequent operations:**
```javascript
let timeout;
function debouncedSave() {
  clearTimeout(timeout);
  timeout = setTimeout(saveData, 500);
}
```

## Community Guidelines

### Code of Conduct

**Be respectful:**
- Welcome newcomers
- Be patient with questions
- Provide constructive feedback
- Respect different opinions

**Be helpful:**
- Answer questions when you can
- Share knowledge
- Help review PRs
- Improve documentation

**Be professional:**
- No harassment or discrimination
- Keep discussions on topic
- Use appropriate language
- Focus on the code, not the person

### Getting Help

**Stuck? Ask for help!**

- Comment on your PR
- Open a discussion on GitHub
- Email: haseebkaloya@gmail.com
- Include:
  - What you're trying to do
  - What you've tried
  - Error messages
  - Screenshots

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## Questions?

Have questions about contributing?

- Read existing issues and PRs
- Check documentation
- Ask in GitHub Discussions
- Email: haseebkaloya@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to YouTube Comment Manager!**

Your contributions help make this tool better for everyone.

*Happy coding!*
