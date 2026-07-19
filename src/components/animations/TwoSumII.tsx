import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a <strong>1-indexed</strong> array of integers <code>numbers</code> that is already <strong>sorted in non-decreasing order</strong>, find two numbers such that they add up to a specific <code>target</code> number. Let these two numbers be <code>numbers[index1]</code> and <code>numbers[index2]</code> where <code>1 &lt;= index1 &lt; index2 &lt;= numbers.length</code>.</p>
    <p>Return the indices of the two numbers, <code>index1</code> and <code>index2</code>, <strong>added by one</strong> as an integer array <code>[index1, index2]</code> of length 2.</p>
    <p>The tests are generated such that there is <strong>exactly one solution</strong>. You <strong>may not</strong> use the same element twice.</p>
    <p>Your solution must use only constant extra space.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'numbers = [2,7,11,15], target = 9', 
    output: '[1,2]',
    explanation: <>The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].</>
  },
  { 
    label: 'Example 2', 
    input: 'numbers = [2,3,4], target = 6', 
    output: '[1,3]',
    explanation: <>The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].</>
  },
  { 
    label: 'Example 3', 
    input: 'numbers = [-1,0], target = -1', 
    output: '[1,2]',
    explanation: <>The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>2 &lt;= numbers.length &lt;= 3 * 10⁴</code></div>
    <div><code>-1000 &lt;= numbers[i] &lt;= 1000</code></div>
    <div><code>numbers</code> is sorted in <strong>non-decreasing order</strong>.</div>
    <div><code>-1000 &lt;= target &lt;= 1000</code></div>
    <div>The tests are generated such that there is <strong>exactly one solution</strong>.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int[] twoSum(int[] numbers, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def twoSum(self, numbers, target):\n        # Write your code here\n        pass`;

export default function TwoSumII({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const timeline = [
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 3, res: null,
      desc: "Initialize left pointer `l` at the start, right pointer `r` at the end.",
      activeLines: [2, 3],
      logic: '<strong>Init:</strong> Set `l = 0` (smallest) and `r = 3` (largest).', logicClass: 'info', activeStep: 1
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 3, res: null,
      desc: "Sum = 2 + 15 = 17. 17 > target (9). Since the array is sorted, to get a smaller sum we must move the right pointer left.",
      activeLines: [5, 9, 10],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">15</strong> = 17.<br/>17 > 9, so move `r` left to decrease sum.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 2, res: null,
      desc: "Sum = 2 + 11 = 13. 13 > target (9). Still too large, move `r` left again.",
      activeLines: [5, 9, 10],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">11</strong> = 13.<br/>13 > 9, so move `r` left to decrease sum.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 1, res: null,
      desc: "Sum = 2 + 7 = 9. 9 == target (9). We found our pair!",
      activeLines: [5, 6],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">7</strong> = 9.<br/>9 == 9, we found our pair!', logicClass: 'success', activeStep: 3
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 1, res: [1, 2],
      desc: "Return the 1-based indices: [l + 1, r + 1] -> [1, 2].",
      activeLines: [7],
      logic: '<strong style="color:var(--green)">Success!</strong> Return 1-based indices [1, 2].', logicClass: 'success', activeStep: 3
    }
  ];

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(timeline.length);
  const current = timeline[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Two Sum II - Input Array Is Sorted" lcNum="167" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={EXAMPLES}
          constraints={CONSTRAINTS}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
        />
      </VisualizerLayout>
    );
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Two Sum II - Input Array Is Sorted" lcNum="167" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={timeline.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Search size={20} />} title="Two Pointers (Outside In)"
              lines={["Since the array is sorted, we can adjust our sum by moving pointers.", "If sum > target, move right pointer left (to decrease sum). If sum < target, move left pointer right (to increase sum)."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays & Pointers
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>numbers array (sorted)</div>
                <div style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Target: {current.target}
                </div>
              </div>
              <div className="arr-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="arr-row">
                  {current.nums.map((val, i) => {
                    let c = '';
                    if (current.res && (current.l === i || current.r === i)) c = 'done';
                    else if (current.l === i) c = 'l';
                    else if (current.r === i) c = 'r';
                    else if (i < current.l || i > current.r) c = 'visited';
                    else c = 'empty';
                    return (
                      <motion.div key={i} layout className={`arr-cell ${c}`}>
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="idx-row" style={{ justifyContent: 'center' }}>
                {current.nums.map((_, i) => <div key={i} className="idx-cell">{i+1}</div>)}
              </div>
              <div className="ptr-row" style={{ justifyContent: 'center' }}>
                {current.nums.map((_, i) => {
                  let lbl = ''; let c = '';
                  if (current.res && (current.l === i || current.r === i)) { lbl = current.l === i ? 'l' : 'r'; c = 'green'; }
                  else if (current.l === i && step < timeline.length - 1) { lbl = 'l'; c = 'pink'; }
                  else if (current.r === i && step < timeline.length - 1) { lbl = 'r'; c = 'sky'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                <div style={{ 
                  background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)',
                  fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <span>Sum:</span>
                  <span style={{ color: current.res ? '#10b981' : 'var(--text)' }}>
                    {current.nums[current.l]} + {current.nums[current.r]} = {current.nums[current.l] + current.nums[current.r]}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">l (left ptr)</div>
                  <div className="st-val">{current.l}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">r (right ptr)</div>
                  <div className="st-val">{current.r}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Sum</div>
                  <div className="st-val">{current.nums[current.l] + current.nums[current.r]}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Searching"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Two Sum II"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int[] twoSum(int[] numbers, int target) {",
                "    int l = 0;",
                "    int r = numbers.length - 1;",
                "    while (l < r) {",
                "        int sum = numbers[l] + numbers[r];",
                "        if (sum == target) {",
                "            return new int[]{l + 1, r + 1};",
                "        } else if (sum < target) {",
                "            l++;",
                "        } else {",
                "            r--;",
                "        }",
                "    }",
                "    return new int[]{};",
                "}"
              ]}
              pythonCode={[
                "def twoSum(numbers, target):",
                "    l, r = 0, len(numbers) - 1",
                "    while l < r:",
                "        s = numbers[l] + numbers[r]",
                "        if s == target:",
                "            return [l + 1, r + 1]",
                "        elif s < target:",
                "            l += 1",
                "        else:",
                "            r -= 1",
                "    return []"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Place a pointer at the beginning (l) and end (r) of the sorted array." },
                { num: 2, txt: "Calculate the sum of elements at l and r." },
                { num: 3, txt: "If sum == target, return indices. If sum < target, increment l. If sum > target, decrement r." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Because the array is <strong>sorted</strong>, the elements increase as we move from left to right.</>,
              <>If our current sum is too large, the only way to decrease it is by moving the right pointer to the left (picking a smaller number). If the sum is too small, we must move the left pointer to the right (picking a larger number).</>,
              <>This greedy strategy guarantees we will find the target sum in a single pass without evaluating every possible pair.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
