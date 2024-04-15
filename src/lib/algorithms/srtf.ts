import { SimulationState } from "@/stores/simulation-status";
import { NextStepReturnType } from ".";

export function nextSRTF(
  processes: SimulationState["processes"],
  currentTime: SimulationState["currentTime"]
): NextStepReturnType {
  const incompleteProcesses = processes.filter((process) => {
    return process.completionTime === null;
  });

  const arrivedProcesses = incompleteProcesses.filter((process) => {
    return process.arrivalTime <= currentTime;
  });
  const notArrivedProcesses = incompleteProcesses.filter((process) => {
    return process.arrivalTime > currentTime;
  });

  if (arrivedProcesses.length === 0) {
    const newTime = Math.min(
      ...notArrivedProcesses.map((process) => process.arrivalTime)
    );
    return {
      newTime,
      processes,
      ganttChartElement: {
        start: currentTime,
        end: newTime,
      },
      isFinished: false,
    };
  } else {
    const shortestArrivedProcess = arrivedProcesses.reduce((prev, current) => {
      if (prev.remainingBurstTime === current.remainingBurstTime) {
        return prev.arrivalTime < current.arrivalTime ? prev : current;
      } else {
        return prev.remainingBurstTime < current.remainingBurstTime
          ? prev
          : current;
      }
    });

    let newTime = currentTime;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      shortestArrivedProcess.remainingBurstTime--;
      newTime++;
      if (shortestArrivedProcess.remainingBurstTime === 0) {
        shortestArrivedProcess.completionTime = newTime;
        shortestArrivedProcess.turnAroundTime =
          shortestArrivedProcess.completionTime -
          shortestArrivedProcess.arrivalTime;
        break;
      }

      const arrivedProcesses = incompleteProcesses.filter((process) => {
        return process.arrivalTime <= newTime;
      });
      const newShortestArrivedProcess = arrivedProcesses.reduce(
        (prev, current) => {
          if (prev.remainingBurstTime === current.remainingBurstTime) {
            return prev.arrivalTime < current.arrivalTime ? prev : current;
          } else {
            return prev.remainingBurstTime < current.remainingBurstTime
              ? prev
              : current;
          }
        }
      );

      if (newShortestArrivedProcess !== shortestArrivedProcess) {
        break;
      }
    }

    return {
      newTime,
      processes: processes.map((process) => {
        if (process.id === shortestArrivedProcess.id) {
          return shortestArrivedProcess;
        } else {
          return process;
        }
      }),
      ganttChartElement: {
        start: currentTime,
        end: newTime,
        process: shortestArrivedProcess.id,
      },
      isFinished: processes.every((process) => {
        return process.completionTime !== null;
      }),
    };
  }
}
