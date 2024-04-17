import { SimulationState } from "@/stores/simulation-status";
import { NextStepReturnType } from ".";

export function nextRR(
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"],
  processQueue: SimulationState["processQueue"],
  timeQuantum: SimulationState["timeQuantum"]
): NextStepReturnType {
  const process = processQueue.shift();

  if (!process) {
    const incompleteProcesses = processes.filter(
      (process) => process.completionTime === null
    );
    const arrivedProcesses = incompleteProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );

    if (arrivedProcesses.length === 0) {
      const notArrivedProcesses = incompleteProcesses.filter(
        (process) => process.arrivalTime > currentTime
      );
      const newestNotArrivedProcess = notArrivedProcesses.reduce(
        (acc, process) =>
          process.arrivalTime < acc.arrivalTime ? process : acc
      );

      const newTime = newestNotArrivedProcess.arrivalTime;
      return {
        newTime,
        processes,
        ganttChartElement: {
          start: currentTime,
          end: newTime,
        },
        isFinished: false,
        processQueue: incompleteProcesses.filter(
          (process) => process.arrivalTime === newTime
        ),
      };
    } else {
      arrivedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
      for (const p of arrivedProcesses) {
        processQueue.push(p);
      }
      return nextRR(processes, currentTime, processQueue, timeQuantum);
    }
  } else {
    const remainingBurstTime = Math.max(
      0,
      process.remainingBurstTime - timeQuantum
    );
    const newTime = Math.min(
      currentTime + process.remainingBurstTime,
      currentTime + timeQuantum
    );

    const incompleteProcessesBetweenCurrentTimeAndNewTime = processes.filter(
      (process) =>
        process.arrivalTime <= newTime &&
        process.remainingBurstTime > 0 &&
        process.arrivalTime > currentTime
    );
    for (const p of incompleteProcessesBetweenCurrentTimeAndNewTime) {
      processQueue.push(p);
    }
    if (remainingBurstTime > 0) {
      processQueue.push({
        ...process,
        remainingBurstTime,
      });
      return {
        newTime,
        processes: processes.map((p) =>
          p.id === process.id ? { ...p, remainingBurstTime } : p
        ),
        ganttChartElement: {
          start: currentTime,
          end: newTime,
          process: process.id,
        },
        processQueue,
        isFinished: false,
      };
    } else {
      return {
        newTime,
        processes: processes.map((p) =>
          p.id === process.id
            ? {
                ...p,
                completionTime: newTime,
                remainingBurstTime: 0,
                waitingTime: newTime - p.burstTime - p.arrivalTime,
                turnAroundTime: newTime - p.arrivalTime,
              }
            : p
        ),
        ganttChartElement: {
          start: currentTime,
          end: newTime,
          process: process.id,
        },
        processQueue,
        isFinished: processes.every(
          (p) => p.remainingBurstTime === 0 || p.id === process.id
        ),
      };
    }
  }
}
