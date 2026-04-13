import { addDays, startOfDay, toDateKey } from './date';

export function buildDailySummary(entries) {
  return entries.reduce((summary, entry) => {
    const current = summary[entry.dateKey] ?? {
      date: entry.dateKey,
      completed: false,
      entries: [],
    };

    current.completed = true;
    current.entries.push(entry);
    summary[entry.dateKey] = current;
    return summary;
  }, {});
}

function getCompletedDaySet(entries) {
  return new Set(entries.map((entry) => entry.dateKey));
}

export function getCurrentStreak(entries, today = new Date()) {
  const completedDays = getCompletedDaySet(entries);
  let streak = 0;
  let cursor = startOfDay(today);

  while (completedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getLongestStreak(entries) {
  const completedDays = [...getCompletedDaySet(entries)].sort();

  if (completedDays.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < completedDays.length; index += 1) {
    const previous = startOfDay(completedDays[index - 1]);
    const nextExpected = toDateKey(addDays(previous, 1));

    if (completedDays[index] === nextExpected) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
