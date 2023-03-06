export const calculateTime = (startTime, endTime) => {
  let bufStart = new Date();
  let bufEnd = new Date();
  bufStart.setHours(
    Number(startTime.split(':')[0]),
    Number(startTime.split(':')[1]),
    Number(startTime.split(':')[2])
  );
  bufEnd.setHours(
    Number(endTime.split(':')[0]),
    Number(endTime.split(':')[1]),
    Number(endTime.split(':')[2])
  );
  return (bufEnd - bufStart) / 1000;
};
