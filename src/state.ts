export type Mode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  mode: Mode;
  pomodorosCompleted: number;
  totalSessions: number;
}

const DURATIONS: Record<Mode, number> = {
  work: 1500,
  shortBreak: 300,
  longBreak: 900,
};

export function createInitialState(): PomodoroState {
  return {
    mode: 'work',
    pomodorosCompleted: 0,
    totalSessions: 0,
  };
}

export function getModeDuration(mode: Mode): number {
  return DURATIONS[mode];
}

export function nextMode(state: PomodoroState): PomodoroState {
  if (state.mode === 'work') {
    const completed = state.pomodorosCompleted + 1;
    const totalSessions = state.totalSessions + 1;
    if (completed >= 4) {
      return { mode: 'longBreak', pomodorosCompleted: 0, totalSessions };
    }
    return { mode: 'shortBreak', pomodorosCompleted: completed, totalSessions };
  }
  return { ...state, mode: 'work' };
}
