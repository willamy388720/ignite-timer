import { ReactNode, createContext, useState } from "react";

export type Cycle = {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
};

type CreateCycleData = {
  task: string;
  minutesAmount: number;
};

type CyclesContextType = {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: ({ task, minutesAmount }: CreateCycleData) => void;
  interruptCycle: () => void;
};

export const CyclesContext = createContext({} as CyclesContextType);

type CyclesContextProviderProps = {
  children: ReactNode;
};

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCycleAsFinished() {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      task: task,
      minutesAmount: minutesAmount,
      startDate: new Date(),
    };

    setCycles((prevState) => [...prevState, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    setActiveCycleId(null);

    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
