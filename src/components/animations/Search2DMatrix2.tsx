import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'Target: 5', matrix: [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target: 5 },
  { label: 'Target: 20', matrix: [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target: 20 },
];

const CODE_JAVA = [
  `boolean searchMatrix(int[][] matrix, int target) {`,
  `    int row = 0;`,
  `    int col = matrix[0].length - 1;`,
  `    while (row < matrix.length && col >= 0) {`,
  `        int val = matrix[row][col];`,
  `        if (val == target)`,
  `            return true;`,
  `        else if (val > target)`,
  `            col--;`,
  `        else`,
  `            row++;`,
  `    }`,
  `    return false;`,
  `}`
];

const CODE_PY = [
  `def searchMatrix(self, matrix, target):`,
  `    row, col = 0, len(matrix[0]) - 1`,
  `    while row < len(matrix) and col >= 0:`,
  `        val = matrix[row][col]`,
  `        if val == target:`,
  `            return True`,
  `        elif val > target:`,
  `            col -= 1`,
  `        else:`,
  `            row += 1`,
  `    return False`
];

export function Search2DMatrix2({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const { matrix: initialMatrix, target } = EXAMPLES[activeEx];
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  
  const getGridSnapshot = (currR: number, currC: number, elimRow: number, elimCol: number): MatrixCellState[][] => {
    return initialMatrix.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        // Eliminated if row < elimRow OR col > elimCol
        const isElim = r < elimRow || c > elimCol;
        return {
          value: val,
          status: isCurrent ? 'current' : isElim ? 'visited' : 'unvisited',
          label: isCurrent ? 'ptr' : undefined
        };
      })
    );
  };

  let row = 0;
  let col = n - 1;
  let found = false;

  steps.push({
    grid: getGridSnapshot(row, col, 0, n - 1),
    state: { row, col, val: '-' }, changed: [],
    algo: 1, codeJava: [2,3], codePy: [2],
    title: `Init`, desc: `Start at top-right corner.`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Start search at the top-right corner: <code>row = 0</code>, <code>col = ${n - 1}</code>.`
  });

  while (row < m && col >= 0) {
    const val = initialMatrix[row][col];
    
    steps.push({
      grid: getGridSnapshot(row, col, row, col),
      state: { row, col, val }, changed: ['val'],
      algo: 2, codeJava: [4,5], codePy: [3,4],
      title: `Check value`, desc: `matrix[${row}][${col}] = ${val}`,
      logic: `Current value is <strong>${val}</strong>. Comparing to target <strong>${target}</strong>.`
    });

    if (val === target) {
      steps.push({
        grid: getGridSnapshot(row, col, row, col),
        state: { row, col, val }, changed: [],
        algo: 3, codeJava: [6,7], codePy: [5,6],
        title: `Found Target!`, desc: `${val} == ${target}`,
        logic: `<strong style="color:var(--green)">Found:</strong> <code>${val} == ${target}</code>. Return true.`,
        finalRes: 'Found: True'
      });
      found = true;
      break;
    } else if (val > target) {
      col--;
      steps.push({
        grid: getGridSnapshot(row, col, row, col), // elim logic happens on next step naturally
        state: { row, col, val }, changed: ['col'],
        algo: 4, codeJava: [8,9], codePy: [7,8],
        title: `Value > Target`, desc: `${val} > ${target}, move left`,
        logic: `${val} > ${target}. Since the column is sorted ascending down, all elements below are even larger. We can eliminate this column and move left: <code>col--</code>.`
      });
    } else {
      row++;
      steps.push({
        grid: getGridSnapshot(row, col, row, col),
        state: { row, col, val }, changed: ['row'],
        algo: 5, codeJava: [10,11], codePy: [9,10],
        title: `Value < Target`, desc: `${val} < ${target}, move down`,
        logic: `${val} < ${target}. Since the row is sorted ascending right, all elements to the left are even smaller. We can eliminate this row and move down: <code>row++</code>.`
      });
    }
  }

  if (!found) {
    steps.push({
      grid: getGridSnapshot(-1, -1, m, -1), // everything eliminated
      state: { row, col, val: '-' }, changed: [],
      algo: 6, codeJava: [13], codePy: [11],
      title: `Not Found`, desc: `Pointer went out of bounds`,
      logic: `<strong style="color:var(--hard)">Not Found:</strong> Pointer went out of bounds. The target is not in the matrix. Return false.`,
      finalRes: 'Not Found: False'
    });
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 2);
  const cs = steps[step];

  return (
    <VisualizerLayout>
      <VPHeader title="Search a 2D Matrix II" lcNum="240" difficulty="Medium" tag="Matrix Elimination" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Write an efficient algorithm that searches for a value in an <code>m x n</code> integer matrix where:<br/>1. Integers in each row are sorted in ascending from left to right.<br/>2. Integers in each column are sorted in ascending from top to bottom.</>}
        examples={[
          { label: 'Example 1', input: 'target = 5', output: 'true' },
        ]}
        constraints={<>Must be O(m + n) time complexity.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={(i) => { setActiveEx(i); reset(); }} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Search size={20} />} title="Approach" lines={['Start from the top-right corner.', 'If value > target, the whole column is too large -> move left.', 'If value < target, the whole row is too small -> move down.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Matrix Search (Eliminated cells grayed out)</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'target', value: target },
              { label: 'row', value: cs.state.row, changed: cs.changed.includes('row') },
              { label: 'col', value: cs.state.col, changed: cs.changed.includes('col') },
              { label: 'curr val', value: cs.state.val, changed: cs.changed.includes('val') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Search 2D Matrix II" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Init pointer at top-right: <code>row = 0</code>, <code>col = n - 1</code>.</> },
                { num: 2, txt: <>While pointer is in bounds, check <code>val = matrix[row][col]</code>.</> },
                { num: 3, txt: <>If <code>val == target</code>, return true.</> },
                { num: 4, txt: <>If <code>val &gt; target</code>, target must be to the left, so <code>col--</code>.</> },
                { num: 5, txt: <>If <code>val &lt; target</code>, target must be below, so <code>row++</code>.</> },
                { num: 6, txt: <>If loop ends without finding target, return false.</> },
              ]} 
            />
            <Complexity time="O(m + n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              'Because the rows and columns are sorted, the top-right corner acts as a binary search tree root.',
              'Moving left is equivalent to moving to a smaller child. Moving down is equivalent to moving to a larger child.',
              'This guarantees we can eliminate an entire row or an entire column at each step, giving O(m+n) time complexity.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
