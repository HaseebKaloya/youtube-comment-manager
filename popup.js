// YouTube Comment Manager - Popup Script v3.0.0
// Optimized for Firefox and Chrome
// Developer: HaseebKaloya

'use strict';

// Cross-browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Performance: Cache DOM elements
const videoUrlInput = document.getElementById('videoUrl');
const commentsTextarea = document.getElementById('comments');
const delayInput = document.getElementById('delay');
const randomizeDelayCheckbox = document.getElementById('randomizeDelay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusBox = document.getElementById('status');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const commentCount = document.getElementById('commentCount');
const logBox = document.getElementById('log');
const logContent = document.getElementById('logContent');
const backgroundIndicator = document.getElementById('backgroundIndicator');

// New UI elements
const statsPanel = document.getElementById('statsPanel');
const statSuccess = document.getElementById('statSuccess');
const statFailed = document.getElementById('statFailed');
const statRetries = document.getElementById('statRetries');
const statSpeed = document.getElementById('statSpeed');
const progressInfo = document.getElementById('progressInfo');
const progressCurrent = document.getElementById('progressCurrent');
const progressTotal = document.getElementById('progressTotal');
const timeElapsed = document.getElementById('timeElapsed');
const timeRemaining = document.getElementById('timeRemaining');
const logCount = document.getElementById('logCount');
const quickActions = document.getElementById('quickActions');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const skipBtn = document.getElementById('skipBtn');

// State management
let isRunning = false;
let isPaused = false;
let stats = {
  success: 0,
  failed: 0,
  retries: 0
};
let startTime = null;
let timerInterval = null;
let logEntries = [];
let currentFilter = 'all';

// Load saved data and restore state on popup open
async function initializePopup() {
  try {
    const data = await browserAPI.storage.local.get([
      'videoUrl', 'comments', 'delay', 'randomizeDelay',
      'isRunning', 'currentProgress', 'totalComments', 'stats', 'startTime'
    ]);
    
    // Restore form data
    if (data.videoUrl) videoUrlInput.value = data.videoUrl;
    if (data.comments) commentsTextarea.value = data.comments;
    if (data.delay) delayInput.value = data.delay;
    if (data.randomizeDelay !== undefined) randomizeDelayCheckbox.checked = data.randomizeDelay;
    updateCommentCount();
    
    // Restore running state if task was active
    if (data.isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      videoUrlInput.disabled = true;
      commentsTextarea.disabled = true;
      delayInput.disabled = true;
      randomizeDelayCheckbox.disabled = true;
      
      // Show all panels
      if (backgroundIndicator) backgroundIndicator.classList.remove('hidden');
      if (statsPanel) statsPanel.classList.remove('hidden');
      if (progressInfo) progressInfo.classList.remove('hidden');
      if (quickActions) quickActions.classList.remove('hidden');
      
      showStatus('Task running in background...', 'info');
      
      // Restore progress
      if (data.currentProgress !== undefined && data.totalComments) {
        const percentage = Math.round((data.currentProgress / data.totalComments) * 100);
        progressBar.style.width = percentage + '%';
        if (progressCurrent) progressCurrent.textContent = data.currentProgress;
        if (progressTotal) progressTotal.textContent = data.totalComments;
      }
      
      // Restore stats
      if (data.stats) {
        stats = data.stats;
        updateStatisticsDisplay();
      }
      
      // Resume timer if it was running
      if (data.startTime) {
        startTime = data.startTime;
        startTimer();
      }
      
      addLog('⚡ Resuming task monitoring...', 'info');
      addLog(`📊 Current progress: ${data.currentProgress || 0}/${data.totalComments || 0}`, 'info');
    } else {
      // Hide all panels
      if (backgroundIndicator) backgroundIndicator.classList.add('hidden');
      if (statsPanel) statsPanel.classList.add('hidden');
      if (progressInfo) progressInfo.classList.add('hidden');
      if (quickActions) quickActions.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
}

initializePopup();

// Debounced save for better performance
let saveTimeout;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveData, 500);
}

// Update comment count with debouncing
commentsTextarea.addEventListener('input', () => {
  updateCommentCount();
  debouncedSave();
});

videoUrlInput.addEventListener('input', debouncedSave);
delayInput.addEventListener('input', debouncedSave);
randomizeDelayCheckbox.addEventListener('change', saveData);

function updateCommentCount() {
  const comments = getComments();
  commentCount.textContent = comments.length;
}

function saveData() {
  browserAPI.storage.local.set({
    videoUrl: videoUrlInput.value,
    comments: commentsTextarea.value,
    delay: delayInput.value,
    randomizeDelay: randomizeDelayCheckbox.checked,
    isRunning: isRunning,
    stats: stats
  }).catch((error) => {
    console.error('Error saving data:', error);
  });
}

function getComments() {
  return commentsTextarea.value
    .split('\n')
    .map(comment => comment.trim())
    .filter(comment => comment.length > 0);
}

function validateInputs() {
  const url = videoUrlInput.value.trim();
  const comments = getComments();
  const delay = parseInt(delayInput.value);

  if (!url) {
    showError('⚠️ Please enter a YouTube video URL');
    return false;
  }

  if (!isValidYouTubeUrl(url)) {
    showError('❌ Invalid YouTube URL. Please check and try again');
    return false;
  }

  if (comments.length === 0) {
    showError('📝 Please enter at least one comment');
    return false;
  }

  if (comments.length > 100) {
    showError('⚠️ Maximum 100 comments per session for safety');
    return false;
  }

  if (delay < 2 || delay > 60) {
    showError('⏱️ Delay must be between 2 and 60 seconds');
    return false;
  }

  return true;
}

function isValidYouTubeUrl(url) {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/watch\?v=[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

function showStatus(message, type = 'info') {
  statusBox.classList.remove('hidden', 'error', 'success');
  if (type === 'error') statusBox.classList.add('error');
  if (type === 'success') statusBox.classList.add('success');
  statusText.textContent = message;
}

function showError(message) {
  showStatus(message, 'error');
  addLog(message, 'error');
}

function showSuccess(message) {
  showStatus(message, 'success');
  addLog(message, 'success');
}

function addLog(message, type = 'info') {
  logBox.classList.remove('hidden');
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  logEntry.setAttribute('data-type', type);
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  // Apply current filter
  if (currentFilter !== 'all' && type !== currentFilter) {
    logEntry.classList.add('hidden');
  }
  
  logContent.appendChild(logEntry);
  logContent.scrollTop = logContent.scrollHeight;
  
  // Store log entry
  logEntries.push({ timestamp, message, type });
  
  // Update log count
  if (logCount) {
    const visibleCount = logContent.querySelectorAll('.log-entry:not(.hidden)').length;
    logCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'entry' : 'entries'}`;
  }
}

function updateProgress(current, total) {
  const percentage = (current / total) * 100;
  progressBar.style.width = `${percentage}%`;
}

// Enhanced functions for statistics and timing
function updateStatisticsDisplay() {
  if (statSuccess) statSuccess.textContent = stats.success;
  if (statFailed) statFailed.textContent = stats.failed;
  if (statRetries) statRetries.textContent = stats.retries;
  
  if (startTime && stats.success > 0) {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const speed = elapsedMinutes > 0 ? (stats.success / elapsedMinutes).toFixed(1) : '--';
    if (statSpeed) statSpeed.textContent = `${speed}/min`;
  }
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const elapsedSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    if (timeElapsed) {
      timeElapsed.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    const currentProg = parseInt(progressCurrent?.textContent || 0);
    const totalComm = parseInt(progressTotal?.textContent || 0);
    
    if (currentProg > 0 && totalComm > 0) {
      const avgTime = elapsed / currentProg;
      const remaining = totalComm - currentProg;
      const remainingMs = avgTime * remaining;
      const remSeconds = Math.floor(remainingMs / 1000);
      const remMin = Math.floor(remSeconds / 60);
      const remSec = remSeconds % 60;
      
      if (timeRemaining) {
        timeRemaining.textContent = `${String(remMin).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Log filtering
function filterLogs(filterType) {
  currentFilter = filterType;
  const allEntries = logContent.querySelectorAll('.log-entry');
  
  allEntries.forEach(entry => {
    const entryType = entry.getAttribute('data-type');
    if (filterType === 'all' || entryType === filterType) {
      entry.classList.remove('hidden');
    } else {
      entry.classList.add('hidden');
    }
  });
  
  if (logCount) {
    const visibleCount = logContent.querySelectorAll('.log-entry:not(.hidden)').length;
    logCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'entry' : 'entries'}`;
  }
}

// Export logs
function exportLogs() {
  if (logEntries.length === 0) {
    alert('No logs to export');
    return;
  }
  
  const logText = logEntries.map(entry => {
    return `[${entry.timestamp}] [${entry.type.toUpperCase()}] ${entry.message}`;
  }).join('\n');
  
  const blob = new Blob([logText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `youtube-comment-log-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addLog('📥 Logs exported', 'info');
}

// Start button click handler
startBtn.addEventListener('click', async function startCommenting() {
  if (!validateInputs()) return;

  const url = videoUrlInput.value.trim();
  const comments = getComments();
  const delay = parseInt(delayInput.value);
  const randomizeDelay = randomizeDelayCheckbox.checked;

  // Get active tab
  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab.url.includes('youtube.com')) {
      showError('Please open a YouTube video page first');
      return;
    }

    // Disable inputs and enable stop button
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    videoUrlInput.disabled = true;
    commentsTextarea.disabled = true;
    delayInput.disabled = true;
    randomizeDelayCheckbox.disabled = true;
    
    // Show all panels
    if (backgroundIndicator) backgroundIndicator.classList.remove('hidden');
    if (statsPanel) statsPanel.classList.remove('hidden');
    if (progressInfo) progressInfo.classList.remove('hidden');
    if (quickActions) quickActions.classList.remove('hidden');

    // Reset stats and update displays
    stats = { success: 0, failed: 0, retries: 0 };
    progressBar.style.width = '0%';
    if (progressCurrent) progressCurrent.textContent = '0';
    if (progressTotal) progressTotal.textContent = comments.length;
    updateStatisticsDisplay();
    
    // Start timer
    startTime = Date.now();
    startTimer();

    // Save running state immediately
    await browserAPI.storage.local.set({
      isRunning: true,
      totalComments: comments.length,
      currentProgress: 0,
      stats: stats,
      startTime: startTime
    });

    showStatus('Starting...', 'info');
    addLog('🚀 Starting comment automation...', 'info');
    addLog(`📝 Total comments to post: ${comments.length}`, 'info');
    addLog(`⏱ Delay between comments: ${delay} seconds${randomizeDelay ? ' (with random variation)' : ''}`, 'info');

    // Send message to content script
    const message = {
      action: 'startCommenting',
      comments: comments,
      delay: delay * 1000,
      randomizeDelay: randomizeDelay
    };

    await browserAPI.tabs.sendMessage(tab.id, message);
  } catch (error) {
    showError('Failed to communicate with YouTube page');
    addLog(`Error: ${error.message}`, 'error');
    resetUI();
  }
});

// Stop button click handler
stopBtn.addEventListener('click', async () => {
  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    await browserAPI.tabs.sendMessage(tab.id, {
      action: 'stopCommenting'
    });

    showStatus('Stopping...', 'info');
    addLog('Stop requested by user', 'info');
  } catch (error) {
    console.error('Error stopping:', error);
  }
  resetUI();
});

async function resetUI() {
  isRunning = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  videoUrlInput.disabled = false;
  commentsTextarea.disabled = false;
  delayInput.disabled = false;
  randomizeDelayCheckbox.disabled = false;
  progressBar.style.width = '0%';
  statusBox.classList.add('hidden');
  
  // Hide all panels
  if (backgroundIndicator) backgroundIndicator.classList.add('hidden');
  if (statsPanel) statsPanel.classList.add('hidden');
  if (progressInfo) progressInfo.classList.add('hidden');
  if (quickActions) quickActions.classList.add('hidden');
  
  // Stop timer
  stopTimer();
  startTime = null;
  
  // Clear running state from storage
  try {
    await browserAPI.storage.local.set({
      isRunning: false,
      currentProgress: 0,
      totalComments: 0,
      startTime: null
    });
  } catch (error) {
    console.error('Error clearing running state:', error);
  }
}

function updateStats() {
  // Update stats in status text if needed
  const statsText = `Success: ${stats.success} | Failed: ${stats.failed} | Retries: ${stats.retries}`;
  console.log('Stats:', statsText);
}

function displayFinalStats() {
  const statsText = `📊 Final Stats - Success: ${stats.success}, Failed: ${stats.failed}, Total Retries: ${stats.retries}`;
  addLog(statsText, 'info');
  
  // Reset stats for next run
  setTimeout(() => {
    stats = { success: 0, failed: 0, retries: 0 };
  }, 5000);
}

// Listen for messages from content script
browserAPI.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'commentProgress') {
    const { current, total } = message;
    const percentage = Math.round((current / total) * 100);
    progressBar.style.width = percentage + '%';
    showStatus(`Posting comment ${current}/${total}...`, 'info');
    addLog(`✓ Comment ${current}/${total} posted successfully`, 'success');
    stats.success++;
    
    // Update progress displays
    if (progressCurrent) progressCurrent.textContent = current;
    if (progressTotal) progressTotal.textContent = total;
    updateStatisticsDisplay();
    
    // Update progress in storage for persistence
    await browserAPI.storage.local.set({
      currentProgress: current,
      totalComments: total,
      stats: stats
    });
  } else if (message.action === 'commentError') {
    addLog(`✗ Error: ${message.error}`, 'error');
    stats.failed++;
    updateStatisticsDisplay();
    await browserAPI.storage.local.set({ stats: stats });
  } else if (message.action === 'commentRetry') {
    addLog(`⟳ Retrying comment ${message.current}/${message.total} (Attempt ${message.attempt}/${message.maxRetries})`, 'info');
    stats.retries++;
    updateStatisticsDisplay();
    await browserAPI.storage.local.set({ stats: stats });
  } else if (message.action === 'commentComplete') {
    progressBar.style.width = '100%';
    showStatus('All comments posted!', 'success');
    addLog('🎉 All comments posted successfully!', 'success');
    displayFinalStats();
    setTimeout(() => resetUI(), 2000);
  } else if (message.action === 'commentStopped') {
    showStatus('Stopped by user', 'info');
    addLog('⏸ Commenting stopped by user', 'info');
    displayFinalStats();
    await resetUI();
  }
});

// Clear log button
const clearLogBtn = document.getElementById('clearLog');
if (clearLogBtn) {
  clearLogBtn.addEventListener('click', () => {
    logContent.innerHTML = '';
    logEntries = [];
    addLog('Log cleared', 'info');
  });
}

// Log filter buttons
document.getElementById('filterAll')?.addEventListener('click', () => {
  filterLogs('all');
  document.querySelectorAll('.log-filter').forEach(btn => btn.classList.remove('active'));
  document.getElementById('filterAll').classList.add('active');
});

document.getElementById('filterSuccess')?.addEventListener('click', () => {
  filterLogs('success');
  document.querySelectorAll('.log-filter').forEach(btn => btn.classList.remove('active'));
  document.getElementById('filterSuccess').classList.add('active');
});

document.getElementById('filterError')?.addEventListener('click', () => {
  filterLogs('error');
  document.querySelectorAll('.log-filter').forEach(btn => btn.classList.remove('active'));
  document.getElementById('filterError').classList.add('active');
});

document.getElementById('filterInfo')?.addEventListener('click', () => {
  filterLogs('info');
  document.querySelectorAll('.log-filter').forEach(btn => btn.classList.remove('active'));
  document.getElementById('filterInfo').classList.add('active');
});

// Export logs button
document.getElementById('exportLog')?.addEventListener('click', exportLogs);

// Quick action buttons
if (pauseBtn) {
  pauseBtn.addEventListener('click', async () => {
    try {
      const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
      await browserAPI.tabs.sendMessage(tabs[0].id, { action: 'pauseCommenting' });
      isPaused = true;
      pauseBtn.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      stopTimer();
      addLog('⏸ Paused', 'info');
    } catch (error) {
      console.error('Pause error:', error);
    }
  });
}

if (resumeBtn) {
  resumeBtn.addEventListener('click', async () => {
    try {
      const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
      await browserAPI.tabs.sendMessage(tabs[0].id, { action: 'resumeCommenting' });
      isPaused = false;
      pauseBtn.classList.remove('hidden');
      resumeBtn.classList.add('hidden');
      startTimer();
      addLog('▶ Resumed', 'info');
    } catch (error) {
      console.error('Resume error:', error);
    }
  });
}

if (skipBtn) {
  skipBtn.addEventListener('click', async () => {
    try {
      const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
      await browserAPI.tabs.sendMessage(tabs[0].id, { action: 'skipComment' });
      addLog('⏭ Skipped current comment', 'info');
    } catch (error) {
      console.error('Skip error:', error);
    }
  });
}

// Save state when popup closes (but keep task running in background)
window.addEventListener('beforeunload', async () => {
  if (isRunning) {
    try {
      await browserAPI.storage.local.set({
        isRunning: true,
        stats: stats,
        videoUrl: videoUrlInput.value,
        comments: commentsTextarea.value,
        delay: delayInput.value,
        randomizeDelay: randomizeDelayCheckbox.checked
      });
    } catch (error) {
      console.error('Error saving state on close:', error);
    }
  }
});

// Initialize
updateCommentCount();
console.log('YouTube Comment Manager v3.0.0 - Popup initialized');
console.log('Developer: HaseebKaloya');
