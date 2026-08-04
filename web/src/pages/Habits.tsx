import { useState, useEffect, useCallback } from 'react';
import './Habits.css';
import { api } from '../api';
import axios from 'axios';

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

interface HabitsProps {
  onNavigate?: (page: string) => void;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

function Habits({ onNavigate }: HabitsProps) {
  const [habits, setHabits] = useState<HabitFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const last7Days = getLast7Days();

  const fetchHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get<HabitFromAPI[]>('/habits/my-habits');
      setHabits(res.data);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCubeClick = async (habitId: string, date: string) => {
    if (togglingId) return;
    setTogglingId(habitId + date);

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

          return {
            ...h,
            log: newLog,
            streak: updatedStreak,
          };
        })
      );
    } catch (err) {
      console.error('Failed to toggle habit day:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const Onclickdelete = async (itemId: string) => {
    const allback = [...habits]
    setHabits(habits.filter(i => i.id !== itemId))
    try {
      await api.delete(`/habits/delete-habit/${itemId}`)
    } catch(err) {
      console.error(err);
      setHabits(allback)
      if(axios.isAxiosError(err)) {
        return alert(err.response?.data?.message || 'ошибка')
      }
    }
  }

  const completedCount = habits.filter((h) => {
    const today = new Date().toISOString().slice(0, 10);
    return h.log.some((l) => l.date === today);
  }).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (isLoading) {
    return (
      <div className="habits-page">
        <div className="habits-loading">
          <div className="habits-loading__spinner" />
          <span>Loading your habits...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="habits-page">
      <div className="bg-orb--1" />
      <div className="bg-orb--2" />

      <div className="habits-header">
        <div className="habits-header__left">
          <h1 className="habits-title">Habits</h1>
          <p className="habits-subtitle">Build consistency, one day at a time</p>
        </div>
        <div className="habits-header__right">
          <button
            className="btn btn--secondary"
            onClick={() => (onNavigate ? onNavigate('habit-tracker') : undefined)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Tracker
          </button>
          <button
            className="btn btn--primary"
            onClick={() => (onNavigate ? onNavigate('create-habit') : undefined)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Habit
          </button>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="habits-progress-card">
        <div className="habits-progress-card__left">
          <div className="habits-progress-ring">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none" stroke="url(#progressGradient)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
                transform="rotate(-90 40 40)"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="habits-progress-ring__text">{completionRate}%</span>
          </div>
          <div className="habits-progress-info">
            <h3 className="habits-progress-info__title">Today's Progress</h3>
            <p className="habits-progress-info__subtitle">
              {completedCount} of {totalHabits} habits completed
            </p>
          </div>
        </div>
        <div className="habits-progress-card__right">
          <div className="habit-stat">
            <span className="habit-stat__value">
              {habits.reduce((sum, h) => sum + h.streak, 0)}
            </span>
            <span className="habit-stat__label">Total Streaks</span>
          </div>
          <div className="habit-stat">
            <span className="habit-stat__value">
              {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0}
            </span>
            <span className="habit-stat__label">Best Streak</span>
          </div>
          <div className="habit-stat">
            <span className="habit-stat__value">🔥 {habits.filter((h) => h.streak > 0).length}</span>
            <span className="habit-stat__label">Active</span>
          </div>
        </div>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="habits-empty">
          <div className="habits-empty__icon">🌱</div>
          <h3 className="habits-empty__title">No habits yet</h3>
          <p className="habits-empty__subtitle">Create your first habit to start building consistency</p>
          <button
            className="btn btn--primary"
            onClick={() => (onNavigate ? onNavigate('create-habit') : undefined)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="habits-list">
          {habits.map((habit) => {
            const todayStr = new Date().toISOString().slice(0, 10);
            const isCompletedToday = habit.log.some((l) => l.date === todayStr);

            return (
              <div key={habit.id} className={`habit-card ${isCompletedToday ? 'habit-card--completed' : ''}`}>
                {/* Left: toggle + icon + info */}
                <div className="habit-card__left">
                  <button
                    className={`habit-toggle ${isCompletedToday ? 'habit-toggle--checked' : ''}`}
                    onClick={() => handleCubeClick(habit.id, todayStr)}
                    disabled={togglingId === habit.id + todayStr}
                  >
                    {isCompletedToday && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span className="habit-icon">{habit.emodji}</span>
                  <div className="habit-info">
                    <span className={`habit-name ${isCompletedToday ? 'habit-name--done' : ''}`}>
                      {habit.title}
                    </span>
                    <span className="habit-frequency">
                      {habit.streak > 0 ? `${habit.streak} day streak` : 'Start today'}
                    </span>
                  </div>
                </div>

                {/* Center: 7-day cube grid */}
                <div className="habit-card__center">
                  <div className="habit-cube-grid">
                    {last7Days.map((date) => {
                      const isChecked = habit.log.some((l) => l.date === date);
                      const isToday = date === todayStr;
                      const isToggling = togglingId === habit.id + date;

                      return (
                        <div key={date} className="habit-cube__day">
                          <span className="habit-cube__label">{formatDayLabel(date)}</span>
                          <button
                            className={`habit-cube ${isChecked ? 'habit-cube--checked' : ''} ${isToday ? 'habit-cube--today' : ''} ${isToggling ? 'habit-cube--loading' : ''}`}
                            onClick={() => handleCubeClick(habit.id, date)}
                            disabled={!!togglingId}
                            title={date}
                          >
                            {isChecked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: streak + delete */}
                <div className="habit-card__right">
                  <div className="habit-streak">
                    <span className="habit-streak__icon">🔥</span>
                    <span className="habit-streak__value">{habit.streak}</span>
                  </div>
                  <button
                    className="habit-delete-btn"
                    onClick={() => Onclickdelete(habit.id)}
                    title="Delete habit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Habits;
