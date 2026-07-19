import React from 'react';
import { Package, Type, Grid, Layers, Repeat, Search, Link2, Lightbulb, Calendar, GitBranch, TreePine, Pickaxe, Network, Target, Zap, Globe, Cuboid, MessageSquare, Monitor, Briefcase, Mic, GraduationCap, Crosshair, Phone, ScrollText, MessageCircle } from 'lucide-react';
import { allProblems } from './Dashboard';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function Sidebar({ activeCategory, setActiveCategory }: SidebarProps) {
  const categories = [
    { id: 'arrays', label: 'Arrays', icon: <Package size={16} /> },
    { id: 'strings', label: 'Strings', icon: <Type size={16} /> },
    { id: 'matrix', label: 'Matrix', icon: <Grid size={16} /> },
    { id: 'stack', label: 'Stack', icon: <Layers size={16} /> },
    { id: 'queue', label: 'Queue', icon: <Repeat size={16} /> },
    { id: 'binarysearch', label: 'Binary Search', icon: <Search size={16} /> },
    { id: 'linkedlist', label: 'Linked List', icon: <Link2 size={16} /> },
    { id: 'greedy', label: 'Greedy', icon: <Lightbulb size={16} /> },
    { id: 'intervals', label: 'Intervals', icon: <Calendar size={16} /> },
    { id: 'backtracking', label: 'Backtracking', icon: <GitBranch size={16} /> },
    { id: 'tree', label: 'Tree', icon: <TreePine size={16} /> },
    { id: 'heap', label: 'Heap', icon: <Pickaxe size={16} /> },
    { id: 'graph', label: 'Graph', icon: <Network size={16} /> },
    { id: 'dp', label: 'Dynamic Prog.', icon: <Target size={16} /> },
    { id: 'bitmanipulation', label: 'Bit Manip.', icon: <Zap size={16} /> },
    { id: 'trie', label: 'Trie', icon: <Globe size={16} /> },
    { id: 'design', label: 'Design', icon: <Cuboid size={16} /> },
  ].map(cat => ({
    ...cat,
    count: allProblems.filter(p => p.category === cat.id).length
  }));

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

    </nav>
  );
}
