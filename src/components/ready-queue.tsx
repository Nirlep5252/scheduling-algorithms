import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const ReadyQueue: React.FC<Props> = (props) => {
  return <div className={cn(props.className)}>ready queue</div>;
};
