import { formatCompactDate, formatTime } from '../utils/date';

export function DayDetails({ dateKey, entries = [] }) {
  const sortedEntries = [...entries].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );

  return (
    <section className="card panel-card day-details-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Day Details</p>
          <h2 className="single-line-title">{formatCompactDate(dateKey)}</h2>
        </div>
        <span className={`status-pill ${entries.length ? 'status-pill--complete' : ''}`}>
          {entries.length ? 'Completed' : 'Incomplete'}
        </span>
      </div>

      {sortedEntries.length ? (
        <div className="meal-list">
          {sortedEntries.map((entry) => (
            <article key={entry.id} className="meal-item">
              <div className="meal-item__header">
                <div>
                  <p className="meal-type">{entry.mealType}</p>
                  <p className="muted">{formatTime(entry.createdAt)}</p>
                </div>
              </div>

              {entry.text ? <p>{entry.text}</p> : <p className="muted">No description added.</p>}
              {entry.imageUrl ? (
                <img className="meal-image" src={entry.imageUrl} alt={`${entry.mealType} entry`} />
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No meals logged for this day yet. One meal is enough to keep the streak alive.
        </p>
      )}
    </section>
  );
}
