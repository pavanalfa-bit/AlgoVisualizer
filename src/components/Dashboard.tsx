import React, { useState } from 'react';
import { ProblemCard } from './ProblemCard';
import { ChevronDown, Play, TrendingUp, Flame, Zap, Award, LayoutGrid, List, Box, Layers, Binary, CheckCircle2, Lock, Package, Type, Grid, Repeat, Search, Link2, Lightbulb, Calendar, GitBranch, TreePine, Pickaxe, Network, Target, Globe, Cuboid } from 'lucide-react';

interface DashboardProps {
  category: string;
  isLoggedIn?: boolean;
  onVisualize: (id: string) => void;
}

// Full problem list parsed from the provided HTML
export const allProblems = [
  // ARRAYS - Basics
  { id: '1929', num: 1929, title: 'Concatenation of Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'bars' as const, description: 'Find the concatenation of two arrays and analyze space.', solved: true },
  { id: '1480', num: 1480, title: 'Running Sum of 1D Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'dots' as const, description: 'Calculate the running sum of a 1D array in place.', solved: true },
  { id: '1672', num: 1672, title: 'Richest Customer Wealth', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'blocks' as const, description: 'Identify the customer with the maximum wealth.' },
  { id: '1470', num: 1470, title: 'Shuffle the Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'dots' as const, description: 'Shuffle an array consisting of 2n elements.' },
  { id: '832', num: 832, title: 'Flipping an Image', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'blocks' as const, description: 'Flip the matrix horizontally and invert it.' },
  { id: '2239', num: 2239, title: 'Find Closest Number to Zero', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics', visualType: 'bars' as const, description: 'Find the number closest to 0. If multiple, return largest.' },
  
  // ARRAYS - Two Pointers
  { id: '88', num: 88, title: 'Merge Sorted Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'dots' as const, description: 'Merge two sorted arrays into a single sorted array.' },
  { id: '26', num: 26, title: 'Remove Duplicates', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'blocks' as const, description: 'Remove duplicates from a sorted array in-place.' },
  { id: '977', num: 977, title: 'Squares of Sorted Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'bars' as const, description: 'Return an array of the squares of each number sorted.' },
  { id: '15', num: 15, title: 'Three Sum', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'bars' as const, description: 'Find all unique triplets which gives the sum of zero.' },
  { id: 'trapping-rain', num: 42, title: 'Trapping Rain Water', difficulty: 'hard' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'bars' as const, description: 'Compute how much water it can trap after raining.' },
  { id: '167', num: 167, title: 'Two Sum II', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'dots' as const, description: 'Find two numbers such that they add up to target.' },
  { id: 'container-water', num: 11, title: 'Container With Most Water', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers', visualType: 'bars' as const, description: 'Find two lines that together form a container.', solved: true },

  // ARRAYS - Subarray
  { id: '53', num: 53, title: 'Maximum Subarray', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Subarray · Sliding Window', visualType: 'bars' as const, description: 'Find the contiguous subarray which has the largest sum.' },
  { id: '121', num: 121, title: 'Best Time to Buy & Sell', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Subarray · Sliding Window', visualType: 'bars' as const, description: 'Maximize your profit by choosing a single day to buy.' },
  
  // ARRAYS - Hashing
  { id: 'two-sum', num: 1, title: 'Two Sum', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Hashing', visualType: 'dots' as const, description: 'Find the creations of [12] and 3 onwxiows in ctep h.', solved: true },
  { id: '217', num: 217, title: 'Contains Duplicate', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Hashing', visualType: 'blocks' as const, description: 'Contain contaix duplicate out cade of that.' },
  { id: '41', num: 41, title: 'First Missing Positive', difficulty: 'hard' as const, category: 'arrays', subtopic: 'Hashing', visualType: 'dots' as const, description: 'Find the smallest missing positive integer.' },

  // STRINGS - General
  { id: '13', num: 13, title: 'Roman to Integer', difficulty: 'easy' as const, category: 'strings', subtopic: 'General' },
  { id: '14', num: 14, title: 'Longest Common Prefix', difficulty: 'easy' as const, category: 'strings', subtopic: 'General' },
  { id: '271', num: 271, title: 'Encode and Decode Strings', difficulty: 'medium' as const, category: 'strings', subtopic: 'General' },
  { id: '205', num: 205, title: 'Isomorphic Strings', difficulty: 'easy' as const, category: 'strings', subtopic: 'General' },
  { id: '344', num: 344, title: 'Reverse String', difficulty: 'easy' as const, category: 'strings', subtopic: 'General' },
  
  // STRINGS - Sliding Window
  { id: '3', num: 3, title: 'Longest Substring Without Repeating', difficulty: 'medium' as const, category: 'strings', subtopic: 'Sliding Window on Strings' },
  { id: '424', num: 424, title: 'Longest Repeating Char Replacement', difficulty: 'medium' as const, category: 'strings', subtopic: 'Sliding Window on Strings' },
  { id: '76', num: 76, title: 'Minimum Window Substring', difficulty: 'hard' as const, category: 'strings', subtopic: 'Sliding Window on Strings' },
  { id: '567', num: 567, title: 'Permutation in String', difficulty: 'medium' as const, category: 'strings', subtopic: 'Sliding Window on Strings' },
  { id: '438', num: 438, title: 'Find All Anagrams in String', difficulty: 'medium' as const, category: 'strings', subtopic: 'Sliding Window on Strings' },
  
  // STRINGS - Anagram
  { id: '242', num: 242, title: 'Valid Anagram', difficulty: 'easy' as const, category: 'strings', subtopic: 'Anagram' },
  { id: '49', num: 49, title: 'Group Anagrams', difficulty: 'medium' as const, category: 'strings', subtopic: 'Anagram' },
  { id: '1189', num: 1189, title: 'Maximum Number of Balloons', difficulty: 'easy' as const, category: 'strings', subtopic: 'Anagram' },
  
  // STRINGS - Palindrome
  { id: '125', num: 125, title: 'Valid Palindrome', difficulty: 'easy' as const, category: 'strings', subtopic: 'Palindrome' },
  { id: '680', num: 680, title: 'Valid Palindrome II', difficulty: 'medium' as const, category: 'strings', subtopic: 'Palindrome' },
  { id: '5', num: 5, title: 'Longest Palindromic Substring', difficulty: 'medium' as const, category: 'strings', subtopic: 'Palindrome' },
  { id: '647', num: 647, title: 'Palindromic Substrings', difficulty: 'medium' as const, category: 'strings', subtopic: 'Palindrome' },
  
  // MATRIX
  { id: '54', num: 54, title: 'Spiral Matrix', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '59', num: 59, title: 'Spiral Matrix II', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '200', num: 200, title: 'Number of Islands', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '73', num: 73, title: 'Set Matrix Zeroes', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '79', num: 79, title: 'Word Search', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '240', num: 240, title: 'Search a 2D Matrix II', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '48', num: 48, title: 'Rotate Image', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '74', num: 74, title: 'Search a 2D Matrix', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  { id: '36', num: 36, title: 'Valid Sudoku', difficulty: 'medium' as const, category: 'matrix', subtopic: 'General' },
  
  // QUEUE
  { id: '933', num: 933, title: 'Number of Recent Calls', difficulty: 'easy' as const, category: 'queue', subtopic: 'Basics' },
  { id: '1700', num: 1700, title: 'Number of Students Unable to Eat Lunch', difficulty: 'easy' as const, category: 'queue', subtopic: 'Simulation' },
  { id: '225', num: 225, title: 'Implement Stack using Queues', difficulty: 'easy' as const, category: 'queue', subtopic: 'Design' },
  { id: '622', num: 622, title: 'Design Circular Queue', difficulty: 'medium' as const, category: 'queue', subtopic: 'Design' },
  
  // BINARY SEARCH
  { id: '704', num: 704, title: 'Binary Search', difficulty: 'easy' as const, category: 'binarysearch', subtopic: 'Basics' },
  { id: '35', num: 35, title: 'Search Insert Position', difficulty: 'easy' as const, category: 'binarysearch', subtopic: 'Basics' },
  { id: '268', num: 268, title: 'Missing Number', difficulty: 'easy' as const, category: 'binarysearch', subtopic: 'Basics' },
  { id: '34', num: 34, title: 'Find First and Last Position', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Bounds' },
  { id: '162', num: 162, title: 'Find Peak Element', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Bounds' },
  { id: '153', num: 153, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Advanced' },
  { id: '33', num: 33, title: 'Search in Rotated Sorted Array', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Advanced' },
  { id: '81', num: 81, title: 'Search in Rotated Sorted Array II', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Advanced' },
  { id: '875', num: 875, title: 'Koko Eating Bananas', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Search on Answer' },
  { id: '1011', num: 1011, title: 'Capacity to Ship Packages', difficulty: 'medium' as const, category: 'binarysearch', subtopic: 'Search on Answer' },
  { id: '410', num: 410, title: 'Split Array Largest Sum', difficulty: 'hard' as const, category: 'binarysearch', subtopic: 'Search on Answer' },
  { id: 'gfg-allocate', num: 0, title: 'Allocate Minimum Pages', difficulty: 'hard' as const, category: 'binarysearch', subtopic: 'Search on Answer' },
  { id: 'ib-painters', num: 0, title: 'Painter\'s Partition Problem', difficulty: 'hard' as const, category: 'binarysearch', subtopic: 'Search on Answer' },
  { id: '4', num: 4, title: 'Median of Two Sorted Arrays', difficulty: 'hard' as const, category: 'binarysearch', subtopic: 'Advanced' },
];

function OverviewDashboard({ onVisualize, isLoggedIn }: { onVisualize: (id: string) => void, isLoggedIn?: boolean }) {
  // Dynamic daily challenge based on current date
  const today = new Date().toISOString().split('T')[0];
  const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dailyProblem = allProblems[hash % allProblems.length];

  // Category progress data (mock)
  const categories = [
    { id: 'arrays', title: 'Arrays & Hashing', icon: <Package size={24} color="var(--accent)" />, solved: 14, total: 35, color: 'var(--accent)' },
    { id: 'strings', title: 'Strings', icon: <Type size={24} color="var(--pink)" />, solved: 8, total: 20, color: 'var(--pink)' },
    { id: 'matrix', title: '2D Matrix', icon: <Grid size={24} color="var(--purple)" />, solved: 2, total: 10, color: 'var(--purple)' },
    { id: 'stack', title: 'Stack', icon: <Layers size={24} color="var(--sky)" />, solved: 5, total: 15, color: 'var(--sky)' },
    { id: 'queue', title: 'Queue', icon: <Repeat size={24} color="var(--green)" />, solved: 3, total: 10, color: 'var(--green)' },
    { id: 'binarysearch', title: 'Binary Search', icon: <Search size={24} color="var(--orange)" />, solved: 7, total: 15, color: 'var(--orange)' },
    { id: 'linkedlist', title: 'Linked Lists', icon: <Link2 size={24} color="var(--yellow)" />, solved: 4, total: 15, color: 'var(--yellow)' },
    { id: 'greedy', title: 'Greedy', icon: <Lightbulb size={24} color="var(--accent)" />, solved: 2, total: 20, color: 'var(--accent)' },
    { id: 'intervals', title: 'Intervals', icon: <Calendar size={24} color="var(--pink)" />, solved: 1, total: 10, color: 'var(--pink)' },
    { id: 'backtracking', title: 'Backtracking', icon: <GitBranch size={24} color="var(--purple)" />, solved: 3, total: 18, color: 'var(--purple)' },
    { id: 'tree', title: 'Trees', icon: <TreePine size={24} color="var(--green)" />, solved: 12, total: 40, color: 'var(--green)' },
    { id: 'heap', title: 'Heap', icon: <Pickaxe size={24} color="var(--orange)" />, solved: 2, total: 12, color: 'var(--orange)' },
    { id: 'graph', title: 'Graphs', icon: <Network size={24} color="var(--sky)" />, solved: 5, total: 25, color: 'var(--sky)' },
    { id: 'sorting', title: 'Sorting', icon: <Layers size={24} color="var(--yellow)" />, solved: 4, total: 15, color: 'var(--yellow)' },
    { id: 'dp', title: 'Dynamic Programming', icon: <Target size={24} color="var(--red)" />, solved: 8, total: 45, color: 'var(--red)' },
    { id: 'bitmanipulation', title: 'Bit Manip.', icon: <Zap size={24} color="var(--accent)" />, solved: 1, total: 10, color: 'var(--accent)' },
    { id: 'trie', title: 'Trie', icon: <Globe size={24} color="var(--purple)" />, solved: 0, total: 8, color: 'var(--purple)' },
    { id: 'design', title: 'Design', icon: <Cuboid size={24} color="var(--pink)" />, solved: 1, total: 10, color: 'var(--pink)' },
  ];

  return (
    <main>
      <div className="ov-hero">
        <div>
          <div className="ov-hero-title">Ready to master algorithms?</div>
          <div className="ov-hero-sub">Tackle today's daily challenge to keep your streak alive and sharpen your problem solving skills.</div>
          <button className="ov-hero-btn" onClick={() => onVisualize(dailyProblem.id)}>
            <Play size={20} fill="currentColor" /> Daily Challenge: {dailyProblem.title}
          </button>
        </div>
      </div>

      <div className="ov-stats-grid" style={{ position: 'relative' }}>
        {!isLoggedIn && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRadius: '16px', border: '1px solid var(--border)'
          }}>
            <Lock size={32} color="var(--accent)" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text)' }}>Sign in to track progress</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.8 }}>Unlock XP, streaks, and category mastery.</div>
          </div>
        )}
        <div className="ov-stat-card">
          <div className="ov-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}><Flame size={24} /></div>
          <div className="ov-stat-info">
            <div className="ov-stat-val">5 Days</div>
            <div className="ov-stat-lbl">Current Streak</div>
          </div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}><CheckCircle2 size={24} /></div>
          <div className="ov-stat-info">
            <div className="ov-stat-val">29 / 150</div>
            <div className="ov-stat-lbl">Problems Solved</div>
          </div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}><Zap size={24} /></div>
          <div className="ov-stat-info">
            <div className="ov-stat-val">2,450</div>
            <div className="ov-stat-lbl">Total XP</div>
          </div>
        </div>
      </div>

      <div className="ov-section-title"><TrendingUp size={20} color="var(--accent)" /> Continue Learning</div>
      <div className="problem-grid" style={{ marginBottom: '40px' }}>
        {allProblems.filter(p => ['two-sum', 'trapping-rain', 'container-water'].includes(p.id)).map(p => (
          <ProblemCard key={p.id} {...p} onVisualize={onVisualize} />
        ))}
      </div>

      <div className="ov-section-title"><Award size={20} color="var(--accent)" /> Category Progress</div>
      <div className="ov-category-grid">
        {categories.map(c => (
          <div key={c.id} className="ov-cat-card">
            <div className="ov-cat-header">
              <div className="ov-cat-title">{c.icon} {c.title}</div>
              <div className="ov-cat-progress-text">{c.solved} / {c.total}</div>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${(c.solved / c.total) * 100}%`, background: c.color }}></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function Dashboard({ category, onVisualize, isLoggedIn }: DashboardProps) {
  const [filterPriority, setFilterPriority] = useState('all');

  if (category === 'dashboard') {
    return <OverviewDashboard onVisualize={onVisualize} isLoggedIn={isLoggedIn} />;
  }

  const filteredProblems = allProblems.filter((p) => p.category === category);
  
  // Group problems by subtopic
  const subtopics = Array.from(new Set(filteredProblems.map(p => p.subtopic)));

  return (
    <main>
      {/* Filter and Legend Area (Mimicking original) */}
      <div style={{ marginBottom: '32px', background: 'transparent', padding: '0', borderRadius: '0', border: 'none', boxShadow: 'none' }}>
        <h2 style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: '600', marginBottom: '20px' }}>
          {category === 'binarysearch' ? 'Binary Search' : category} Problems
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={() => setFilterPriority('all')}
            className={`dash-filter-btn ${filterPriority === 'all' ? 'active-all' : ''}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterPriority('easy')}
            className={`dash-filter-btn ${filterPriority === 'easy' ? 'active-easy' : ''}`}
          >
            Easy
          </button>
          <button 
            onClick={() => setFilterPriority('medium')}
            className={`dash-filter-btn ${filterPriority === 'medium' ? 'active-medium' : ''}`}
          >
            Medium
          </button>
          <button 
            onClick={() => setFilterPriority('hard')}
            className={`dash-filter-btn ${filterPriority === 'hard' ? 'active-hard' : ''}`}
          >
            Hard
          </button>
          <button className="dash-filter-btn topics-btn">
            Topics <ChevronDown size={14}/>
          </button>
        </div>
      </div>
      
      {filteredProblems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {subtopics.map(sub => {
            const subProblems = filteredProblems.filter(p => p.subtopic === sub && (filterPriority === 'all' || p.difficulty === filterPriority));
            if (subProblems.length === 0) return null;

            return (
              <div key={sub}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', marginBottom: '12px', paddingLeft: '4px' }}>
                  {sub}
                </div>
                <div className="problem-grid">
                  {subProblems.map((p) => (
                    <ProblemCard key={p.id} {...p} onVisualize={onVisualize} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '40px' }}>
          <p>No problems implemented yet for this category.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Select "Arrays" to see the visualizer.</p>
        </div>
      )}
    </main>
  );
}
