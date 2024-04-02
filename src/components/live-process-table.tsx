import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const LiveProcessView: React.FC<Props> = (props) => {
  return <div className={cn(props.className)}>live process view</div>;
};
