import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { mockEvents, type DayEvent, type LocalCalendarEvent } from './data';
import {
  createWeekDayEvents,
  getLocalEventsForWeek,
  getWeekStart,
} from './helpers';

dayjs.extend(minMax);
dayjs.extend(utc);
dayjs.extend(timezone);
const LOCAL_TIMEZONE = 'Asia/Tashkent'; // needs dayjs wrapper to make it consistent

const currentWeekStart = getWeekStart(new Date(), LOCAL_TIMEZONE);
const currentWeekEvents = getLocalEventsForWeek(
  mockEvents,
  currentWeekStart,
  LOCAL_TIMEZONE
);
const currentWeekDayEvents = createWeekDayEvents(
  currentWeekEvents,
  currentWeekStart,
  LOCAL_TIMEZONE
);
const currentWeek = [...Array(7)].map((_, i) => currentWeekStart.add(i, 'day'));
const dayLabels = currentWeek.map((day) => day.format('ddd DD.MM'));

export function App() {
  return (
    <div className="flex p-2">
      <Calendar />
    </div>
  );
}

function Calendar() {
  return (
    <WeekView
      days={dayLabels}
      weekEvents={currentWeekDayEvents}
      timezone={LOCAL_TIMEZONE}
    />
  );
}

interface WeekViewProps {
  days: string[];
  weekEvents: LocalCalendarEvent[][];
  timezone: string;
}

function WeekView({ days, weekEvents, timezone }: WeekViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* days header */}
      <div className="flex sticky top-0 bg-gray-800/20 z-10">
        <div className="sticky left-0 bg-white w-[40px] shrink-0 z-1"></div>
        <div className="flex-1 flex">
          {days.map((day, i) => (
            <div key={i} className="flex-1 min-w-[120px] text-center">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex">
        {/* hour indicators */}
        <div className="flex flex-col">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="min-h-12">
              {i !== 0 && (
                <div className="absolute -mt-px w-full border-t border-red-400" />
              )}
            </div>
          ))}
        </div>

        {/* hours column */}
        <div className="flex flex-col sticky left-0 w-[40px] bg-gray-400/20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="min-h-12">
              {i !== 0 && (
                <div className="-mt-2 w-[40px] pr-1 text-xs text-right">
                  {i}:00
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex">
          {weekEvents.map((dayEvents, i) => (
            <div key={i} className="relative flex-1 border-r min-w-[120px]">
              <DayColumn events={dayEvents} timezone={timezone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  events,
  timezone,
}: {
  events: LocalCalendarEvent[];
  timezone: string;
}) {
  let prevLongestEventEnd: dayjs.Dayjs | null = null;
  let prevLeft = 0;

  const dayEvents: DayEvent[] = events.map((event, i) => {
    const start = dayjs(event.localStart).tz(timezone);
    const end = dayjs(event.localEnd).tz(timezone);
    const top = start.hour() * 48 + (start.minute() / 60) * 48;
    const height = end.diff(start, 'minute') * (48 / 60);

    prevLongestEventEnd = prevLongestEventEnd
      ? dayjs.max(prevLongestEventEnd, end)
      : end;

    const isSameTimePrev =
      i > 0 &&
      dayjs(events[i - 1].localStart)
        .tz(timezone)
        .isSame(start) &&
      dayjs(events[i - 1].localEnd)
        .tz(timezone)
        .isSame(end);

    const left =
      (!!prevLongestEventEnd && prevLongestEventEnd.isAfter(end)) ||
      isSameTimePrev
        ? prevLeft + 20
        : 0;

    prevLeft = left;

    return {
      localCalendarEvent: event,
      top,
      left,
      height,
    };
  });

  return (
    <div className="absolute inset-0">
      {dayEvents.map((dayEvent, index) => (
        <EventCard key={index} dayEvent={dayEvent} />
      ))}
    </div>
  );
}

interface EventCardProps {
  dayEvent: DayEvent;
}

function EventCard({ dayEvent }: EventCardProps) {
  return (
    <div
      className="absolute bg-blue-500 text-white rounded px-1 shadow-[0_0_5px_rgba(0,0,0)]"
      style={{
        top: dayEvent.top,
        left: dayEvent.left,
        height: dayEvent.height,
        right: 2,
      }}
    >
      {dayEvent.localCalendarEvent.calendarEvent.title}
    </div>
  );
}
