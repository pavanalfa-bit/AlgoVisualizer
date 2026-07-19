import React, { useState } from 'react';
import { ProblemCard } from './ProblemCard';

interface DashboardProps {
  category: string;
  onVisualize: (id: string) => void;
}

// Full problem list parsed from the provided HTML
const allProblems = [
  // ARRAYS - Basics
  { id: '1929', num: 1929, title: 'Concatenation of Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  { id: '1480', num: 1480, title: 'Running Sum of 1D Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  { id: '1672', num: 1672, title: 'Richest Customer Wealth', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  { id: '1470', num: 1470, title: 'Shuffle the Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  { id: '832', num: 832, title: 'Flipping an Image', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  { id: '2239', num: 2239, title: 'Find Closest Number to Zero', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Basics' },
  
  // ARRAYS - Two Pointers
  { id: '88', num: 88, title: 'Merge Sorted Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: '26', num: 26, title: 'Remove Duplicates', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: '977', num: 977, title: 'Squares of Sorted Array', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: '15', num: 15, title: 'Three Sum', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: 'trapping-rain', num: 42, title: 'Trapping Rain Water', difficulty: 'hard' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: '167', num: 167, title: 'Two Sum II', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers' },
  { id: 'container-water', num: 11, title: 'Container With Most Water', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Two Pointers' },

  // ARRAYS - Subarray
  { id: '53', num: 53, title: 'Maximum Subarray', difficulty: 'medium' as const, category: 'arrays', subtopic: 'Subarray · Sliding Window' },
  { id: '121', num: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Subarray · Sliding Window' },
  
  // ARRAYS - Hashing
  { id: 'two-sum', num: 1, title: 'Two Sum', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Hashing' },
  { id: '217', num: 217, title: 'Contains Duplicate', difficulty: 'easy' as const, category: 'arrays', subtopic: 'Hashing' },
  { id: '41', num: 41, title: 'First Missing Positive', difficulty: 'hard' as const, category: 'arrays', subtopic: 'Hashing' },

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

export function Dashboard({ category, onVisualize }: DashboardProps) {
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredProblems = allProblems.filter((p) => p.category === category);
  
  // Group problems by subtopic
  const subtopics = Array.from(new Set(filteredProblems.map(p => p.subtopic)));

  return (
    <main>
      {/* Filter and Legend Area (Mimicking original) */}
      <div style={{ marginBottom: '24px', background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text)', textTransform: 'capitalize', fontSize: '1.2rem', marginBottom: '12px' }}>
          {category === 'binarysearch' ? 'Binary Search' : category} Problems
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
           <button 
            onClick={() => setFilterPriority('all')}
            style={{ padding: '6px 12px', borderRadius: '8px', background: filterPriority === 'all' ? 'rgba(108, 142, 245, 0.15)' : 'var(--surface2)', border: '1px solid', borderColor: filterPriority === 'all' ? 'var(--accent)' : 'var(--border)', color: filterPriority === 'all' ? 'var(--text)' : 'var(--muted)', cursor: 'pointer' }}
          >
            All
          </button>
          <button 
            onClick={() => setFilterPriority('easy')}
            style={{ padding: '6px 12px', borderRadius: '8px', background: filterPriority === 'easy' ? 'rgba(74, 222, 128, 0.15)' : 'var(--surface2)', border: '1px solid', borderColor: filterPriority === 'easy' ? 'var(--easy)' : 'var(--border)', color: filterPriority === 'easy' ? 'var(--easy)' : 'var(--muted)', cursor: 'pointer' }}
          >
            Easy Only
          </button>
           <button 
            onClick={() => setFilterPriority('medium')}
            style={{ padding: '6px 12px', borderRadius: '8px', background: filterPriority === 'medium' ? 'rgba(251, 191, 36, 0.15)' : 'var(--surface2)', border: '1px solid', borderColor: filterPriority === 'medium' ? 'var(--medium)' : 'var(--border)', color: filterPriority === 'medium' ? 'var(--medium)' : 'var(--muted)', cursor: 'pointer' }}
          >
            Medium Only
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
