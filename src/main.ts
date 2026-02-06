import './style.css';
import { createInitialState, getModeDuration, nextMode, type PomodoroState } from './state';
import { createTimer } from './timer';
import { ensureAudioContext, playNotification } from './audio';
import {
  updateTimerDisplay,
  updateProgressRing,
  updateModeIndicator,
  updateDots,
  updateButtonStates,
  updateSessionCount,
  formatTitleTime,
} from './ui';

// DOM elements
const timerDisplay = document.getElementById('timer-display')!;
const progressCircle = document.querySelector<SVGCircleElement>('.progress-ring__circle')!;
const btnStart = document.getElementById('btn-start')!;
const btnPause = document.getElementById('btn-pause')!;
const btnReset = document.getElementById('btn-reset')!;
const btnSkip = document.getElementById('btn-skip')!;
const sessionCountEl = document.getElementById('session-count')!;
const modeTabs = document.querySelectorAll<HTMLElement>('.mode-tab');

// State
let state: PomodoroState = createInitialState();
let currentDuration = getModeDuration(state.mode);

function refreshUI(remaining: number): void {
  updateTimerDisplay(timerDisplay, remaining);
  updateProgressRing(progressCircle, remaining, currentDuration);
  document.title = formatTitleTime(remaining, state.mode);
}

const timer = createTimer(
  (remaining) => refreshUI(remaining),
  () => handleTimerComplete(),
);

function handleTimerComplete(): void {
  playNotification();
  state = nextMode(state);
  currentDuration = getModeDuration(state.mode);
  updateModeIndicator(state.mode);
  updateDots(state.pomodorosCompleted);
  updateSessionCount(sessionCountEl, state.totalSessions);
  timer.start(currentDuration);
  updateButtonStates(btnStart, btnPause, true);
}

function setMode(newState: PomodoroState): void {
  timer.reset();
  state = newState;
  currentDuration = getModeDuration(state.mode);
  updateModeIndicator(state.mode);
  updateDots(state.pomodorosCompleted);
  updateSessionCount(sessionCountEl, state.totalSessions);
  refreshUI(currentDuration);
  updateButtonStates(btnStart, btnPause, false);
}

// Event listeners
btnStart.addEventListener('click', () => {
  ensureAudioContext();
  if (timer.isPaused()) {
    timer.resume();
  } else {
    timer.start(currentDuration);
  }
  updateButtonStates(btnStart, btnPause, true);
});

btnPause.addEventListener('click', () => {
  timer.pause();
  updateButtonStates(btnStart, btnPause, false);
});

btnReset.addEventListener('click', () => {
  timer.reset();
  currentDuration = getModeDuration(state.mode);
  refreshUI(currentDuration);
  updateButtonStates(btnStart, btnPause, false);
});

btnSkip.addEventListener('click', () => {
  ensureAudioContext();
  state = nextMode(state);
  currentDuration = getModeDuration(state.mode);
  timer.reset();
  updateModeIndicator(state.mode);
  updateDots(state.pomodorosCompleted);
  updateSessionCount(sessionCountEl, state.totalSessions);
  refreshUI(currentDuration);
  updateButtonStates(btnStart, btnPause, false);
});

modeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode as PomodoroState['mode'];
    if (mode && mode !== state.mode) {
      setMode({ ...state, mode });
    }
  });
});

// Refresh UI immediately when tab becomes visible (handles background throttling)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && timer.isRunning()) {
    refreshUI(timer.getRemaining());
  }
});

// Initial render
updateModeIndicator(state.mode);
updateDots(state.pomodorosCompleted);
refreshUI(currentDuration);
