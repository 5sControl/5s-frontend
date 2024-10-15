import { start } from "repl";
import { timeIntervals } from "../constants/timeIntervals";

export const parseInputDate = (
  startDateString: string,
  intervalMilliseconds: number
): string => {
  const months: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const startDate = new Date(startDateString);

  const startMonth: string = months[startDate.getMonth()];
  const startDay: number = startDate.getDate();
  const startHours: string = startDate.getHours().toString().padStart(2, "0");
  const startMinutes: string = startDate.getMinutes().toString().padStart(2, "0");

  const endMilliseconds = startDate.getTime() + intervalMilliseconds;
  const endDate = new Date(endMilliseconds);
  const endMonth: string = months[endDate.getMonth()];
  const endDay: number = endDate.getDate();
  const endHours: string = endDate.getHours().toString().padStart(2, "0");
  const endMinutes: string = endDate.getMinutes().toString().padStart(2, "0");


  if (endDate.getDate() !== startDate.getDate()) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
  }

  return `${startMonth} ${startDay} | ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};