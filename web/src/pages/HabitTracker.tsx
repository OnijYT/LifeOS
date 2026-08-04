import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api';
import s from './HabitTracker.module.css';

interface HabitLog {
  date: string;
}

interface HabitFromAPI {
  id: string;
  title: string;
  emodji: string;
  streak: number;
  createdAt: string;
  log: HabitLog[];
}

interface HabitTrackerProps {
  onNavigate?: (page: string) => void;
}

type ViewMode = 'week' | 'month';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fromDateStr(s: string): Date {
  return new Date(s + 'T00:00:00');
}

function getWeekDates(weekOffset: number): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toDateStr(d));
  }
  return dates;
}

/** Returns array of week-arrays, each containing 7 date strings (Mon-Sun) */
function getMonthWeekRows(monthOffset: number): string[][] {
  const today = new Date();
  const targetMonth = today.getMonth() + monthOffset;
  const firstDay = new Date(today.getFullYear(), targetMonth, 1);
  const lastDay = new Date(today.getFullYear(), targetMonth + 1, 0);

  // Monday before or on the 1st
  const startDow = firstDay.getDay();
  const daysBeforeFirst = startDow === 0 ? 6 : startDow - 1;
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - daysBeforeFirst);

  // Build rows of 7
  const rows: string[][] = [];
  let currentRow: string[] = [];
  const cursor = new Date(calendarStart);

  const totalDays = daysBeforeFirst + lastDay.getDate();
  const totalCells = Math.ceil(totalDays / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    currentRow.push(toDateStr(cursor));
    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return rows;
}

function formatDayName(dateStr: string): string {
  const d = fromDateStr(dateStr);
  return DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
}

function formatDayNum(dateStr: string): number {
  return fromDateStr(dateStr).getDate();
}

function formatPeriodLabel(viewMode: ViewMode, weekOffset: number, monthOffset: number): string {
  const today = new Date();
  if (viewMode === 'week') {
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);
    return `${MONTHS[monday.getMonth()]} ${monday.getFullYear()}`;
  } else {
    const targetMonth = today.getMonth() + monthOffset;
    const d = new Date(today.getFullYear(), targetMonth, 1);
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
}

function HabitTracker({ onNavigate }: HabitTrackerProps) {
  const [habits, setHabits] = useState<HabitFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingCell, setTogglingCell] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const todayStr = toDateStr(new Date());

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const monthRows = useMemo(() => getMonthWeekRows(monthOffset), [monthOffset]);

  const periodLabel = useMemo(() => {
    return formatPeriodLabel(viewMode, weekOffset, monthOffset);
  }, [viewMode, weekOffset, monthOffset]);

  const isCurrentPeriod = viewMode === 'week' ? weekOffset === 0 : monthOffset === 0;

  const fetchHabits = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await api.get<HabitFromAPI[]>('/habits/my-habits');
      setHabits(res.data);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits(true);
  }, [fetchHabits]);

  const handleCellClick = async (habitId: string, date: string) => {
    if (togglingCell) return;
    setTogglingCell(habitId + date);

    try {
      const res = await api.post(`/habits/check-habit-day/${habitId}`, {
        targetDate: date,
      });

      const updatedStreak = res.data.streak;

      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const isChecked = h.log.some((l) => l.date === date);
          const newLog = isChecked
            ? h.log.filter((l) => l.date !== date)
            : [...h.log, { date }];
          return { ...h, log: newLog, streak: updatedStreak };
        })
      );
    } catch (err) {
      console.error('Failed to toggle:', err);
    } finally {
      setTogglingCell(null);
    }
  };

  const getCompletionForDate = (date: string): number => {
    return habits.filter((h) => h.log.some((l) => l.date === date)).length;
  };

  const totalHabits = habits.length;

  const goToPrev = () => {
    if (viewMode === 'week') setWeekOffset((w) => w - 1);
    else setMonthOffset((m) => m - 1);
  };

  const goToNext = () => {
    if (viewMode === 'week') setWeekOffset((w) => w + 1);
    else setMonthOffset((m) => m + 1);
  };

  const goToToday = () => {
    if (viewMode === 'week') setWeekOffset(0);
    else setMonthOffset(0);
  };

  const switchToWeek = () => { setViewMode('week'); setWeekOffset(0); };
  const switchToMonth = () => { setViewMode('month'); setMonthOffset(0); };

  // Check if a date belongs to the target month
  const isDateInTargetMonth = useCallback((dateStr: string): boolean => {
    const today = new Date();
    const targetMonth = today.getMonth() + monthOffset;
    const d = fromDateStr(dateStr);
    const targetYear = new Date(today.getFullYear(), targetMonth, 1).getFullYear();
    return d.getMonth() === (targetMonth % 12 + 12) % 12 && d.getFullYear() === targetYear;
  }, [monthOffset]);

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.loading}>
          <div className={s.loading__spinner} />
          <span>Loading tracker...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.bgOrb1} />
      <div className={s.bgOrb2} />

      <div className={s.container}>
        {/* Header */}
        <div className={s.header}>
          <button
            className={s.backBtn}
            onClick={() => (onNavigate ? onNavigate('habits') : undefined)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className={s.header__text}>
            <h1 className={s.title}>Habit Tracker</h1>
            <p className={s.subtitle}>Click any cell to mark your habit as done</p>
          </div>

          <div className={s.header__actions}>
            <button
              className={s.addBtn}
              onClick={() => (onNavigate ? onNavigate('create-habit') : undefined)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Habit
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className={s.viewToggle}>
          <button
            className={`${s.viewToggle__btn} ${viewMode === 'week' ? s.viewToggle__btnActive : ''}`}
            onClick={switchToWeek}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Week
          </button>
          <button
            className={`${s.viewToggle__btn} ${viewMode === 'month' ? s.viewToggle__btnActive : ''}`}
            onClick={switchToMonth}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Month
          </button>
        </div>

        {/* Navigation */}
        <div className={s.weekNav}>
          <button className={s.weekNav__btn} onClick={goToPrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={s.weekNav__center}>
            <span className={s.weekNav__month}>{periodLabel}</span>
            {!isCurrentPeriod && (
              <button className={s.weekNav__today} onClick={goToToday}>
                Go to today
              </button>
            )}
          </div>

          <button className={s.weekNav__btn} onClick={goToNext}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Table */}
        {habits.length === 0 ? (
          <div className={s.empty}>
            <div className={s.empty__icon}>📊</div>
            <h3 className={s.empty__title}>No habits to track</h3>
            <p className={s.empty__subtitle}>Create your first habit to start tracking your progress</p>
            <button
              className={s.empty__btn}
              onClick={() => (onNavigate ? onNavigate('create-habit') : undefined)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Habit
            </button>
          </div>
        ) : viewMode === 'week' ? (
          <div className={s.tableWrapper}>
            <div className={s.table}>
              {/* Table Header */}
              <div className={s.table__header}>
                <div className={s.colHabit}>
                  <span>Habit</span>
                </div>
                <div className={s.colDays}>
                  {weekDates.map((date) => {
                    const isToday = date === todayStr;
                    return (
                      <div key={date} className={`${s.dayHeader} ${isToday ? s.dayHeaderToday : ''}`}>
                        <span className={s.dayName}>{formatDayName(date)}</span>
                        <span className={s.dayNum}>{formatDayNum(date)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={s.colStreak}>
                  <span>Streak</span>
                </div>
              </div>

              {/* Table Body */}
              {habits.map((habit) => (
                <div key={habit.id} className={s.table__row}>
                  <div className={s.colHabit}>
                    <div className={s.habitCell}>
                      <span className={s.habitEmoji}>{habit.emodji}</span>
                      <span className={s.habitTitle}>{habit.title}</span>
                    </div>
                  </div>
                  <div className={s.colDays}>
                    {weekDates.map((date) => {
                      const isChecked = habit.log.some((l) => l.date === date);
                      const isToday = date === todayStr;
                      const isToggling = togglingCell === habit.id + date;

                      return (
                        <div key={date} className={s.cellWrapper}>
                          <button
                            className={`${s.cell} ${isChecked ? s.cellChecked : ''} ${isToday ? s.cellToday : ''} ${isToggling ? s.cellLoading : ''}`}
                            onClick={() => handleCellClick(habit.id, date)}
                            disabled={!!togglingCell}
                            title={`${habit.title} — ${formatDayName(date)} ${formatDayNum(date)}`}
                          >
                            {isChecked && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className={s.colStreak}>
                    <div className={s.streakBadge}>
                      <span className={s.streakIcon}>🔥</span>
                      <span className={s.streakValue}>{habit.streak}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer: daily completion */}
              <div className={s.table__footer}>
                <div className={s.colHabit}>
                  <span className={s.footerLabel}>Completed</span>
                </div>
                <div className={s.colDays}>
                  {weekDates.map((date) => {
                    const count = getCompletionForDate(date);
                    const pct = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;
                    const isToday = date === todayStr;

                    return (
                      <div key={date} className={s.cellWrapper}>
                        <div className={`${s.footerCell} ${isToday ? s.footerCellToday : ''}`}>
                          <span className={s.footerCount}>{count}/{totalHabits}</span>
                          <div className={s.footerBar}>
                            <div
                              className={s.footerBarFill}
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={s.colStreak} />
              </div>
            </div>
          </div>
        ) : (
          /* ── Month View ── */
          <div className={s.tableWrapper}>
            <div className={s.monthGrid}>
              {/* Day-of-week header row */}
              <div className={s.monthRow}>
                <div className={`${s.monthHabitCol} ${s.monthHabitLabel}`}>Habit</div>
                {(monthRows[0] || []).map((date) => (
                  <div key={date} className={s.monthDayHeader}>{formatDayName(date)}</div>
                ))}
                <div className={s.monthStreakCol}>Streak</div>
              </div>

              {/* Per-habit rows */}
              {habits.map((habit) => (
                <div key={habit.id} className={s.monthRow}>
                  <div className={s.monthHabitCol}>
                    <div className={s.habitCell}>
                      <span className={s.habitEmoji}>{habit.emodji}</span>
                      <span className={s.habitTitle}>{habit.title}</span>
                    </div>
                  </div>
                  {monthRows.flat().map((date) => {
                    const inMonth = isDateInTargetMonth(date);
                    const isChecked = inMonth && habit.log.some((l) => l.date === date);
                    const isToday = date === todayStr;
                    const isToggling = togglingCell === habit.id + date;

                    return (
                      <div key={date} className={s.monthCellWrapper}>
                        {inMonth ? (
                          <button
                            className={`${s.monthCell} ${isChecked ? s.monthCellChecked : ''} ${isToday ? s.monthCellToday : ''} ${isToggling ? s.cellLoading : ''}`}
                            onClick={() => handleCellClick(habit.id, date)}
                            disabled={!!togglingCell}
                            title={`${habit.title} — ${formatDayName(date)} ${formatDayNum(date)}`}
                          >
                            <span className={s.monthCellNum}>{formatDayNum(date)}</span>
                            {isChecked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        ) : (
                          <div className={s.monthCellEmpty} />
                        )}
                      </div>
                    );
                  })}
                  <div className={s.monthStreakCol}>
                    <div className={s.streakBadge}>
                      <span className={s.streakIcon}>🔥</span>
                      <span className={s.streakValue}>{habit.streak}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer: daily completion */}
              <div className={s.monthRow}>
                <div className={`${s.monthHabitCol} ${s.monthHabitLabel}`}>
                  <span className={s.footerLabel}>Done</span>
                </div>
                {monthRows.flat().map((date) => {
                  const inMonth = isDateInTargetMonth(date);
                  const count = getCompletionForDate(date);
                  const pct = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;
                  const isToday = date === todayStr;

                  return (
                    <div key={date} className={s.monthCellWrapper}>
                      {inMonth ? (
                        <div className={`${s.monthFooterCell} ${isToday ? s.monthCellToday : ''}`}>
                          <span className={s.footerCount}>{count}/{totalHabits}</span>
                          <div className={s.footerBar}>
                            <div className={s.footerBarFill} style={{ height: `${pct}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className={s.monthCellEmpty} />
                      )}
                    </div>
                  );
                })}
                <div className={s.monthStreakCol} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitTracker;
