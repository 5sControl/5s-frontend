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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}.${month}.${year}`;
}

export const formatDateUTC = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(2);

  return `${day}.${month}.${year}`;
}

export const localDateString = (now: Date) => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export const getLocalDateString = () => {
  const now = new Date();
  return localDateString(now)
}
export const localeFronString = (time: string) => {
  const date = new Date(time);
  return localDateString(date)

}
export const updateDateTime = (originalDateTime: string, newDate: string) => {

  const originalDateObj = new Date(originalDateTime);
  const newDateObj = new Date(newDate);
  const hours = originalDateObj.getHours();
  const minutes = originalDateObj.getMinutes();
  const seconds = originalDateObj.getSeconds();
  newDateObj.setHours(hours);
  newDateObj.setMinutes(minutes);
  newDateObj.setSeconds(seconds);

  return localDateString(newDateObj);
}

export const updateTime = (originalDateTime: string, newTime: string) => {

  const originalDateObj = new Date(originalDateTime);
  const newTimeObj = new Date(newTime);
  const year = originalDateObj.getFullYear();
  const month = originalDateObj.getMonth();
  const day = originalDateObj.getDate();

  originalDateObj.setHours(newTimeObj.getHours());
  originalDateObj.setMinutes(newTimeObj.getMinutes());
  originalDateObj.setSeconds(newTimeObj.getSeconds());


  return localDateString(originalDateObj);
}

export const getTimeDifference = (date1: string, date2: string) => {
  let hours = 0, minutes = 0;
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  if (!isNaN(dateObj1.getTime()) && !isNaN(dateObj2.getTime())) {

    dateObj1.setSeconds(0, 0);
    dateObj2.setSeconds(0, 0);

    const differenceInMs = Math.abs(dateObj2.getTime() - dateObj1.getTime());
    hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
  }

  return { hours, minutes };
}

export const mergeDateAndTime = (dateStr1: string, dateStr2: string) => {

  const [datePart1] = dateStr1.split('T');
  const [, timePart2] = dateStr2.split('T');
  const mergedDateTime = `${datePart1}T${timePart2}`;
  return mergedDateTime;
}

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

export const updateTimeInDate = (dateString: string): string => {

  const [datePart] = dateString.split('T');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${datePart}T${hours}:${minutes}`;
}

export const getCurrentDateTimeISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const formatYMD = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const convertToCustomFormat = (dateString: string): string => {

  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

export const truncateDate = (dateString: string): string => {
  return dateString.split('.')[0];
};