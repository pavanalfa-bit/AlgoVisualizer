import React from 'react';

export interface LLNode {
  id: string;
  val: string | number;
  x: number;
  y: number;
  next?: string | null;
  color?: string;
  bgColor?: string;
  isDummy?: boolean;
}

export interface LLPointer {
  label: string;
  targetId: string | null;
  color: string;
}

interface GenericLinkedListCanvasProps {
  nodes: LLNode[];
  pointers: LLPointer[];
  svgWidth?: number;
  svgHeight?: number;
}

export function GenericLinkedListCanvas({ nodes, pointers, svgWidth = 800, svgHeight = 300 }: GenericLinkedListCanvasProps) {
  // Arrow head marker definition
  const markerDef = (
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--muted)" />
      </marker>
      <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--viz-red-bd)" />
      </marker>
    </defs>
  );

  // Group pointers by target
  const pointersByTarget: Record<string, LLPointer[]> = {};
  pointers.forEach(p => {
    if (p.targetId) {
      if (!pointersByTarget[p.targetId]) pointersByTarget[p.targetId] = [];
      pointersByTarget[p.targetId].push(p);
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
        {markerDef}
        
        {/* Draw connections first so they are behind nodes */}
        {nodes.map(node => {
          if (node.next === undefined) return null;
          const target = nodes.find(n => n.id === node.next);
          if (!target) {
            // Draw null terminator arrow
            return (
              <g key={`edge-${node.id}-null`} style={{ transition: 'all 0.5s ease' }}>
                <line 
                  x1={node.x + 20} y1={node.y} 
                  x2={node.x + 60} y2={node.y} 
                  stroke="var(--muted)" strokeWidth="2" 
                  markerEnd="url(#arrowhead)" 
                />
                <text x={node.x + 75} y={node.y + 5} fill="var(--muted)" fontSize="14" textAnchor="middle" fontFamily="monospace">null</text>
              </g>
            );
          }

          const startX = node.x + 20;
          const startY = node.y;
          const endX = target.x - 30;
          const endY = target.y;

          let pathD = '';
          if (startY === endY && endX > startX) {
            // Straight line
            pathD = `M ${startX} ${startY} L ${endX - 2} ${endY}`;
          } else if (endX < startX) {
            // Cycle back
            pathD = `M ${startX} ${startY} C ${startX + 50} ${startY + 60}, ${endX - 50} ${endY + 60}, ${endX - 2} ${endY}`;
          } else {
            // Curvy path to different row
            pathD = `M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 40} ${endY}, ${endX - 2} ${endY}`;
          }

          return (
            <path 
              key={`edge-${node.id}-${target.id}`} 
              d={pathD} 
              fill="none" 
              stroke="var(--muted)" 
              strokeWidth="2" 
              markerEnd="url(#arrowhead)"
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map(node => (
          <g key={node.id} style={{ transform: `translate(${node.x}px, ${node.y}px)`, transition: 'transform 0.5s ease, fill 0.5s ease' }}>
            <rect 
              x={-30} y={-20} 
              width={60} height={40} 
              rx={6} 
              fill={node.bgColor || 'var(--surface)'} 
              stroke={node.color || 'var(--border)'} 
              strokeWidth={2}
              style={{ transition: 'all 0.3s ease' }}
            />
            <line x1={10} y1={-20} x2={10} y2={20} stroke={node.color || 'var(--border)'} strokeWidth={2} style={{ transition: 'all 0.3s ease' }} />
            <text x={-10} y={5} textAnchor="middle" fill="var(--text)" fontWeight="bold" fontFamily="monospace" fontSize="16">
              {node.isDummy ? 'D' : node.val}
            </text>
            <circle cx={20} cy={0} r={3} fill={node.color || 'var(--border)'} style={{ transition: 'all 0.3s ease' }} />
          </g>
        ))}

        {/* Draw pointers */}
        {Object.entries(pointersByTarget).map(([targetId, ptrs]) => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return null;
          
          return (
            <g key={`ptrs-${targetId}`} style={{ transform: `translate(${target.x}px, ${target.y}px)`, transition: 'transform 0.5s ease' }}>
              {ptrs.map((ptr, idx) => (
                <text 
                  key={ptr.label}
                  x={0} 
                  y={40 + idx * 16} 
                  textAnchor="middle" 
                  fill={ptr.color} 
                  fontSize="13" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                  style={{ transition: 'all 0.3s ease' }}
                >
                  ↑ {ptr.label}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
