import React, { useState } from 'react';
import { TextSearch, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'Word: ABCCED (True)', matrix: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' },
  { label: 'Word: ABCB (False)', matrix: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCB' },
];

const CODE_JAVA = [
  `boolean exist(char[][] board, String word) {`,
  `    for (int i=0; i<board.length; i++)`,
  `        for (int j=0; j<board[0].length; j++)`,
  `            if (dfs(board, i, j, word, 0))`,
  `                return true;`,
  `    return false;`,
  `}`,
  ``,
  `boolean dfs(char[][] board, int r, int c, String word, int idx) {`,
  `    if (idx == word.length()) return true;`,
  `    if (r<0 || c<0 || r>=board.length || c>=board[0].length || board[r][c] != word.charAt(idx))`,
  `        return false;`,
  `    `,
  `    char temp = board[r][c];`,
  `    board[r][c] = '*'; // mark visited`,
  `    `,
  `    boolean found = dfs(board, r+1, c, word, idx+1) ||`,
  `                    dfs(board, r-1, c, word, idx+1) ||`,
  `                    dfs(board, r, c+1, word, idx+1) ||`,
  `                    dfs(board, r, c-1, word, idx+1);`,
  `                    `,
  `    board[r][c] = temp; // backtrack`,
  `    return found;`,
  `}`
];

const CODE_PY = [
  `def exist(self, board, word):`,
  `    def dfs(r, c, idx):`,
  `        if idx == len(word): return True`,
  `        if r<0 or c<0 or r>=len(board) or c>=len(board[0]) or board[r][c] != word[idx]:`,
  `            return False`,
  `        `,
  `        temp = board[r][c]`,
  `        board[r][c] = '*'`,
  `        `,
  `        found = (dfs(r+1, c, idx+1) or`,
  `                 dfs(r-1, c, idx+1) or`,
  `                 dfs(r, c+1, idx+1) or`,
  `                 dfs(r, c-1, idx+1))`,
  `                 `,
  `        board[r][c] = temp`,
  `        return found`,
  `    `,
  `    for i in range(len(board)):`,
  `        for j in range(len(board[0])):`,
  `            if dfs(i, j, 0):`,
  `                return True`,
  `    return False`
];

export function WordSearch({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const { matrix: initialMatrix, word } = EXAMPLES[activeEx];
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  const mData = initialMatrix.map(r => [...r]);

  const getGridSnapshot = (currR: number, currC: number, path: [number, number][]): MatrixCellState[][] => {
    return mData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        const pathIdx = path.findIndex(([pr, pc]) => pr === r && pc === c);
        const isPath = pathIdx !== -1;
        return {
          value: val === '*' ? ' ' : val,
          status: isCurrent ? 'current' : isPath ? 'visited' : 'unvisited',
          label: isPath ? `#${pathIdx}` : undefined
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1, []),
    state: { r: '-', c: '-', idx: '-', char: '-' }, changed: [],
    algo: 1, codeJava: [2], codePy: [18],
    title: `Init`, desc: `Searching for "${word}"`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> We will scan the grid for the first character <code>'${word[0]}'</code> and launch DFS from there.`
  });

  let overallFound = false;

  const dfs = (r: number, c: number, idx: number, path: [number, number][]): boolean => {
    if (idx === word.length) {
      steps.push({
        grid: getGridSnapshot(r, c, path), state: { r, c, idx, char: '-' }, changed: [],
        algo: 2, codeJava: [10], codePy: [3],
        title: `Word Found!`, desc: `idx == ${idx} == word.length`,
        logic: `<strong style="color:var(--green)">Success!</strong> <code>idx == ${idx}</code> which matches the word length. Entire word matched.`
      });
      return true;
    }

    const charNeeded = word[idx];

    steps.push({
      grid: getGridSnapshot(r, c, path), state: { r, c, idx, char: charNeeded }, changed: ['r', 'c', 'idx'],
      algo: 3, codeJava: [11], codePy: [4],
      title: `DFS: Check bounds & match`, desc: `Looking for '${charNeeded}' at idx ${idx}`,
      logic: `Checking bounds and if <code>board[${r}][${c}] == '${charNeeded}'</code>.`
    });

    if (r < 0 || c < 0 || r >= m || c >= n || mData[r][c] !== charNeeded) {
      steps.push({
        grid: getGridSnapshot(r, c, path), state: { r, c, idx, char: charNeeded }, changed: [],
        algo: 3, codeJava: [12], codePy: [5],
        title: `DFS: Mismatch or Out of Bounds`, desc: `Return false`,
        logic: `Condition failed. Either out of bounds, already visited ('*'), or char doesn't match.<br/><strong style="color:var(--orange)">Return false.</strong>`
      });
      return false;
    }

    const temp = mData[r][c];
    mData[r][c] = '*';
    const newPath: [number, number][] = [...path, [r, c]];

    steps.push({
      grid: getGridSnapshot(r, c, newPath), state: { r, c, idx, char: charNeeded }, changed: [],
      algo: 4, codeJava: [14,15], codePy: [7,8],
      title: `DFS: Match! Mark visited`, desc: `board[${r}][${c}] = '*'`,
      logic: `<strong style="color:var(--purple)">Match!</strong> <code>'${temp}'</code> matches <code>'${charNeeded}'</code>.<br/>Marking cell as visited (<code>'*'</code>) and recursing in 4 directions.`
    });

    // 4 directions
    if (
      dfs(r + 1, c, idx + 1, newPath) ||
      dfs(r - 1, c, idx + 1, newPath) ||
      dfs(r, c + 1, idx + 1, newPath) ||
      dfs(r, c - 1, idx + 1, newPath)
    ) {
      return true;
    }

    mData[r][c] = temp; // backtrack
    steps.push({
      grid: getGridSnapshot(r, c, path), state: { r, c, idx, char: charNeeded }, changed: [],
      algo: 5, codeJava: [22,23], codePy: [15,16],
      title: `DFS: Backtrack`, desc: `Restore board[${r}][${c}] = '${temp}'`,
      logic: `All 4 directions failed to build the word.<br/><strong style="color:var(--hard)">Backtracking:</strong> Restore cell to <code>'${temp}'</code> and return false.`
    });

    return false;
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Small optimization to avoid animating every single cell if we only care about the start char
      if (initialMatrix[i][j] === word[0]) {
        if (dfs(i, j, 0, [])) {
          overallFound = true;
          break;
        }
      }
    }
    if (overallFound) break;
  }

  steps.push({
    grid: getGridSnapshot(-1, -1, []),
    state: { r: '-', c: '-', idx: '-', char: '-' }, changed: [],
    algo: 6, codeJava: [6], codePy: [22],
    title: `Done!`, desc: `Search complete.`,
    logic: overallFound 
      ? `<strong style="color:var(--green)">Done!</strong> Word "${word}" was found.` 
      : `<strong style="color:var(--hard)">Done!</strong> Word "${word}" does not exist in the grid.`,
    finalRes: overallFound ? 'True (Found)' : 'False (Not Found)'
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 4);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Word Search" lcNum="79" difficulty="Medium" tag="DFS Backtracking" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Given an <code>m x n</code> grid of characters and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid.</>}
        examples={[
          { label: 'Example 1', input: 'word = "ABCCED"', output: 'true' },
        ]}
        constraints={<>The word must be constructed from letters of sequentially adjacent cells (horizontal or vertical).</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<TextSearch size={20} />} title="Approach" lines={['Scan for the first character of the word.', 'Launch DFS. If a character matches, mark it visited (temporarily).', 'Recursively search 4 neighbors. If all fail, BACKTRACK and unmark.']} />
            
            <div className="card matrix-card">
              <div className="card-title">Grid Map (Path marked with indices)</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'idx', value: cs.state.idx, changed: cs.changed.includes('idx') },
              { label: 'needed char', value: cs.state.char, changed: cs.changed.includes('char') },
              { label: 'r', value: cs.state.r, changed: cs.changed.includes('r') },
              { label: 'c', value: cs.state.c, changed: cs.changed.includes('c') }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Word Search" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Iterate through grid. Launch DFS if first char matches.</> },
                { num: 2, txt: <>DFS Base Case: If <code>idx == word.length()</code>, return true.</> },
                { num: 3, txt: <>DFS Bounds: Return false if out of bounds, visited, or char mismatch.</> },
                { num: 4, txt: <>DFS Match: Temporarily mark <code>board[r][c] = '*'</code> and recurse 4 directions.</> },
                { num: 5, txt: <>DFS Backtrack: If all 4 directions return false, restore <code>board[r][c]</code> and return false.</> },
                { num: 6, txt: <>Return overall result.</> },
              ]} 
            />
            <Complexity time="O(m×n×4^L)" space="O(L) recursion stack (L = word length)" />
            <WhyItWorks paragraphs={[
              'DFS allows us to explore deep paths to form the word.',
              'Backtracking (restoring the cell after recursive calls) is critical. It allows a cell to be visited again if a different path reaches it later on in the search.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
