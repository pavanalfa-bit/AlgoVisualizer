import React, { useState } from 'react';
import { Package, Type, Grid, Layers, Repeat, Search, Link2, Lightbulb, Calendar, GitBranch, TreePine, Pickaxe, Network, Target, Zap, Globe, Cuboid, Monitor, LayoutDashboard, ChevronDown, ChevronRight } from 'lucide-react';
import { allProblems } from './Dashboard';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function Sidebar({ activeCategory, setActiveCategory }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ arrays: true });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'arrays', label: 'Arrays', icon: <Package size={16} /> },
    { id: 'strings', label: 'Strings', icon: <Type size={16} /> },
    { id: 'matrix', label: 'Matrix', icon: <Grid size={16} /> },
    { id: 'stack', label: 'Stack', icon: <Layers size={16} /> },
    { id: 'queue', label: 'Queue', icon: <Repeat size={16} /> },
    { id: 'binarysearch', label: 'Binary Search', icon: <Search size={16} /> },
    { id: 'linkedlist', label: 'Linked Lists', icon: <Link2 size={16} /> },
    { id: 'greedy', label: 'Greedy', icon: <Lightbulb size={16} /> },
    { id: 'intervals', label: 'Intervals', icon: <Calendar size={16} /> },
    { id: 'backtracking', label: 'Backtracking', icon: <GitBranch size={16} /> },
    { id: 'tree', label: 'Trees', icon: <TreePine size={16} /> },
    { id: 'heap', label: 'Heap', icon: <Pickaxe size={16} /> },
    { id: 'graph', label: 'Graphs', icon: <Network size={16} /> },
    { id: 'sorting', label: 'Sorting', icon: <Layers size={16} /> },
    { id: 'dp', label: 'Dynamic Programming', icon: <Target size={16} /> },
    { id: 'bitmanipulation', label: 'Bit Manip.', icon: <Zap size={16} /> },
    { id: 'trie', label: 'Trie', icon: <Globe size={16} /> },
    { id: 'design', label: 'Design', icon: <Cuboid size={16} /> },
  ].map(cat => ({
    ...cat,
    count: cat.id === 'dashboard' ? 0 : allProblems.filter(p => p.category === cat.id).length
  }));

  return (
    <nav id="sidebar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const isExpanded = expanded[cat.id];
        
        return (
          <React.Fragment key={cat.id}>
            <a
              href={`#${cat.id}`}
              className={isActive ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(cat.id);
              }}
              style={{ position: 'relative' }}
            >
              {cat.icon} {cat.label} 
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {cat.count > 0 && (
                  <span className="count" style={{ marginLeft: 0 }}>
                    {cat.count}
                  </span>
                )}
              </div>
            </a>
          </React.Fragment>
        );
      })}

      <div className="section-label" style={{ marginTop: '16px' }}>Interview Prep</div>
      <a
        href="#system-design"
        className={activeCategory === 'system-design' ? 'active' : 'sd-nav-link'}
        onClick={(e) => {
          e.preventDefault();
          setActiveCategory('system-design');
        }}
      >
        <Monitor size={16} /> System Design <span className="focus-nav-new">New</span>
      </a>
    </nav>
  );
}
