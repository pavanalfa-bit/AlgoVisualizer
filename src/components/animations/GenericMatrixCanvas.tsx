import React from 'react';
import { motion } from 'framer-motion';

export interface MatrixCellState {
  value: number | string;
  status: 'unvisited' | 'visited' | 'current' | 'highlight' | 'neighbor' | 'error';
  label?: string; // e.g. visit order or specific pointer label
}

export interface BoundaryState {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface GenericMatrixCanvasProps {
  matrix: MatrixCellState[][];
  boundaries?: BoundaryState;
}

export function GenericMatrixCanvas({ matrix, boundaries }: GenericMatrixCanvasProps) {
  if (!matrix || matrix.length === 0) return null;
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  const CELL_SIZE = 56;
  const CELL_GAP = 5;

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'current': return { bg: 'var(--viz-sky-bg)', border: 'var(--viz-sky-bd)', text: 'var(--viz-sky-fg)' };
      case 'visited': return { bg: 'var(--viz-green-bg)', border: 'var(--viz-green-bd)', text: 'var(--viz-green-fg)' };
      case 'highlight': return { bg: 'var(--viz-yellow-bg)', border: 'var(--viz-yellow-bd)', text: 'var(--viz-yellow-fg)' };
      case 'neighbor': return { bg: 'var(--viz-purple-bg)', border: 'var(--viz-purple-bd)', text: 'var(--viz-purple-fg)' };
      case 'error': return { bg: 'var(--viz-red-bg)', border: 'var(--viz-red-bd)', text: 'var(--viz-red-fg)' };
      default: return { bg: 'var(--surface)', border: 'var(--border)', text: 'var(--text)' };
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: '16px' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          gap: `${CELL_GAP}px`,
          position: 'relative',
          zIndex: 1
        }}
      >
        {matrix.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            const colors = getStatusColors(cell.status);
            return (
              <motion.div
                layout
                key={`${rIdx}-${cIdx}`}
                initial={false}
                animate={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  scale: cell.status === 'current' ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px solid',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  position: 'relative'
                }}
              >
                {cell.value}
                {cell.label && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '4px',
                    fontSize: '0.6rem',
                    color: cell.status === 'visited' ? 'var(--green)' : 'var(--muted)'
                  }}>
                    {cell.label}
                  </span>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Boundary Overlays (Optional) */}
      {boundaries && (
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, pointerEvents: 'none', zIndex: 5 }}>
          {boundaries.top !== undefined && boundaries.top >= 0 && (
            <motion.div layout transition={{ duration: 0.4 }} style={{ position: 'absolute', left: boundaries.left ? (boundaries.left * (CELL_SIZE + CELL_GAP)) : 0, right: boundaries.right !== undefined ? ((cols - 1 - boundaries.right) * (CELL_SIZE + CELL_GAP)) : 0, top: boundaries.top * (CELL_SIZE + CELL_GAP) - 2, borderTop: '3px dashed var(--orange)', zIndex: 10 }} />
          )}
          {boundaries.bottom !== undefined && boundaries.bottom >= 0 && (
             <motion.div layout transition={{ duration: 0.4 }} style={{ position: 'absolute', left: boundaries.left ? (boundaries.left * (CELL_SIZE + CELL_GAP)) : 0, right: boundaries.right !== undefined ? ((cols - 1 - boundaries.right) * (CELL_SIZE + CELL_GAP)) : 0, top: boundaries.bottom * (CELL_SIZE + CELL_GAP) + CELL_SIZE + 2, borderTop: '3px dashed var(--blue)', zIndex: 10 }} />
          )}
          {boundaries.left !== undefined && boundaries.left >= 0 && (
             <motion.div layout transition={{ duration: 0.4 }} style={{ position: 'absolute', top: boundaries.top ? (boundaries.top * (CELL_SIZE + CELL_GAP)) : 0, bottom: boundaries.bottom !== undefined ? ((rows - 1 - boundaries.bottom) * (CELL_SIZE + CELL_GAP)) : 0, left: boundaries.left * (CELL_SIZE + CELL_GAP) - 2, borderLeft: '3px dashed var(--purple)', zIndex: 10 }} />
          )}
          {boundaries.right !== undefined && boundaries.right >= 0 && (
             <motion.div layout transition={{ duration: 0.4 }} style={{ position: 'absolute', top: boundaries.top ? (boundaries.top * (CELL_SIZE + CELL_GAP)) : 0, bottom: boundaries.bottom !== undefined ? ((rows - 1 - boundaries.bottom) * (CELL_SIZE + CELL_GAP)) : 0, left: boundaries.right * (CELL_SIZE + CELL_GAP) + CELL_SIZE + 2, borderLeft: '3px dashed var(--hard)', zIndex: 10 }} />
          )}
        </div>
      )}
    </div>
  );
}
