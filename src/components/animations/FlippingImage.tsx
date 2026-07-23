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
  { label: 'image = [[1,1,0],[1,0,1],[0,0,0]]', input: 'image = [[1,1,0],[1,0,1],[0,0,0]]', matrix: [[1,1,0],[1,0,1],[0,0,0]], output: '[[1,0,0],[0,1,0],[1,1,1]]', explanation: <></> },
  { label: 'image = [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]', input: 'image = [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]', matrix: [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]], output: '[[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]', explanation: <></> }
];

const EDGE_CASES = [
  "image = [[1,1],[0,0]]",
  "image = [[0,0,0],[0,0,0],[0,0,0]]",
  "image = [[1]]"
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
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [originalMatrix, setOriginalMatrix] = useState(EXAMPLES[0].matrix);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('image = ')) clean = val.substring(8);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0 || !Array.isArray(parsed[0])) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}image = ${JSON.stringify(parsed)}`;
      const res = parsed.map((row: number[]) => {
        const newRow = [...row].reverse();
        return newRow.map(x => x ^ 1);
      });
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        matrix: parsed,
        output: JSON.stringify(res),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setOriginalMatrix(parsed);
      reset();
    } catch (e) {
      alert("Invalid format! Please use: image = [[1,1,0],[1,0,1],[0,0,0]]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('image = ')) clean = clean.substring(8);
    
    if (lang === 'java') {
      let javaArr = clean.replace(/\[/g, '{').replace(/\]/g, '}');
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[][] image = new int[][]{${javaArr}};\n        int[][] res = flipAndInvertImage(image);\n        for (int[] row : res) {\n            System.out.println(java.util.Arrays.toString(row));\n        }\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    image = ${clean}\n    res = Solution().flipAndInvertImage(image)\n    print(res)`);
    }
  };

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
          <ProblemStatement {...problemProps} examples={examples} />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { 
              setActiveEx(idx); 
              let pr = examples[idx].input;
              if (pr.startsWith('✨ ')) pr = pr.substring(3);
              if (pr.startsWith('image = ')) pr = pr.substring(8);
              const inputArr = examples[idx].matrix || JSON.parse(pr);
              setOriginalMatrix(inputArr); 
              reset(); 
            }} 
            onCustomInput={handleCustomInput}
            onGenerateEdgeCase={async () => {
              await new Promise(r => setTimeout(r, 1000));
              return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
            }}
          />

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
                                    background: isBoth ? 'var(--viz-yellow-bg)' : isL ? 'var(--viz-sky-bg)' : isR ? 'var(--viz-yellow-bg)' : 'var(--surface)',
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
          examples={examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`import java.util.Arrays;\n\nclass Main {\n    public static int[][] flipAndInvertImage(int[][] image) {\n        // Write your solution here\n        return image;\n    }\n\n    public static void main(String[] args) {\n        int[][] image = {{1,1,0},{1,0,1},{0,0,0}};\n        int[][] result = flipAndInvertImage(image);\n        System.out.println("Output:");\n        for (int[] row : result) {\n            System.out.println(Arrays.toString(row));\n        }\n    }\n}`}
          defaultCodePython={`class Solution:\n    def flipAndInvertImage(self, image):\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    image = [[1,1,0],[1,0,1],[0,0,0]]\n    res = Solution().flipAndInvertImage(image)\n    print("Output:", res)`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('image = ')) pr = pr.substring(8);
                const inputArr = examples[idx].matrix || JSON.parse(pr);
                setOriginalMatrix(inputArr); 
                reset(); 
              }} 
              onCustomInput={handleCustomInput}
              onGenerateEdgeCase={async () => {
                await new Promise(r => setTimeout(r, 1000));
                return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
              }}
            />
          }
          activeExampleStr={examples[activeEx].label}
          codeInjector={injectCode}
        />
      )}
    </VisualizerLayout>
  );
}
