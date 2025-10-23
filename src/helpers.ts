import dayjs, { Dayjs } from 'dayjs';
import { type CalendarEvent, type LocalCalendarEvent } from './data';

export function getWeekStart(date: Date, timezone: string): Dayjs {
  return dayjs(date).tz(timezone).startOf('week').add(1, 'day');
}

export function getLocalEventsForWeek(
  events: CalendarEvent[],
  localWeekStart: Dayjs,
  localTimezone: string
): LocalCalendarEvent[] {
  // Assume mockEvents are sorted
  return events.reduce((acc, event) => {
    const eventDate = dayjs.tz(event.start, 'YYYY-MM-DD hh:mm', event.timezone);
    const localStart = eventDate.tz(localTimezone);
    const localEnd = dayjs
      .tz(event.end, 'YYYY-MM-DD hh:mm', event.timezone)
      .tz(localTimezone);

    const dayIndex = localStart.diff(localWeekStart, 'day');

    if (dayIndex >= 0 && dayIndex < 7) {
      acc.push({
        calendarEvent: event,
        localStart: localStart.toDate(),
        localEnd: localEnd.toDate(),
      });
    }
    return acc;
  }, [] as LocalCalendarEvent[]);
}

export function createWeekDayEvents(
  weekEvents: LocalCalendarEvent[],
  localWeekStart: Dayjs,
  localTimezone: string
) {
  const weekDayEvents: LocalCalendarEvent[][] = Array.from(
    { length: 7 },
    () => []
  );

  const stack = weekEvents.toReversed();

  while (stack.length > 0) {
    const event = stack.pop()!;
    const eventStart = dayjs.tz(event.localStart, localTimezone);
    const eventEnd = dayjs.tz(event.localEnd, localTimezone);
    const dayIndex = eventStart.diff(localWeekStart, 'day');

    if (eventEnd.diff(eventStart, 'day') > 0) {
      // Multi-day event, split it
      const endOfStartDay = eventStart.endOf('day');
      weekDayEvents[dayIndex].push({
        ...event,
        localEnd: endOfStartDay.toDate(),
      });

      const nextDayStart = endOfStartDay.add(1, 'millisecond');
      stack.push({
        ...event,
        localStart: nextDayStart.toDate(),
      });
      continue;
    }

    if (dayIndex >= 0 && dayIndex < 7) {
      weekDayEvents[dayIndex].push(event);
    }
  }

  return weekDayEvents;
}
