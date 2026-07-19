import React, { useState } from 'react';
import { Map, CheckCircle2 } from 'lucide-react';

import { GenericMatrixCanvas, type MatrixCellState } from './GenericMatrixCanvas';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '3 Islands', matrix: [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']] },
  { label: '1 Island', matrix: [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']] },
];

const CODE_JAVA = [
  `int numIslands(char[][] grid) {`,
  `    int count = 0;`,
  `    for (int i=0; i<grid.length; i++) {`,
  `        for (int j=0; j<grid[0].length; j++) {`,
  `            if (grid[i][j] == '1') {`,
  `                count++;`,
  `                dfs(grid, i, j);`,
  `            }`,
  `        }`,
  `    }`,
  `    return count;`,
  `}`,
  ``,
  `void dfs(char[][] grid, int r, int c) {`,
  `    if (r<0 || c<0 || r>=grid.length || c>=grid[0].length || grid[r][c]=='0')`,
  `        return;`,
  `    grid[r][c] = '0';`,
  `    dfs(grid, r-1, c);`,
  `    dfs(grid, r+1, c);`,
  `    dfs(grid, r, c-1);`,
  `    dfs(grid, r, c+1);`,
  `}`
];

const CODE_PY = [
  `def numIslands(self, grid):`,
  `    def dfs(r, c):`,
  `        if r<0 or c<0 or r>=len(grid) or c>=len(grid[0]) or grid[r][c]=='0':`,
  `            return`,
  `        grid[r][c] = '0'`,
  `        dfs(r-1, c)`,
  `        dfs(r+1, c)`,
  `        dfs(r, c-1)`,
  `        dfs(r, c+1)`,
  `    `,
  `    count = 0`,
  `    for i in range(len(grid)):`,
  `        for j in range(len(grid[0])):`,
  `            if grid[i][j] == '1':`,
  `                count += 1`,
  `                dfs(i, j)`,
  `    return count`
];

export function NumberOfIslands({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const initialMatrix = EXAMPLES[activeEx].matrix;
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;

  const steps: any[] = [];
  const mData = initialMatrix.map(r => [...r]);
  let islands = 0;

  const getGridSnapshot = (currR: number, currC: number): MatrixCellState[][] => {
    return mData.map((row, r) => 
      row.map((val, c) => {
        const isCurrent = r === currR && c === currC;
        return {
          value: val,
          status: isCurrent ? 'current' : val === '0' ? 'visited' : 'unvisited',
        };
      })
    );
  };

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', islands: 0, dfs: 'No' }, changed: [],
    algo: 1, codeJava: [2], codePy: [11],
    title: `Init`, desc: `m=${m}, n=${n}`,
    logic: `<strong style="color:var(--cyan)">Init:</strong> Initialize <code>count = 0</code>. We will scan the grid looking for '1's.`
  });

  const dfs = (r: number, c: number, depth: number) => {
    steps.push({
      grid: getGridSnapshot(r, c), state: { i: r, j: c, islands, dfs: `Yes (Depth ${depth})` }, changed: [],
      algo: 2, codeJava: [14, 15], codePy: [3,4],
      title: `DFS: Check Bounds`, desc: `dfs(${r}, ${c})`,
      logic: `Checking bounds and value at <code>[${r}][${c}]</code>.`
    });

    if (r < 0 || c < 0 || r >= m || c >= n || mData[r][c] === '0') {
      steps.push({
        grid: getGridSnapshot(r, c), state: { i: r, j: c, islands, dfs: `Return (Depth ${depth})` }, changed: [],
        algo: 2, codeJava: [15], codePy: [4],
        title: `DFS: Return`, desc: `Out of bounds or water.`,
        logic: `Out of bounds or hit water ('0'). <strong style="color:var(--orange)">Return.</strong>`
      });
      return;
    }

    mData[r][c] = '0';
    steps.push({
      grid: getGridSnapshot(r, c), state: { i: r, j: c, islands, dfs: `Sink (Depth ${depth})` }, changed: [],
      algo: 3, codeJava: [16], codePy: [5],
      title: `DFS: Sink Island`, desc: `grid[${r}][${c}] = '0'`,
      logic: `<strong style="color:var(--purple)">Sinking land:</strong> Setting <code>grid[${r}][${c}] = '0'</code> so we don't visit it again.`
    });

    dfs(r - 1, c, depth + 1);
    dfs(r + 1, c, depth + 1);
    dfs(r, c - 1, depth + 1);
    dfs(r, c + 1, depth + 1);
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mData[i][j] === '1') {
        islands++;
        steps.push({
          grid: getGridSnapshot(i, j), state: { i, j, islands, dfs: 'No' }, changed: ['islands'],
          algo: 1, codeJava: [5,6,7], codePy: [14,15,16],
          title: `Found Land`, desc: `grid[${i}][${j}] == '1'`,
          logic: `<strong style="color:var(--green)">Found Land!</strong> Incrementing <code>count = ${islands}</code> and starting DFS to sink the entire island.`
        });
        dfs(i, j, 1);
      } else {
        // Just sweeping, optional to animate every single water cell but good for clarity
      }
    }
  }

  steps.push({
    grid: getGridSnapshot(-1, -1),
    state: { i: '-', j: '-', islands, dfs: 'No' }, changed: [],
    algo: 4, codeJava: [10], codePy: [17],
    title: `Done!`, desc: `All cells scanned. Total islands: ${islands}`,
    logic: `<strong style="color:var(--green)">Done!</strong> Grid fully scanned. Total islands found: <strong>${islands}</strong>.`,
    finalRes: `Islands: ${islands}`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length, 4);
  const cs = steps[step];

  const setMatrix = (idx: number) => {
    setActiveEx(idx);
    reset();
  };

  return (
    <VisualizerLayout>
      <VPHeader title="Number of Islands" lcNum="200" difficulty="Medium" tag="DFS Grid Traversal" onBack={onBack} />
      
      <ProblemStatement 
        statement={<>Given an <code>m x n</code> 2D binary grid which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.</>}
        examples={[
          { label: 'Example 1', input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
        ]}
        constraints={<>Modifies grid in place (sinks islands).</>}
      />

      <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={setMatrix} />

      <VPBody 
        left={
          <>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Map size={20} />} title="Approach" lines={['Scan the grid row by row.', 'When a "1" is found, increment island count.', 'Launch DFS from that "1" to flip all connected "1"s to "0" (sinking the island).']} />
            
            <div className="card matrix-card">
              <div className="card-title">Grid Map</div>
              <div style={{ marginTop: 14 }}>
                <GenericMatrixCanvas matrix={cs.grid} boundaries={{ top: -1, bottom: -1, left: -1, right: -1 }} />
              </div>
            </div>

            <StateGrid items={[
              { label: 'Islands', value: cs.state.islands, changed: cs.changed.includes('islands') },
              { label: 'i / r', value: cs.state.i },
              { label: 'j / c', value: cs.state.j },
              { label: 'In DFS?', value: cs.state.dfs }
            ]} />
            
            <StepLogic html={cs.logic} />
            <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
            <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
          </>
        }
        right={
          <>
            <CodePanel title="Number of Islands" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
            <AlgorithmList 
              activeStep={cs.algo}
              steps={[
                { num: 1, txt: <>Iterate through grid. If <code>grid[i][j] == '1'</code>, increment <code>count</code> and call <code>dfs(i, j)</code>.</> },
                { num: 2, txt: <>DFS: If out of bounds or cell is <code>'0'</code>, return.</> },
                { num: 3, txt: <>DFS: Sink the land by setting <code>grid[r][c] = '0'</code>. Then recursively call DFS on all 4 neighbors.</> },
                { num: 4, txt: <>Return total <code>count</code>.</> },
              ]} 
            />
            <Complexity time="O(m×n)" space="O(m×n) worst case recursion" />
            <WhyItWorks paragraphs={[
              'By sinking the island (changing 1s to 0s) as soon as we discover it, we guarantee that we will never count the same island twice.',
              'The DFS explores all reachable land mass from the initial discovery point, completely obliterating the island from the map.'
            ]} />
          </>
        }
      />
    </VisualizerLayout>
  );
}
