import React, { useState } from 'react';
import { Shuffle, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '[2,5,1,3,4,7]', nums: [2,5,1,3,4,7], output: '[2,3,5,4,1,7]' },
  { label: '[1,2,3,4,4,3,2,1]', nums: [1,2,3,4,4,3,2,1], output: '[1,4,2,3,3,2,4,1]' },
  { label: '[1,1,2,2]', nums: [1,1,2,2], output: '[1,2,1,2]' },
];

const CODE_JAVA = [
  `public int[] shuffle(int[] nums, int n) {`,
  `    int[] ans = new int[2 * n];`,
  `    for (int i = 0; i < n; i++) {`,
  `        ans[2 * i] = nums[i];`,
  `        ans[2 * i + 1] = nums[i + n];`,
  `    }`,
  `    return ans;`,
  `}`
];

const CODE_PY = [
  `def shuffle(self, nums, n):`,
  `    ans = [0] * (2 * n)`,
  `    for i in range(n):`,
  `        ans[2 * i] = nums[i]`,
  `        ans[2 * i + 1] = nums[i + n]`,
  `    return ans`
];

export function ShuffleArray({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const n = nums.length / 2;
  const ansSize = 2 * n;

  // Pre-compute steps
  const steps: any[] = [];
  const ans = new Array(ansSize).fill(null);

  steps.push({
    title: `Initialize`,
    desc: `nums = [${nums.join(', ')}]\nn = ${n}\nCreate ans array of size ${ansSize}`,
    codeJava: [2], codePy: [2], algoStep: 1,
    ansArr: [...ans], currI: -1, state: { i: '—', n: n, x: '—', y: '—' },
    logic: `<strong style="color:var(--cyan)">Initialization:</strong> The array is split into two halves of length ${n}: X elements and Y elements.<br/>We create an empty array <code>ans</code> of size ${ansSize}.`,
    logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    const xVal = nums[i];
    const yVal = nums[i + n];
    
    ans[2 * i] = xVal;
    steps.push({
      title: `i = ${i} (Place x_i)`,
      desc: `x_${i+1} is at nums[${i}] = ${xVal}\nans[${2*i}] = ${xVal}`,
      codeJava: [3, 4], codePy: [3, 4], algoStep: 2,
      ansArr: [...ans], currI: i, isY: false,
      state: { i, n, x: xVal, y: '—' },
      logic: `Place <code>x_${i+1}</code> (from index ${i}) into <code>ans[${2*i}]</code>.<br/>ans[${2*i}] = <strong style="color:var(--cyan)">${xVal}</strong>`
    });

    ans[2 * i + 1] = yVal;
    steps.push({
      title: `i = ${i} (Place y_i)`,
      desc: `y_${i+1} is at nums[${i+n}] = ${yVal}\nans[${2*i+1}] = ${yVal}`,
      codeJava: [3, 5], codePy: [3, 5], algoStep: 3,
      ansArr: [...ans], currI: i, isY: true,
      state: { i, n, x: xVal, y: yVal },
      logic: `Place <code>y_${i+1}</code> (from index ${i+n}) into <code>ans[${2*i+1}]</code>.<br/>ans[${2*i+1}] = <strong style="color:var(--orange)">${yVal}</strong>`,
      logicClass: i === n - 1 ? 'success' : ''
    });
  }

  steps.push({
    title: `Done! Array shuffled.`,
    desc: `Result = [${ans.join(', ')}]`,
    codeJava: [7], codePy: [6], algoStep: 4,
    ansArr: [...ans], currI: -1, state: { i: '✓', n: n, x: '✓', y: '✓' },
    logic: `<strong style="color:var(--green)">Complete!</strong> The array is now successfully shuffled into [x_1, y_1, x_2, y_2...].`,
    logicClass: 'success',
    finalRes: `[${ans.join(', ')}]`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given the array <code>nums</code> consisting of <code>2n</code> elements in the form <code>[x<sub>1</sub>,x<sub>2</sub>,...,x<sub>n</sub>,y<sub>1</sub>,y<sub>2</sub>,...,y<sub>n</sub>]</code>.<br/><br/>Return the array in the form <code>[x<sub>1</sub>,y<sub>1</sub>,x<sub>2</sub>,y<sub>2</sub>,...,x<sub>n</sub>,y<sub>n</sub>]</code>.</>,
    examples: [
      { label: 'Example 1', input: 'nums = [2,5,1,3,4,7], n = 3', output: '[2,3,5,4,1,7]', explanation: 'Since x1=2, x2=5, x3=1, y1=3, y2=4, y3=7 then the answer is [2,3,5,4,1,7].' },
      { label: 'Example 2', input: 'nums = [1,2,3,4,4,3,2,1], n = 4', output: '[1,4,2,3,3,2,4,1]' }
    ],
    constraints: <>1 ≤ n ≤ 500 &nbsp;|&nbsp; nums.length == 2n &nbsp;|&nbsp; 1 ≤ nums[i] ≤ 10^3</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Shuffle the Array" 
        lcNum="1470" 
        difficulty="Easy" 
        tag="Array Basics" 
        onBack={onBack} 
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {tab === 'visualizer' ? (
        <>
          <ProblemStatement {...problemProps} />
          <ExamplePicker examples={EXAMPLES} activeEx={activeEx} onSelect={idx => { setActiveEx(idx); setNums(EXAMPLES[idx].nums); reset(); }} />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                <ApproachBanner icon={<Shuffle size={20} />} title="Approach" lines={['Two Pointers / Index Math', 'Create a new array. For each index i from 0 to n-1, map nums[i] to ans[2i] and nums[i+n] to ans[2i+1].']} />
                
                <div className="card">
                  <div className="card-title">Array Shuffle Visualization</div>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Input: nums[] (size 2n = {2*n})</div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {nums.map((num: number, idx: number) => {
                      const isX = idx < n;
                      const isCurrX = isX && cs.currI === idx;
                      const isCurrY = !isX && cs.currI === (idx - n);
                      
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 44, height: 44, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1rem',
                              background: isCurrX ? 'rgba(78, 205, 196, 0.2)' : isCurrY ? 'rgba(251, 191, 36, 0.2)' : 'var(--surface)',
                              borderColor: isCurrX ? 'var(--cyan)' : isCurrY ? 'var(--orange)' : 'var(--border)',
                              color: isCurrX ? 'var(--cyan)' : isCurrY ? 'var(--orange)' : 'var(--text)'
                            }}
                          >
                            {num}
                          </motion.div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>
                            {isX ? `x${idx+1}` : `y${idx-n+1}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Result: ans[]</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {cs.ansArr.map((val: number | null, idx: number) => {
                      const isNewlyPlacedX = cs.currI !== -1 && !cs.isY && idx === 2 * cs.currI;
                      const isNewlyPlacedY = cs.currI !== -1 && cs.isY && idx === 2 * cs.currI + 1;
                      const isFilled = val !== null;
                      
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 44, height: 44, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1rem',
                              background: isNewlyPlacedX ? 'rgba(78, 205, 196, 0.2)' : isNewlyPlacedY ? 'rgba(251, 191, 36, 0.2)' : (isFilled ? 'var(--surface2)' : 'var(--bg)'),
                              borderColor: isNewlyPlacedX ? 'var(--cyan)' : isNewlyPlacedY ? 'var(--orange)' : (isFilled ? 'var(--border)' : 'var(--border)'),
                              color: isNewlyPlacedX ? 'var(--cyan)' : isNewlyPlacedY ? 'var(--orange)' : (isFilled ? 'var(--text)' : 'var(--muted)')
                            }}
                          >
                            {val !== null ? val : '_'}
                          </motion.div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'n', value: cs.state.n },
                  { label: 'i', value: cs.state.i },
                  { label: 'x (nums[i])', value: cs.state.x },
                  { label: 'y (nums[i+n])', value: cs.state.y }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Shuffled Array" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Shuffle the Array" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Create <code>ans</code> array of size <code>2n</code></> },
                    { num: 2, txt: <>For each <code>i</code>, set <code>ans[2*i] = nums[i]</code> (x elements)</> },
                    { num: 3, txt: <>For each <code>i</code>, set <code>ans[2*i+1] = nums[i+n]</code> (y elements)</> },
                    { num: 4, txt: <>Return the <code>ans</code> array</> }
                  ]} 
                />
                <Complexity time="O(n)" space="O(n)" />
                <WhyItWorks paragraphs={[
                  'By recognizing the mapping of indices, we can interleave the two halves easily.',
                  'The x elements start at index 0 and are spaced by 2: (0, 2, 4...). Thus, ans[2*i] = nums[i].',
                  'The y elements start at index 1 and are spaced by 2: (1, 3, 5...). Thus, ans[2*i+1] = nums[i+n].'
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
    public static int[] shuffle(int[] nums, int n) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {2,5,1,3,4,7};
        int n = 3;
        System.out.println("Output: " + Arrays.toString(shuffle(nums, n)));
    }
}`}
          defaultCodePython={`def shuffle(nums, n):
    # Write your solution here
    pass

if __name__ == "__main__":
    nums = [2,5,1,3,4,7]
    n = 3
    print(f"Output: {shuffle(nums, n)}")`}
        />
      )}
    </VisualizerLayout>
  );
}
