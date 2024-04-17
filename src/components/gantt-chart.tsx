import { cn } from "@/lib/utils";
import { useProcessesStore } from "@/stores/processes";
import { useSimulationStatus } from "@/stores/simulation-status";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  className?: string;
}

export const GanttChart: React.FC<Props> = (props) => {
  const { ganttChart, currentTime } = useSimulationStatus();
  const { processes } = useProcessesStore();
  const [parent] = useAutoAnimate();

  const total = ganttChart
    .map((item) => item.end - item.start)
    .reduce((a, b) => a + b, 0);

  return (
    <div
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 w-full relative"
      )}
      ref={parent}
    >
      <div className="current-time absolute top-2 left-2">
        Current Time: {currentTime}
      </div>
      {ganttChart.length > 0 ? (
        ganttChart.map((item, index) => {
          return (
            <div
              key={index}
              className="relative group"
              style={{ width: `${((item.end - item.start) / total) * 100}%` }}
            >
              <div
                className={`${!item.process ? "border-4 border-primary" : "bg-primary"} h-20 rounded-lg flex items-center justify-center`}
              >
                {item.process
                  ? processes.find((process) => process.id === item.process)
                      ?.name
                  : "Idle"}
              </div>
              <div className="absolute left-2 bottom-2 hidden group-hover:block">
                {item.start}
              </div>
              <div className="absolute right-2 bottom-2 hidden group-hover:block">
                {item.end}
              </div>
            </div>
          );
        })
      ) : (
        <div>The Gantt chart is empty.</div>
      )}
    </div>
  );
};
