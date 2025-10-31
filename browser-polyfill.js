// Cross-browser compatibility layer for Chrome and Firefox
// This ensures the extension works on both browsers seamlessly

(function() {
  'use strict';

  // Check if we're running in Firefox or Chrome
  const isFirefox = typeof browser !== 'undefined';
  const isChrome = typeof chrome !== 'undefined' && typeof browser === 'undefined';

  // Create a unified API object
  if (isChrome && !isFirefox) {
    // Chrome environment - wrap chrome API to support promises
    window.browser = {
      runtime: {
        sendMessage: promisify(chrome.runtime.sendMessage),
        onMessage: chrome.runtime.onMessage,
        onInstalled: chrome.runtime.onInstalled,
        onStartup: chrome.runtime.onStartup,
        lastError: chrome.runtime.lastError
      },
      tabs: {
        query: promisify(chrome.tabs.query),
        sendMessage: promisify(chrome.tabs.sendMessage),
        update: promisify(chrome.tabs.update)
      },
      storage: {
        local: {
          get: promisify(chrome.storage.local.get),
          set: promisify(chrome.storage.local.set),
          remove: promisify(chrome.storage.local.remove),
          clear: promisify(chrome.storage.local.clear)
        }
      },
      scripting: chrome.scripting ? {
        executeScript: promisify(chrome.scripting.executeScript)
      } : null
    };

    // Keep chrome object available for backward compatibility
    window.chrome = chrome;
  }

  // Helper function to convert callback-based APIs to promises
  function promisify(fn) {
    if (!fn) return null;
    
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn.call(this, ...args, (...results) => {
          const error = chrome?.runtime?.lastError || browser?.runtime?.lastError;
          if (error) {
            reject(error);
          } else {
            resolve(results.length <= 1 ? results[0] : results);
          }
        });
      });
    };
  }

  console.log(`KaloyaXploit AutoCommentBot - Running on ${isFirefox ? 'Firefox' : 'Chrome'}`);
})();
