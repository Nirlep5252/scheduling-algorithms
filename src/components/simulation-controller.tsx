import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSimulationStatus,
  SimulationState,
} from "@/stores/simulation-status";
import { useProcessesStore } from "@/stores/processes";

interface Props {
  className?: string;
}

export const SimulationController: React.FC<Props> = (props) => {
  const {
    isRunning,
    setAlgorithm,
    stop,
    start,
    next,
    previous,
    algorithm,
    ganttChart,
  } = useSimulationStatus();
  const { processes } = useProcessesStore();

  return (
    <div className={cn(props.className, "flex items-center justify-around")}>
      <div className="algo-selector w-1/2">
        <Select
          defaultValue={algorithm}
          onValueChange={(value) => {
            setAlgorithm(value as SimulationState["algorithm"]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fcfs">First Come First Serve</SelectItem>
            <SelectItem value="sjf">Shortest Job First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="controls flex items-center justify-center gap-2">
        <Button
          disabled={!isRunning || ganttChart.length === 0}
          variant={"ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => previous()}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => {
            if (isRunning) {
              stop();
            } else {
              start(processes);
            }
          }}
          size="icon"
          className="w-12 h-12"
        >
          {!isRunning ? (
            <PlayIcon className="w-6 h-6" />
          ) : (
            <StopIcon className="w-6 h-6" />
          )}
        </Button>
        <Button
          disabled={!isRunning}
          variant={"ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => next()}
        >
          <ArrowRightIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
