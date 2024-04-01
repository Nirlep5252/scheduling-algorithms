import { useProcessesStore } from "@/stores/processes";
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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

interface Props {}

export const ProcessTable: React.FC<Props> = () => {
  const { processes, removeProcess } = useProcessesStore();

  return (
    <Table>
      <TableCaption>
        {processes.length === 0 ? "No process found." : ""}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Process ID</TableHead>
          <TableHead>Arrival Time</TableHead>
          <TableHead>Burst Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processes.map((process) => (
          <TableRow key={process.id}>
            <TableCell>{process.name}</TableCell>
            <TableCell>{process.arrivalTime}</TableCell>
            <TableCell>{process.burstTime}</TableCell>
            <Button
              variant={"ghost"}
              size="icon"
              className="flex items-center justify-center"
              onClick={() => {
                removeProcess(process.id);
              }}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
