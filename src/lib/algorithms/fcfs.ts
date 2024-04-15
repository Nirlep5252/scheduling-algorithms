import { SimulationState } from "@/stores/simulation-status";
import { NextStepReturnType } from ".";

export function nextFCFS(
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"]
): NextStepReturnType {
  const incompleteProcesses = processes.filter((process) => {
    return process.completionTime === null;
  });
  incompleteProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  if (incompleteProcesses[0].arrivalTime > currentTime) {
    const newTime = incompleteProcesses[0].arrivalTime;
    return {
      newTime,
      processes,
      ganttChartElement: {
        start: currentTime,
        end: newTime,
      },
      isFinished: false,
    };
  }

  const newTime = currentTime + incompleteProcesses[0].remainingBurstTime;
  return {
    newTime,
    processes: processes.map((process) => {
      if (process.id === incompleteProcesses[0].id) {
        return {
          ...process,
          remainingBurstTime: 0,
          completionTime: newTime,
          turnAroundTime: newTime - incompleteProcesses[0].arrivalTime,
        };
      }
      return process;
    }),
    ganttChartElement: {
      process: incompleteProcesses[0].id,
      start: currentTime,
      end: newTime,
    },
    isFinished: incompleteProcesses.length === 1,
  };
}
