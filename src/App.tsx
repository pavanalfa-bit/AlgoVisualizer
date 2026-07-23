import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Search, User } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Visualizer } from './components/Visualizer';
import { SystemDesign } from './components/SystemDesign';
import './index.css';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  return (
    <div>
      <header>
        <h1><Sparkles size={24} color="var(--accent)" /> AlgoVisualizer</h1>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={16} color="var(--muted)" />
            <input type="text" placeholder="Search" />
          </div>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isLoggedIn ? (
            <div className="profile-icon" onClick={() => setIsLoggedIn(false)} style={{ cursor: 'pointer' }} title="Log out">
              <User size={18} />
            </div>
          ) : (
            <button className="ov-hero-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setIsLoggedIn(true)}>
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className="layout">
        <Sidebar activeCategory={activeCategory} setActiveCategory={(c) => {
          setActiveCategory(c);
          setActiveProblem(null);
        }} />
        
        {activeProblem ? (
          <Visualizer problemId={activeProblem} onBack={() => setActiveProblem(null)} />
        ) : activeCategory === 'system-design' ? (
          <SystemDesign />
        ) : (
          <Dashboard category={activeCategory} onVisualize={setActiveProblem} isLoggedIn={isLoggedIn} />
        )}
      </div>
    </div>
  );
}

export default App;
