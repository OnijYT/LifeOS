import { useState } from 'react';
import './Habits.css';

interface Habit {
  id: number;
  name: string;
  icon: string;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  frequency: string;
  completedDays: boolean[];
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialHabits: Habit[] = [
  { id: 1, name: 'Morning workout', icon: '💪', streak: 12, bestStreak: 21, completedToday: true, frequency: 'Daily', completedDays: [true, true, true, true, true, false, false] },
  { id: 2, name: 'Read 30 minutes', icon: '📚', streak: 8, bestStreak: 15, completedToday: true, frequency: 'Daily', completedDays: [true, true, true, true, true, true, false] },
  { id: 3, name: 'Meditate', icon: '🧘', streak: 5, bestStreak: 30, completedToday: false, frequency: 'Daily', completedDays: [true, true, true, true, false, false, false] },
  { id: 4, name: 'Journal writing', icon: '✍️', streak: 3, bestStreak: 10, completedToday: true, frequency: 'Daily', completedDays: [true, true, true, false, false, false, false] },
  { id: 5, name: 'No social media', icon: '📵', streak: 1, bestStreak: 7, completedToday: false, frequency: 'Weekdays', completedDays: [true, false, false, false, false, false, false] },
  { id: 6, name: 'Drink 2L water', icon: '💧', streak: 15, bestStreak: 15, completedToday: true, frequency: 'Daily', completedDays: [true, true, true, true, true, true, true] },
];

function Habits() {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id: number) => {
    setHabits(habits.map((h) =>
      h.id === id
        ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak - 1 : h.streak + 1 }
        : h
    ));
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = Math.round((completedCount / totalHabits) * 100);

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div className="habits-header__left">
          <h1 className="habits-title">Habits</h1>
          <p className="habits-subtitle">Build consistency, one day at a time</p>
        </div>
        <div className="habits-header__right">
          <button className="btn btn--primary">
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
            <p className="habits-progress-info__subtitle">{completedCount} of {totalHabits} habits completed</p>
          </div>
        </div>
        <div className="habits-progress-card__right">
          <div className="habit-stat">
            <span className="habit-stat__value">{habits.reduce((sum, h) => sum + h.streak, 0)}</span>
            <span className="habit-stat__label">Total Streaks</span>
          </div>
          <div className="habit-stat">
            <span className="habit-stat__value">{Math.max(...habits.map((h) => h.bestStreak))}</span>
            <span className="habit-stat__label">Best Streak</span>
          </div>
          <div className="habit-stat">
            <span className="habit-stat__value">🔥 {habits.filter((h) => h.streak > 0).length}</span>
            <span className="habit-stat__label">Active</span>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="habits-list">
        {habits.map((habit) => (
          <div key={habit.id} className={`habit-card ${habit.completedToday ? 'habit-card--completed' : ''}`}>
            <div className="habit-card__left">
              <button
                className={`habit-toggle ${habit.completedToday ? 'habit-toggle--checked' : ''}`}
                onClick={() => toggleHabit(habit.id)}
              >
                {habit.completedToday && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="habit-icon">{habit.icon}</span>
              <div className="habit-info">
                <span className={`habit-name ${habit.completedToday ? 'habit-name--done' : ''}`}>
                  {habit.name}
                </span>
                <span className="habit-frequency">{habit.frequency}</span>
              </div>
            </div>
            <div className="habit-card__center">
              <div className="habit-week">
                {weekDays.map((day, i) => (
                  <div key={day} className="habit-week__day">
                    <span className="habit-week__label">{day}</span>
                    <div className={`habit-week__dot ${habit.completedDays[i] ? 'habit-week__dot--filled' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="habit-card__right">
              <div className="habit-streak">
                <span className="habit-streak__icon">🔥</span>
                <span className="habit-streak__value">{habit.streak}</span>
              </div>
              <span className="habit-best">Best: {habit.bestStreak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Habits;
