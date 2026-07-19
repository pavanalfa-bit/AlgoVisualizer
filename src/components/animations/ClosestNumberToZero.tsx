import React, { useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: '[-4,-2,1,4,8]', nums: [-4,-2,1,4,8], output: '1' },
  { label: '[2,-1,1]', nums: [2,-1,1], output: '1' },
  { label: '[-100,-100]', nums: [-100,-100], output: '-100' },
];

const CODE_JAVA = [
  `public int findClosestNumber(int[] nums) {`,
  `    int closest = nums[0];`,
  `    for (int num : nums) {`,
  `        int dist = Math.abs(num);`,
  `        int closestDist = Math.abs(closest);`,
  `        `,
  `        if (dist < closestDist || `,
  `           (dist == closestDist && num > closest)) {`,
  `            closest = num;`,
  `        }`,
  `    }`,
  `    return closest;`,
  `}`
];

const CODE_PY = [
  `def findClosestNumber(self, nums):`,
  `    closest = nums[0]`,
  `    for num in nums:`,
  `        dist = abs(num)`,
  `        closest_dist = abs(closest)`,
  `        if dist < closest_dist or (dist == closest_dist and num > closest):`,
  `            closest = num`,
  `    return closest`
];

export function ClosestNumberToZero({ onBack }: { onBack?: () => void }) {
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  // Pre-compute steps
  const steps: any[] = [];
  
  steps.push({
    title: `Initialize`,
    desc: `Set closest = nums[0] = ${nums[0]}\nDistance = ${Math.abs(nums[0])}`,
    codeJava: [2], codePy: [2], algoStep: 1,
    currI: -1, closest: nums[0],
    state: { num: '—', dist: '—', closest: nums[0] },
    logic: `<strong style="color:var(--cyan)">Initialization:</strong> Start by assuming the first element (<code>${nums[0]}</code>) is the closest.`,
    logicClass: 'info'
  });

  let closest = nums[0];

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const dist = Math.abs(num);
    const closestDist = Math.abs(closest);
    
    steps.push({
      title: `i = ${i} (num = ${num})`,
      desc: `Check nums[${i}] = ${num}\nDistance to zero = ${dist}\nCurrent closest = ${closest} (dist: ${closestDist})`,
      codeJava: [3,4,5], codePy: [3,4,5], algoStep: 2,
      currI: i, closest,
      state: { num, dist, closest },
      logic: `Examine <strong>${num}</strong>.<br/>Distance to 0 is <code>abs(${num}) = ${dist}</code>. Current best distance is <code>${closestDist}</code>.`
    });

    if (dist < closestDist) {
      closest = num;
      steps.push({
        title: `Closer distance found!`,
        desc: `${dist} < ${closestDist}\nUpdate closest = ${num}`,
        codeJava: [7,8,9,10], codePy: [6,7], algoStep: 3,
        currI: i, closest,
        state: { num, dist, closest },
        logic: `Distance <strong>${dist}</strong> < <strong>${closestDist}</strong>.<br/>Update closest to <strong style="color:var(--green)">${num}</strong>.`,
        logicClass: 'success'
      });
    } else if (dist === closestDist && num > closest) {
      closest = num;
      steps.push({
        title: `Tie-breaker!`,
        desc: `${dist} == ${closestDist}, but ${num} > ${closest - num}\nUpdate closest = ${num}`,
        codeJava: [7,8,9,10], codePy: [6,7], algoStep: 4,
        currI: i, closest,
        state: { num, dist, closest },
        logic: `Distance is tied (<strong>${dist}</strong>), but <strong>${num}</strong> > <strong>${closest === num ? 'itself' : closest}</strong>.<br/>Update closest to <strong style="color:var(--green)">${num}</strong>.`,
        logicClass: 'success'
      });
    } else {
      steps.push({
        title: `Not closer`,
        desc: `${dist} >= ${closestDist}, and tie-breaker failed.\nKeep closest = ${closest}`,
        codeJava: [7], codePy: [6], algoStep: 2,
        currI: i, closest,
        state: { num, dist, closest },
        logic: `Does not beat the current closest. Moving on.`,
        logicClass: ''
      });
    }
  }

  steps.push({
    title: `Done!`,
    desc: `Result = ${closest}`,
    codeJava: [12], codePy: [8], algoStep: 5,
    currI: -1, closest,
    state: { num: '✓', dist: '✓', closest },
    logic: `<strong style="color:var(--green)">Complete!</strong> The closest number to 0 is <strong>${closest}</strong>.`,
    logicClass: 'success',
    finalRes: `${closest}`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given an integer array <code>nums</code> of size <code>n</code>, return the number with the value closest to <code>0</code> in <code>nums</code>. If there are multiple answers, return the number with the largest value.</>,
    examples: [
      { label: 'Example 1', input: 'nums = [-4,-2,1,4,8]', output: '1', explanation: 'The distance from -4 to 0 is 4.\nThe distance from -2 to 0 is 2.\nThe distance from 1 to 0 is 1.\n1 is the closest.' },
      { label: 'Example 2', input: 'nums = [2,-1,1]', output: '1', explanation: '1 and -1 are both distance 1. Return the larger value (1).' }
    ],
    constraints: <>1 ≤ n ≤ 1000 &nbsp;|&nbsp; -10^5 ≤ nums[i] ≤ 10^5</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Find Closest Number to Zero" 
        lcNum="2239" 
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
                <ApproachBanner icon={<Target size={20} />} title="Approach" lines={['Distance Tracking', 'Iterate through all numbers, checking abs(num). If tied in distance, prefer the positive number.']} />
                
                <div className="card">
                  <div className="card-title">Number Line Visualization</div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {nums.map((num: number, idx: number) => {
                      const isCurr = cs.currI === idx;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 44, height: 44, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1rem',
                              background: isCurr ? 'rgba(78, 205, 196, 0.2)' : 'var(--surface)',
                              borderColor: isCurr ? 'var(--cyan)' : 'var(--border)',
                              color: isCurr ? 'var(--cyan)' : 'var(--text)'
                            }}
                          >
                            {num}
                          </motion.div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div style={{ padding: '16px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '12px' }}>Current Closest Tracking</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--green)' }}>
                      {cs.closest}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Distance: {Math.abs(cs.closest)}
                    </div>
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Current num', value: cs.state.num },
                  { label: 'dist = abs(num)', value: cs.state.dist },
                  { label: 'closest', value: cs.state.closest, changed: cs.logicClass === 'success' }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Closest Number" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Find Closest Number" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Initialize <code>closest = nums[0]</code></> },
                    { num: 2, txt: <>For each <code>num</code>, calculate <code>dist = abs(num)</code></> },
                    { num: 3, txt: <>If <code>dist &lt; abs(closest)</code>, update <code>closest = num</code></> },
                    { num: 4, txt: <>If <code>dist == abs(closest)</code> AND <code>num &gt; closest</code>, update <code>closest = num</code></> },
                    { num: 5, txt: <>Return <code>closest</code></> }
                  ]} 
                />
                <Complexity time="O(n)" space="O(1)" />
                <WhyItWorks paragraphs={[
                  'By iterating exactly once through the array and keeping track of the single best candidate, we solve the problem optimally.',
                  'The secondary condition (tie breaker) handles cases like -1 and 1 elegantly.'
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
          defaultCodeJava={`class Main {
    public static int findClosestNumber(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        int[] nums = {-4,-2,1,4,8};
        System.out.println("Closest to zero: " + findClosestNumber(nums));
    }
}`}
          defaultCodePython={`def findClosestNumber(nums):
    # Write your solution here
    pass

if __name__ == "__main__":
    nums = [-4,-2,1,4,8]
    print(f"Closest to zero: {findClosestNumber(nums)}")`}
        />
      )}
    </VisualizerLayout>
  );
}
