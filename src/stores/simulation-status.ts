import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isRunning: boolean;
  isPaused: boolean;
  algorithm: "fcfs";
}

interface Actions {
  pause: () => void;
  resume: () => void;
  start: () => void;
  stop: () => void;
  setAlgorithm: (algorithm: State["algorithm"]) => void;
}

export const useSimulationStatus = create<State & Actions>()(
  persist(
    (set) => ({
      isRunning: false,
      isPaused: false,
      algorithm: "fcfs",
      pause() {
        set({ isPaused: true });
      },
      resume() {
        set({ isPaused: false });
      },
      start() {
        set({ isRunning: true });
      },
      stop() {
        set({ isRunning: false });
      },
      setAlgorithm(algorithm) {
        set({ algorithm });
      },
    }),
    {
      name: "os-simulation-status",
    }
  )
);
