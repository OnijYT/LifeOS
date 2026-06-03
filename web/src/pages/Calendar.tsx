import { useState } from 'react';
import './Calendar.css';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'task' | 'goal' | 'habit' | 'deadline';
  color: string;
}

const events: CalendarEvent[] = [
  { id: 1, title: 'Design review', date: '2026-06-02', type: 'task', color: '#8B5CF6' },
  { id: 2, title: 'Sprint deadline', date: '2026-06-05', type: 'deadline', color: '#EF4444' },
  { id: 3, title: 'Launch v1.0', date: '2026-06-10', type: 'goal', color: '#22C55E' },
  { id: 4, title: 'Team meeting', date: '2026-06-03', type: 'task', color: '#8B5CF6' },
  { id: 5, title: 'Code review', date: '2026-06-07', type: 'task', color: '#8B5CF6' },
  { id: 6, title: 'Weekly report', date: '2026-06-06', type: 'deadline', color: '#F59E0B' },
  { id: 7, title: 'User testing', date: '2026-06-12', type: 'goal', color: '#22C55E' },
  { id: 8, title: 'Deploy v2.0', date: '2026-06-15', type: 'deadline', color: '#EF4444' },
  { id: 9, title: 'Workshop', date: '2026-06-08', type: 'task', color: '#3B82F6' },
  { id: 10, title: 'Retrospective', date: '2026-06-19', type: 'task', color: '#8B5CF6' },
];

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(null);
  };

  const formatDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const getEventsForDate = (dateKey: string) => events.filter((e) => e.date === dateKey);

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const selectedKey = selectedDate ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` : null;
  const selectedEvents = selectedKey ? getEventsForDate(selectedKey) : [];

  const cells: { day: number; isCurrentMonth: boolean; dateKey: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateKey = `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, isCurrentMonth: false, dateKey });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, isCurrentMonth: true, dateKey: formatDateKey(day) });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateKey = `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, isCurrentMonth: false, dateKey });
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="calendar-header__left">
          <h1 className="calendar-title">Calendar</h1>
          <p className="calendar-subtitle">Track your deadlines, tasks, and goals</p>
        </div>
        <div className="calendar-header__right">
          <button className="btn btn--secondary" onClick={goToToday}>Today</button>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-nav">
            <button className="calendar-nav__btn" onClick={prevMonth}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="calendar-nav__title">{monthNames[currentMonth]} {currentYear}</h2>
            <button className="calendar-nav__btn" onClick={nextMonth}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="calendar-grid">
            {dayNames.map((day) => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}
            {cells.map((cell, i) => {
              const dayEvents = getEventsForDate(cell.dateKey);
              const isSelected = selectedDate === cell.day && cell.isCurrentMonth;
              return (
                <div
                  key={i}
                  className={`calendar-cell ${!cell.isCurrentMonth ? 'calendar-cell--other' : ''} ${isToday(cell.day) && cell.isCurrentMonth ? 'calendar-cell--today' : ''} ${isSelected ? 'calendar-cell--selected' : ''}`}
                  onClick={() => cell.isCurrentMonth && setSelectedDate(cell.day)}
                >
                  <span className="calendar-cell__number">{cell.day}</span>
                  {dayEvents.length > 0 && (
                    <div className="calendar-cell__dots">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span key={ev.id} className="calendar-dot" style={{ background: ev.color }} />
                      ))}
                      {dayEvents.length > 3 && <span className="calendar-dot__more">+{dayEvents.length - 3}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#8B5CF6' }} /> Tasks</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#EF4444' }} /> Deadlines</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#22C55E' }} /> Goals</span>
          </div>
        </div>

        <div className="calendar-sidebar">
          <h3 className="calendar-sidebar__title">
            {selectedDate ? `${monthNames[currentMonth]} ${selectedDate}` : 'Select a date'}
          </h3>
          {selectedDate ? (
            selectedEvents.length > 0 ? (
              <div className="calendar-events">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="calendar-event">
                    <span className="calendar-event__dot" style={{ background: ev.color }} />
                    <div className="calendar-event__info">
                      <span className="calendar-event__title">{ev.title}</span>
                      <span className="calendar-event__type">{ev.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="calendar-no-events">
                <p>No events for this day</p>
              </div>
            )
          ) : (
            <div className="calendar-no-events">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>Click on a date to see events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
