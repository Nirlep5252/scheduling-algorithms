import { ProcessManager } from "@/components/process-manager/index";
import { SimulationController } from "@/components/simulation-controller";
import { GanttChart } from "@/components/gantt-chart";
import { ProcessQueue } from "@/components/process-queue";
import { LiveProcessView } from "@/components/live-process-table";
import { Toaster } from "@/components/ui/sonner";
import { useSimulationStatus } from "./stores/simulation-status";

// Terminology:
// - Arrival Time
// - Burst Time
// - Completion Time
// - Turn Around Time
// - Waiting Time

// Scheduling Algos
// - FCFS (non-preamptive) (crieteria: AT)
// - SJF (non-preamptive) (crieteria: BT)
// - SRTF (preamptive) (crieteria: BT)
// - RR (preamptive) (crieteria: AT) (uses queue)
// - Priority (non-preamptive & preamptive) (crieteria: Priority)

function App() {
  const { algorithm } = useSimulationStatus();

  return (
    <>
      <Toaster />
      <div className="w-screen h-screen bg-background grid grid-cols-3 grid-rows-5 gap-4 p-16 [&>*]:rounded-lg [&>*]:border-2 [&>*]:border-accent [&>*]:p-2">
        <ProcessManager className="col-span-1 row-span-4" />
        <LiveProcessView className="col-span-2 row-span-3" />
        <GanttChart
          className={`col-span-2 ${algorithm === "rr" ? "row-span-1" : "row-span-2"}`}
        />
        <SimulationController className="col-span-1 row-span-1" />
        {algorithm === "rr" && (
          <ProcessQueue className="col-span-2 row-span-1" />
        )}
      </div>
    </>
  );
}

export default App;
