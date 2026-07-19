import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '[1,2,1]', nums: [1,2,1], output: '[1,2,1,1,2,1]' },
  { label: '[1,3,2,1]', nums: [1,3,2,1], output: '[1,3,2,1,1,3,2,1]' },
  { label: '[1,2,3,4,5]', nums: [1,2,3,4,5], output: '[1,2,3,4,5,1,2,3,4,5]' },
];

const CODE_JAVA = [
  `public int[] getConcatenation(int[] nums) {`,
  `    int n = nums.length;`,
  `    int[] ans = new int[2 * n];`,
  `    for (int i = 0; i < n; i++) {`,
  `        ans[i]     = nums[i];`,
  `        ans[i + n] = nums[i];`,
  `    }`,
  `    return ans;`,
  `}`
];

const CODE_PY = [
  `def getConcatenation(self, nums):`,
  `    n = len(nums)`,
  `    ans = [0] * (2 * n)`,
  `    for i in range(n):`,
  `        ans[i] = nums[i]`,
  `        ans[i + n] = nums[i]`,
  `    return ans`
];

export function ConcatenationOfArray({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const n = nums.length;
  const ansSize = 2 * n;

  // Pre-compute steps
  const steps: any[] = [];
  const ans = new Array(ansSize).fill(null);

  steps.push({
    showApproach: true,
    title: `nums=[${nums}]  n=${n}  — create ans[${ansSize}]`,
    desc: `nums = [${nums.join(', ')}]  (n=${n})\nCreate result array of size 2*n = ${ansSize}\nFor each i: ans[i] = nums[i]  AND  ans[i+n] = nums[i]`,
    codeJava: [2, 3], codePy: [2, 3], algoStep: 1,
    ansArr: [...ans],
    state: { i: '—', v: '—', ai: '—', ain: '—' },
    logic: `<strong style="color:var(--cyan)">Init:</strong> nums has ${n} elements. We create ans of size 2×${n} = ${ansSize}.<br/>Every slot starts empty. We'll fill two positions per iteration.`,
    logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    ans[i] = nums[i];
    ans[i + n] = nums[i];
    steps.push({
      showApproach: false,
      title: `i=${i}: ans[${i}]=${nums[i]}  ans[${i+n}]=${nums[i]}`,
      desc: `i = ${i}   nums[${i}] = ${nums[i]}\nans[${i}] = ${nums[i]}  ← first copy\nans[${i+n}] = ${nums[i]}  ← second copy`,
      codeJava: [4, 5, 6], codePy: [4, 5, 6], algoStep: i === 0 ? 2 : 3,
      currI: i,
      ansArr: [...ans],
      state: { i, v: nums[i], ai: nums[i], ain: nums[i] },
      logic: `nums[<code>${i}</code>] = <strong style="color:var(--cyan)">${nums[i]}</strong><br/>→ Write to ans[${i}] (first half) and ans[${i+n}] (second half).<br/>${i === n - 1 ? '<strong style="color:var(--green)">Last element — done!</strong>' : ''}`,
      logicClass: i === n - 1 ? 'success' : ''
    });
  }

  steps.push({
    showApproach: false,
    title: `Done! ans = [${ans.join(', ')}]`,
    desc: `All ${n} elements copied to both halves.`,
    codeJava: [8], codePy: [7], algoStep: 4,
    currI: -1,
    ansArr: [...ans],
    state: { i: '✓', v: '✓', ai: '✓', ain: '✓' },
    logic: `<strong style="color:var(--green)">Complete!</strong> All elements copied twice. ans = [${ans.join(', ')}]`,
    logicClass: 'success',
    finalRes: `[${ans.join(', ')}]`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given an integer array <code>nums</code> of length <code>n</code>, create an array <code>ans</code> of length <code>2n</code> where <code>ans[i] == nums[i]</code> and <code>ans[i+n] == nums[i]</code> for all <code>0 ≤ i &lt; n</code>. Return <code>ans</code>.</>,
    examples: [
      { label: 'Example 1', input: 'nums = [1,2,1]', output: '[1,2,1,1,2,1]', explanation: 'ans = nums + nums.' },
      { label: 'Example 2', input: 'nums = [1,3,2,1]', output: '[1,3,2,1,1,3,2,1]', explanation: 'ans = nums + nums.' }
    ],
    constraints: <>1 ≤ n ≤ 1000 &nbsp;|&nbsp; 1 ≤ nums[i] ≤ 1000</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Concatenation of Array" 
        lcNum="1929" 
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
                {cs.showApproach && <ApproachBanner icon={<Copy size={20} />} title="Approach" lines={['Index Mapping — Copy Each Element Twice', 'Create ans[2n]. For each index i: set ans[i] = nums[i] and ans[i+n] = nums[i].']} />}
                
                <div className="card">
                  <div className="card-title">Array Visualization</div>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Input: nums[]</div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                    {nums.map((num: number, idx: number) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <motion.div 
                          layout
                          style={{
                            width: 48, height: 48, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid', borderRadius: '8px',
                            fontWeight: 'bold', fontSize: '1.1rem',
                            background: cs.currI === idx ? '#0e3d55' : 'var(--surface)',
                            borderColor: cs.currI === idx ? 'var(--cyan)' : 'var(--border)',
                            color: cs.currI === idx ? 'var(--cyan)' : 'var(--text)'
                          }}
                        >
                          {num}
                        </motion.div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Result: ans[] (size 2n)</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {cs.ansArr.map((val: number | null, idx: number) => {
                      const isHighlighted = cs.currI !== undefined && cs.currI !== -1 && (idx === cs.currI || idx === cs.currI + n);
                      const isFilled = val !== null;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 48, height: 48, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1.1rem',
                              background: isHighlighted ? 'rgba(78, 205, 196, 0.1)' : (isFilled ? 'var(--grn-bg)' : 'var(--bg)'),
                              borderColor: isHighlighted ? 'var(--cyan)' : (isFilled ? 'var(--green)' : 'var(--border)'),
                              color: isHighlighted ? 'var(--cyan)' : (isFilled ? 'var(--green)' : 'var(--muted)')
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
                  { label: 'Index i', value: cs.state.i },
                  { label: 'nums[i]', value: cs.state.v },
                  { label: 'ans[i]', value: cs.state.ai },
                  { label: 'ans[i+n]', value: cs.state.ain }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Concatenation of Array" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Get n = nums.length; create <code>ans[2*n]</code></> },
                    { num: 2, txt: <>For each i: copy <code>nums[i]</code> → <code>ans[i]</code> (first half)</> },
                    { num: 3, txt: <>Also copy <code>nums[i]</code> → <code>ans[i+n]</code> (second half)</> },
                    { num: 4, txt: <>Return ans — the concatenated array</> }
                  ]} 
                />
                <Complexity time="O(n)" space="O(n)" />
                <WhyItWorks paragraphs={[
                  'The result is simply nums repeated twice. We write each element to its original position i and also to position i+n (offset by the array length).',
                  'This can be done in a single pass without extra logic.'
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
    public static int[] getConcatenation(int[] nums) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 1};
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + Arrays.toString(getConcatenation(nums)));
    }
}`}
          defaultCodePython={`def getConcatenation(nums):
    # Write your solution here
    pass

if __name__ == "__main__":
    nums = [1, 2, 1]
    print(f"Input: {nums}")
    print(f"Output: {getConcatenation(nums)}")`}
        />
      )}
    </VisualizerLayout>
  );
}
