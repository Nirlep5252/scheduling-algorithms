import { SimulationState } from "@/stores/simulation-status";
import { nextFCFS } from "./fcfs";
import { nextSJF } from "./sjf";
import { nextSRTF } from "./srtf";
import { nextRR } from "./rr";

export interface NextStepReturnType {
  newTime: number;
  processes: SimulationState["processes"];
  ganttChartElement: SimulationState["ganttChart"][number];
  isFinished: boolean;
  processQueue?: SimulationState["processQueue"];
}

export function nextStep(
  algorithm: SimulationState["algorithm"],
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"],
  processQueue: SimulationState["processQueue"],
  timeQuantum: SimulationState["timeQuantum"]
): NextStepReturnType {
  switch (algorithm) {
    case "fcfs":
      return nextFCFS(processes, currentTime);
    case "sjf":
      return nextSJF(processes, currentTime);
    case "srtf":
      return nextSRTF(processes, currentTime);
    case "rr":
      return nextRR(processes, currentTime, processQueue, timeQuantum);
  }
}
