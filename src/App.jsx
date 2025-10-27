import { useEffect, useMemo, useState } from 'react';
import placeholderImage from './bumshot.JPG';

const medalColors = {
  1: '#d4af37',
  2: '#c0c0c0',
  3: '#cd7f32',
};

const SITE_PASSWORD = (import.meta.env.VITE_SITE_PASSWORD ?? '').trim();

const EyeIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="eye-icon"
    focusable="false"
  >
    <path
      d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 10Z"
      fill="currentColor"
    />
  </svg>
);

function LeaderboardRow({ entry, onSelect }) {
  const medalStyle = medalColors[entry.position]
    ? { backgroundColor: medalColors[entry.position] }
    : null;

  return (
    <button
      type="button"
      className="leaderboard-row"
      onClick={() => onSelect(entry)}
    >
      <span className="position">
        <span className="position-number">{entry.position}</span>
        {medalStyle && <span className="medal-dot" style={medalStyle} />}
      </span>
      <span className="name" aria-label={`Position ${entry.position}`}>
        {entry.name}
      </span>
      <span className="view-entry">
        View <EyeIcon />
      </span>
    </button>
  );
}

function EntryModal({ entry, onClose }) {
  if (!entry) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 id="modal-title">No. {entry.position}</h2>
        <p className="modal-name">{entry.name}</p>
        <img
          className="modal-image"
          src={entry.photoUrl}
          alt={`Placeholder for ${entry.name}`}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!SITE_PASSWORD) {
      return true;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem('site:authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const leaderboard = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        position: index + 1,
        name: 'Caro C.',
        photoUrl: placeholderImage,
      })),
    [],
  );

  useEffect(() => {
    if (!SITE_PASSWORD || typeof window === 'undefined') {
      return;
    }

    if (isAuthenticated) {
      window.localStorage.setItem('site:authenticated', 'true');
    } else {
      window.localStorage.removeItem('site:authenticated');
    }
  }, [isAuthenticated]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!SITE_PASSWORD || password === SITE_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setError('');
      return;
    }

    setError('Incorrect password. Please try again.');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-gate">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Members Only</h1>
          {SITE_PASSWORD ? (
            <p>Enter the password to continue.</p>
          ) : (
            <p>Password protection is not configured.</p>
          )}
          {SITE_PASSWORD && (
            <>
              <label className="auth-label" htmlFor="password-input">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="auth-input"
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-button">
                Unlock
              </button>
            </>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍑</h1>
        <h1>Top Ten Bums 2025</h1>
        <p>This year's winning entries!</p>
      </header>
      <main className="leaderboard-container">
        <div className="leaderboard">
          {leaderboard.map((entry) => (
            <LeaderboardRow
              key={entry.position}
              entry={entry}
              onSelect={setSelectedEntry}
            />
          ))}
        </div>
      </main>
      <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}
