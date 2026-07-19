import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '3×4 (Target: 3)', matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 3 },
  { label: '3×4 (Target: 13)', matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 13 },
];

const CODE_JAVA = [
  `boolean searchMatrix(int[][] matrix, int target) {`,
  `    int m = matrix.length;`,
  `    int n = matrix[0].length;`,
  `    int left = 0, right = m * n - 1;`,
  `    while (left <= right) {`,
  `        int mid = left + (right - left) / 2;`,
  `        int midVal = matrix[mid / n][mid % n];`,
  `        if (midVal == target)`,
  `            return true;`,
  `        else if (midVal < target)`,
  `            left = mid + 1;`,
  `        else`,
  `            right = mid - 1;`,
  `    }`,
  `    return false;`,
  `}`
];

const CODE_PY = [
  `def searchMatrix(self, matrix, target):`,
  `    m, n = len(matrix), len(matrix[0])`,
  `    left, right = 0, m * n - 1`,
  `    while left <= right:`,
  `        mid = (left + right) // 2`,
  `        mid_val = matrix[mid // n][mid % n]`,
  `        if mid_val == target:`,
  `            return True`,
  `        elif mid_val < target:`,
  `            left = mid + 1`,
  `        else:`,
  `            right = mid - 1`,
  `    return False`
];

export function Search2DMatrix({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const { matrix: initialMatrix, target } = EXAMPLES[activeEx];
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  
  const getGridSnapshot = (l: number, r: number, mIdx: number): MatrixCellState[][] => {
    return initialMatrix.map((row, rowIdx) => 
      row.map((val, colIdx) => {
        const flatIdx = rowIdx * n + colIdx;
        const isMid = flatIdx === mIdx;
        const inBounds = flatIdx >= l && flatIdx <= r;
        return {
          value: val,
          status: isMid ? 'current' : inBounds ? 'unvisited' : 'visited', // we use visited to gray out out-of-bounds
          label: flatIdx === l ? 'L' : flatIdx === r ? 'R' : undefined
        };
      })
    );
  };

  let left = 0;
  let right = m * n - 1;
  let found = false;

  steps.push({
    grid: getGridSnapshot(left, right, -1),
    state: { left, right, mid: '-', midVal: '-' },
    changed: [], algo: 1, codeJava: [4], codePy: [3],
    title: `Init`, desc: `m=${m}, n=${n}, target=${target}\nleft=0, right=${m*n - 1}`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Treat the ${m}×${n} matrix as a 1D array of length ${m*n}.<br/><code>left = 0</code>, <code>right = ${m*n - 1}</code>.`
  });

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const midVal = initialMatrix[row][col];

    steps.push({
      grid: getGridSnapshot(left, right, mid),
      state: { left, right, mid, midVal }, changed: ['mid'],
      algo: 2, codeJava: [6,7], codePy: [5,6],
      title: `Calculate Mid`, desc: `mid = ${left} + (${right}-${left})/2 = ${mid}\nmatrix[${row}][${col}] = ${midVal}`,
      logic: `Calculate <code>mid = ${mid}</code>.<br/>Map to 2D coordinates: row = ${mid}/${n} = ${row}, col = ${mid}%${n} = ${col}.<br/>Value is <strong>${midVal}</strong>.`
    });

    if (midVal === target) {
      steps.push({
        grid: getGridSnapshot(left, right, mid),
        state: { left, right, mid, midVal }, changed: [],
        algo: 3, codeJava: [8,9], codePy: [7,8],
        title: `Found Target!`, desc: `${midVal} == ${target}`,
        logic: `<strong style="color:var(--green)">Found:</strong> <code>${midVal} == ${target}</code>. Return true.`,
        finalRes: 'Found: True'
      });
      found = true;
      break;
    } else if (midVal < target) {
      left = mid + 1;
      steps.push({
        grid: getGridSnapshot(left, right, -1),
        state: { left, right, mid, midVal }, changed: ['left'],
        algo: 4, codeJava: [10,11], codePy: [9,10],
        title: `Mid < Target`, desc: `${midVal} < ${target}, move left`,
        logic: `${midVal} < ${target}. The target must be in the right half.<br/>Update <code>left = mid + 1 = ${left}</code>.`
      });
    } else {
      right = mid - 1;
      steps.push({
        grid: getGridSnapshot(left, right, -1),
        state: { left, right, mid, midVal }, changed: ['right'],
        algo: 5, codeJava: [12,13], codePy: [11,12],
        title: `Mid > Target`, desc: `${midVal} > ${target}, move right`,
        logic: `${midVal} > ${target}. The target must be in the left half.<br/>Update <code>right = mid - 1 = ${right}</code>.`
      });
    }
  }

  if (!found) {
    steps.push({
      grid: getGridSnapshot(-1, -1, -1),
      state: { left, right, mid: '-', midVal: '-' }, changed: [],
      algo: 6, codeJava: [15], codePy: [13],
      title: `Not Found`, desc: `left > right`,
      logic: `<strong style="color:var(--hard)">Not Found:</strong> <code>left > right</code>. The target is not in the matrix. Return false.`,
      finalRes: 'Not Found: False'
    });
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 3);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Search a 2D Matrix" lcNum="74" difficulty="Medium" tag="Binary Search" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>You are given an <code>m x n</code> integer matrix with two properties:<br/>1. Each row is sorted in non-decreasing order.<br/>2. The first integer of each row is greater than the last integer of the previous row.</>}
        examples={[
          { label: 'Example 1', input: 'target = 3', output: 'true' },
        ]}
        constraints={<>Must run in O(log(m * n)) time complexity.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Search size={20} />} title="Approach" lines={['Treat the 2D matrix as a sorted 1D array of length m*n.', 'Map 1D index `mid` to 2D: `row = mid / n`, `col = mid % n`.', 'Perform standard Binary Search.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Matrix Memory</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'target', value: target },
              { label: 'left', value: cs.state.left, changed: cs.changed.includes('left') },
              { label: 'right', value: cs.state.right, changed: cs.changed.includes('right') },
              { label: 'mid idx', value: cs.state.mid, changed: cs.changed.includes('mid') },
              { label: 'mid value', value: cs.state.midVal, changed: cs.changed.includes('mid') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Search 2D Matrix" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Init <code>left = 0</code>, <code>right = m*n - 1</code>.</> },
                { num: 2, txt: <>Calculate <code>mid</code>. Map to 2D: <code>row=mid/n</code>, <code>col=mid%n</code>.</> },
                { num: 3, txt: <>If <code>midVal == target</code>, return true.</> },
                { num: 4, txt: <>If <code>midVal &lt; target</code>, move to right half: <code>left = mid + 1</code>.</> },
                { num: 5, txt: <>If <code>midVal &gt; target</code>, move to left half: <code>right = mid - 1</code>.</> },
                { num: 6, txt: <>If loop ends, return false.</> },
              ]} 
            />
            <Complexity time="O(log(m×n))" space="O(1)" />
            <WhyItWorks paragraphs={[
              'Because the first element of a row is strictly strictly greater than the last element of the previous row, and all rows are sorted, the entire matrix can be unrolled into a single strictly sorted array.',
              'Mapping a 1D index to a 2D grid of width n is simple: the row is how many times n fits into the index (division), and the column is the remainder (modulo).'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
