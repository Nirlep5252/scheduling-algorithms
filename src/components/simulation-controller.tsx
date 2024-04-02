import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulationStatus } from "@/stores/simulation-status";

interface Props {
  className?: string;
}

export const SimulationController: React.FC<Props> = (props) => {
  const { isRunning, isPaused, setAlgorithm } = useSimulationStatus();

  return (
    <div className={cn(props.className, "flex items-center justify-around")}>
      <div className="algo-selector w-1/2">
        <Select
          onValueChange={(value) => {
            // @ts-expect-error stoopid
            setAlgorithm(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fcfs">FCFS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="controls flex items-center justify-center gap-2">
        <Button
          disabled={isPaused || !isRunning}
          variant={"ghost"}
          size="icon"
          className="w-12 h-12"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
        <Button size="icon" className="w-12 h-12">
          <PlayIcon className="w-6 h-6" />
        </Button>
        <Button
          disabled={isPaused || !isRunning}
          variant={"ghost"}
          size="icon"
          className="w-12 h-12"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
