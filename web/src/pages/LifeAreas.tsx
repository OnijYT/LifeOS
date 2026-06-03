import './LifeAreas.css';

interface LifeArea {
  id: number;
  name: string;
  icon: string;
  color: string;
  tasks: number;
  completed: number;
  goals: number;
  habits: number;
}

const lifeAreas: LifeArea[] = [
  { id: 1, name: 'Work', icon: '💼', color: '#8B5CF6', tasks: 24, completed: 18, goals: 3, habits: 2 },
  { id: 2, name: 'Study', icon: '📚', color: '#3B82F6', tasks: 12, completed: 8, goals: 2, habits: 3 },
  { id: 3, name: 'Finance', icon: '💰', color: '#22C55E', tasks: 5, completed: 3, goals: 1, habits: 1 },
  { id: 4, name: 'Health', icon: '❤️', color: '#EF4444', tasks: 8, completed: 6, goals: 2, habits: 4 },
  { id: 5, name: 'Sport', icon: '🏋️', color: '#F59E0B', tasks: 6, completed: 4, goals: 1, habits: 3 },
  { id: 6, name: 'Self Development', icon: '🧠', color: '#A855F7', tasks: 10, completed: 7, goals: 4, habits: 5 },
  { id: 7, name: 'Relationships', icon: '💕', color: '#EC4899', tasks: 4, completed: 3, goals: 1, habits: 1 },
];

function LifeAreas() {
  const totalTasks = lifeAreas.reduce((sum, a) => sum + a.tasks, 0);

  return (
    <div className="life-areas-page">
      <div className="life-areas-header">
        <div className="life-areas-header__left">
          <h1 className="life-areas-title">Life Areas</h1>
          <p className="life-areas-subtitle">Balance and track all areas of your life</p>
        </div>
        <div className="life-areas-header__right">
          <button className="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Area
          </button>
        </div>
      </div>

      {/* Balance Wheel */}
      <div className="balance-wheel">
        <h2 className="balance-wheel__title">Life Balance</h2>
        <div className="balance-chart">
          <div className="balance-chart__inner">
            {lifeAreas.map((area, i) => {
              const angle = (i / lifeAreas.length) * 360 - 90;
              const radius = 40;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={area.id}
                  className="balance-node"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    background: area.color,
                  }}
                  title={area.name}
                >
                  <span>{area.icon}</span>
                </div>
              );
            })}
            <div className="balance-center">
              <span className="balance-center__text">{lifeAreas.length}</span>
              <span className="balance-center__label">Areas</span>
            </div>
          </div>
        </div>
        <div className="balance-legend">
          {lifeAreas.map((area) => (
            <span key={area.id} className="balance-legend__item">
              <span className="balance-legend__dot" style={{ background: area.color }} />
              {area.name}
            </span>
          ))}
        </div>
      </div>

      {/* Areas Grid */}
      <div className="areas-grid">
        {lifeAreas.map((area) => {
          const completionRate = Math.round((area.completed / area.tasks) * 100);
          const share = Math.round((area.tasks / totalTasks) * 100);

          return (
            <div key={area.id} className="area-card">
              <div className="area-card__header">
                <div className="area-card__icon" style={{ background: `${area.color}20`, color: area.color }}>
                  <span>{area.icon}</span>
                </div>
                <div className="area-card__info">
                  <h3 className="area-card__name">{area.name}</h3>
                  <span className="area-card__share">{share}% of total</span>
                </div>
              </div>

              <div className="area-card__progress">
                <div className="area-card__progress-bar">
                  <div
                    className="area-card__progress-fill"
                    style={{ width: `${completionRate}%`, background: area.color }}
                  />
                </div>
                <span className="area-card__progress-text">{completionRate}%</span>
              </div>

              <div className="area-card__stats">
                <div className="area-stat">
                  <span className="area-stat__value">{area.tasks}</span>
                  <span className="area-stat__label">Tasks</span>
                </div>
                <div className="area-stat">
                  <span className="area-stat__value">{area.completed}</span>
                  <span className="area-stat__label">Done</span>
                </div>
                <div className="area-stat">
                  <span className="area-stat__value">{area.goals}</span>
                  <span className="area-stat__label">Goals</span>
                </div>
                <div className="area-stat">
                  <span className="area-stat__value">{area.habits}</span>
                  <span className="area-stat__label">Habits</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LifeAreas;
