import React from 'react';
import { Play } from 'lucide-react';

interface ProblemProps {
  id: string;
  num: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onVisualize: (id: string) => void;
}

export function ProblemCard({ id, num, title, difficulty, onVisualize }: ProblemProps) {
  return (
    <div className={`problem-card ${difficulty}`} onClick={() => onVisualize(id)}>
      <div className="problem-num">{num}.</div>
      <div className="problem-info">
        <div className="problem-name">{title}</div>
        <span className={`diff-badge ${difficulty}`}>{difficulty}</span>
      </div>
      <button className="viz-btn">
        <Play size={12} fill="currentColor" /> Viz
      </button>
    </div>
  );
}
