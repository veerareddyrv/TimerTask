import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

const saveToLocalStorage = (state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("timerState", serializedState);
  } catch (error) {
    console.error("Could not save state", error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("timerState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state", error);
    return undefined;
  }
};

const initialState = {
  timers: [] as Timer[],
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer) => timer.id !== action.payload
      );
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    updateTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer && timer.isRunning) {
        timer.remainingTime -= 1;
        timer.isRunning = timer.remainingTime > 0;
      }
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(
        (timer) => timer.id === action.payload.id
      );
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
  },
});

const preloadedState = loadFromLocalStorage(); // Load state from localStorage

const store = configureStore({
  reducer: timerSlice.reducer,
  preloadedState, // Preload state from localStorage
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) =>
      dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) =>
      dispatch(editTimer({ id, updates })),
  };
};
