import { SimulationState } from "@/stores/simulation-status";
import { nextFCFS } from "./fcfs";

export interface NextStepReturnType {
  newTime: number;
  processes: SimulationState["processes"];
  ganttChartElement: SimulationState["ganttChart"][number];
  isFinished: boolean;
}

export function nextStep(
  algorithm: SimulationState["algorithm"],
  processes: SimulationState["processes"],
  newTime: SimulationState["currentTime"]
) {
  switch (algorithm) {
    case "fcfs":
      return nextFCFS(processes, newTime);
  }
}
