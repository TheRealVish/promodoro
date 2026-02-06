export interface Timer {
  start(durationSeconds: number): void;
  pause(): void;
  resume(): void;
  reset(): void;
  isRunning(): boolean;
  isPaused(): boolean;
  getRemaining(): number;
}

export function createTimer(
  onTick: (remaining: number) => void,
  onComplete: () => void,
): Timer {
  let intervalId: number | null = null;
  let targetEndTime = 0;
  let remainingAtPause = 0;
  let running = false;
  let paused = false;
  let lastDisplayed = -1;

  function tick() {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

    if (remaining !== lastDisplayed) {
      lastDisplayed = remaining;
      onTick(remaining);
    }

    if (remaining <= 0) {
      stop();
      onComplete();
    }
  }

  function startInterval() {
    intervalId = window.setInterval(tick, 250);
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    running = false;
    paused = false;
  }

  return {
    start(durationSeconds: number) {
      stop();
      targetEndTime = Date.now() + durationSeconds * 1000;
      remainingAtPause = 0;
      running = true;
      paused = false;
      lastDisplayed = -1;
      onTick(durationSeconds);
      startInterval();
    },

    pause() {
      if (!running || paused) return;
      remainingAtPause = Math.max(0, targetEndTime - Date.now());
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      paused = true;
    },

    resume() {
      if (!running || !paused) return;
      targetEndTime = Date.now() + remainingAtPause;
      paused = false;
      lastDisplayed = -1;
      startInterval();
    },

    reset() {
      stop();
      lastDisplayed = -1;
    },

    isRunning() {
      return running && !paused;
    },

    isPaused() {
      return running && paused;
    },

    getRemaining() {
      if (!running) return 0;
      if (paused) return Math.ceil(remainingAtPause / 1000);
      return Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
    },
  };
}
