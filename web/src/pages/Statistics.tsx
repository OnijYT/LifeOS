import './Statistics.css';

const weeklyData = [
  { day: 'Mon', tasks: 8, habits: 3, goals: 1 },
  { day: 'Tue', tasks: 6, habits: 4, goals: 0 },
  { day: 'Wed', tasks: 9, habits: 2, goals: 2 },
  { day: 'Thu', tasks: 7, habits: 4, goals: 1 },
  { day: 'Fri', tasks: 5, habits: 3, goals: 1 },
  { day: 'Sat', tasks: 3, habits: 2, goals: 0 },
  { day: 'Sun', tasks: 4, habits: 3, goals: 1 },
];

const monthlyStats = [
  { label: 'Tasks Completed', value: 142, total: 180, color: '#8B5CF6' },
  { label: 'Habits Maintained', value: 23, total: 30, color: '#22C55E' },
  { label: 'Goals Progress', value: 68, total: 100, color: '#F59E0B' },
  { label: 'Notes Created', value: 18, total: 30, color: '#3B82F6' },
];

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first task', icon: '🎯', unlocked: true },
  { id: 2, title: 'Streak Master', description: 'Maintain a 7-day habit streak', icon: '🔥', unlocked: true },
  { id: 3, title: 'Goal Crusher', description: 'Complete 5 goals', icon: '🏆', unlocked: true },
  { id: 4, title: 'Century Club', description: 'Complete 100 tasks', icon: '💯', unlocked: true },
  { id: 5, title: 'Consistency King', description: '30-day habit streak', icon: '👑', unlocked: false },
  { id: 6, title: 'Note Taker', description: 'Create 50 notes', icon: '📝', unlocked: false },
];

function Statistics() {
  const maxTasks = Math.max(...weeklyData.map((d) => d.tasks));

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <div className="statistics-header__left">
          <h1 className="statistics-title">Statistics</h1>
          <p className="statistics-subtitle">Track your growth and progress over time</p>
        </div>
        <div className="statistics-header__right">
          <div className="period-selector">
            <button className="period-btn period-btn--active">Week</button>
            <button className="period-btn">Month</button>
            <button className="period-btn">Year</button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-overview">
        <div className="overview-card">
          <div className="overview-card__icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__value">142</span>
            <span className="overview-card__label">Tasks Done</span>
          </div>
          <span className="overview-card__change overview-card__change--up">+12%</span>
        </div>

        <div className="overview-card">
          <div className="overview-card__icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__value">23</span>
            <span className="overview-card__label">Habits Done</span>
          </div>
          <span className="overview-card__change overview-card__change--up">+8%</span>
        </div>

        <div className="overview-card">
          <div className="overview-card__icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__value">68%</span>
            <span className="overview-card__label">Goals Progress</span>
          </div>
          <span className="overview-card__change overview-card__change--up">+5%</span>
        </div>

        <div className="overview-card">
          <div className="overview-card__icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__value">18</span>
            <span className="overview-card__label">Notes Created</span>
          </div>
          <span className="overview-card__change overview-card__change--down">-3%</span>
        </div>
      </div>

      <div className="statistics-grid">
        {/* Weekly Chart */}
        <section className="stat-section stat-chart-section">
          <div className="section-header">
            <h2 className="section-title">Weekly Activity</h2>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#8B5CF6' }} /> Tasks</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#22C55E' }} /> Habits</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#F59E0B' }} /> Goals</span>
            </div>
          </div>
          <div className="weekly-chart">
            {weeklyData.map((data) => (
              <div key={data.day} className="weekly-chart__column">
                <div className="weekly-chart__bars">
                  <div className="weekly-chart__bar weekly-chart__bar--tasks" style={{ height: `${(data.tasks / maxTasks) * 100}%` }} />
                  <div className="weekly-chart__bar weekly-chart__bar--habits" style={{ height: `${(data.habits / 4) * 100}%` }} />
                  <div className="weekly-chart__bar weekly-chart__bar--goals" style={{ height: `${(data.goals / 2) * 100}%` }} />
                </div>
                <span className="weekly-chart__label">{data.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Progress */}
        <section className="stat-section">
          <div className="section-header">
            <h2 className="section-title">Monthly Progress</h2>
          </div>
          <div className="monthly-progress">
            {monthlyStats.map((stat) => (
              <div key={stat.label} className="progress-item">
                <div className="progress-item__header">
                  <span className="progress-item__label">{stat.label}</span>
                  <span className="progress-item__value">{stat.value}/{stat.total}</span>
                </div>
                <div className="progress-item__bar">
                  <div
                    className="progress-item__fill"
                    style={{ width: `${(stat.value / stat.total) * 100}%`, background: stat.color }}
                  />
                </div>
                <span className="progress-item__percent">{Math.round((stat.value / stat.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="stat-section stat-achievements">
          <div className="section-header">
            <h2 className="section-title">Achievements</h2>
            <span className="achievements-count">{achievements.filter((a) => a.unlocked).length}/{achievements.length}</span>
          </div>
          <div className="achievements-grid">
            {achievements.map((ach) => (
              <div key={ach.id} className={`achievement-card ${ach.unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}>
                <span className="achievement-card__icon">{ach.icon}</span>
                <div className="achievement-card__info">
                  <span className="achievement-card__title">{ach.title}</span>
                  <span className="achievement-card__desc">{ach.description}</span>
                </div>
                {ach.unlocked && (
                  <span className="achievement-card__check">✓</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Heatmap */}
        <section className="stat-section">
          <div className="section-header">
            <h2 className="section-title">Activity Heatmap</h2>
          </div>
          <div className="heatmap">
            {Array.from({ length: 12 }, (_, weekIdx) => (
              <div key={weekIdx} className="heatmap__week">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const intensity = Math.random();
                  const opacity = intensity < 0.2 ? 0.1 : intensity < 0.4 ? 0.3 : intensity < 0.6 ? 0.5 : intensity < 0.8 ? 0.7 : 1;
                  return (
                    <div
                      key={dayIdx}
                      className="heatmap__cell"
                      style={{ opacity, background: `var(--primary)` }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="heatmap__legend">
            <span>Less</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map((op) => (
              <div key={op} className="heatmap__cell" style={{ opacity: op, background: 'var(--primary)' }} />
            ))}
            <span>More</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Statistics;
