import { ProcessManager } from "@/components/process-manager/index";

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
  return (
    <div className="w-screen h-screen bg-background grid grid-cols-3 grid-rows-3 gap-4 p-16">
      <ProcessManager className="col-span-1 row-span-3" />
    </div>
  );
}

export default App;
