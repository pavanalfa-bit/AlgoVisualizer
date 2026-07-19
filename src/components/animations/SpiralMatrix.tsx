import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

// ── PROBLEM DATA ──
const EXAMPLES = [
  { label: '3×3', output: '[1,2,3,6,9,8,7,4,5]', matrix: [[1,2,3],[4,5,6],[7,8,9]] },
  { label: '3×4', output: '[1,2,3,4,8,12,11,10,9,5,6,7]', matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]] },
  { label: '1×1', output: '[1]', matrix: [[1]] },
];

const CODE_JAVA = [
  `List<Integer> spiralOrder(int[][] matrix) {`,
  `    List<Integer> res = new ArrayList<>();`,
  `    int top=0, bottom=matrix.length-1, left=0, right=matrix[0].length-1;`,
  `    while (top<=bottom && left<=right) {`,
  `        for (int c=left; c<=right; c++) res.add(matrix[top][c]); top++;`,
  `        for (int r=top; r<=bottom; r++) res.add(matrix[r][right]); right--;`,
  `        if (top<=bottom)`,
  `            for (int c=right; c>=left; c--) res.add(matrix[bottom][c]); bottom--;`,
  `        if (left<=right)`,
  `            for (int r=bottom; r>=top; r--) res.add(matrix[r][left]); left++;`,
  `    }`,
  `    return res;`,
  `}`
];

const CODE_PY = [
  `def spiralOrder(self, matrix):`,
  `    res = []`,
  `    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1`,
  `    while top <= bottom and left <= right:`,
  `        for c in range(left, right+1): res.append(matrix[top][c])`,
  `        top += 1`,
  `        for r in range(top, bottom+1): res.append(matrix[r][right])`,
  `        right -= 1`,
  `        if top <= bottom:`,
  `            for c in range(right, left-1, -1): res.append(matrix[bottom][c])`,
  `            bottom -= 1`,
  `        if left <= right:`,
  `            for r in range(bottom, top-1, -1): res.append(matrix[r][left])`,
  `            left += 1`,
  `    return res`
];

export function SpiralMatrix({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [matrixData, setMatrixData] = useState(EXAMPLES[0].matrix);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const m = matrixData.length;
  const n = matrixData[0].length;

  // Pre-compute steps
  const steps: any[] = [];
  let top = 0, bottom = m - 1, left = 0, right = n - 1;
  let visitOrder = 0;
  let result: number[] = [];
  let visitedMap: Record<string, number> = {};

  const getGridSnapshot = (currR: number, currC: number, vMap: Record<string, number>): MatrixCellState[][] => {
    return matrixData.map((row, r) => 
      row.map((val, c) => {
        const key = `${r},${c}`;
        const isCurrent = r === currR && c === currC;
        const isVisited = key in vMap;
        return {
          value: val,
          status: isCurrent ? 'current' : isVisited ? 'visited' : 'unvisited',
          label: isVisited ? `#${vMap[key]}` : undefined
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1, visitedMap),
    bounds: { top, bottom, left, right },
    result: [], changed: [], algo: 1, codeJava: [2, 3], codePy: [2, 3],
    dir: 'none', title: `Spiral Matrix ${m}×${n} — 4-Boundary Peel`,
    desc: `matrix ${m}×${n} — ${m*n} cells to visit\n\nInit boundaries:\n  top=${top}  bottom=${bottom}  left=${left}  right=${right}\n\nresult = []`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Set four boundaries: <code>top=0, bottom=${m-1}, left=0, right=${n-1}</code>.<br/>We peel the matrix layer by layer, shrinking one boundary per direction pass.`,
    logicClass: 'info'
  });

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) {
      visitOrder++; result.push(matrixData[top][c]); visitedMap = { ...visitedMap, [`${top},${c}`]: visitOrder };
      steps.push({
        grid: getGridSnapshot(top, c, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: [],
        algo: 2, codeJava: [5], codePy: [5], dir: 'right', title: `→ Right: visit matrix[${top}][${c}] = ${matrixData[top][c]}`,
        desc: `Traversing top row (left→right), row=${top}\nVisiting [${top}][${c}] = ${matrixData[top][c]}  (visit #${visitOrder})\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
        logic: `<strong style="color:var(--cyan)">→ Right:</strong> Traversing top row at <code>row=${top}</code>, column <code>${c}</code>.<br/>Cell value = <strong>${matrixData[top][c]}</strong> added to result (visit #${visitOrder}).`
      });
    }
    top++;
    steps.push({
      grid: getGridSnapshot(-1, -1, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: ['top'],
      algo: 2, codeJava: [5], codePy: [6], dir: 'right', title: `top++  →  top = ${top}`,
      desc: `Finished top row — shrink top boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
      logic: `After traversing the top row, increment <code>top</code> to ${top} — the top boundary shrinks inward.<br/>Next: traverse right column downward.`
    });

    if (top > bottom || left > right) break;

    for (let r = top; r <= bottom; r++) {
      visitOrder++; result.push(matrixData[r][right]); visitedMap = { ...visitedMap, [`${r},${right}`]: visitOrder };
      steps.push({
        grid: getGridSnapshot(r, right, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: [],
        algo: 3, codeJava: [6], codePy: [7], dir: 'down', title: `↓ Down: visit matrix[${r}][${right}] = ${matrixData[r][right]}`,
        desc: `Traversing right column (top→bottom), col=${right}\nVisiting [${r}][${right}] = ${matrixData[r][right]}  (visit #${visitOrder})\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
        logic: `<strong style="color:var(--orange)">↓ Down:</strong> Traversing right column at <code>col=${right}</code>, row <code>${r}</code>.<br/>Cell value = <strong>${matrixData[r][right]}</strong> added to result (visit #${visitOrder}).`
      });
    }
    right--;
    steps.push({
      grid: getGridSnapshot(-1, -1, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: ['right'],
      algo: 3, codeJava: [6], codePy: [8], dir: 'down', title: `right--  →  right = ${right}`,
      desc: `Finished right column — shrink right boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
      logic: `After traversing the right column, decrement <code>right</code> to ${right} — the right boundary shrinks inward.<br/>Next: traverse bottom row leftward.`
    });

    if (top > bottom || left > right) break;

    for (let c = right; c >= left; c--) {
      visitOrder++; result.push(matrixData[bottom][c]); visitedMap = { ...visitedMap, [`${bottom},${c}`]: visitOrder };
      steps.push({
        grid: getGridSnapshot(bottom, c, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: [],
        algo: 4, codeJava: [8], codePy: [10], dir: 'left', title: `← Left: visit matrix[${bottom}][${c}] = ${matrixData[bottom][c]}`,
        desc: `Traversing bottom row (right→left), row=${bottom}\nVisiting [${bottom}][${c}] = ${matrixData[bottom][c]}  (visit #${visitOrder})\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
        logic: `<strong style="color:var(--purple)">← Left:</strong> Traversing bottom row at <code>row=${bottom}</code>, column <code>${c}</code>.<br/>Cell value = <strong>${matrixData[bottom][c]}</strong> added to result (visit #${visitOrder}).`
      });
    }
    bottom--;
    steps.push({
      grid: getGridSnapshot(-1, -1, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: ['bottom'],
      algo: 4, codeJava: [8], codePy: [11], dir: 'left', title: `bottom--  →  bottom = ${bottom}`,
      desc: `Finished bottom row — shrink bottom boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
      logic: `After traversing the bottom row, decrement <code>bottom</code> to ${bottom} — the bottom boundary shrinks inward.<br/>Next: traverse left column upward.`
    });

    if (top > bottom || left > right) break;

    for (let r = bottom; r >= top; r--) {
      visitOrder++; result.push(matrixData[r][left]); visitedMap = { ...visitedMap, [`${r},${left}`]: visitOrder };
      steps.push({
        grid: getGridSnapshot(r, left, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: [],
        algo: 5, codeJava: [10], codePy: [13], dir: 'up', title: `↑ Up: visit matrix[${r}][${left}] = ${matrixData[r][left]}`,
        desc: `Traversing left column (bottom→top), col=${left}\nVisiting [${r}][${left}] = ${matrixData[r][left]}  (visit #${visitOrder})\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
        logic: `<strong style="color:var(--green)">↑ Up:</strong> Traversing left column at <code>col=${left}</code>, row <code>${r}</code>.<br/>Cell value = <strong>${matrixData[r][left]}</strong> added to result (visit #${visitOrder}).`
      });
    }
    left++;
    steps.push({
      grid: getGridSnapshot(-1, -1, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: ['left'],
      algo: 5, codeJava: [10], codePy: [14], dir: 'up', title: `left++  →  left = ${left}`,
      desc: `Finished left column — shrink left boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nresult=[${result.join(', ')}]`,
      logic: `After traversing the left column, increment <code>left</code> to ${left} — the left boundary shrinks inward.`
    });
  }

  steps.push({
    grid: getGridSnapshot(-1, -1, visitedMap), bounds: { top, bottom, left, right }, result: [...result], changed: [],
    algo: 6, codeJava: [12], codePy: [15], dir: 'none', title: `Done! All ${m*n} cells visited in spiral order`,
    desc: `Spiral traversal complete.\nAll ${m*n} elements visited.\n\nresult = [${result.join(', ')}]`,
    logic: `<strong style="color:var(--green)">Done!</strong> All ${m*n} elements traversed in clockwise spiral order.<br/>Result: <code>[${result.join(', ')}]</code>`,
    logicClass: 'success', finalRes: `[${result.join(', ')}]`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    setMatrixData(EXAMPLES[idx].matrix);
    reset();
  };

  const getDirIcon = (dir: string) => {
    if (dir === 'right') return { icon: '→', label: 'Right', color: 'var(--cyan)' };
    if (dir === 'down') return { icon: '↓', label: 'Down', color: 'var(--orange)' };
    if (dir === 'left') return { icon: '←', label: 'Left', color: 'var(--purple)' };
    if (dir === 'up') return { icon: '↑', label: 'Up', color: 'var(--green)' };
    return { icon: '—', label: 'Init', color: 'var(--muted)' };
  };
  const dInfo = getDirIcon(cs.dir);

  const problemProps = {
    statement: <>Given an <code>m × n</code> matrix, return <strong>all elements of the matrix in spiral order</strong> (clockwise from the top-left).</>,
    examples: [
      { label: 'Example 1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Traverse outer ring clockwise then inner ring.' },
      { label: 'Example 2', input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]', explanation: '3×4 spiral — two passes, first outer ring then inner row.' }
    ],
    constraints: <>1 ≤ m, n ≤ 10 &nbsp;|&nbsp; -100 ≤ matrix[i][j] ≤ 100</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Spiral Matrix" 
        lcNum="54" 
        difficulty="Medium" 
        tag="4-Boundary Peel" 
        onBack={onBack}
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {tab === 'visualizer' ? (
        <>
          <ProblemStatement {...problemProps} />
          <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                <ApproachBanner icon={<RefreshCw size={20} />} title="Approach" lines={['Four Boundaries: top, bottom, left, right — shrink after each directional pass', 'Traverse right→down→left→up, shrink boundary, repeat until all visited']} />
                
                <div className="card matrix-card">
                  <div className="card-title">Matrix — Spiral Traversal</div>
                  <div className="dir-indicator">
                    <span className="dir-label">Direction:</span>
                    <div className="dir-arrow" style={{ borderColor: dInfo.color, background: `${dInfo.color}22`, color: dInfo.color }}>
                      {dInfo.icon} <span>{dInfo.label}</span>
                    </div>
                    <div className="bnd-legend">
                      <div className="bnd-legend-item"><div className="bnd-legend-dot" style={{ background: 'var(--orange)' }}></div>top</div>
                      <div className="bnd-legend-item"><div className="bnd-legend-dot" style={{ background: 'var(--blue)' }}></div>bottom</div>
                      <div className="bnd-legend-item"><div className="bnd-legend-dot" style={{ background: 'var(--purple)' }}></div>left</div>
                      <div className="bnd-legend-item"><div className="bnd-legend-dot" style={{ background: 'var(--hard)' }}></div>right</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <GenericMatrixCanvas matrix={cs.grid} boundaries={cs.bounds} />
                  </div>
                  <div className="result-array-wrap">
                    <div className="result-array-label">Result (spiral order)</div>
                    <div className="result-array-cells">
                      {cs.result.length === 0 && <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>( empty )</span>}
                      {cs.result.map((num: number, idx: number) => <div key={idx} className="ra-cell">{num}</div>)}
                    </div>
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Direction', value: dInfo.icon, changed: cs.changed.includes('dir') },
                  { label: 'top', value: cs.bounds.top, changed: cs.changed.includes('top') },
                  { label: 'bottom', value: cs.bounds.bottom, changed: cs.changed.includes('bottom') },
                  { label: 'left', value: cs.bounds.left, changed: cs.changed.includes('left') },
                  { label: 'right', value: cs.bounds.right, changed: cs.changed.includes('right') }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Spiral Order" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Spiral Matrix" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algo}
                  steps={[
                    { num: 1, txt: <>Init four boundaries: <code>top=0, bottom=m-1, left=0, right=n-1</code></> },
                    { num: 2, txt: <>→ Traverse top row left to right; then <code>top++</code></> },
                    { num: 3, txt: <>↓ Traverse right column top to bottom; then <code>right--</code></> },
                    { num: 4, txt: <>← Traverse bottom row right to left (if <code>top≤bottom</code>); then <code>bottom--</code></> },
                    { num: 5, txt: <>↑ Traverse left column bottom to top (if <code>left≤right</code>); then <code>left++</code></> },
                    { num: 6, txt: <>Repeat while <code>top≤bottom &amp;&amp; left≤right</code></> }
                  ]} 
                />
                <Complexity time="O(m×n)" space="O(1)" />
                <WhyItWorks paragraphs={[
                  'Instead of tracking visited cells, we use four integer boundaries that shrink inward after each directional pass. This guarantees every cell is visited exactly once in spiral clockwise order, with O(1) extra space.',
                  'The guards prevent double-counting the last row or column when the spiral collapses to a single row/column.'
                ]} />
              </>
            }
          />
        </>
      ) : (
        <PracticeWorkspace 
          problemStatement={problemProps.statement}
          examples={problemProps.examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`import java.util.List;
import java.util.ArrayList;

class Main {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // Write your solution here
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};
        System.out.println("Output: " + spiralOrder(matrix));
    }
}`}
          defaultCodePython={`def spiralOrder(matrix):
    # Write your solution here
    pass

if __name__ == "__main__":
    matrix = [[1,2,3],[4,5,6],[7,8,9]]
    print(f"Output: {spiralOrder(matrix)}")`}
        />
      )}
    </VisualizerLayout>
  );
}
