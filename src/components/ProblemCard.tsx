import React from 'react';
import { Play, MoreVertical, Heart, CheckCircle2 } from 'lucide-react';

interface ProblemProps {
  id: string;
  num: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
  visualType?: 'bars' | 'dots' | 'blocks';
  solved?: boolean;
  onVisualize: (id: string) => void;
}

export function ProblemCard({ id, num, title, difficulty, description, visualType = 'bars', solved, onVisualize }: ProblemProps) {
  const desc = description || `Implement an efficient algorithm to solve ${title.toLowerCase()} and analyze its time and space complexity.`;

  return (
    <div className={`problem-card ${difficulty}`} onClick={() => onVisualize(id)}>
      <div className="card-top-row">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`card-diff-badge ${difficulty}`}>{difficulty}</span>
          {solved && <CheckCircle2 size={16} color="var(--green)" />}
        </div>
        <MoreVertical size={16} className="card-kebab" />
      </div>
      
      <div className="card-title-row">
        <div className="card-title">{title}</div>
        <div className="card-desc">{desc}</div>
      </div>

      <div className="card-visual-area">
        {visualType === 'bars' && (
          <div className="mini-bars">
            <div className="mb" style={{ height: '40%', opacity: 0.4 }}></div>
            <div className="mb" style={{ height: '60%', opacity: 0.6 }}></div>
            <div className="mb" style={{ height: '100%', opacity: 1 }}></div>
            <div className="mb" style={{ height: '80%', opacity: 0.8 }}></div>
            <div className="mb" style={{ height: '30%', opacity: 0.3 }}></div>
          </div>
        )}
        {visualType === 'blocks' && (
          <div className="mini-blocks">
            <div className="mbk" style={{ opacity: 1 }}></div>
            <div className="mbk" style={{ opacity: 0.5 }}></div>
            <div className="mbk" style={{ opacity: 0.2 }}></div>
          </div>
        )}
        {visualType === 'dots' && (
          <div className="mini-dots">
            <div className="mdt" style={{ opacity: 0.8 }}></div>
            <div className="mdt" style={{ opacity: 1 }}></div>
          </div>
        )}
      </div>

      <div className="card-bottom-row">
        <Heart size={16} className="card-heart" />
        <div className="card-actions">
          <button className="card-viz-btn" onClick={(e) => { e.stopPropagation(); onVisualize(id); }}>
            Visualize
          </button>
        </div>
      </div>
    </div>
  );
}
