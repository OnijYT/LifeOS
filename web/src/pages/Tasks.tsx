import { useState } from 'react';
import './Tasks.css';

interface Task {
  id: number;
  title: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  tags: string[];
}

const initialTasks: Task[] = [
  { id: 1, title: 'Design new landing page', description: 'Create wireframes and high-fidelity mockups', project: 'LifeOS Redesign', priority: 'high', status: 'in-progress', dueDate: '2026-06-02', tags: ['Design', 'UI'] },
  { id: 2, title: 'Review pull requests', description: 'Review and merge pending PRs from the team', project: 'Backend API', priority: 'medium', status: 'pending', dueDate: '2026-06-03', tags: ['Code Review'] },
  { id: 3, title: 'Update documentation', description: 'Update API docs with new endpoints', project: 'LifeOS Docs', priority: 'low', status: 'completed', dueDate: '2026-06-01', tags: ['Docs'] },
  { id: 4, title: 'Fix authentication bug', description: 'Users getting logged out unexpectedly', project: 'Backend API', priority: 'high', status: 'in-progress', dueDate: '2026-06-02', tags: ['Bug', 'Auth'] },
  { id: 5, title: 'Prepare sprint retrospective', description: 'Gather metrics and prepare slides', project: 'Team', priority: 'medium', status: 'pending', dueDate: '2026-06-05', tags: ['Meeting'] },
  { id: 6, title: 'Optimize database queries', description: 'Improve performance of slow queries', project: 'Backend API', priority: 'high', status: 'pending', dueDate: '2026-06-04', tags: ['Performance', 'DB'] },
  { id: 7, title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing', project: 'DevOps', priority: 'medium', status: 'in-progress', dueDate: '2026-06-06', tags: ['DevOps'] },
  { id: 8, title: 'Write unit tests', description: 'Add test coverage for user service', project: 'Backend API', priority: 'low', status: 'pending', dueDate: '2026-06-07', tags: ['Testing'] },
];

const columns: { id: Task['status']; label: string; color: string }[] = [
  { id: 'pending', label: 'To Do', color: '#F59E0B' },
  { id: 'in-progress', label: 'In Progress', color: '#8B5CF6' },
  { id: 'completed', label: 'Done', color: '#22C55E' },
];

const filters = ['All', 'High', 'Medium', 'Low'];

function Tasks() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = initialTasks.filter((task) => {
    const matchesFilter = activeFilter === 'All' || task.priority === activeFilter.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTasksByStatus = (status: Task['status']) => filteredTasks.filter((t) => t.status === status);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--info)' };
    return colors[priority] || 'var(--text-secondary)';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff < -1) return `${Math.abs(diff)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-header__left">
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">{filteredTasks.length} tasks total</p>
        </div>
        <div className="tasks-header__right">
          <button className="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        </div>
      </div>

      <div className="tasks-toolbar">
        <div className="tasks-toolbar__left">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-box__input"
            />
          </div>
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'filter-tab--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="tasks-toolbar__right">
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === 'board' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="18" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Board
            </button>
            <button
              className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'board' && (
        <div className="board-view">
          {columns.map((column) => (
            <div key={column.id} className="board-column">
              <div className="board-column__header">
                <div className="board-column__title">
                  <span className="board-column__dot" style={{ background: column.color }} />
                  <span>{column.label}</span>
                  <span className="board-column__count">{getTasksByStatus(column.id).length}</span>
                </div>
                <button className="board-column__add">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
              <div className="board-column__cards">
                {getTasksByStatus(column.id).map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-card__header">
                      <span className="task-card__priority" style={{ color: getPriorityColor(task.priority) }}>
                        {task.priority}
                      </span>
                      <button className="task-card__menu">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="task-card__title">{task.title}</h3>
                    <p className="task-card__description">{task.description}</p>
                    <div className="task-card__tags">
                      {task.tags.map((tag) => (
                        <span key={tag} className="task-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="task-card__footer">
                      <span className="task-card__project">{task.project}</span>
                      <span className="task-card__date">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="list-view">
          <div className="list-header">
            <span className="list-header__cell list-header__cell--task">Task</span>
            <span className="list-header__cell list-header__cell--project">Project</span>
            <span className="list-header__cell list-header__cell--priority">Priority</span>
            <span className="list-header__cell list-header__cell--status">Status</span>
            <span className="list-header__cell list-header__cell--date">Due Date</span>
          </div>
          <div className="list-body">
            {filteredTasks.map((task) => (
              <div key={task.id} className="list-row">
                <div className="list-row__cell list-row__cell--task">
                  <button className={`task-checkbox ${task.status === 'completed' ? 'task-checkbox--checked' : ''}`}>
                    {task.status === 'completed' && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <span className={`list-task-title ${task.status === 'completed' ? 'list-task-title--done' : ''}`}>
                      {task.title}
                    </span>
                    <span className="list-task-desc">{task.description}</span>
                  </div>
                </div>
                <span className="list-row__cell list-row__cell--project">{task.project}</span>
                <span className="list-row__cell list-row__cell--priority">
                  <span className={`priority-badge priority-badge--${task.priority}`}>{task.priority}</span>
                </span>
                <span className="list-row__cell list-row__cell--status">
                  <span className={`status-badge status-badge--${task.status}`}>{task.status.replace('-', ' ')}</span>
                </span>
                <span className="list-row__cell list-row__cell--date">{formatDate(task.dueDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
