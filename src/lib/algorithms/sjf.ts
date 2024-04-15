import { SimulationState } from "@/stores/simulation-status";
import { NextStepReturnType } from ".";

export function nextSJF(
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"]
): NextStepReturnType {
  const incompleteProcesses = processes.filter(
    (process) => process.completionTime === null
  );
  incompleteProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  if (currentTime < incompleteProcesses[0].arrivalTime) {
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

  const arrivedProcessWithShortestBurstTime = incompleteProcesses.reduce(
    (shortestBurstTimeProcess, process) => {
      if (
        process.arrivalTime <= currentTime &&
        process.burstTime < shortestBurstTimeProcess.burstTime
      ) {
        return process;
      }
      return shortestBurstTimeProcess;
    },
    incompleteProcesses[0]
  );
  const newTime = currentTime + arrivedProcessWithShortestBurstTime.burstTime;
  return {
    newTime,
    processes: processes.map((process) => {
      if (process.id === arrivedProcessWithShortestBurstTime.id) {
        return {
          ...process,
          completionTime: newTime,
          turnAroundTime:
            newTime - arrivedProcessWithShortestBurstTime.arrivalTime,
        };
      }
      return process;
    }),
    ganttChartElement: {
      process: arrivedProcessWithShortestBurstTime.id,
      start: currentTime,
      end: newTime,
    },
    isFinished: incompleteProcesses.length === 1,
  };
}
