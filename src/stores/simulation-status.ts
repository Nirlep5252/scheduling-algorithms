import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Process } from "./processes";
import { toast } from "sonner";

interface SimulationProcess {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number | null;
  turnAroundTime: number | null;
}

export interface SimulationState {
  isRunning: boolean;
  algorithm: "fcfs";
  processes: SimulationProcess[];
  isFinished: boolean;
  currentTime: number;
  ganttChart: {
    process: string;
    start: number;
    end: number;
  }[];
}

interface Actions {
  pause: () => void;
  resume: () => void;
  start: (processes: Process[]) => void;
  setAlgorithm: (algorithm: SimulationState["algorithm"]) => void;

  next: () => void;
  previous: () => void;
}

export const useSimulationStatus = create<SimulationState & Actions>()(
  persist(
    (set, get) => ({
      ganttChart: [],
      currentTime: 0,
      isRunning: false,
      algorithm: "fcfs",
      processes: [],
      isFinished: true,
      pause() {
        set({ isRunning: false });
      },
      resume() {
        set({ isRunning: true });
      },
      start(processes) {
        if (processes.length === 0) return;
        set({
          isRunning: true,
          processes: processes.map((process) => {
            return {
              id: process.id,
              name: process.name,
              arrivalTime: process.arrivalTime,
              burstTime: process.burstTime,
              completionTime: null,
              turnAroundTime: null,
            };
          }),
          isFinished: false,
        });
      },
      setAlgorithm(algorithm) {
        set({ algorithm });
      },

      next() {
        const state = get();
        console.log(state.processes);
        const incompleteProcesses = state.processes.filter(
          (process) => process.completionTime === null,
        );
        console.log(incompleteProcesses);
        switch (state.algorithm) {
          case "fcfs":
            incompleteProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
            set((state) => ({
              currentTime: state.currentTime + incompleteProcesses[0].burstTime,
              processes: state.processes.map((process) => {
                if (process.id === incompleteProcesses[0].id) {
                  return {
                    ...process,
                    completionTime: state.currentTime + process.burstTime,
                    turnAroundTime:
                      state.currentTime +
                      process.burstTime -
                      process.arrivalTime,
                  };
                }
                return process;
              }),
              ganttChart: [
                ...state.ganttChart,
                {
                  process: incompleteProcesses[0].id,
                  start: state.currentTime,
                  end: state.currentTime + incompleteProcesses[0].burstTime,
                },
              ],
              isFinished: incompleteProcesses.length === 1,
            }));
            break;
        }
        if (incompleteProcesses.length === 1) {
          toast.success("Simulation finished!");
        }
      },
      previous() {
        set((state) => {
          const lastProcess = state.ganttChart[state.ganttChart.length - 1];
          return {
            currentTime:
              state.currentTime - (lastProcess.end - lastProcess.start),
            processes: state.processes.map((process) => {
              if (process.id === lastProcess.process) {
                return {
                  ...process,
                  completionTime: null,
                  turnAroundTime: null,
                };
              }
              return process;
            }),
            ganttChart: state.ganttChart.slice(0, -1),
            isFinished: false,
          };
        });
      },
    }),
    {
      name: "os-simulation-status",
    },
  ),
);
