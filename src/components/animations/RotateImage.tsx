import React, { useState } from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '3×3', matrix: [[1,2,3],[4,5,6],[7,8,9]] },
  { label: '4×4', matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] },
];

const CODE_JAVA = [
  `void rotate(int[][] matrix) {`,
  `    int n = matrix.length;`,
  `    // Transpose`,
  `    for (int i=0; i<n; i++) {`,
  `        for (int j=i; j<n; j++) {`,
  `            int temp = matrix[i][j];`,
  `            matrix[i][j] = matrix[j][i];`,
  `            matrix[j][i] = temp;`,
  `        }`,
  `    }`,
  `    // Reverse each row`,
  `    for (int i=0; i<n; i++) {`,
  `        for (int j=0; j<n/2; j++) {`,
  `            int temp = matrix[i][j];`,
  `            matrix[i][j] = matrix[i][n-1-j];`,
  `            matrix[i][n-1-j] = temp;`,
  `        }`,
  `    }`,
  `}`
];

const CODE_PY = [
  `def rotate(self, matrix):`,
  `    n = len(matrix)`,
  `    # Transpose`,
  `    for i in range(n):`,
  `        for j in range(i, n):`,
  `            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]`,
  `    `,
  `    # Reverse each row`,
  `    for i in range(n):`,
  `        for j in range(n // 2):`,
  `            matrix[i][j], matrix[i][n-1-j] = matrix[i][n-1-j], matrix[i][j]`
];

export function RotateImage({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const initialMatrix = EXAMPLES[activeEx].matrix;
  const n = initialMatrix.length;

  const steps: any[] = [];
  const mData = initialMatrix.map(r => [...r]);

  const getGridSnapshot = (currCells: [number, number][]): MatrixCellState[][] => {
    return mData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = currCells.some(([cr, cc]) => cr === r && cc === c);
        return {
          value: val,
          status: isCurrent ? 'current' : 'unvisited',
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot([]),
    changed: [], algo: 1, codeJava: [2], codePy: [2],
    title: `Init`, desc: `Matrix size ${n}×${n}.`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Rotate by 90 degrees clockwise in-place.<br/>We use a 2-step mathematical approach: Transpose, then Reverse.`
  });

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i !== j) {
        steps.push({
          grid: getGridSnapshot([[i, j], [j, i]]), changed: [],
          algo: 2, codeJava: [4,5], codePy: [4,5],
          title: `Transpose: Swap`, desc: `Swapping matrix[${i}][${j}] (${mData[i][j]}) with matrix[${j}][${i}] (${mData[j][i]})`,
          logic: `Transposing: swapping element at row ${i}, col ${j} with row ${j}, col ${i}.`
        });

        const temp = mData[i][j];
        mData[i][j] = mData[j][i];
        mData[j][i] = temp;

        steps.push({
          grid: getGridSnapshot([[i, j], [j, i]]), changed: [],
          algo: 2, codeJava: [7,8,9], codePy: [6],
          title: `Transpose: Swapped`, desc: `Swapped.`,
          logic: `Elements swapped.`
        });
      }
    }
  }

  // Reverse
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < Math.floor(n / 2); j++) {
      const opp = n - 1 - j;
      steps.push({
        grid: getGridSnapshot([[i, j], [i, opp]]), changed: [],
        algo: 3, codeJava: [13,14], codePy: [9,10],
        title: `Reverse: Swap in row ${i}`, desc: `Swapping matrix[${i}][${j}] (${mData[i][j]}) with matrix[${i}][${opp}] (${mData[i][opp]})`,
        logic: `Reversing row ${i}: swapping col ${j} with col ${opp}.`
      });

      const temp = mData[i][j];
      mData[i][j] = mData[i][opp];
      mData[i][opp] = temp;

      steps.push({
        grid: getGridSnapshot([[i, j], [i, opp]]), changed: [],
        algo: 3, codeJava: [15,16,17], codePy: [11],
        title: `Reverse: Swapped`, desc: `Swapped.`,
        logic: `Elements swapped.`
      });
    }
  }

  steps.push({
    grid: getGridSnapshot([]), changed: [],
    algo: 4, codeJava: [19], codePy: [11],
    title: `Done!`, desc: `Matrix rotated by 90 degrees.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Image rotated in place.`,
    finalRes: 'Rotated 90°'
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 3);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Rotate Image" lcNum="48" difficulty="Medium" tag="Math / Matrix" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>You are given an <code>n x n</code> 2D matrix representing an image, rotate the image by <strong>90 degrees (clockwise)</strong> in-place.</>}
        examples={[
          { label: 'Example 1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
        ]}
        constraints={<>You have to rotate the image in-place.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<RotateCw size={20} />} title="Approach" lines={['1. Transpose the matrix (swap matrix[i][j] with matrix[j][i]).', '2. Reverse each row (swap left and right elements in each row).']} />
            
            <div className="card matrix-card">
              <div className="card-title">Matrix Memory</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Complete" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Rotate Image" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Init matrix of size <code>n×n</code>.</> },
                { num: 2, txt: <>Transpose: Iterate <code>i</code> from <code>0</code> to <code>n</code>, and <code>j</code> from <code>i</code> to <code>n</code>. Swap <code>(i,j)</code> with <code>(j,i)</code>.</> },
                { num: 3, txt: <>Reverse: For each row, swap elements up to <code>n/2</code> from the edges inwards.</> },
              ]} 
            />
            <Complexity time="O(n²)" space="O(1)" />
            <WhyItWorks paragraphs={[
              'Rotating a 2D array by 90 degrees clockwise is mathematically equivalent to transposing the matrix (swapping elements across the main diagonal) and then reversing every row.',
              'Transposing converts rows to columns, and reversing the rows flips the columns into the correct 90 degree clockwise orientation.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
