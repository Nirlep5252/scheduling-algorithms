import { cn } from "@/lib/utils";
import React from "react";
import { ProcessTable } from "./process-table";
import { AddProcess } from "./add-process";

interface Props {
  className?: string;
}

export const ProcessManager: React.FC<Props> = (props) => {
  return (
    <div
      className={cn(
        props.className,
        "rounded-lg border-2 border-accent p-2 relative"
      )}
    >
      <AddProcess />
      <ProcessTable />
    </div>
  );
};
