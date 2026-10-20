import type { ExerciseTrackingState } from '../types/index';

const PIN_AUTH_KEY = 'appfit_auth_status';
const ACTIVE_SESSION_KEY = 'appfit_active_workout_session';
const TRACKING_STATE_KEY = 'appfit_tracking_exercises_state';

export const storage = {
  isPinAuthenticated: (): boolean => {
    try {
      return localStorage.getItem(PIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setPinAuthenticated: (val: boolean) => {
    try {
      if (val) {
        localStorage.setItem(PIN_AUTH_KEY, 'true');
      } else {
        localStorage.removeItem(PIN_AUTH_KEY);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getActiveSession: (): any | null => {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setActiveSession: (session: any | null) => {
    try {
      if (session) {
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getTrackingState: (): ExerciseTrackingState[] | null => {
    try {
      const data = localStorage.getItem(TRACKING_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setTrackingState: (exercises: ExerciseTrackingState[]) => {
    try {
      localStorage.setItem(TRACKING_STATE_KEY, JSON.stringify(exercises));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  clearActiveWorkout: () => {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.removeItem(TRACKING_STATE_KEY);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },
};
