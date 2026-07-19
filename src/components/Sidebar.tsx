import React from 'react';
import { Package, Type, Grid, Layers, Repeat, Search, Link2, Lightbulb, Calendar, GitBranch, TreePine, Pickaxe, Network, Target, Zap, Globe, Cuboid, MessageSquare, Monitor, Briefcase, Mic, GraduationCap, Crosshair, Phone, ScrollText, MessageCircle } from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function Sidebar({ activeCategory, setActiveCategory }: SidebarProps) {
  const categories = [
    { id: 'arrays', label: 'Arrays', count: 18, icon: <Package size={16} /> },
    { id: 'strings', label: 'Strings', count: 17, icon: <Type size={16} /> },
    { id: 'matrix', label: 'Matrix', count: 9, icon: <Grid size={16} /> },
    { id: 'stack', label: 'Stack', count: 8, icon: <Layers size={16} /> },
    { id: 'queue', label: 'Queue', count: 1, icon: <Repeat size={16} /> },
    { id: 'binarysearch', label: 'Binary Search', count: 13, icon: <Search size={16} /> },
    { id: 'linkedlist', label: 'Linked List', count: 13, icon: <Link2 size={16} /> },
    { id: 'greedy', label: 'Greedy', count: 5, icon: <Lightbulb size={16} /> },
    { id: 'intervals', label: 'Intervals', count: 5, icon: <Calendar size={16} /> },
    { id: 'backtracking', label: 'Backtracking', count: 9, icon: <GitBranch size={16} /> },
    { id: 'tree', label: 'Tree', count: 20, icon: <TreePine size={16} /> },
    { id: 'heap', label: 'Heap', count: 6, icon: <Pickaxe size={16} /> },
    { id: 'graph', label: 'Graph', count: 11, icon: <Network size={16} /> },
    { id: 'dp', label: 'Dynamic Prog.', count: 15, icon: <Target size={16} /> },
    { id: 'bitmanipulation', label: 'Bit Manip.', count: 8, icon: <Zap size={16} /> },
    { id: 'trie', label: 'Trie', count: 2, icon: <Globe size={16} /> },
    { id: 'design', label: 'Design', count: 1, icon: <Cuboid size={16} /> },
  ];

  return (
    <nav id="sidebar">
      <div className="section-label">Learning Path</div>
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`#${cat.id}`}
          className={activeCategory === cat.id ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            setActiveCategory(cat.id);
          }}
        >
          {cat.icon} {cat.label} <span className="count">{cat.count}</span>
        </a>
      ))}

      <div className="section-label" style={{ marginTop: '16px' }}>Reference</div>
      <a href="#patterns"><Target size={16} /> Common Patterns <span className="count">43</span></a>
      <a href="#iq" className="iq-nav-link"><MessageSquare size={16} /> Interview Questions <span className="focus-nav-new">New</span></a>
      <a href="#sd" className="sd-nav-link"><Monitor size={16} /> System Design <span className="focus-nav-new">New</span></a>
      <a href="#tricks"><Zap size={16} /> Code Tricks</a>
      <a href="#edge"><Lightbulb size={16} /> Edge Cases</a>
      <a href="#jobs" className="jobs-nav-link"><Briefcase size={16} /> Jobs <span className="focus-nav-new">New</span></a>
      <a href="#mock" className="mi-nav-link"><Mic size={16} /> Mock Interview <span className="focus-nav-new">New</span></a>

      <div className="section-label" style={{ marginTop: '16px' }}>Apps</div>
      <a href="#java" className="java-nav-link"><GraduationCap size={16} /> AI-Powered Java Backend <span className="focus-nav-new">New</span></a>
      <a href="#quiz" className="quiz-nav-link"><Target size={16} /> Pattern Quiz</a>
      <a href="#focus" className="focus-nav-link"><Crosshair size={16} /> Focus <span className="focus-nav-new">New</span></a>

      <div className="section-label" style={{ marginTop: '16px' }}>Support</div>
      <a href="#contact"><Phone size={16} /> Contact Us</a>
      <a href="#refund"><ScrollText size={16} /> Refund Policy</a>
      <a href="#feedback"><MessageCircle size={16} /> Feedback</a>
    </nav>
  );
}
