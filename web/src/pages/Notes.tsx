import { useState } from 'react';
import './Notes.css';

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

const initialNotes: Note[] = [
  { id: 1, title: 'Project Ideas', content: '1. AI-powered habit tracker\n2. Smart budget planner\n3. Learning path generator\n4. Team collaboration tool', category: 'Ideas', createdAt: '2026-06-01', updatedAt: '2026-06-02', pinned: true },
  { id: 2, title: 'Meeting Notes — Sprint Planning', content: '• Review last sprint metrics\n• Assign new tasks\n• Discuss blockers\n• Set sprint goals for next 2 weeks', category: 'Work', createdAt: '2026-06-02', updatedAt: '2026-06-02', pinned: false },
  { id: 3, title: 'Book Notes: Atomic Habits', content: 'Key takeaways:\n- 1% better every day\n- Identity-based habits\n- Environment design\n- Two-minute rule', category: 'Learning', createdAt: '2026-05-28', updatedAt: '2026-05-30', pinned: false },
  { id: 4, title: 'Weekly Reflection', content: 'This week I:\n✅ Completed 8/10 tasks\n✅ Read 50 pages\n✅ Worked out 4 times\n❌ Missed meditation twice', category: 'Personal', createdAt: '2026-06-01', updatedAt: '2026-06-01', pinned: false },
  { id: 5, title: 'API Design Notes', content: 'RESTful principles:\n- Use nouns not verbs\n- Proper HTTP status codes\n- Versioning via URL\n- Pagination with cursor', category: 'Work', createdAt: '2026-05-25', updatedAt: '2026-05-26', pinned: false },
];

const categories = ['All', 'Ideas', 'Work', 'Learning', 'Personal'];

function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const filteredNotes = notes
    .filter((note) => activeCategory === 'All' || note.category === activeCategory)
    .filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const togglePin = (id: number) => {
    setNotes(notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <div className="notes-header__left">
          <h1 className="notes-title">Notes</h1>
          <p className="notes-subtitle">{notes.length} notes</p>
        </div>
        <div className="notes-header__right">
          <button className="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
        </div>
      </div>

      <div className="notes-toolbar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-box__input"
          />
        </div>
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

      <div className="notes-layout">
        <div className="notes-list">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${selectedNote?.id === note.id ? 'note-card--active' : ''} ${note.pinned ? 'note-card--pinned' : ''}`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="note-card__header">
                <h3 className="note-card__title">{note.title}</h3>
                <button
                  className={`note-pin ${note.pinned ? 'note-pin--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L12 12" />
                    <path d="M18 8L12 14L6 8" />
                    <line x1="5" y1="22" x2="19" y2="22" />
                  </svg>
                </button>
              </div>
              <p className="note-card__preview">{note.content.split('\n')[0]}</p>
              <div className="note-card__footer">
                <span className="note-card__category">{note.category}</span>
                <span className="note-card__date">{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="notes-editor">
          {selectedNote ? (
            <>
              <div className="editor-header">
                <h2 className="editor-title">{selectedNote.title}</h2>
                <div className="editor-actions">
                  <button className="editor-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="editor-meta">
                <span className="editor-meta__item">Category: {selectedNote.category}</span>
                <span className="editor-meta__item">Updated: {formatDate(selectedNote.updatedAt)}</span>
              </div>
              <div className="editor-content">
                <textarea
                  className="editor-textarea"
                  defaultValue={selectedNote.content}
                  placeholder="Start writing..."
                />
              </div>
            </>
          ) : (
            <div className="editor-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p>Select a note to view or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
