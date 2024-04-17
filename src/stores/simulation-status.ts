import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Process } from "./processes";
import { toast } from "sonner";
import { nextStep } from "@/lib/algorithms";

interface SimulationProcess {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingBurstTime: number;
  completionTime: number | null;
  turnAroundTime: number | null;
}

interface GanttChartItem {
  process?: string;
  start: number;
  end: number;
}

export interface SimulationState {
  isRunning: boolean;
  algorithm: "fcfs" | "sjf" | "srtf" | "rr";
  processes: SimulationProcess[];
  processQueue: SimulationProcess[];
  timeQuantum: number;
  currentTime: number;
  ganttChart: GanttChartItem[];
}

interface Actions {
  stop: () => void;
  start: (processes: Process[]) => void;
  setAlgorithm: (algorithm: SimulationState["algorithm"]) => void;
  setTimeQuantum: (value: SimulationState["timeQuantum"]) => void;

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
      processQueue: [],
      timeQuantum: 1,
      isFinished: true,

      stop() {
        set({
          isRunning: false,
          currentTime: 0,
          ganttChart: [],
          processes: [],
          processQueue: [],
        });
      },

      start(processes) {
        set({
          ganttChart: [],
          currentTime: 0,
          processQueue: [],
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
      setTimeQuantum(value) {
        set({ timeQuantum: value });
      },

      next() {
        const state = get();
        const newData = nextStep(
          state.algorithm,
          state.processes,
          state.currentTime,
          state.processQueue,
          state.timeQuantum
        );
        set((state) => ({
          currentTime: newData.newTime,
          processes: newData.processes,
          ganttChart: [...state.ganttChart, newData.ganttChartElement],
          processQueue: newData.processQueue || state.processQueue,
        }));
        if (newData.isFinished) {
          toast.success("Simulation finished!");
          set({ isRunning: false });
        }
      },

      previous() {
        set((state) => {
          const lastProcess = state.ganttChart[state.ganttChart.length - 1];
          const newTime =
            state.currentTime - (lastProcess.end - lastProcess.start);
          state.processQueue.pop();
          return {
            currentTime: newTime,
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
            processQueue: [
              state.processes.find((p) => p.id === lastProcess.process)!,
              ...state.processQueue.filter((p) => p.arrivalTime <= newTime),
            ],
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
