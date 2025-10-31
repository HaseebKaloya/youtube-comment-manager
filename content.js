// Content script for YouTube Comment Manager
// Optimized for Firefox and Chrome - v3.0.0
// Developer: HaseebKaloya

'use strict';

// Cross-browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// State management
let isCommenting = false;
let shouldStop = false;
let isPaused = false;

// Performance optimized constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const SELECTOR_CACHE_TIME = 5000;

// Cached selectors for performance
let cachedSelectors = {
  commentBox: null,
  submitButton: null,
  timestamp: 0
};

// Listen for messages from popup
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startCommenting') {
    if (!isCommenting) {
      startCommenting(message.comments, message.delay, message.randomizeDelay);
      sendResponse({ status: 'started' });
    } else {
      sendResponse({ status: 'already_running' });
    }
  } else if (message.action === 'stopCommenting') {
    shouldStop = true;
    isCommenting = false;
    sendResponse({ status: 'stopped' });
  } else if (message.action === 'pauseCommenting') {
    isPaused = true;
    sendResponse({ status: 'paused' });
  } else if (message.action === 'resumeCommenting') {
    isPaused = false;
    sendResponse({ status: 'resumed' });
  } else if (message.action === 'getStatus') {
    // New action to check current status
    sendResponse({ 
      isCommenting: isCommenting,
      isPaused: isPaused,
      shouldStop: shouldStop
    });
  }
  
  return true; // Keep message channel open for async response
});

async function startCommenting(comments, delay, randomizeDelay = false) {
  isCommenting = true;
  shouldStop = false;
  let completedCount = 0;

  try {
    // Scroll to comments section
    await scrollToComments();
    await sleep(1000);

    // Focus on comment box to make it appear
    const commentBox = await waitForCommentBox();
    if (!commentBox) {
      sendError('Could not find comment box. Make sure you are logged in to YouTube.');
      isCommenting = false;
      return;
    }

    // Post each comment
    for (let i = 0; i < comments.length; i++) {
      // Handle pause
      while (isPaused && !shouldStop) {
        await sleep(500);
      }

      if (shouldStop) {
        sendMessage({
          action: 'commentStopped',
          completed: completedCount
        });
        break;
      }

      const comment = comments[i];
      console.log(`Attempting to post comment ${i + 1}/${comments.length}: "${comment.substring(0, 30)}..."`);
      
      // Try posting with retries
      let success = false;
      let retryCount = 0;
      
      while (!success && retryCount < MAX_RETRIES && !shouldStop) {
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount}/${MAX_RETRIES - 1}`);
          sendMessage({
            action: 'commentRetry',
            current: i + 1,
            retry: retryCount,
            total: comments.length
          });
          await sleep(RETRY_DELAY);
          // Re-activate comment box before retry
          await activateCommentBox();
        }
        
        success = await postComment(comment, i);
        
        if (!success) {
          retryCount++;
        }
      }

      if (success) {
        completedCount++;
        sendMessage({
          action: 'commentProgress',
          current: completedCount,
          total: comments.length
        });
        console.log(`Successfully posted comment ${completedCount}/${comments.length}`);

        // Wait and prepare for next comment
        if (i < comments.length - 1) {
          const actualDelay = randomizeDelay ? getRandomizedDelay(delay) : delay;
          console.log(`Waiting ${actualDelay}ms before next comment...`);
          await sleep(actualDelay);
          // Reactivate comment box for next comment
          await activateCommentBox();
          await sleep(500);
        }
      } else {
        sendError(`Failed to post comment after ${MAX_RETRIES} attempts: "${comment.substring(0, 50)}..."`);
        console.error(`Failed to post comment ${i + 1} after all retries`);
        // Continue with next comment
      }
    }

    // Send completion message if all done
    if (!shouldStop && completedCount > 0) {
      sendMessage({
        action: 'commentComplete',
        total: completedCount
      });
    }

  } catch (error) {
    sendError(`Error during commenting: ${error.message}`);
  } finally {
    isCommenting = false;
    shouldStop = false;
  }
}

async function scrollToComments() {
  return new Promise((resolve) => {
    // Try to find comments section
    const commentsSection = document.querySelector('#comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If not found, scroll down a bit
      window.scrollBy(0, 800);
    }
    setTimeout(resolve, 1000);
  });
}

async function waitForCommentBox(timeout = 10000) {
  const startTime = Date.now();
  let attemptCount = 0;
  
  while (Date.now() - startTime < timeout) {
    attemptCount++;
    const activated = await activateCommentBox();
    if (activated) {
      console.log(`Comment box found in ${attemptCount} attempts`);
      return activated;
    }
    // Progressive delay for better performance
    await sleep(attemptCount < 5 ? 300 : 500);
  }

  console.error('Comment box not found within timeout');
  return null;
}

async function activateCommentBox() {
  // Check cache first for performance
  const now = Date.now();
  if (cachedSelectors.commentBox && (now - cachedSelectors.timestamp < SELECTOR_CACHE_TIME)) {
    const cached = document.querySelector(cachedSelectors.commentBox);
    if (cached) {
      cached.click();
      await sleep(600);
      return cached;
    }
  }
  
  // Optimized selectors in order of likelihood (Firefox compatible)
  const selectors = [
    '#simplebox-placeholder',
    '#placeholder-area',
    'ytd-comment-simplebox-renderer',
    '#comment-input',
    '.ytd-comment-simplebox-renderer'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.offsetParent !== null) {
      // Click to focus
      element.click();
      await sleep(600);
      
      // Cache successful selector
      cachedSelectors.commentBox = selector;
      cachedSelectors.timestamp = now;
      
      console.log(`Activated comment box using: ${selector}`);
      return element;
    }
  }

  console.warn('Comment box activation failed');
  return null;
}

async function postComment(commentText, commentIndex) {
  try {
    console.log(`[Comment ${commentIndex + 1}] Starting post process...`);
    
    // Find the comment input area - try multiple methods
    let commentInput = await findCommentInput();
    
    if (!commentInput) {
      console.error('[postComment] Could not find comment input field');
      return false;
    }

    console.log(`[Comment ${commentIndex + 1}] Found comment input field`);

    // Focus the input
    commentInput.focus();
    await sleep(300);

    // Clear any existing content
    commentInput.textContent = '';
    commentInput.innerText = '';
    
    // Dispatch input event to clear
    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(200);

    // Set the comment text using multiple methods for reliability
    commentInput.textContent = commentText;
    commentInput.innerText = commentText;
    
    // Trigger multiple events to ensure YouTube recognizes the input
    const events = [
      new Event('input', { bubbles: true }),
      new Event('change', { bubbles: true }),
      new InputEvent('input', { bubbles: true, inputType: 'insertText', data: commentText })
    ];
    
    events.forEach(event => commentInput.dispatchEvent(event));
    
    await sleep(700);
    
    console.log(`[Comment ${commentIndex + 1}] Text entered: "${commentText.substring(0, 30)}..."`);

    // Find and click the submit button
    const submitButton = await findSubmitButton();
    if (!submitButton) {
      console.error('[postComment] Could not find submit button');
      return false;
    }

    // Check if button is enabled
    if (submitButton.hasAttribute('disabled') || submitButton.getAttribute('aria-disabled') === 'true') {
      console.error('[postComment] Submit button is disabled');
      return false;
    }

    console.log(`[Comment ${commentIndex + 1}] Clicking submit button...`);
    // Click the submit button
    submitButton.click();
    await sleep(1500);

    // Verify comment was posted
    const isPosted = await verifyCommentPosted(commentInput);
    
    if (isPosted) {
      console.log(`[Comment ${commentIndex + 1}] ✓ Successfully posted`);
    } else {
      console.error(`[Comment ${commentIndex + 1}] ✗ Verification failed`);
    }
    
    return isPosted;

  } catch (error) {
    console.error(`[Comment ${commentIndex + 1}] Error:`, error);
    return false;
  }
}

async function findCommentInput() {
  // Optimized selectors for Firefox and Chrome
  const selectors = [
    '#contenteditable-root[contenteditable="true"]',
    'div#contenteditable-root[contenteditable="true"]',
    '[aria-label*="comment" i][contenteditable="true"]',
    'ytd-commentbox-renderer #contenteditable-root',
    '#contenteditable-textarea[contenteditable="true"]'
  ];

  for (const selector of selectors) {
    const input = document.querySelector(selector);
    if (input && input.isContentEditable && input.offsetParent !== null) {
      return input;
    }
  }

  // Last resort: try to activate and find
  await activateCommentBox();
  await sleep(400);
  
  const fallbackInput = document.querySelector('#contenteditable-root[contenteditable="true"]');
  return fallbackInput && fallbackInput.isContentEditable ? fallbackInput : null;
}

async function verifyCommentPosted(commentInput) {
  // Multiple verification methods
  await sleep(800);
  
  // Method 1: Check if input is cleared
  const isCleared = !commentInput.textContent || commentInput.textContent.trim() === '';
  
  // Method 2: Check if submit button is hidden/disabled again
  const submitButton = await findSubmitButton();
  const buttonHidden = !submitButton || submitButton.hasAttribute('disabled') || 
                       submitButton.getAttribute('aria-disabled') === 'true' ||
                       submitButton.offsetParent === null;
  
  return isCleared || buttonHidden;
}

async function findSubmitButton() {
  // Check cache for performance
  const now = Date.now();
  if (cachedSelectors.submitButton && (now - cachedSelectors.timestamp < SELECTOR_CACHE_TIME)) {
    const cached = document.querySelector(cachedSelectors.submitButton);
    if (cached && cached.offsetParent !== null && !cached.hasAttribute('disabled')) {
      return cached;
    }
  }
  
  // Optimized selectors for Firefox and Chrome
  const selectors = [
    'ytd-commentbox-renderer #submit-button button',
    '#submit-button button',
    'ytd-button-renderer#submit-button button',
    'button[aria-label*="Comment" i]',
    '#simplebox-submit-button button',
    '.ytd-commentbox button[type="submit"]'
  ];

  for (const selector of selectors) {
    const buttons = document.querySelectorAll(selector);
    for (const button of buttons) {
      // Check if visible and enabled
      if (button && button.offsetParent !== null && 
          !button.hasAttribute('disabled') &&
          button.getAttribute('aria-disabled') !== 'true') {
        
        // Cache successful selector
        cachedSelectors.submitButton = selector;
        cachedSelectors.timestamp = now;
        
        return button;
      }
    }
  }

  console.warn('Submit button not found or disabled');
  return null;
}

function sendMessage(message) {
  browserAPI.runtime.sendMessage(message).catch(err => {
    console.error('Failed to send message:', err);
  });
}

function sendError(error) {
  console.error('[sendError]', error);
  browserAPI.runtime.sendMessage({
    action: 'commentError',
    error: error
  }).catch(err => console.error('Failed to send error message:', err));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomizedDelay(baseDelay) {
  // Add random variation of ±2 seconds (±2000ms)
  const variation = Math.floor(Math.random() * 4000) - 2000;
  const randomizedDelay = Math.max(2000, baseDelay + variation); // Ensure minimum 2 seconds
  return randomizedDelay;
}

// Cleanup on unload for better memory management
window.addEventListener('beforeunload', () => {
  isCommenting = false;
  shouldStop = true;
  cachedSelectors = { commentBox: null, submitButton: null, timestamp: 0 };
});

// Log that content script is loaded
console.log('YouTube Comment Manager v3.0.0 - Content script loaded (Optimized for Firefox)');
console.log('Developer: HaseebKaloya');
