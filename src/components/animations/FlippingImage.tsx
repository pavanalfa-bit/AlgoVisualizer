import React, { useState } from 'react';
import { FlipHorizontal, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'Example 1', matrix: [[1,1,0],[1,0,1],[0,0,0]], output: '[[1,0,0],[0,1,0],[1,1,1]]' },
  { label: 'Example 2', matrix: [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]], output: '[[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]' }
];

const CODE_JAVA = [
  `public int[][] flipAndInvertImage(int[][] image) {`,
  `    int n = image.length;`,
  `    for (int[] row : image) {`,
  `        int left = 0, right = n - 1;`,
  `        while (left <= right) {`,
  `            int temp = row[left] ^ 1;`,
  `            row[left] = row[right] ^ 1;`,
  `            row[right] = temp;`,
  `            left++;`,
  `            right--;`,
  `        }`,
  `    }`,
  `    return image;`,
  `}`
];

const CODE_PY = [
  `def flipAndInvertImage(self, image):`,
  `    for row in image:`,
  `        left, right = 0, len(row) - 1`,
  `        while left <= right:`,
  `            row[left], row[right] = row[right] ^ 1, row[left] ^ 1`,
  `            left += 1`,
  `            right -= 1`,
  `    return image`
];

export function FlippingImage({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [originalMatrix, setOriginalMatrix] = useState(EXAMPLES[0].matrix);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const n = originalMatrix.length;

  // Pre-compute steps
  const steps: any[] = [];
  const matrix = originalMatrix.map((row: number[]) => [...row]);

  steps.push({
    title: `Initialize`,
    desc: `We need to flip each row horizontally, then invert it (0 -> 1, 1 -> 0).`,
    codeJava: [2, 3], codePy: [2], algoStep: 1,
    mat: matrix.map(r => [...r]),
    r: -1, l: -1, rt: -1,
    state: { row: '—', left: '—', right: '—' },
    logic: `<strong style="color:var(--cyan)">Initialization:</strong> Iterate through each row. We can flip and invert simultaneously using two pointers.`,
    logicClass: 'info'
  });

  for (let r = 0; r < n; r++) {
    let left = 0;
    let right = n - 1;
    
    steps.push({
      title: `Row ${r} - Start`,
      desc: `Processing row ${r}\nSet left=0, right=${n-1}`,
      codeJava: [4], codePy: [3], algoStep: 2,
      mat: matrix.map(r => [...r]),
      r, l: left, rt: right,
      state: { row: r, left, right },
      logic: `Start processing row ${r}. Initialized pointers: <code>left = ${left}, right = ${right}</code>.`
    });

    while (left <= right) {
      if (left === right) {
        // Just invert the middle element
        const oldVal = matrix[r][left];
        matrix[r][left] ^= 1;
        steps.push({
          title: `Row ${r} - Middle Element`,
          desc: `left == right == ${left}\nInvert ${oldVal} to ${matrix[r][left]}`,
          codeJava: [6, 7], codePy: [5], algoStep: 3,
          mat: matrix.map(r => [...r]),
          r, l: left, rt: right,
          state: { row: r, left, right },
          logic: `Pointers met at middle element. Just invert it: ${oldVal} → <strong style="color:var(--orange)">${matrix[r][left]}</strong>.`
        });
      } else {
        // Swap and invert
        const oldLeft = matrix[r][left];
        const oldRight = matrix[r][right];
        
        matrix[r][left] = oldRight ^ 1;
        matrix[r][right] = oldLeft ^ 1;
        
        steps.push({
          title: `Row ${r} - Swap & Invert`,
          desc: `left=${left}, right=${right}\nSwap and Invert:\nleft: ${oldLeft} -> ${matrix[r][left]}\nright: ${oldRight} -> ${matrix[r][right]}`,
          codeJava: [6, 7, 8], codePy: [5], algoStep: 3,
          mat: matrix.map(r => [...r]),
          r, l: left, rt: right,
          state: { row: r, left, right },
          logic: `Swap and invert elements at <code>left</code> and <code>right</code>.<br/>left becomes <strong style="color:var(--cyan)">${matrix[r][left]}</strong>, right becomes <strong style="color:var(--orange)">${matrix[r][right]}</strong>.`
        });
      }
      left++;
      right--;
    }
  }

  steps.push({
    title: `Done!`,
    desc: `All rows flipped and inverted.`,
    codeJava: [13], codePy: [8], algoStep: 4,
    mat: matrix.map(r => [...r]),
    r: -1, l: -1, rt: -1,
    state: { row: '✓', left: '✓', right: '✓' },
    logic: `<strong style="color:var(--green)">Complete!</strong> The matrix has been successfully modified in-place.`,
    logicClass: 'success',
    finalRes: JSON.stringify(matrix)
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given an <code>n x n</code> binary matrix <code>image</code>, flip the image horizontally, then invert it, and return the resulting image.<br/><br/>To flip an image horizontally means that each row of the image is reversed. To invert an image means that each 0 is replaced by 1, and each 1 is replaced by 0.</>,
    examples: [
      { label: 'Example 1', input: 'image = [[1,1,0],[1,0,1],[0,0,0]]', output: '[[1,0,0],[0,1,0],[1,1,1]]', explanation: 'First reverse each row: [[0,1,1],[1,0,1],[0,0,0]].\nThen, invert the image: [[1,0,0],[0,1,0],[1,1,1]].' }
    ],
    constraints: <>n == image.length | n == image[i].length | 1 ≤ n ≤ 20 | image[i][j] is either 0 or 1.</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Flipping an Image" 
        lcNum="832" 
        difficulty="Easy" 
        tag="Array Basics" 
        onBack={onBack} 
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {tab === 'visualizer' ? (
        <>
          <ProblemStatement {...problemProps} />
          <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={idx => { setActiveEx(idx); setOriginalMatrix(EXAMPLES[idx].matrix); reset(); }} />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                <ApproachBanner icon={<FlipHorizontal size={20} />} title="Approach" lines={['Two Pointers per Row', 'For each row, use left and right pointers to simultaneously swap and invert (XOR 1) the elements.']} />
                
                <div className="card">
                  <div className="card-title">Image Matrix</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
                    {cs.mat.map((row: number[], rIdx: number) => {
                      const isCurrRow = cs.r === rIdx;
                      return (
                        <div key={rIdx} style={{ display: 'flex', gap: '8px', padding: '8px', background: isCurrRow ? 'rgba(78, 205, 196, 0.05)' : 'transparent', borderRadius: '8px', border: isCurrRow ? '1px solid var(--cyan)' : '1px solid transparent' }}>
                          {row.map((val: number, cIdx: number) => {
                            const isL = isCurrRow && cs.l === cIdx;
                            const isR = isCurrRow && cs.rt === cIdx;
                            const isBoth = isL && isR;
                            
                            return (
                              <div key={cIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <motion.div 
                                  layout
                                  style={{
                                    width: 44, height: 44, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid', borderRadius: '6px',
                                    fontWeight: 'bold', fontSize: '1rem',
                                    background: isBoth ? 'rgba(251, 191, 36, 0.3)' : isL ? 'rgba(78, 205, 196, 0.2)' : isR ? 'rgba(251, 191, 36, 0.2)' : 'var(--surface)',
                                    borderColor: isBoth ? 'var(--orange)' : isL ? 'var(--cyan)' : isR ? 'var(--orange)' : 'var(--border)',
                                    color: val === 1 ? 'var(--green)' : 'var(--muted)'
                                  }}
                                >
                                  {val}
                                </motion.div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '4px', height: '12px' }}>
                                  {isL && !isBoth && 'left'}
                                  {isR && !isBoth && 'right'}
                                  {isBoth && 'l=r'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Current Row', value: cs.state.row },
                  { label: 'left ptr', value: cs.state.left },
                  { label: 'right ptr', value: cs.state.right }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Output Matrix" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Flipping an Image" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Iterate over each <code>row</code> in the matrix</> },
                    { num: 2, txt: <>Set <code>left=0, right=n-1</code></> },
                    { num: 3, txt: <>While <code>left &lt;= right</code>, swap and invert <code>row[left]</code> and <code>row[right]</code></> },
                    { num: 4, txt: <>Return modified matrix</> }
                  ]} 
                />
                <Complexity time="O(n²)" space="O(1)" />
                <WhyItWorks paragraphs={[
                  'By processing elements from the outside in using two pointers, we can both reverse the row and invert the bits in a single pass.',
                  'Inversion is efficiently done using XOR 1 (num ^ 1).'
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
          defaultCodeJava={`import java.util.Arrays;

class Main {
    public static int[][] flipAndInvertImage(int[][] image) {
        // Write your solution here
        return image;
    }

    public static void main(String[] args) {
        int[][] image = {{1,1,0},{1,0,1},{0,0,0}};
        int[][] result = flipAndInvertImage(image);
        System.out.println("Output:");
        for (int[] row : result) {
            System.out.println(Arrays.toString(row));
        }
    }
}`}
          defaultCodePython={`def flipAndInvertImage(image):
    # Write your solution here
    pass

if __name__ == "__main__":
    image = [[1,1,0],[1,0,1],[0,0,0]]
    res = flipAndInvertImage(image)
    print("Output:")
    for row in res:
        print(row)`}
        />
      )}
    </VisualizerLayout>
  );
}
