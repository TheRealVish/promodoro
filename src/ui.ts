import type { Mode } from './state';

const CIRCUMFERENCE = 2 * Math.PI * 100; // r=100

export function updateTimerDisplay(el: HTMLElement, seconds: number): void {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function updateProgressRing(circle: SVGCircleElement, remaining: number, total: number): void {
  const progress = total > 0 ? remaining / total : 1;
  circle.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
}

export function updateModeIndicator(mode: Mode): void {
  document.body.className = `mode-${mode}`;

  document.querySelectorAll('.mode-tab').forEach((tab) => {
    const el = tab as HTMLElement;
    el.classList.toggle('active', el.dataset.mode === mode);
  });
}

export function updateDots(pomodorosCompleted: number): void {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('filled', i < pomodorosCompleted);
  });
}

export function updateButtonStates(
  btnStart: HTMLElement,
  btnPause: HTMLElement,
  running: boolean,
): void {
  btnStart.classList.toggle('hidden', running);
  btnPause.classList.toggle('hidden', !running);
}

export function updateSessionCount(el: HTMLElement, count: number): void {
  el.textContent = String(count);
}

export function formatTitleTime(seconds: number, mode: Mode): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const time = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const label = mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Break' : 'Long Break';
  return `${time} - ${label} | Pomodoro`;
}
