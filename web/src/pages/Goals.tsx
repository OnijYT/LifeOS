import { useState } from 'react';
import './Goals.css';

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
  milestones: { id: number; title: string; completed: boolean }[];
}

const initialGoals: Goal[] = [
  {
    id: 1, title: 'Launch LifeOS v1.0', description: 'Complete all core features and release the first stable version', progress: 72, deadline: '2026-06-30', category: 'Product',
    milestones: [
      { id: 1, title: 'Design system', completed: true },
      { id: 2, title: 'Core features', completed: true },
      { id: 3, title: 'Testing & QA', completed: false },
      { id: 4, title: 'Documentation', completed: false },
    ],
  },
  {
    id: 2, title: 'Reach 1000 users', description: 'Grow the user base to 1000 active users', progress: 45, deadline: '2026-07-15', category: 'Growth',
    milestones: [
      { id: 1, title: 'Landing page', completed: true },
      { id: 2, title: 'SEO optimization', completed: true },
      { id: 3, title: 'Social media campaign', completed: false },
      { id: 4, title: 'Referral program', completed: false },
    ],
  },
  {
    id: 3, title: 'Complete onboarding flow', description: 'Design and implement a smooth onboarding experience', progress: 90, deadline: '2026-06-10', category: 'Product',
    milestones: [
      { id: 1, title: 'User research', completed: true },
      { id: 2, title: 'Wireframes', completed: true },
      { id: 3, title: 'Implementation', completed: true },
      { id: 4, title: 'User testing', completed: false },
    ],
  },
  {
    id: 4, title: 'Learn Rust', description: 'Complete Rust programming language course and build a project', progress: 30, deadline: '2026-08-01', category: 'Learning',
    milestones: [
      { id: 1, title: 'Complete Rust book', completed: true },
      { id: 2, title: 'Build CLI tool', completed: false },
      { id: 3, title: 'Contribute to OSS', completed: false },
      { id: 4, title: 'Build web service', completed: false },
    ],
  },
];

const categories = ['All', 'Product', 'Growth', 'Learning'];

function Goals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);

  const filteredGoals = initialGoals.filter(
    (goal) => activeCategory === 'All' || goal.category === activeCategory
  );

  const toggleGoal = (id: number) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div className="goals-header__left">
          <h1 className="goals-title">Goals</h1>
          <p className="goals-subtitle">{filteredGoals.length} active goals</p>
        </div>
        <div className="goals-header__right">
          <button className="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Goal
          </button>
        </div>
      </div>

      <div className="goals-toolbar">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'filter-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="goals-list">
        {filteredGoals.map((goal) => {
          const isExpanded = expandedGoal === goal.id;
          const completedMilestones = goal.milestones.filter((m) => m.completed).length;

          return (
            <div key={goal.id} className={`goal-card ${isExpanded ? 'goal-card--expanded' : ''}`}>
              <div className="goal-card__main" onClick={() => toggleGoal(goal.id)}>
                <div className="goal-card__left">
                  <div className="goal-card__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div className="goal-card__info">
                    <h3 className="goal-card__title">{goal.title}</h3>
                    <p className="goal-card__description">{goal.description}</p>
                  </div>
                </div>
                <div className="goal-card__right">
                  <div className="goal-card__meta">
                    <span className="goal-card__category">{goal.category}</span>
                    <span className="goal-card__deadline">Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="goal-card__progress-wrapper">
                    <div className="goal-card__progress-bar">
                      <div className="goal-card__progress-fill" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="goal-card__progress-text">{goal.progress}%</span>
                  </div>
                  <button className={`goal-card__chevron ${isExpanded ? 'goal-card__chevron--open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="goal-card__details">
                  <div className="milestones">
                    <h4 className="milestones__title">Milestones ({completedMilestones}/{goal.milestones.length})</h4>
                    <div className="milestones__list">
                      {goal.milestones.map((milestone) => (
                        <div key={milestone.id} className="milestone-item">
                          <button className={`milestone-checkbox ${milestone.completed ? 'milestone-checkbox--checked' : ''}`}>
                            {milestone.completed && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                          <span className={`milestone-title ${milestone.completed ? 'milestone-title--done' : ''}`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;
