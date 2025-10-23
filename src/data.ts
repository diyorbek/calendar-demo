export interface CalendarEvent {
  id: string;
  type: 'SINGULAR' | 'RECURRING' | 'ALL_DAY';
  start: string; // YYYY-MM-DD hh:mm
  end: string; // YYYY-MM-DD hh:mm
  timezone: string;
  title: string;
  description: string;
  // RRULE: string | null;
  updatedAt: number; // UTC timestamp
}

export interface LocalCalendarEvent {
  calendarEvent: CalendarEvent;
  localStart: Date;
  localEnd: Date;
}

export interface DayEvent {
  localCalendarEvent: LocalCalendarEvent;
  top: number;
  left: number;
  height: number;
}

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    type: 'SINGULAR',
    start: '2025-10-20 10:00',
    end: '2025-10-20 10:30',
    timezone: 'Europe/Warsaw',
    title: 'Meeting with Team',
    description: 'Discuss project updates and next steps.',
    updatedAt: Date.now(),
  },
  {
    id: '2',
    type: 'SINGULAR',
    start: '2025-10-20 13:00',
    end: '2025-10-20 14:00',
    timezone: 'Europe/Warsaw',
    title: 'Client Call',
    description: 'Monthly check-in with the client.',
    updatedAt: Date.now(),
  },
  {
    id: '3',
    type: 'SINGULAR',
    start: '2025-10-21 7:00',
    end: '2025-10-21 9:00',
    timezone: 'Europe/Warsaw',
    title: 'Design Review 1',
    description: 'Review new design mockups with the design team.',
    updatedAt: Date.now(),
  },
  {
    id: '3',
    type: 'SINGULAR',
    start: '2025-10-21 7:00',
    end: '2025-10-21 9:00',
    timezone: 'Europe/Warsaw',
    title: 'Design Review 2',
    description: 'Review new design mockups with the design team.',
    updatedAt: Date.now(),
  },
  {
    id: '3',
    type: 'SINGULAR',
    start: '2025-10-21 7:30',
    end: '2025-10-21 9:00',
    timezone: 'Europe/Warsaw',
    title: 'Design Review 20',
    description: 'Review new design mockups with the design team.',
    updatedAt: Date.now(),
  },
  {
    id: '3',
    type: 'SINGULAR',
    start: '2025-10-22 10:00',
    end: '2025-10-23 11:00',
    timezone: 'Europe/Warsaw',
    title: 'Design Review 3',
    description: 'Review new design mockups with the design team.',
    updatedAt: Date.now(),
  },
  {
    id: '4',
    type: 'SINGULAR',
    start: '2025-10-23 08:00',
    end: '2025-10-23 10:30',
    timezone: 'Europe/Warsaw',
    title: 'Project Review 1',
    description: 'Review project milestones and deliverables.',
    updatedAt: Date.now(),
  },
  {
    id: '5',
    type: 'SINGULAR',
    start: '2025-10-23 15:00',
    end: '2025-10-23 16:30',
    timezone: 'Europe/Warsaw',
    title: 'Project Review 2',
    description: 'Review project milestones and deliverables.',
    updatedAt: Date.now(),
  },
  {
    id: '6',
    type: 'SINGULAR',
    start: '2025-10-25 11:00',
    end: '2025-10-25 13:00',
    timezone: 'Europe/Warsaw',
    title: 'Team Lunch',
    description: 'Team building lunch at local restaurant.',
    updatedAt: Date.now(),
  },
].map(
  (event, i) =>
    ({
      ...event,
      id: String(i + 1),
    } as CalendarEvent)
);
