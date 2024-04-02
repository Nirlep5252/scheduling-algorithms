import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const SimulationController: React.FC<Props> = (props) => {
  return (
    <div
      className={cn(
        props.className,
        "flex flex-col items-center justify-center"
      )}
    >
      <div className="algo-selector"></div>
      <div className="controls flex items-center justify-center gap-2">
        <Button variant={"ghost"} size="icon" className="w-12 h-12">
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
        <Button size="icon" className="w-12 h-12">
          <PlayIcon className="w-6 h-6" />
        </Button>
        <Button variant={"ghost"} size="icon" className="w-12 h-12">
          <ArrowRightIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
