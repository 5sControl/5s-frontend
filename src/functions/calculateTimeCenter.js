function timestrToSec(timestr) {
  var parts = timestr.split(":");
  return parts[0] * 3600 + parts[1] * 60 + +parts[2];
}
function pad(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}
function formatTime(seconds) {
  return [
    pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
  ].join(":");
}

export const calculateTimeCenter = (startTime, endTime) => {
  let bufStart = new Date();
  let bufEnd = new Date();

  bufStart.setHours(
    Number(startTime.split(":")[0]),
    Number(startTime.split(":")[1]),
    Number(startTime.split(":")[2])
  );
  bufEnd.setHours(
    Number(endTime.split(":")[0]),
    Number(endTime.split(":")[1]),
    Number(endTime.split(":")[2])
  );

  let middle = formatTime(
    timestrToSec(startTime) / 2 + timestrToSec(endTime) / 2
  );
  let preMiddle = formatTime(
    timestrToSec(startTime) / 2 + timestrToSec(middle) / 2
  );
  let postMiddle = formatTime(
    timestrToSec(middle) / 2 + timestrToSec(endTime) / 2
  );
  return [startTime, preMiddle, middle, postMiddle, endTime];
};
