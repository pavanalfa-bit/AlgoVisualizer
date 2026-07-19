import React, { useState } from 'react';
import { Maximize, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '3×3 (1 zero)', matrix: [[1,1,1],[1,0,1],[1,1,1]] },
  { label: '3×4 (2 zeros)', matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] },
];

const CODE_JAVA = [
  `void setZeroes(int[][] matrix) {`,
  `    boolean firstRow = false, firstCol = false;`,
  `    for (int i=0; i<matrix.length; i++)`,
  `        if (matrix[i][0] == 0) firstCol = true;`,
  `    for (int j=0; j<matrix[0].length; j++)`,
  `        if (matrix[0][j] == 0) firstRow = true;`,
  `    for (int i=1; i<matrix.length; i++) {`,
  `        for (int j=1; j<matrix[0].length; j++) {`,
  `            if (matrix[i][j] == 0) {`,
  `                matrix[i][0] = 0;`,
  `                matrix[0][j] = 0;`,
  `            }`,
  `        }`,
  `    }`,
  `    for (int i=1; i<matrix.length; i++) {`,
  `        for (int j=1; j<matrix[0].length; j++) {`,
  `            if (matrix[i][0] == 0 || matrix[0][j] == 0)`,
  `                matrix[i][j] = 0;`,
  `        }`,
  `    }`,
  `    if (firstCol)`,
  `        for (int i=0; i<matrix.length; i++) matrix[i][0] = 0;`,
  `    if (firstRow)`,
  `        for (int j=0; j<matrix[0].length; j++) matrix[0][j] = 0;`,
  `}`
];

const CODE_PY = [
  `def setZeroes(self, matrix):`,
  `    firstRow = any(matrix[0][j] == 0 for j in range(len(matrix[0])))`,
  `    firstCol = any(matrix[i][0] == 0 for i in range(len(matrix)))`,
  `    for i in range(1, len(matrix)):`,
  `        for j in range(1, len(matrix[0])):`,
  `            if matrix[i][j] == 0:`,
  `                matrix[i][0] = 0`,
  `                matrix[0][j] = 0`,
  `    for i in range(1, len(matrix)):`,
  `        for j in range(1, len(matrix[0])):`,
  `            if matrix[i][0] == 0 or matrix[0][j] == 0:`,
  `                matrix[i][j] = 0`,
  `    if firstCol:`,
  `        for i in range(len(matrix)):`,
  `            matrix[i][0] = 0`,
  `    if firstRow:`,
  `        for j in range(len(matrix[0])):`,
  `            matrix[0][j] = 0`
];

export function SetMatrixZeroes({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const initialMatrix = EXAMPLES[activeEx].matrix;
  
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  
  // Clone the matrix for simulation
  const mData = initialMatrix.map(r => [...r]);
  let firstRow = false;
  let firstCol = false;

  const getGridSnapshot = (currR: number, currC: number, markedR: number[] = [], markedC: number[] = []): MatrixCellState[][] => {
    return mData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        const isMarked = markedR.includes(r) && c === 0 || markedC.includes(c) && r === 0;
        return {
          value: val,
          status: isCurrent ? 'current' : isMarked ? 'visited' : 'unvisited',
          label: (r===0 || c===0) ? 'marker' : undefined
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { firstRow, firstCol },
    changed: [], algo: 1, codeJava: [2], codePy: [2, 3],
    title: `Init`,
    desc: `Check if first row or first column have zeroes to prevent overlapping logic.`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> We use the first row and first column as markers to store zero states.<br/>First, we need to check if the first row/col already contain zeroes.`
  });

  // Check first col
  for (let i = 0; i < m; i++) {
    const isZ = mData[i][0] === 0;
    if (isZ) firstCol = true;
    steps.push({
      grid: getGridSnapshot(i, 0), state: { firstRow, firstCol }, changed: isZ ? ['firstCol'] : [],
      algo: 1, codeJava: [3,4], codePy: [3],
      title: `Check First Column`,
      desc: `matrix[${i}][0] == ${mData[i][0]}`,
      logic: `Checking matrix[${i}][0]. ${isZ ? 'Found a zero! <code>firstCol = true</code>' : 'Not zero.'}`
    });
  }

  // Check first row
  for (let j = 0; j < n; j++) {
    const isZ = mData[0][j] === 0;
    if (isZ) firstRow = true;
    steps.push({
      grid: getGridSnapshot(0, j), state: { firstRow, firstCol }, changed: isZ ? ['firstRow'] : [],
      algo: 1, codeJava: [5,6], codePy: [2],
      title: `Check First Row`,
      desc: `matrix[0][${j}] == ${mData[0][j]}`,
      logic: `Checking matrix[0][${j}]. ${isZ ? 'Found a zero! <code>firstRow = true</code>' : 'Not zero.'}`
    });
  }

  // Scan rest of matrix
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const isZ = mData[i][j] === 0;
      if (isZ) {
        mData[i][0] = 0;
        mData[0][j] = 0;
      }
      steps.push({
        grid: getGridSnapshot(i, j, isZ ? [i] : [], isZ ? [j] : []), state: { firstRow, firstCol }, changed: [],
        algo: 2, codeJava: [7,8,9,10,11], codePy: [4,5,6,7,8],
        title: `Scan Inner Matrix`,
        desc: `matrix[${i}][${j}] == ${isZ ? 0 : mData[i][j]}`,
        logic: isZ 
          ? `<strong style="color:var(--orange)">Zero found!</strong> Setting markers: <code>matrix[${i}][0] = 0</code> and <code>matrix[0][${j}] = 0</code>.`
          : `matrix[${i}][${j}] is non-zero. Continue.`
      });
    }
  }

  // Zero out cells based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const markR = mData[i][0] === 0;
      const markC = mData[0][j] === 0;
      const willZero = markR || markC;
      if (willZero) mData[i][j] = 0;
      
      steps.push({
        grid: getGridSnapshot(i, j), state: { firstRow, firstCol }, changed: [],
        algo: 3, codeJava: [15,16,17,18], codePy: [9,10,11,12],
        title: `Zero out matrix`,
        desc: `matrix[${i}][0]==${mData[i][0]} || matrix[0][${j}]==${mData[0][j]}`,
        logic: willZero 
          ? `<strong style="color:var(--purple)">Marker matched.</strong> Setting <code>matrix[${i}][${j}] = 0</code>.`
          : `No marker for this cell.`
      });
    }
  }

  // Zero out first col if needed
  if (firstCol) {
    for (let i = 0; i < m; i++) {
      mData[i][0] = 0;
      steps.push({
        grid: getGridSnapshot(i, 0), state: { firstRow, firstCol }, changed: [],
        algo: 4, codeJava: [21,22], codePy: [13,14,15],
        title: `Zero First Column`, desc: `firstCol is true. Setting matrix[${i}][0] = 0`,
        logic: `Since <code>firstCol == true</code>, we must zero out the entire first column.`
      });
    }
  }

  // Zero out first row if needed
  if (firstRow) {
    for (let j = 0; j < n; j++) {
      mData[0][j] = 0;
      steps.push({
        grid: getGridSnapshot(0, j), state: { firstRow, firstCol }, changed: [],
        algo: 4, codeJava: [23,24], codePy: [16,17,18],
        title: `Zero First Row`, desc: `firstRow is true. Setting matrix[0][${j}] = 0`,
        logic: `Since <code>firstRow == true</code>, we must zero out the entire first row.`
      });
    }
  }

  steps.push({
    grid: getGridSnapshot(-1, -1), state: { firstRow, firstCol }, changed: [],
    algo: 5, codeJava: [25], codePy: [18],
    title: `Done!`, desc: `Matrix updated in place.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Matrix zeroes have been propagated in-place using O(1) space.`,
    finalRes: 'Matrix Updated'
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 3);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Set Matrix Zeroes" lcNum="73" difficulty="Medium" tag="In-place State Markers" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Given an <code>m x n</code> integer matrix, if an element is <code>0</code>, set its entire row and column to <code>0</code>'s. You must do it <strong>in place</strong>.</>}
        examples={[
          { label: 'Example 1', input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' },
        ]}
        constraints={<>O(1) extra space requirement.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Maximize size={20} />} title="Approach" lines={['Use the first row and first column as markers to store zero states.', 'Scan inner matrix -> set markers -> zero inner matrix -> zero markers if needed.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Matrix Memory</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'firstRow', value: cs.state.firstRow ? 'true' : 'false', changed: cs.changed.includes('firstRow') },
              { label: 'firstCol', value: cs.state.firstCol ? 'true' : 'false', changed: cs.changed.includes('firstCol') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Complete" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Set Matrix Zeroes" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Check if first row/col have zeroes. Store in <code>firstRow</code> and <code>firstCol</code>.</> },
                { num: 2, txt: <>Scan inner matrix. If zero, mark <code>matrix[i][0]=0</code> and <code>matrix[0][j]=0</code>.</> },
                { num: 3, txt: <>Scan inner matrix again. If row or col marker is zero, set <code>matrix[i][j]=0</code>.</> },
                { num: 4, txt: <>Finally, zero out first row and col if <code>firstRow</code>/<code>firstCol</code> are true.</> },
              ]} 
            />
            <Complexity time="O(m×n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              'To achieve O(1) space, we must store the state directly inside the matrix.',
              'We reserve the first row and first column to act as our "has a zero" arrays.',
              'Since the first row and col overlap at matrix[0][0], we use two boolean variables to track the original state of the first row and first col.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
