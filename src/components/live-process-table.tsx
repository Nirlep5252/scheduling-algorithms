import { cn } from "@/lib/utils";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSimulationStatus } from "@/stores/simulation-status";

interface Props {
  className?: string;
}

export const LiveProcessView: React.FC<Props> = (props) => {
  const { processes } = useSimulationStatus();

  return (
    <div className={cn(props.className)}>
      <Table>
        <TableCaption>
          {processes.length === 0
            ? "Please start the simulation with some processes"
            : ""}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Process ID</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Burst Time</TableHead>
            <TableHead>Remaining Burst Time</TableHead>
            <TableHead>Completion Time</TableHead>
            <TableHead>Waiting Time</TableHead>
            <TableHead>Turn Around Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow className="h-14" key={process.id}>
              <TableCell>{process.name}</TableCell>
              <TableCell>{process.arrivalTime}</TableCell>
              <TableCell>{process.burstTime}</TableCell>
              <TableCell>{process.remainingBurstTime}</TableCell>
              <TableCell>{process.completionTime || "-"}</TableCell>
              <TableCell>
                {process.turnAroundTime
                  ? process.turnAroundTime - process.burstTime
                  : "-"}
              </TableCell>
              <TableCell>{process.turnAroundTime || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
