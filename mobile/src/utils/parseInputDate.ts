export const parseInputDate = (
  startDateString: string,
  intervalMilliseconds: number,
  language: string
): string => {

  const translateMonths = {
    en: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    ru: [
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
      "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
    ],
    pl: [
      "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
      "Lip", "Sie", "Wrze", "Paź", "Lis", "Gru"
    ]
  };

  const months = translateMonths[language];
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

export const formatDateYMD = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${year}-${month}-${day}`;
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

export const formatDateWithFullMonthName = (dateString: string, language: string): string => {
  const translateFullMonths = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    ru: [
      "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
      "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ],
    pl: [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ]
  };
  
  const months = translateFullMonths[language];
  const date = new Date(dateString);

  const day: number = date.getDate();
  const month: string = months[date.getMonth()];

  return `${day} ${month}`;
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

    dateObj1.setSeconds(dateObj1.getSeconds(), dateObj1.getMilliseconds());
    dateObj2.setSeconds(dateObj2.getSeconds(), dateObj2.getMilliseconds());

    const differenceInMs = Math.abs(dateObj2.getTime() - dateObj1.getTime());
    return differenceInMs/1000;
  }

  return 0;
}

export const mergeDateAndTime = (dateStr1: string, dateStr2: string) => {

  const [datePart1] = dateStr1.split('T');
  const [, timePart2] = dateStr2.split('T');
  const mergedDateTime = `${datePart1}T${timePart2}`;
  return mergedDateTime;
}

export const formatTime = (seconds: number) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.round((seconds % 3600) / 60);
  if(minutes >= 60){
    hours +=1;
    minutes = 0; 
  }
  return { hours, minutes };
}

export const updateTimeInDate = (dateString: string): string => {

  const [datePart] = dateString.split('T');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${datePart}T${hours}:${minutes}`;
}

export const getDateTimeISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const getCurrentDateTimeISO = (): string => {
  return getDateTimeISO(new Date());
}

export const getDateWeekAgoISO = (): string => {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const year = weekAgo.getFullYear();
  const month = String(weekAgo.getMonth() + 1).padStart(2, '0');
  const day = String(weekAgo.getDate()).padStart(2, '0');
  const hours = String(weekAgo.getHours()).padStart(2, '0');
  const minutes = String(weekAgo.getMinutes()).padStart(2, '0');
  const seconds = String(weekAgo.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const extractTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const formatISOBeforeSend = (dateString: string): string => {
  return (new Date(dateString)).toISOString();
}

export const formatYMD = (dateString: string): string => {
  const date = new Date(dateString);
  const localDate = new Date(date.getTime());
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

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