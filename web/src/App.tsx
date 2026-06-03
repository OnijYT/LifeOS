import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Notes from './pages/Notes';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import LifeAreas from './pages/LifeAreas';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'goals':
        return <Goals />;
      case 'habits':
        return <Habits />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'statistics':
        return <Statistics />;
      case 'life-areas':
        return <LifeAreas />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
