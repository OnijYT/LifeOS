import { useState } from 'react';
import './Settings.css';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {[
            { id: 'profile', label: 'Profile', icon: 'user' },
            { id: 'appearance', label: 'Appearance', icon: 'palette' },
            { id: 'notifications', label: 'Notifications', icon: 'bell' },
            { id: 'data', label: 'Data & Export', icon: 'database' },
            { id: 'about', label: 'About', icon: 'info' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="settings-section__title">Profile</h2>
              <div className="settings-group">
                <div className="settings-field">
                  <label className="settings-field__label">Display Name</label>
                  <input type="text" className="settings-input" defaultValue="Zanthera" />
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Email</label>
                  <input type="email" className="settings-input" defaultValue="zanthera@lifeos.app" />
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Bio</label>
                  <textarea className="settings-textarea" defaultValue="Building a better life, one habit at a time." rows={3} />
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Avatar</label>
                  <div className="settings-avatar">
                    <div className="settings-avatar__preview">
                      <span>ZA</span>
                    </div>
                    <button className="btn btn--secondary">Change Avatar</button>
                  </div>
                </div>
              </div>
              <div className="settings-actions">
                <button className="btn btn--primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2 className="settings-section__title">Appearance</h2>
              <div className="settings-group">
                <div className="settings-field">
                  <label className="settings-field__label">Theme</label>
                  <div className="theme-options">
                    <button className="theme-option theme-option--active">
                      <div className="theme-option__preview theme-option__preview--dark">
                        <div className="theme-option__sidebar" />
                        <div className="theme-option__content" />
                      </div>
                      <span>Dark</span>
                    </button>
                    <button className="theme-option">
                      <div className="theme-option__preview theme-option__preview--light">
                        <div className="theme-option__sidebar" />
                        <div className="theme-option__content" />
                      </div>
                      <span>Light</span>
                    </button>
                    <button className="theme-option">
                      <div className="theme-option__preview theme-option__preview--system">
                        <div className="theme-option__sidebar" />
                        <div className="theme-option__content" />
                      </div>
                      <span>System</span>
                    </button>
                  </div>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Accent Color</label>
                  <div className="color-options">
                    {['#8B5CF6', '#3B82F6', '#22C55E', '#EF4444', '#F59E0B', '#EC4899', '#06B6D4', '#F97316'].map((color) => (
                      <button
                        key={color}
                        className={`color-option ${color === '#8B5CF6' ? 'color-option--active' : ''}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Font Size</label>
                  <select className="settings-select">
                    <option>Small</option>
                    <option selected>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="settings-section__title">Notifications</h2>
              <div className="settings-group">
                {[
                  { label: 'Task reminders', description: 'Get notified about upcoming deadlines', enabled: true },
                  { label: 'Habit reminders', description: 'Daily reminders for your habits', enabled: true },
                  { label: 'Goal updates', description: 'Notifications about goal progress', enabled: false },
                  { label: 'Weekly report', description: 'Receive weekly summary email', enabled: true },
                  { label: 'Achievement alerts', description: 'Celebrate your wins', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="settings-toggle">
                    <div className="settings-toggle__info">
                      <span className="settings-toggle__label">{item.label}</span>
                      <span className="settings-toggle__desc">{item.description}</span>
                    </div>
                    <button className={`toggle ${item.enabled ? 'toggle--on' : 'toggle--off'}`}>
                      <span className="toggle__thumb" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2 className="settings-section__title">Data & Export</h2>
              <div className="settings-group">
                <div className="settings-field">
                  <label className="settings-field__label">Export Data</label>
                  <p className="settings-field__hint">Download all your data in JSON format</p>
                  <button className="btn btn--secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export All Data
                  </button>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">Backup</label>
                  <p className="settings-field__hint">Last backup: June 1, 2026</p>
                  <button className="btn btn--secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Create Backup
                  </button>
                </div>
                <div className="settings-field settings-field--danger">
                  <label className="settings-field__label">Danger Zone</label>
                  <p className="settings-field__hint">Permanently delete all your data</p>
                  <button className="btn btn--danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="settings-section">
              <h2 className="settings-section__title">About LifeOS</h2>
              <div className="about-card">
                <div className="about-logo">
                  <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="url(#aboutLogoGrad)" />
                    <path d="M8 14.5L12 18.5L20 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="aboutLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="about-name">LifeOS</h3>
                <p className="about-version">Version 1.0.0 (MVP)</p>
                <p className="about-desc">Your personal life operating system. Track tasks, build habits, achieve goals, and balance your life.</p>
                <div className="about-links">
                  <a href="#" className="about-link">Privacy Policy</a>
                  <a href="#" className="about-link">Terms of Service</a>
                  <a href="#" className="about-link">GitHub</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
