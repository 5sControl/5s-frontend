import { TimeInterval } from "../models/types/timeInterval";

export const timeIntervals: Record<string, TimeInterval> = {
  TenMinutes: {
    label: {
      en: '10min',
      ru: '10мин',
      pl: '10min'
    },
    milliseconds: 600000,
    timeFormat: {
      units: 'minutes',
      frequency: 2
    }
  },
  OneHour: {
    label: {
      en: '1h',
      ru: '1ч',
      pl: '1godz'
    },
    milliseconds: 3600000,
    timeFormat: {
      units: 'minutes',
      frequency: 10
    }
  },
  EightHours: {
    label: {
      en: '8h',
      ru: '8ч',
      pl: '8godz'
    },
    milliseconds: 28800000,
    timeFormat: {
      units: 'hours',
      frequency: 2
    }
  },
  TwelveHours: {
    label: {
      en: '12h',
      ru: '12ч',
      pl: '12godz'
    },
    milliseconds: 43200000,
    timeFormat: {
      units: 'hours',
      frequency: 3
    }
  },
  OneDay: {
    label: {
      en: '1d',
      ru: '1д',
      pl: '1dz'
    },
    milliseconds: 86400000,
    timeFormat: {
      units: 'hours',
      frequency: 6
    }
  },
  OneWeek: {
    label: {
      en: '1w',
      ru: '1нед',
      pl: '1tydz'
    },
    milliseconds: 604800000,
    timeFormat: {
      units: 'days',
      frequency: 1
    }
  }
};
