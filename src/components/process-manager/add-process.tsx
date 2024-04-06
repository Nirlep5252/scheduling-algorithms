import React, { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProcessesStore } from "@/stores/processes";
import * as uuid from "uuid";

interface Props {}

export const AddProcess: React.FC<Props> = () => {
  const { addProcess } = useProcessesStore();
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // @ts-expect-error - stupid ass typescript
    const name = form["name"].value;
    const arrivalTime = parseInt(form["arrival-time"].value);
    const burstTime = parseInt(form["burst-time"].value);
    addProcess({ id: uuid.v4(), name, arrivalTime, burstTime });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="absolute right-4 bottom-4 flex items-center justify-center gap-2">
          <span>Add Process</span> <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new process</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input required id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arrival-time" className="text-right">
                Arrival Time
              </Label>
              <Input
                type="number"
                required
                id="arrival-time"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="burst-time" className="text-right">
                Burst Time
              </Label>
              <Input
                type="number"
                required
                id="burst-time"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
