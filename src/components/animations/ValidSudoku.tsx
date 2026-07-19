import React, { useState } from 'react';
import { Grid, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { 
    label: 'Valid Board', 
    matrix: [
      ['5','3','.','.','7','.','.','.','.'],
      ['6','.','.','1','9','5','.','.','.'],
      ['.','9','8','.','.','.','.','6','.'],
      ['8','.','.','.','6','.','.','.','3'],
      ['4','.','.','8','.','3','.','.','1'],
      ['7','.','.','.','2','.','.','.','6'],
      ['.','6','.','.','.','.','2','8','.'],
      ['.','.','.','4','1','9','.','.','5'],
      ['.','.','.','.','8','.','.','7','9']
    ],
    isValid: true
  },
  { 
    label: 'Invalid Board', 
    matrix: [
      ['5','3','.','.','7','.','.','.','.'],
      ['6','.','.','1','9','5','.','.','.'],
      ['.','9','8','.','.','.','.','6','.'],
      ['8','.','.','.','6','.','.','.','3'],
      ['4','.','.','8','.','3','.','.','1'],
      ['7','.','.','.','2','.','.','.','6'],
      ['.','6','.','.','.','.','2','8','.'],
      ['.','.','.','4','1','9','.','.','5'],
      ['.','.','.','.','8','.','5','7','9'] // 5 conflicts with top-left 5? Actually 5 in col 0? Let's make it explicitly conflict
    ],
    isValid: false
  },
];

// Let's modify the invalid board to guarantee a quick conflict for animation purposes
EXAMPLES[1].matrix[0][0] = '5';
EXAMPLES[1].matrix[0][1] = '5'; // Immediate row conflict on first row

const CODE_JAVA = [
  `boolean isValidSudoku(char[][] board) {`,
  `    HashSet<String> seen = new HashSet<>();`,
  `    for (int i=0; i<9; i++) {`,
  `        for (int j=0; j<9; j++) {`,
  `            char num = board[i][j];`,
  `            if (num != '.') {`,
  `                if (!seen.add(num + " in row " + i) ||`,
  `                    !seen.add(num + " in col " + j) ||`,
  `                    !seen.add(num + " in box " + i/3 + "-" + j/3)) {`,
  `                    return false;`,
  `                }`,
  `            }`,
  `        }`,
  `    }`,
  `    return true;`,
  `}`
];

const CODE_PY = [
  `def isValidSudoku(self, board):`,
  `    seen = set()`,
  `    for i in range(9):`,
  `        for j in range(9):`,
  `            num = board[i][j]`,
  `            if num != '.':`,
  `                row_str = f"{num} in row {i}"`,
  `                col_str = f"{num} in col {j}"`,
  `                box_str = f"{num} in box {i//3}-{j//3}"`,
  `                `,
  `                if row_str in seen or col_str in seen or box_str in seen:`,
  `                    return False`,
  `                `,
  `                seen.add(row_str)`,
  `                seen.add(col_str)`,
  `                seen.add(box_str)`,
  `    return True`
];

export function ValidSudoku({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const initialMatrix = EXAMPLES[activeEx].matrix;

  const steps: any[] = [];
  
  const getGridSnapshot = (currR: number, currC: number, conflict: boolean = false): MatrixCellState[][] => {
    return initialMatrix.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        return {
          value: val === '.' ? ' ' : val,
          status: isCurrent && conflict ? 'error' : isCurrent ? 'current' : val !== '.' && (r < currR || (r === currR && c < currC)) ? 'visited' : 'unvisited',
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', num: '-' }, changed: [],
    algo: 1, codeJava: [2], codePy: [2],
    title: `Init`, desc: `Create HashSet`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Initialize an empty HashSet to keep track of seen numbers in rows, columns, and 3x3 boxes.`
  });

  const seen = new Set<string>();
  let hasConflict = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = initialMatrix[i][j];
      
      // Skip empty cells to make animation faster and more focused
      if (num === '.') continue;

      steps.push({
        grid: getGridSnapshot(i, j), state: { i, j, num }, changed: ['i', 'j', 'num'],
        algo: 2, codeJava: [5, 6], codePy: [5, 6],
        title: `Scan Cell [${i}][${j}]`, desc: `num = ${num}`,
        logic: `Found number <strong>${num}</strong> at <code>[${i}][${j}]</code>.`
      });

      const rowStr = `${num} in row ${i}`;
      const colStr = `${num} in col ${j}`;
      const boxStr = `${num} in box ${Math.floor(i/3)}-${Math.floor(j/3)}`;

      if (seen.has(rowStr) || seen.has(colStr) || seen.has(boxStr)) {
        steps.push({
          grid: getGridSnapshot(i, j, true), state: { i, j, num }, changed: [],
          algo: 3, codeJava: [7,8,9,10], codePy: [10,11],
          title: `Conflict!`, desc: `Found duplicate in HashSet`,
          logic: `<strong style="color:var(--hard)">Conflict detected!</strong> <code>${num}</code> was already seen in the same row, col, or box.<br/>Return false.`,
          finalRes: 'Invalid (False)'
        });
        hasConflict = true;
        break;
      }

      seen.add(rowStr);
      seen.add(colStr);
      seen.add(boxStr);

      steps.push({
        grid: getGridSnapshot(i, j), state: { i, j, num }, changed: [],
        algo: 4, codeJava: [7], codePy: [13,14,15],
        title: `Add to HashSet`, desc: `Added row, col, and box strings.`,
        logic: `<strong style="color:var(--green)">Valid so far.</strong> Added to HashSet:<br/><code>${rowStr}</code><br/><code>${colStr}</code><br/><code>${boxStr}</code>`
      });
    }
    if (hasConflict) break;
  }

  if (!hasConflict) {
    steps.push({
      grid: getGridSnapshot(-1, -1), state: { i: '-', j: '-', num: '-' }, changed: [],
      algo: 5, codeJava: [15], codePy: [16],
      title: `Done!`, desc: `All filled cells validated.`,
      logic: `<strong style="color:var(--green)">Done!</strong> Entire board scanned without conflicts. Return true.`,
      finalRes: 'Valid (True)'
    });
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 4); // fast by default
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Valid Sudoku" lcNum="36" difficulty="Medium" tag="Hashing" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Determine if a <code>9 x 9</code> Sudoku board is valid. Only the filled cells need to be validated according to the following rules:<br/>1. Each row must contain the digits <code>1-9</code> without repetition.<br/>2. Each column must contain the digits <code>1-9</code> without repetition.<br/>3. Each of the nine <code>3 x 3</code> sub-boxes must contain the digits <code>1-9</code> without repetition.</>}
        examples={[
          { label: 'Example 1', input: 'board = ...', output: 'true or false depending on conflicts' },
        ]}
        constraints={<>board.length == 9, board[i].length == 9.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Grid size={20} />} title="Approach" lines={['Use a HashSet to keep track of strings describing what we have seen.', 'For a number `5` at `[0][2]`, we add "5 in row 0", "5 in col 2", "5 in box 0-0".', 'If any string is already in the set, the board is invalid.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Sudoku Board</div>
              <div style={{ marginTop: 14 }}>
                {/* Minor hack: 9x9 might be large, GenericMatrixCanvas handles flex/scaling inherently */}
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'row (i)', value: cs.state.i, changed: cs.changed.includes('i') },
              { label: 'col (j)', value: cs.state.j, changed: cs.changed.includes('j') },
              { label: 'number', value: cs.state.num, changed: cs.changed.includes('num') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Valid Sudoku" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Init <code>HashSet&lt;String&gt; seen</code>.</> },
                { num: 2, txt: <>Iterate through grid. Skip empty cells (<code>'.'</code>).</> },
                { num: 3, txt: <>If <code>seen.add()</code> returns false (item exists), return false (conflict).</> },
                { num: 4, txt: <>Add formatted strings to the Set for row, col, and 3x3 box.</> },
                { num: 5, txt: <>If loop finishes, return true.</> },
              ]} 
            />
            <Complexity time="O(1)" space="O(1)" />
            <WhyItWorks paragraphs={[
              'Since the board is strictly 9x9, the time and space complexity are practically O(1).',
              'By stringifying the context ("in row", "in col", "in box"), we can use a single HashSet to check all three rules simultaneously.',
              'The 3x3 box index is mathematically found via integer division: (row/3) and (col/3).'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
