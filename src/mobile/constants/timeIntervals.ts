import { TimeMode } from "../models/enums/timeMode.enum";
import { TimeInterval } from "../models/types/timeInterval";

export const timeIntervals: {
  hourMode: {
    value: TimeInterval;
    hours: number;
  }[];
  minuteMode: {
    value: string;
  }[];
} = {
  [TimeMode.hour]: [
    { value: "1h", hours: 1 },
    { value: "4h", hours: 4 },
    { value: "8h", hours: 8 },
    { value: "12h", hours: 12 },
    { value: "24h", hours: 24 },
  ],
  [TimeMode.minute]: [
    { value: "1min" },
    { value: "6min" },
    { value: "12min" },
    { value: "20min" },
    { value: "30min" },
  ],
};
