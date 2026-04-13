import { useMemo, useState } from 'react';
import { MONTHS, formatCompactDate, formatTime, toDateKey } from '../utils/date';

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return {
    year,
    monthIndex: month - 1,
    day,
  };
}

function buildDateKey(year, monthIndex, day) {
  return `${year}-${`${monthIndex + 1}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
}

export function HistoryList({ entries }) {
  const sortedEntries = useMemo(
    () => [...entries].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [entries],
  );
  const fallbackDateKey = sortedEntries[0]?.dateKey ?? toDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(fallbackDateKey);
  const selectedDate = parseDateKey(selectedDateKey);
  const availableYears = useMemo(() => {
    const years = [...new Set(entries.map((entry) => Number(entry.dateKey.slice(0, 4))))].sort((left, right) => right - left);
    return years.length ? years : [selectedDate.year];
  }, [entries, selectedDate.year]);
  const dayCount = getDaysInMonth(selectedDate.year, selectedDate.monthIndex);
  const selectedEntries = sortedEntries.filter((entry) => entry.dateKey === selectedDateKey);

  const updateDate = (nextYear, nextMonthIndex, nextDay) => {
    const nextDayCount = getDaysInMonth(nextYear, nextMonthIndex);
    setSelectedDateKey(buildDateKey(nextYear, nextMonthIndex, Math.min(nextDay, nextDayCount)));
  };

  if (entries.length === 0) {
    return (
      <section className="card panel-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">History</p>
            <h2>Your timeline starts here</h2>
          </div>
        </div>
        <p className="empty-state">Log your first meal to begin building consistency.</p>
      </section>
    );
  }

  return (
    <section className="card panel-card history-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">History</p>
          <h2>{formatCompactDate(selectedDateKey)}</h2>
        </div>
      </div>

      <div className="history-filters" aria-label="History date filters">
        <label>
          Year
          <select
            value={selectedDate.year}
            onChange={(event) => updateDate(Number(event.target.value), selectedDate.monthIndex, selectedDate.day)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month
          <select
            value={selectedDate.monthIndex}
            onChange={(event) => updateDate(selectedDate.year, Number(event.target.value), selectedDate.day)}
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label>
          Day
          <select
            value={selectedDate.day}
            onChange={(event) => updateDate(selectedDate.year, selectedDate.monthIndex, Number(event.target.value))}
          >
            {Array.from({ length: dayCount }, (_, index) => index + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="history-list history-list--scroll">
        {selectedEntries.length ? selectedEntries.map((entry) => (
          <article key={entry.id} className="history-item">
            <div className="history-item__date">
              <p>{formatCompactDate(entry.dateKey)}</p>
              <p className="muted">{formatTime(entry.createdAt)}</p>
            </div>

            <div className="history-item__content">
              <p className="meal-type">{entry.mealType}</p>
              <p>{entry.text || 'No description added.'}</p>
              {entry.imageUrl ? (
                <img className="meal-image meal-image--history" src={entry.imageUrl} alt={entry.mealType} />
              ) : null}
            </div>
          </article>
        )) : (
          <p className="empty-state">No meals logged for this day.</p>
        )}
      </div>
    </section>
  );
}
