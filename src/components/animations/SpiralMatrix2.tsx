import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'n = 3', n: 3 },
  { label: 'n = 4', n: 4 },
  { label: 'n = 1', n: 1 },
];

const CODE_JAVA = [
  `int[][] generateMatrix(int n) {`,
  `    int[][] matrix = new int[n][n];`,
  `    int top=0, bottom=n-1, left=0, right=n-1;`,
  `    int num = 1;`,
  `    while (top<=bottom && left<=right) {`,
  `        for (int c=left; c<=right; c++) matrix[top][c] = num++;`,
  `        top++;`,
  `        for (int r=top; r<=bottom; r++) matrix[r][right] = num++;`,
  `        right--;`,
  `        if (top<=bottom)`,
  `            for (int c=right; c>=left; c--) matrix[bottom][c] = num++;`,
  `        bottom--;`,
  `        if (left<=right)`,
  `            for (int r=bottom; r>=top; r--) matrix[r][left] = num++;`,
  `        left++;`,
  `    }`,
  `    return matrix;`,
  `}`
];

const CODE_PY = [
  `def generateMatrix(self, n):`,
  `    matrix = [[0]*n for _ in range(n)]`,
  `    top, bottom, left, right = 0, n-1, 0, n-1`,
  `    num = 1`,
  `    while top <= bottom and left <= right:`,
  `        for c in range(left, right+1):`,
  `            matrix[top][c] = num; num += 1`,
  `        top += 1`,
  `        for r in range(top, bottom+1):`,
  `            matrix[r][right] = num; num += 1`,
  `        right -= 1`,
  `        if top <= bottom:`,
  `            for c in range(right, left-1, -1):`,
  `                matrix[bottom][c] = num; num += 1`,
  `            bottom -= 1`,
  `        if left <= right:`,
  `            for r in range(bottom, top-1, -1):`,
  `                matrix[r][left] = num; num += 1`,
  `            left += 1`,
  `    return matrix`
];

export function SpiralMatrix2({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const n = EXAMPLES[activeEx].n;

  // Pre-compute steps
  const steps: any[] = [];
  let top = 0, bottom = n - 1, left = 0, right = n - 1;
  let num = 1;
  
  // Track the actual matrix values as we build it
  const matrixData: (number | null)[][] = Array(n).fill(0).map(() => Array(n).fill(null));

  const getGridSnapshot = (currR: number, currC: number): MatrixCellState[][] => {
    return matrixData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        return {
          value: val === null ? '' : val,
          status: isCurrent ? 'current' : val !== null ? 'visited' : 'unvisited',
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1),
    bounds: { top, bottom, left, right },
    changed: [], algo: 1, codeJava: [2, 3, 4], codePy: [2, 3, 4],
    dir: 'none', title: `Generate ${n}×${n} Spiral Matrix`,
    desc: `n = ${n} — ${n*n} cells to fill\n\nInit boundaries:\n  top=${top}  bottom=${bottom}  left=${left}  right=${right}\n\nnum = ${num}`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Set four boundaries: <code>top=0, bottom=${n-1}, left=0, right=${n-1}</code>.<br/>Start with <code>num = 1</code>.`,
    logicClass: 'info'
  });

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) {
      matrixData[top][c] = num;
      steps.push({
        grid: getGridSnapshot(top, c), bounds: { top, bottom, left, right }, changed: ['num'],
        algo: 2, codeJava: [6], codePy: [6, 7], dir: 'right', title: `→ Right: matrix[${top}][${c}] = ${num}`,
        desc: `Traversing top row (left→right), row=${top}\nSetting [${top}][${c}] = ${num}\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}`,
        logic: `<strong style="color:var(--cyan)">→ Right:</strong> Traversing top row at <code>row=${top}</code>.<br/>Assigning <code>matrix[${top}][${c}] = ${num}</code>.`
      });
      num++;
    }
    top++;
    steps.push({
      grid: getGridSnapshot(-1, -1), bounds: { top, bottom, left, right }, changed: ['top'],
      algo: 2, codeJava: [7], codePy: [8], dir: 'right', title: `top++  →  top = ${top}`,
      desc: `Finished top row — shrink top boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nnum = ${num}`,
      logic: `Increment <code>top</code> to ${top}.`
    });

    if (top > bottom || left > right) break;

    for (let r = top; r <= bottom; r++) {
      matrixData[r][right] = num;
      steps.push({
        grid: getGridSnapshot(r, right), bounds: { top, bottom, left, right }, changed: ['num'],
        algo: 3, codeJava: [8], codePy: [9, 10], dir: 'down', title: `↓ Down: matrix[${r}][${right}] = ${num}`,
        desc: `Traversing right column (top→bottom), col=${right}\nSetting [${r}][${right}] = ${num}\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}`,
        logic: `<strong style="color:var(--orange)">↓ Down:</strong> Traversing right column at <code>col=${right}</code>.<br/>Assigning <code>matrix[${r}][${right}] = ${num}</code>.`
      });
      num++;
    }
    right--;
    steps.push({
      grid: getGridSnapshot(-1, -1), bounds: { top, bottom, left, right }, changed: ['right'],
      algo: 3, codeJava: [9], codePy: [11], dir: 'down', title: `right--  →  right = ${right}`,
      desc: `Finished right column — shrink right boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nnum = ${num}`,
      logic: `Decrement <code>right</code> to ${right}.`
    });

    if (top > bottom || left > right) break;

    for (let c = right; c >= left; c--) {
      matrixData[bottom][c] = num;
      steps.push({
        grid: getGridSnapshot(bottom, c), bounds: { top, bottom, left, right }, changed: ['num'],
        algo: 4, codeJava: [11], codePy: [13, 14], dir: 'left', title: `← Left: matrix[${bottom}][${c}] = ${num}`,
        desc: `Traversing bottom row (right→left), row=${bottom}\nSetting [${bottom}][${c}] = ${num}\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}`,
        logic: `<strong style="color:var(--purple)">← Left:</strong> Traversing bottom row at <code>row=${bottom}</code>.<br/>Assigning <code>matrix[${bottom}][${c}] = ${num}</code>.`
      });
      num++;
    }
    bottom--;
    steps.push({
      grid: getGridSnapshot(-1, -1), bounds: { top, bottom, left, right }, changed: ['bottom'],
      algo: 4, codeJava: [12], codePy: [15], dir: 'left', title: `bottom--  →  bottom = ${bottom}`,
      desc: `Finished bottom row — shrink bottom boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nnum = ${num}`,
      logic: `Decrement <code>bottom</code> to ${bottom}.`
    });

    if (top > bottom || left > right) break;

    for (let r = bottom; r >= top; r--) {
      matrixData[r][left] = num;
      steps.push({
        grid: getGridSnapshot(r, left), bounds: { top, bottom, left, right }, changed: ['num'],
        algo: 5, codeJava: [14], codePy: [17, 18], dir: 'up', title: `↑ Up: matrix[${r}][${left}] = ${num}`,
        desc: `Traversing left column (bottom→top), col=${left}\nSetting [${r}][${left}] = ${num}\ntop=${top}  bottom=${bottom}  left=${left}  right=${right}`,
        logic: `<strong style="color:var(--green)">↑ Up:</strong> Traversing left column at <code>col=${left}</code>.<br/>Assigning <code>matrix[${r}][${left}] = ${num}</code>.`
      });
      num++;
    }
    left++;
    steps.push({
      grid: getGridSnapshot(-1, -1), bounds: { top, bottom, left, right }, changed: ['left'],
      algo: 5, codeJava: [15], codePy: [19], dir: 'up', title: `left++  →  left = ${left}`,
      desc: `Finished left column — shrink left boundary.\ntop = ${top}  bottom=${bottom}  left=${left}  right=${right}\nnum = ${num}`,
      logic: `Increment <code>left</code> to ${left}.`
    });
  }

  steps.push({
    grid: getGridSnapshot(-1, -1), bounds: { top, bottom, left, right }, changed: [],
    algo: 6, codeJava: [17], codePy: [20], dir: 'none', title: `Done! Matrix filled.`,
    desc: `Spiral generation complete.\nAll ${n*n} elements placed.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Matrix is fully generated.`,
    logicClass: 'success', finalRes: `Generated ${n}x${n} Matrix`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const getDirIcon = (dir: string) => {
    if (dir === 'right') return { icon: '→', label: 'Right', color: 'var(--cyan)' };
    if (dir === 'down') return { icon: '↓', label: 'Down', color: 'var(--orange)' };
    if (dir === 'left') return { icon: '←', label: 'Left', color: 'var(--purple)' };
    if (dir === 'up') return { icon: '↑', label: 'Up', color: 'var(--green)' };
    return { icon: '—', label: 'Init', color: 'var(--muted)' };
  };
  const dInfo = getDirIcon(cs.dir);

  return (
    <VisualizerLayout>
      <VPHeader title="Spiral Matrix II" lcNum="59" difficulty="Medium" tag="4-Boundary Peel" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Given a positive integer <code>n</code>, generate an <code>n × n</code> matrix filled with elements from <code>1</code> to <code>n<sup>2</sup></code> in spiral order.</>}
        examples={[
          { label: 'Example 1', input: 'n = 3', output: '[[1,2,3],[8,9,4],[7,6,5]]', explanation: 'Same spiral pattern but placing 1 to 9.' },
        ]}
        constraints={<>1 ≤ n ≤ 20</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={(i) => { setActiveEx(i); reset(); }} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<RefreshCw size={20} />} title="Approach" lines={['Four Boundaries: top, bottom, left, right — same as Spiral Matrix I', 'Keep a counter `num`. Place `num` in the cell, then increment `num`.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Matrix Generation</div>
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
            </div>

            <StateGrid items={[
              { label: 'Direction', value: dInfo.icon, changed: cs.changed.includes('dir') },
              { label: 'num', value: cs.changed.includes('num') || step === 0 ? num : (cs.changed.length ? '-' : '-'), changed: cs.changed.includes('num') },
              { label: 'top', value: cs.bounds.top, changed: cs.changed.includes('top') },
              { label: 'bottom', value: cs.bounds.bottom, changed: cs.changed.includes('bottom') },
              { label: 'left', value: cs.bounds.left, changed: cs.changed.includes('left') },
              { label: 'right', value: cs.bounds.right, changed: cs.changed.includes('right') }
            ]} />
            
            <StepLogic html={cs.logic} logicClass={cs.logicClass} />
            <ResultBanner show={!!cs.finalRes} title="Complete" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Spiral Matrix II" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Init empty <code>n×n</code> matrix. Set <code>num=1</code>.</> },
                { num: 2, txt: <>→ Fill top row left to right; <code>top++</code></> },
                { num: 3, txt: <>↓ Fill right column top to bottom; <code>right--</code></> },
                { num: 4, txt: <>← Fill bottom row right to left; <code>bottom--</code></> },
                { num: 5, txt: <>↑ Fill left column bottom to top; <code>left++</code></> },
                { num: 6, txt: <>Repeat until all <code>n<sup>2</sup></code> cells are filled.</> }
              ]} 
            />
            <Complexity time="O(n²)" space="O(1) extra space" />
            <WhyItWorks paragraphs={[
              'The logic is exactly the same as Spiral Matrix I.',
              'Instead of reading from the matrix and storing into a result array, we write the incremental counter into the matrix cells.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
