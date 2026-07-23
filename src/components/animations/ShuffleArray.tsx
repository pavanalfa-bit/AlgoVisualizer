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
  { label: 'nums = [2,5,1,3,4,7]', input: 'nums = [2,5,1,3,4,7]', nums: [2,5,1,3,4,7], output: '[2,3,5,4,1,7]', explanation: <></> },
  { label: 'nums = [1,2,3,4,4,3,2,1]', input: 'nums = [1,2,3,4,4,3,2,1]', nums: [1,2,3,4,4,3,2,1], output: '[1,4,2,3,3,2,4,1]', explanation: <></> },
  { label: 'nums = [1,1,2,2]', input: 'nums = [1,1,2,2]', nums: [1,1,2,2], output: '[1,2,1,2]', explanation: <></> },
];

const EDGE_CASES = [
  "nums = [1000, 1000, 1000, 1000]",
  "nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
  "nums = [-1, -2, -3, -4]"
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
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length % 2 !== 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      const n = parsed.length / 2;
      const res = new Array(2 * n);
      for (let i = 0; i < n; i++) {
        res[2*i] = parsed[i];
        res[2*i+1] = parsed[i+n];
      }
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        nums: parsed,
        output: `[${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [1,2,3,4] (Must be even length)");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int n = nums.length / 2;\n        int[] res = shuffle(nums, n);\n        System.out.println(java.util.Arrays.toString(res));\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    n = len(nums) // 2\n    res = Solution().shuffle(nums, n)\n    print(res)`);
    }
  };

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
          <ProblemStatement {...problemProps} examples={examples} />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { 
              setActiveEx(idx); 
              let pr = examples[idx].input;
              if (pr.startsWith('✨ ')) pr = pr.substring(3);
              if (pr.startsWith('nums = ')) pr = pr.substring(7);
              const inputArr = examples[idx].nums || JSON.parse(pr);
              setNums(inputArr); 
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
                              background: isCurrX ? 'var(--viz-sky-bg)' : isCurrY ? 'var(--viz-yellow-bg)' : 'var(--surface)',
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
                              background: isNewlyPlacedX ? 'var(--viz-sky-bg)' : isNewlyPlacedY ? 'var(--viz-yellow-bg)' : (isFilled ? 'var(--surface2)' : 'var(--bg)'),
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
          examples={examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`import java.util.Arrays;\n\nclass Main {\n    public static int[] shuffle(int[] nums, int n) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {2,5,1,3,4,7};\n        int n = 3;\n        System.out.println("Output: " + Arrays.toString(shuffle(nums, n)));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def shuffle(self, nums, n):\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    nums = [2,5,1,3,4,7]\n    n = 3\n    print(f"Output: {Solution().shuffle(nums, n)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('nums = ')) pr = pr.substring(7);
                const inputArr = examples[idx].nums || JSON.parse(pr);
                setNums(inputArr); 
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
