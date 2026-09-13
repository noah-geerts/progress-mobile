import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import dayjs, { type Dayjs } from "dayjs";

type CurrentDayContextValue = {
  currentDay: Dayjs;
  setCurrentDay: Dispatch<SetStateAction<Dayjs>>;
};

const CurrentDayContext = createContext<CurrentDayContextValue | null>(null);

export function useCurrentDay(): CurrentDayContextValue {
  const context = useContext(CurrentDayContext);
  if (context === null) {
    throw new Error("useCurrentDay called outside of CurrentDayProvider");
  }
  return context;
}

export default function CurrentDayProvider({ children }: { children: ReactNode }) {
  const [currentDay, setCurrentDay] = useState<Dayjs>(() => dayjs().startOf("day"));

  return (
    <CurrentDayContext value={{ currentDay, setCurrentDay }}>
      {children}
    </CurrentDayContext>
  );
}