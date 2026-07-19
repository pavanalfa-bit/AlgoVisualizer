import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Visualizer } from './components/Visualizer';
import './index.css';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeCategory, setActiveCategory] = useState('arrays');
  const [activeProblem, setActiveProblem] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  return (
    <div>
      <header>
        <h1><Sparkles size={24} /> DSA Visualizer</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </header>

      <div className="layout">
        <Sidebar activeCategory={activeCategory} setActiveCategory={(c) => {
          setActiveCategory(c);
          setActiveProblem(null);
        }} />
        
        {activeProblem ? (
          <Visualizer problemId={activeProblem} onBack={() => setActiveProblem(null)} />
        ) : (
          <Dashboard category={activeCategory} onVisualize={setActiveProblem} />
        )}
      </div>
    </div>
  );
}

export default App;
