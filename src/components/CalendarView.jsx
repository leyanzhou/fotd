import { formatMonthLabel, getCalendarDays, isSameMonth, toDateKey, WEEKDAYS } from '../utils/date';

export function CalendarView({
  monthDate,
  selectedDateKey,
  summaryByDate,
  onChangeMonth,
  onSelectDate,
}) {
  const days = getCalendarDays(monthDate);
  const todayKey = toDateKey(new Date());

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2>{formatMonthLabel(monthDate)}</h2>
        </div>

        <div className="month-controls">
          <button className="icon-button" onClick={() => onChangeMonth(-1)} type="button">
            ←
          </button>
          <button className="icon-button" onClick={() => onChangeMonth(1)} type="button">
            →
          </button>
        </div>
      </div>

      <div className="calendar-grid calendar-grid--labels">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="calendar-label">
            {weekday}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const hasEntry = Boolean(summaryByDate[dateKey]?.completed);
          const isSelected = dateKey === selectedDateKey;
          const inCurrentMonth = isSameMonth(day, monthDate);
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              className={[
                'calendar-day',
                inCurrentMonth ? '' : 'calendar-day--muted',
                hasEntry ? 'calendar-day--complete' : 'calendar-day--empty',
                isSelected ? 'calendar-day--selected' : '',
                isToday ? 'calendar-day--today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => onSelectDate(dateKey)}
            >
              <span>{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
