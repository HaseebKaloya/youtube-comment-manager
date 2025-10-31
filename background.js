// Background service worker for YouTube Comment Manager v3.0.0
// Optimized for Firefox and Chrome
// Developer: HaseebKaloya

'use strict';

// Cross-browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Extension configuration
const EXTENSION_CONFIG = {
  version: '3.0.0',
  name: 'YouTube Comment Manager',
  developer: 'HaseebKaloya'
};

// Listen for installation
browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log(`${EXTENSION_CONFIG.name} v${EXTENSION_CONFIG.version} installed successfully!`);
    console.log(`Developer: ${EXTENSION_CONFIG.developer}`);
    console.log('Optimized for Firefox and Chrome');
    
    // Set default settings with optimized values
    browserAPI.storage.local.set({
      delay: 7, // Optimal default delay
      comments: '',
      videoUrl: '',
      randomizeDelay: true
    }).then(() => {
      console.log('Default settings initialized');
    }).catch((error) => {
      console.error('Error initializing settings:', error);
    });
  } else if (details.reason === 'update') {
    console.log(`${EXTENSION_CONFIG.name} updated to v${EXTENSION_CONFIG.version}!`);
    console.log('New: Enhanced performance, better Firefox compatibility, SEO optimization');
  }
});

// Handle messages from popup and content scripts
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward messages between popup and content script if needed
  if (message.action === 'commentProgress' || 
      message.action === 'commentError' || 
      message.action === 'commentComplete' ||
      message.action === 'commentStopped' ||
      message.action === 'commentRetry') {
    // These messages are sent from content script to popup
    // Background script receives them but they're handled by popup
    return true;
  }
  
  // Handle state queries
  if (message.action === 'getExtensionState') {
    browserAPI.storage.local.get(['isRunning', 'currentProgress', 'totalComments', 'stats']).then((data) => {
      sendResponse(data);
    }).catch((error) => {
      console.error('Error getting extension state:', error);
      sendResponse({ error: error.message });
    });
    return true; // Keep channel open for async response
  }
  
  return true;
});

// Keep service worker alive if needed
browserAPI.runtime.onStartup.addListener(() => {
  console.log(`${EXTENSION_CONFIG.name} v${EXTENSION_CONFIG.version} - Service worker started`);
  console.log(`Developer: ${EXTENSION_CONFIG.developer}`);
});

// Performance monitoring (optional)
if (typeof performance !== 'undefined') {
  console.log(`${EXTENSION_CONFIG.name} background script loaded in ${performance.now().toFixed(2)}ms`);
} else {
  console.log(`${EXTENSION_CONFIG.name} background script loaded successfully`);
}

console.log('Cross-browser support: Firefox & Chrome optimized');
