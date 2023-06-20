export const convertMillisecondsToTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  let timeString = '';
  if (hours > 0) {
    timeString += `${hours}:`;
  }
  if (minutes > 0) {
    timeString += `${minutes}:`;
  } else {
    timeString += '0:';
  }
  timeString += `${seconds}`;

  return timeString;
};
