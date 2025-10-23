import dayjs, { Dayjs } from 'dayjs';
import {
  type CalendarEvent,
  type DayEvent,
  type LocalCalendarEvent,
} from './data';

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

// There are maybe some redundant checks or more edge cases to cover
export function generateDayEvents(
  events: LocalCalendarEvent[],
  timezone: string
): DayEvent[] {
  let prevLongestEventEnd: dayjs.Dayjs | null = null;
  let prevLongestEventLeft = 0;
  let prevLeft = 0;

  return events.map((event, i) => {
    const start = dayjs(event.localStart).tz(timezone);
    const end = dayjs(event.localEnd).tz(timezone);

    const decimalHour = start.hour() + start.minute() / 60;
    const top = (decimalHour / 24) * 100;
    const height = (end.diff(start, 'minute') / (24 * 60)) * 100;

    const isSameTimePrev =
      i > 0 &&
      dayjs(events[i - 1].localStart)
        .tz(timezone)
        .isSame(start);

    let left = 0;

    if (
      (!!prevLongestEventEnd && prevLongestEventEnd.isAfter(start)) ||
      isSameTimePrev
    ) {
      const isOverlapWithPrev =
        i > 0 &&
        dayjs(events[i - 1].localEnd)
          .tz(timezone)
          .isAfter(start);

      const shift = isOverlapWithPrev ? 10 : 0;

      left = Math.max(prevLongestEventLeft, prevLeft) + shift;
    }

    prevLongestEventEnd = prevLongestEventEnd
      ? dayjs.max(prevLongestEventEnd, end)
      : end;

    if (prevLongestEventEnd.isSame(end)) {
      prevLongestEventLeft = left;
    }

    prevLeft = left;

    return {
      localCalendarEvent: event,
      top,
      left,
      height,
    };
  });
}
