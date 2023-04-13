/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns';

const createDefineds = (weekStartsOn: any) => ({
  startOfWeek: startOfWeek(new Date(), { weekStartsOn }),
  endOfWeek: endOfWeek(new Date(), { weekStartsOn }),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7), { weekStartsOn }),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7), { weekStartsOn }),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
});

const staticRangeHandler = {
  range: {},
  isSelected(range: { startDate: number | Date; endDate: number | Date }) {
    // @ts-ignore
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

export function createStaticRanges(ranges: any[]) {
  return ranges.map((range: any) => ({ ...staticRangeHandler, ...range }));
}

export default (locale: { options: { weekStartsOn: any } }) => {
  const defineds = createDefineds(locale.options.weekStartsOn);

  return createStaticRanges([
    {
      label: 'Today',
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
    },
    {
      label: 'Yesterday',
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
    },

    {
      label: 'This Week',
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek,
      }),
    },
    {
      label: 'Last Week',
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek,
      }),
    },
    {
      label: 'This Month',
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
    },
    {
      label: 'Last Month',
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
    },
  ]);
};
