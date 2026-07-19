import React, { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '4×3 Glider', matrix: [[0,1,0],[0,0,1],[1,1,1],[0,0,0]] },
];

const CODE_JAVA = [
  `void gameOfLife(int[][] board) {`,
  `    int m = board.length, n = board[0].length;`,
  `    for (int i=0; i<m; i++) {`,
  `        for (int j=0; j<n; j++) {`,
  `            int lives = 0;`,
  `            for (int r=Math.max(0, i-1); r<=Math.min(m-1, i+1); r++) {`,
  `                for (int c=Math.max(0, j-1); c<=Math.min(n-1, j+1); c++) {`,
  `                    if (r==i && c==j) continue;`,
  `                    if (board[r][c] == 1 || board[r][c] == 2) lives++;`,
  `                }`,
  `            }`,
  `            if (board[i][j] == 1 && (lives < 2 || lives > 3)) board[i][j] = 2;`,
  `            if (board[i][j] == 0 && lives == 3) board[i][j] = 3;`,
  `        }`,
  `    }`,
  `    for (int i=0; i<m; i++) {`,
  `        for (int j=0; j<n; j++) {`,
  `            if (board[i][j] == 2) board[i][j] = 0;`,
  `            if (board[i][j] == 3) board[i][j] = 1;`,
  `        }`,
  `    }`,
  `}`
];

const CODE_PY = [
  `def gameOfLife(self, board):`,
  `    m, n = len(board), len(board[0])`,
  `    for i in range(m):`,
  `        for j in range(n):`,
  `            lives = 0`,
  `            for r in range(max(0, i-1), min(m, i+2)):`,
  `                for c in range(max(0, j-1), min(n, j+2)):`,
  `                    if r == i and c == j: continue`,
  `                    if board[r][c] in (1, 2): lives += 1`,
  `            `,
  `            if board[i][j] == 1 and (lives < 2 or lives > 3):`,
  `                board[i][j] = 2 # live -> dead`,
  `            if board[i][j] == 0 and lives == 3:`,
  `                board[i][j] = 3 # dead -> live`,
  `    `,
  `    for i in range(m):`,
  `        for j in range(n):`,
  `            if board[i][j] == 2: board[i][j] = 0`,
  `            if board[i][j] == 3: board[i][j] = 1`
];

export function GameOfLife({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const initialMatrix = EXAMPLES[activeEx].matrix;
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  const mData = initialMatrix.map(r => [...r]);

  const getGridSnapshot = (currR: number, currC: number, checkR: number = -1, checkC: number = -1): MatrixCellState[][] => {
    return mData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        const isCheck = r === checkR && c === checkC;
        const isNeighbor = Math.abs(r - currR) <= 1 && Math.abs(c - currC) <= 1 && !isCurrent;
        
        let label = '';
        if (val === 2) label = 'die';
        if (val === 3) label = 'live';

        return {
          value: val,
          status: isCurrent ? 'current' : isCheck ? 'visited' : isNeighbor ? 'neighbor' : 'unvisited',
          label: label || undefined
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', lives: '-' }, changed: [],
    algo: 1, codeJava: [2], codePy: [2],
    title: `Init`, desc: `m=${m}, n=${n}`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> We will compute the next state in-place.<br/>Use <code>2</code> to represent <em>live→dead</em> and <code>3</code> to represent <em>dead→live</em>.`
  });

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let lives = 0;
      const isAlive = mData[i][j] === 1;

      steps.push({
        grid: getGridSnapshot(i, j),
        state: { i, j, lives: 0 }, changed: ['i', 'j'],
        algo: 2, codeJava: [5], codePy: [5],
        title: `Cell [${i}][${j}]`, desc: `Checking neighbors for ${isAlive ? 'Live' : 'Dead'} cell`,
        logic: `Looking at cell <code>[${i}][${j}]</code> (Currently <strong>${isAlive ? 'Live' : 'Dead'}</strong>). Counting neighbors...`
      });

      for (let r = Math.max(0, i - 1); r <= Math.min(m - 1, i + 1); r++) {
        for (let c = Math.max(0, j - 1); c <= Math.min(n - 1, j + 1); c++) {
          if (r === i && c === j) continue;
          const nVal = mData[r][c];
          const nAlive = nVal === 1 || nVal === 2;
          if (nAlive) lives++;

          steps.push({
            grid: getGridSnapshot(i, j, r, c),
            state: { i, j, lives }, changed: nAlive ? ['lives'] : [],
            algo: 2, codeJava: [8,9], codePy: [9],
            title: `Check Neighbor [${r}][${c}]`, desc: `Neighbor is ${nAlive ? 'Live' : 'Dead'}. Lives = ${lives}`,
            logic: `Neighbor <code>[${r}][${c}]</code> is <strong>${nAlive ? 'Live' : 'Dead'}</strong>. <code>lives = ${lives}</code>.`
          });
        }
      }

      let newState = mData[i][j];
      let ruleApplied = 'None';
      if (isAlive && (lives < 2 || lives > 3)) {
        newState = 2; // dies
        ruleApplied = lives < 2 ? 'Under-population (dies)' : 'Over-population (dies)';
        mData[i][j] = 2;
      } else if (!isAlive && lives === 3) {
        newState = 3; // lives
        ruleApplied = 'Reproduction (lives)';
        mData[i][j] = 3;
      }

      steps.push({
        grid: getGridSnapshot(i, j),
        state: { i, j, lives }, changed: [],
        algo: 3, codeJava: [12,13], codePy: [11,13],
        title: `Apply Rule`, desc: `lives = ${lives}. Rule: ${ruleApplied}`,
        logic: `Finished counting: <code>lives = ${lives}</code>.<br/>Rule applied: <strong>${ruleApplied}</strong>.<br/>Cell state updated to ${newState}.`
      });
    }
  }

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', lives: '-' }, changed: [],
    algo: 4, codeJava: [16], codePy: [16],
    title: `Phase 2: Update States`, desc: `Convert 2->0 and 3->1`,
    logic: `All rules computed.<br/>Now iterate through the board and apply the deferred states (2→0, 3→1).`
  });

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mData[i][j] === 2) {
        mData[i][j] = 0;
        steps.push({
          grid: getGridSnapshot(i, j), state: { i, j, lives: '-' }, changed: [],
          algo: 4, codeJava: [18], codePy: [18],
          title: `Update [${i}][${j}]`, desc: `2 -> 0`, logic: `Converting 2 back to 0 (Dead).`
        });
      }
      if (mData[i][j] === 3) {
        mData[i][j] = 1;
        steps.push({
          grid: getGridSnapshot(i, j), state: { i, j, lives: '-' }, changed: [],
          algo: 4, codeJava: [19], codePy: [19],
          title: `Update [${i}][${j}]`, desc: `3 -> 1`, logic: `Converting 3 back to 1 (Live).`
        });
      }
    }
  }

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', lives: '-' }, changed: [],
    algo: 5, codeJava: [22], codePy: [19],
    title: `Done!`, desc: `Game of Life step complete.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Board updated to next generation in-place.`,
    finalRes: 'Next Gen Computed'
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 4);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Game of Life" lcNum="289" difficulty="Medium" tag="State Machine" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>The board is an <code>m x n</code> grid where 0 is dead and 1 is alive. Update the board to the next state based on Conway's Game of Life rules (Under-pop, Over-pop, Reproduction, Survival). <strong>Do it in-place</strong>.</>}
        examples={[
          { label: 'Example 1', input: 'board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]', output: '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]' },
        ]}
        constraints={<>Must run in O(1) space.</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Activity size={20} />} title="Approach" lines={['To update in-place without losing the original state for neighboring cells, use intermediate states.', 'State 2 = originally alive, now dead. State 3 = originally dead, now alive.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Board Grid</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'i', value: cs.state.i, changed: cs.changed.includes('i') },
              { label: 'j', value: cs.state.j, changed: cs.changed.includes('j') },
              { label: 'live neighbors', value: cs.state.lives, changed: cs.changed.includes('lives') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Game of Life" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Identify states: <code>2</code> for live→dead, <code>3</code> for dead→live.</> },
                { num: 2, txt: <>Iterate through grid, counting neighbors that are <code>1</code> or <code>2</code>.</> },
                { num: 3, txt: <>Apply rules: assign <code>2</code> if dying, <code>3</code> if reproducing.</> },
                { num: 4, txt: <>After full pass, replace all <code>2</code> with <code>0</code>, and <code>3</code> with <code>1</code>.</> },
                { num: 5, txt: <>Board is updated.</> },
              ]} 
            />
            <Complexity time="O(m×n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              'If we update cells directly to 0 and 1, we lose the previous state which is required by the neighbors that haven\'t been evaluated yet.',
              'By using a finite state machine (0, 1, 2, 3), we encode both the old state and the new state into a single integer. For example, a cell with value 2 means it is currently dead but used to be alive.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
