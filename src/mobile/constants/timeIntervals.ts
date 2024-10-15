import { TimeInterval } from "../models/types/timeInterval";

export const timeIntervals: Record<string, TimeInterval> = {
  TenMinutes: { 
    label: '10min', 
    milliseconds: 600000,
    timeFormat: {
      units: 'minutes',
      frequency: 2
    } 
  },
  OneHour: { 
    label: '1h', 
    milliseconds: 3600000,
    timeFormat: {
      units: 'minutes',
      frequency: 10
    } 
  },
  EightHours: { 
    label: '8h', 
    milliseconds: 28800000,
    timeFormat: {
      units: 'hours',
      frequency: 2
    } 
  },
  TwelveHours: { 
    label: '12h', 
    milliseconds: 43200000,
    timeFormat: {
      units: 'hours',
      frequency: 3
    }
  },
  OneDay: { 
    label: '1d', 
    milliseconds: 86400000,
    timeFormat: {
      units: 'hours',
      frequency: 6
    }
  },
  OneWeek: { 
    label: '1w', 
    milliseconds: 604800000,
    timeFormat: {
      units: 'days',
      frequency: 1
    }
  }
};
