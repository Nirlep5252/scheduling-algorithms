import { cn } from "@/lib/utils";
import { useSimulationStatus } from "@/stores/simulation-status";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

interface Props {
  className?: string;
}

export const ProcessQueue: React.FC<Props> = (props) => {
  const { processQueue } = useSimulationStatus();
  const [parent] = useAutoAnimate();

  return (
    <div
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 w-full relative overflow-x-scroll"
      )}
      ref={parent}
    >
      <div className="current-time absolute top-2 left-2">Process Queue</div>
      {processQueue.length > 0 ? (
        processQueue.map((item, index) => {
          return (
            <div key={index} className="relative group">
              <div className="bg-primary h-20 w-12 rounded-lg flex items-center justify-center">
                {item.name}
              </div>
            </div>
          );
        })
      ) : (
        <div>The Process Queue is empty.</div>
      )}
    </div>
  );
};
