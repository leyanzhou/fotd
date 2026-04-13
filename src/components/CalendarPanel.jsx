import { formatMonthLabel, getCalendarDays, isSameMonth, MONTHS, toDateKey, WEEKDAYS } from '../utils/date';

export function CalendarView({
  monthDate,
  selectedDateKey,
  summaryByDate,
  onChangeMonth,
  onJumpToMonth,
  onSelectDate,
}) {
  const days = getCalendarDays(monthDate);
  const todayKey = toDateKey(new Date());
  const currentMonth = monthDate.getMonth();
  const currentYear = monthDate.getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, index) => currentYear - 10 + index);

  return (
    <section className="card panel-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2 className="single-line-title">{formatMonthLabel(monthDate)}</h2>
        </div>

        <div className="month-controls">
          <label className="month-picker">
            <span className="sr-only">Select year</span>
            <select
              aria-label="Select year"
              value={currentYear}
              onChange={(event) => onJumpToMonth(Number(event.target.value), currentMonth)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="month-picker">
            <span className="sr-only">Select month</span>
            <select
              aria-label="Select month"
              value={currentMonth}
              onChange={(event) => onJumpToMonth(currentYear, Number(event.target.value))}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </label>
          <button className="icon-button" onClick={() => onChangeMonth(-1)} type="button">
            Prev
          </button>
          <button className="icon-button" onClick={() => onChangeMonth(1)} type="button">
            Next
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
