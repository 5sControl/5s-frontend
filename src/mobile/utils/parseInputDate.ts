export const parseInputDate = (dateString: string, timeMode: string, selectedInterval: string): string => {
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