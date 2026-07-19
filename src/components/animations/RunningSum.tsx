import React, { useState } from 'react';
import { PlusSquare, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '[1,2,3,4]', nums: [1,2,3,4], output: '[1,3,6,10]' },
  { label: '[1,1,1,1]', nums: [1,1,1,1], output: '[1,2,3,4]' },
  { label: '[3,1,2,10,1]', nums: [3,1,2,10,1], output: '[3,4,6,16,17]' },
];

const CODE_JAVA = [
  `public int[] runningSum(int[] nums) {`,
  `    for (int i = 1; i < nums.length; i++) {`,
  `        // Add previous sum to current element`,
  `        nums[i] = nums[i - 1] + nums[i];`,
  `    }`,
  `    return nums;`,
  `}`
];

const CODE_PY = [
  `def runningSum(self, nums):`,
  `    for i in range(1, len(nums)):`,
  `        # Add previous sum to current element`,
  `        nums[i] += nums[i - 1]`,
  `    return nums`
];

export function RunningSum({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const n = nums.length;

  // Pre-compute steps
  const steps: any[] = [];
  const ans = [...nums];

  steps.push({
    title: `Initialize`,
    desc: `Input array nums = [${nums.join(', ')}]\nStart from index 1. Index 0 is already its own running sum.`,
    codeJava: [2], codePy: [2], algoStep: 1,
    ansArr: [...ans],
    currI: 0, prevI: -1,
    state: { i: '—', val: '—', prevSum: '—' },
    logic: `<strong style="color:var(--cyan)">Initialization:</strong> The first element (<code>${ans[0]}</code>) is already its running sum. We start iterating from <code>i = 1</code>.`,
    logicClass: 'info'
  });

  for (let i = 1; i < n; i++) {
    const prevSum = ans[i - 1];
    const currVal = ans[i];
    ans[i] = prevSum + currVal;
    
    steps.push({
      title: `i = ${i}: add nums[${i-1}] to nums[${i}]`,
      desc: `i = ${i}\nPrevious sum = ${prevSum}\nCurrent value = ${currVal}\nNew sum = ${prevSum} + ${currVal} = ${ans[i]}`,
      codeJava: [3, 4], codePy: [3, 4], algoStep: 2,
      currI: i, prevI: i - 1,
      ansArr: [...ans],
      state: { i, val: currVal, prevSum: prevSum },
      logic: `At <code>i = ${i}</code>: Add previous running sum (<strong>${prevSum}</strong>) to current element (<strong>${currVal}</strong>).<br/>New value = <strong style="color:var(--green)">${ans[i]}</strong>`,
      logicClass: i === n - 1 ? 'success' : ''
    });
  }

  steps.push({
    title: `Done! Running sum computed.`,
    desc: `All running sums computed in-place.\nResult = [${ans.join(', ')}]`,
    codeJava: [6], codePy: [5], algoStep: 3,
    currI: -1, prevI: -1,
    ansArr: [...ans],
    state: { i: '✓', val: '✓', prevSum: '✓' },
    logic: `<strong style="color:var(--green)">Complete!</strong> We modified the array in-place to store running sums.`,
    logicClass: 'success',
    finalRes: `[${ans.join(', ')}]`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given an array <code>nums</code>. We define a running sum of an array as <code>runningSum[i] = sum(nums[0]…nums[i])</code>. Return the running sum of <code>nums</code>.</>,
    examples: [
      { label: 'Example 1', input: 'nums = [1,2,3,4]', output: '[1,3,6,10]', explanation: 'Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].' },
      { label: 'Example 2', input: 'nums = [1,1,1,1,1]', output: '[1,2,3,4,5]' }
    ],
    constraints: <>1 ≤ nums.length ≤ 1000 &nbsp;|&nbsp; -10^6 ≤ nums[i] ≤ 10^6</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Running Sum of 1D Array" 
        lcNum="1480" 
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
                <ApproachBanner icon={<PlusSquare size={20} />} title="Approach" lines={['In-place Prefix Sum Calculation', 'Iterate from i = 1 to n-1. Add nums[i-1] (which holds the running sum up to i-1) to nums[i].']} />
                
                <div className="card">
                  <div className="card-title">Array Visualization (In-place)</div>
                  
                  <div style={{ display: 'flex', gap: '4px', marginTop: '24px', marginBottom: '24px' }}>
                    {cs.ansArr.map((num: number, idx: number) => {
                      const isCurr = cs.currI === idx;
                      const isPrev = cs.prevI === idx;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 48, height: 48, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1.1rem',
                              background: isCurr ? 'rgba(78, 205, 196, 0.15)' : isPrev ? 'rgba(251, 191, 36, 0.15)' : 'var(--surface)',
                              borderColor: isCurr ? 'var(--cyan)' : isPrev ? 'var(--medium)' : 'var(--border)',
                              color: isCurr ? 'var(--cyan)' : isPrev ? 'var(--medium)' : 'var(--text)'
                            }}
                          >
                            {num}
                          </motion.div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '24px' }}>
                            <span>{idx}</span>
                            {isCurr && <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>curr</span>}
                            {isPrev && <span style={{ color: 'var(--medium)', fontWeight: 'bold' }}>prev sum</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Index i', value: cs.state.i },
                  { label: 'prevSum (nums[i-1])', value: cs.state.prevSum },
                  { label: 'curr (nums[i])', value: cs.state.val }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Running Sum Array" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Running Sum" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Start loop from <code>i = 1</code> since index 0 is already its own sum</> },
                    { num: 2, txt: <>Add previous running sum <code>nums[i-1]</code> to current element <code>nums[i]</code></> },
                    { num: 3, txt: <>Return modified array <code>nums</code></> }
                  ]} 
                />
                <Complexity time="O(n)" space="O(1)" />
                <WhyItWorks paragraphs={[
                  'By modifying the input array in-place, we achieve O(1) auxiliary space complexity.',
                  'When we are at index i, nums[i-1] has already been updated to contain the running sum of all elements from index 0 to i-1. Thus, adding nums[i-1] to nums[i] gives us the running sum up to index i.'
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
    public static int[] runningSum(int[] nums) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4};
        System.out.println("Output: " + Arrays.toString(runningSum(nums)));
    }
}`}
          defaultCodePython={`def runningSum(nums):
    # Write your solution here
    pass

if __name__ == "__main__":
    nums = [1, 2, 3, 4]
    print(f"Output: {runningSum(nums)}")`}
        />
      )}
    </VisualizerLayout>
  );
}
