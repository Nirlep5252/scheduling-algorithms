import { cn } from "@/lib/utils";
import { useProcessesStore } from "@/stores/processes";
import { useSimulationStatus } from "@/stores/simulation-status";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as uuid from "uuid";

interface Props {
  className?: string;
}

export const GanttChart: React.FC<Props> = (props) => {
  const { ganttChart } = useSimulationStatus();
  const { processes } = useProcessesStore();
  const [parent] = useAutoAnimate();

  return (
    <div
      className={cn(
        props.className,
        "rounded-lg flex items-center justify-center overflow-y-scroll gap-1",
      )}
      ref={parent}
    >
      {ganttChart.length > 0 ? (
        ganttChart.map((item) => {
          return (
            <div
              key={item.process || uuid.v4()}
              className={`${item.process === "" ? "bg-red-400" : "bg-primary"} h-20 rounded-lg flex items-center justify-center`}
              style={{ width: `${(item.end - item.start) * 20}px` }}
            >
              {processes.find((process) => process.id === item.process)?.name}
            </div>
          );
        })
      ) : (
        <div>The Gantt chart is empty.</div>
      )}
    </div>
  );
};
