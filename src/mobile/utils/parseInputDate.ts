export const parseInputDate = (
  dateString: string,
  timeMode: string,
  selectedInterval: string
): string => {
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date: Date;
  let interval = 1;

  if (dateString) {
    date = new Date(dateString);
  } else {
    date = new Date();
  }

  const month: string = months[date.getMonth()];
  const day: number = date.getDate();
  const startHours: string = date.getHours().toString().padStart(2, "0");
  const startMinutes: string = date.getMinutes().toString().padStart(2, "0");
  if (timeMode === "hourMode") {
    interval = parseInt(selectedInterval.slice(0, -1));
  }
  const endHours: string = (date.getHours() + interval)
    .toString()
    .padStart(2, "0");
  const endMinutes: string = date.getMinutes().toString().padStart(2, "0");

  if (
    parseInt(endHours) > 24 ||
    (parseInt(endHours) === 24 && parseInt(endMinutes) > 0)
  ) {
    return "Select correct time";
  }

  return `${month} ${day} | ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

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

export const  mergeDateAndTime = (dateStr1: string, dateStr2: string) =>  {
  
  const [datePart1] = dateStr1.split('T');
  const [, timePart2] = dateStr2.split('T');  
  const mergedDateTime = `${datePart1}T${timePart2}`;
  return mergedDateTime;
}





