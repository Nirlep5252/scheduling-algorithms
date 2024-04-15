import { SimulationState } from "@/stores/simulation-status";
import { nextFCFS } from "./fcfs";
import { nextSJF } from "./sjf";
import { nextSRTF } from "./srtf";

export interface NextStepReturnType {
  newTime: number;
  processes: SimulationState["processes"];
  ganttChartElement: SimulationState["ganttChart"][number];
  isFinished: boolean;
}

export function nextStep(
  algorithm: SimulationState["algorithm"],
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"]
): NextStepReturnType {
  switch (algorithm) {
    case "fcfs":
      return nextFCFS(processes, currentTime);
    case "sjf":
      return nextSJF(processes, currentTime);
    case "srtf":
      return nextSRTF(processes, currentTime);
  }
}
