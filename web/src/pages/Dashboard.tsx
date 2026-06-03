import './Dashboard.css';

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'warning';
  icon: string;
}

const statsData: StatData[] = [
  { label: 'Total Tasks', value: '142', change: '+12%', trend: 'up', icon: 'check-circle' },
  { label: 'Completed', value: '89', change: '+8%', trend: 'up', icon: 'check' },
  { label: 'In Progress', value: '31', change: '-3%', trend: 'down', icon: 'clock' },
  { label: 'Overdue', value: '5', change: '+2', trend: 'warning', icon: 'alert' },
];

interface Task {
  id: number;
  title: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
}

const recentTasks: Task[] = [
  { id: 1, title: 'Design new landing page', project: 'LifeOS Redesign', priority: 'high', status: 'in-progress', dueDate: 'Today' },
  { id: 2, title: 'Review pull requests', project: 'Backend API', priority: 'medium', status: 'pending', dueDate: 'Tomorrow' },
  { id: 3, title: 'Update documentation', project: 'LifeOS Docs', priority: 'low', status: 'completed', dueDate: 'Yesterday' },
  { id: 4, title: 'Fix authentication bug', project: 'Backend API', priority: 'high', status: 'in-progress', dueDate: 'Today' },
  { id: 5, title: 'Prepare sprint retrospective', project: 'Team', priority: 'medium', status: 'pending', dueDate: 'Jun 5' },
];

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
}

const goals: Goal[] = [
  { id: 1, title: 'Launch v1.0', progress: 72, deadline: 'Jun 30' },
  { id: 2, title: 'Reach 1000 users', progress: 45, deadline: 'Jul 15' },
  { id: 3, title: 'Complete onboarding flow', progress: 90, deadline: 'Jun 10' },
];

interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
}

const habits: Habit[] = [
  { id: 1, name: 'Morning workout', streak: 12, completed: true },
  { id: 2, name: 'Read 30 min', streak: 8, completed: true },
  { id: 3, name: 'Meditate', streak: 5, completed: false },
  { id: 4, name: 'Journal', streak: 3, completed: true },
];

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const taskHeights = [65, 80, 45, 90, 70, 30, 55];
const habitHeights = [40, 60, 80, 50, 75, 90, 35];

function StatCard({ label, value, change, trend }: StatData) {
  const trendClass = trend === 'up'
    ? 'stat-card__trend--up'
    : trend === 'warning'
      ? 'stat-card__trend--warning'
      : 'stat-card__trend--down';

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <span className={`stat-card__trend ${trendClass}`}>{change}</span>
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__bar">
        <div className="stat-card__bar-fill" style={{ width: `${Math.min(parseInt(value), 100)}%` }} />
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return <span className={`priority-badge priority-badge--${priority}`}>{priority}</span>;
}

function Dashboard() {
  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? 'Good morning' : currentDate.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header__left">
          <h1 className="dashboard-greeting">{greeting}, Zanthera</h1>
          <p className="dashboard-date">{formattedDate}</p>
        </div>
        <div className="dashboard-header__right">
          <div className="dashboard-streak">
            <span className="streak-icon">🔥</span>
            <span className="streak-text">12 day streak</span>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section dashboard-tasks">
          <div className="section-header">
            <h2 className="section-title">Recent Tasks</h2>
            <button className="section-action">View all</button>
          </div>
          <div className="task-list">
            {recentTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-item__left">
                  <button className={`task-checkbox task-checkbox--${task.status === 'completed' ? 'checked' : 'unchecked'}`}>
                    {task.status === 'completed' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <div className="task-item__info">
                    <span className={`task-item__title ${task.status === 'completed' ? 'task-item__title--done' : ''}`}>
                      {task.title}
                    </span>
                    <span className="task-item__project">{task.project}</span>
                  </div>
                </div>
                <div className="task-item__right">
                  <PriorityBadge priority={task.priority} />
                  <span className="task-item__due">{task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-goals">
          <div className="section-header">
            <h2 className="section-title">Goals Progress</h2>
            <button className="section-action">View all</button>
          </div>
          <div className="goals-list">
            {goals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <div className="goal-card__header">
                  <span className="goal-card__title">{goal.title}</span>
                  <span className="goal-card__progress">{goal.progress}%</span>
                </div>
                <div className="goal-card__bar">
                  <div className="goal-card__bar-fill" style={{ width: `${goal.progress}%` }} />
                </div>
                <span className="goal-card__deadline">Due {goal.deadline}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-habits">
          <div className="section-header">
            <h2 className="section-title">Today's Habits</h2>
            <button className="section-action">View all</button>
          </div>
          <div className="habits-list">
            {habits.map((habit) => (
              <div key={habit.id} className="habit-item">
                <button className={`habit-checkbox ${habit.completed ? 'habit-checkbox--checked' : ''}`}>
                  {habit.completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className={`habit-name ${habit.completed ? 'habit-name--done' : ''}`}>
                  {habit.name}
                </span>
                <span className="habit-streak">🔥 {habit.streak}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-activity">
          <div className="section-header">
            <h2 className="section-title">Weekly Activity</h2>
            <div className="activity-legend">
              <span className="legend-item">
                <span className="legend-dot legend-dot--purple" />
                Tasks
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--green" />
                Habits
              </span>
            </div>
          </div>
          <div className="activity-chart">
            {chartDays.map((day, i) => (
              <div key={day} className="chart-column">
                <div className="chart-bars">
                  <div className="chart-bar chart-bar--purple" style={{ height: `${taskHeights[i]}%` }} />
                  <div className="chart-bar chart-bar--green" style={{ height: `${habitHeights[i]}%` }} />
                </div>
                <span className="chart-label">{day}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
