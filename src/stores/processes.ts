import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
}

interface State {
  processes: Process[];
}

interface Actions {
  addProcess: (process: Process) => void;
  removeProcess: (id: number) => void;
  clearProcesses: () => void;
}

export const useProcessesStore = create<State & Actions>()(
  persist(
    (set) => ({
      processes: [],
      addProcess: (process) =>
        set((state) => ({ processes: [...state.processes, process] })),
      removeProcess: (id) =>
        set((state) => ({
          processes: state.processes.filter((process) => process.id !== id),
        })),
      clearProcesses: () => set({ processes: [] }),
    }),
    {
      name: "os-processes",
    }
  )
);
