import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Process } from "./processes";
import { toast } from "sonner";
import { nextStep } from "@/lib/algorithms";

export interface SimulationProcess {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingBurstTime: number;
  completionTime: number | null;
  turnAroundTime: number | null;
}

export interface SimulationState {
  isRunning: boolean;
  algorithm: "fcfs" | "sjf" | "srtf";
  processes: SimulationProcess[];
  currentTime: number;
  ganttChart: {
    process?: string;
    start: number;
    end: number;
  }[];
}

interface Actions {
  stop: () => void;
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
      stop() {
        set({
          isRunning: false,
          currentTime: 0,
          ganttChart: [],
          processes: [],
        });
      },
      start(processes) {
        set({
          ganttChart: [],
          currentTime: 0,
        });
        if (processes.length === 0) return;
        set({
          isRunning: true,
          processes: processes.map((process) => {
            return {
              id: process.id,
              name: process.name,
              arrivalTime: process.arrivalTime,
              burstTime: process.burstTime,
              remainingBurstTime: process.burstTime,
              completionTime: null,
              turnAroundTime: null,
            };
          }),
        });
      },
      setAlgorithm(algorithm) {
        set({ algorithm });
      },

      next() {
        const state = get();
        const newData = nextStep(
          state.algorithm,
          state.processes,
          state.currentTime
        );
        set((state) => ({
          currentTime: newData.newTime,
          processes: newData.processes,
          ganttChart: [...state.ganttChart, newData.ganttChartElement],
        }));
        if (newData.isFinished) {
          toast.success("Simulation finished!");
          set({ isRunning: false });
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
                  remainingBurstTime:
                    process.remainingBurstTime +
                    lastProcess.end -
                    lastProcess.start,
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
    }
  )
);
