import React, { useState } from 'react';
import { Sigma, CheckCircle2, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return the only number in the range that is missing from the array.</p>
    <p><em>Follow up: Could you implement a solution using only <code>O(1)</code> extra space complexity and <code>O(n)</code> runtime complexity?</em></p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [3,0,1]', 
    output: '2',
    explanation: <>n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [0,1]', 
    output: '2',
    explanation: <>n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [9,6,4,2,3,5,7,0,1]', 
    output: '8'
  }
];

const CONSTRAINTS = (
  <>
    <div><code>n == nums.length</code></div>
    <div><code>1 &lt;= n &lt;= 10⁴</code></div>
    <div><code>0 &lt;= nums[i] &lt;= n</code></div>
    <div>All the numbers of <code>nums</code> are <strong>unique</strong>.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int missingNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [3, 0, 1];
const N = NUMS.length;
const EXPECTED_SUM = (N * (N + 1)) / 2;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  timeline.push({
    expectedSum: 0, actualSum: 0, i: -1, phase: 'init', returned: null,
    activeLines: [2, 3], activeStep: 1,
    desc: `Initialize n = ${N}. Calculate the expected sum of numbers from 0 to ${N} using the formula: n * (n + 1) / 2.`,
    logic: `<strong>Init:</strong> expectedSum = ${N} * ${N + 1} / 2 = ${EXPECTED_SUM}`, logicClass: 'info'
  });

  let actualSum = 0;
  
  for (let i = 0; i < N; i++) {
    timeline.push({
      expectedSum: EXPECTED_SUM, actualSum, i, phase: 'loop_val', returned: null,
      activeLines: [5], activeStep: 2,
      desc: `Look at nums[${i}] = ${NUMS[i]}. Add it to the actual sum.`,
      logic: `Add <strong style="color:var(--sky)">${NUMS[i]}</strong> to actualSum`, logicClass: 'info'
    });
    
    actualSum += NUMS[i];
    
    timeline.push({
      expectedSum: EXPECTED_SUM, actualSum, i, phase: 'loop_add', returned: null,
      activeLines: [6], activeStep: 3,
      desc: `actualSum is now ${actualSum}.`,
      logic: `actualSum = <strong style="color:var(--sky)">${actualSum}</strong>`, logicClass: 'success'
    });
  }

  const missing = EXPECTED_SUM - actualSum;
  timeline.push({
    expectedSum: EXPECTED_SUM, actualSum, i: N, phase: 'done', returned: missing,
    activeLines: [8], activeStep: 4,
    desc: `Loop complete. The missing number is simply the expected sum minus the actual sum: ${EXPECTED_SUM} - ${actualSum} = ${missing}.`,
    logic: `Return <strong style="color:var(--green)">${EXPECTED_SUM} - ${actualSum} = ${missing}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function MissingNumber({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Missing Number" lcNum="268" difficulty="Easy" tag="Math" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Missing Number" lcNum="268" difficulty="Easy" tag="Math" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Calculator size={20} />} title="Gauss's Sum Formula"
              lines={["Instead of sorting, we can use math!", "The sum of the first N numbers is N * (N + 1) / 2.", "If we calculate this expected sum and subtract the actual sum of all numbers in the array, the difference MUST be the missing number!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Math Visualization
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '32px' }}>
                  
                  {/* Expected Sum Block */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold' }}>Expected Sum (0 to {N})</div>
                    <div style={{ 
                      width: '100px', height: '100px', borderRadius: '50%', background: 'var(--viz-sky-bg)', border: '4px solid var(--sky)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)'
                    }}>
                      {EXPECTED_SUM}
                    </div>
                  </div>

                  <div style={{ fontSize: '2rem', color: 'var(--muted)', fontWeight: 'bold' }}>-</div>

                  {/* Actual Sum Block */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold' }}>Actual Sum</div>
                    <motion.div 
                      layout
                      style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', background: 'var(--viz-red-bg)', border: '4px solid var(--pink)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)'
                      }}
                    >
                      {current.actualSum}
                    </motion.div>
                  </div>

                  <div style={{ fontSize: '2rem', color: 'var(--muted)', fontWeight: 'bold' }}>=</div>

                  {/* Result Block */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold' }}>Missing</div>
                    <div style={{ 
                      width: '100px', height: '100px', borderRadius: '12px', background: current.phase === 'done' ? 'var(--viz-green-bg)' : 'var(--surface)', border: `4px dashed ${current.phase === 'done' ? 'var(--green)' : 'var(--border-strong)'}`,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)'
                    }}>
                      {current.phase === 'done' ? current.returned : '?'}
                    </div>
                  </div>

                </div>

                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = current.i === idx;
                    const isProcessed = idx < current.i;
                    
                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let opacity = 1;

                    if (isActive) {
                      bg = 'var(--viz-sky-bg)';
                      border = 'var(--sky)';
                    } else if (isProcessed) {
                      bg = 'var(--surface2)';
                      border = 'var(--border-strong)';
                      opacity = 0.5;
                    }

                    return (
                      <div key={idx} className="array-block-wrapper" style={{ zIndex: 1, opacity }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}></div>
                        
                        <motion.div 
                          className="array-block"
                          layout
                          style={{
                            width: '48px', height: '48px',
                            background: bg, borderColor: border,
                            color: 'var(--text)',
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {num}
                        </motion.div>
                        
                        <div style={{ height: '40px', textAlign: 'center', marginTop: '4px', display: 'flex', flexDirection: 'column' }}>
                          {isActive && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>i</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Calculating"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Missing Number"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int missingNumber(int[] nums) {",
                "    int n = nums.length;",
                "    int expectedSum = n * (n + 1) / 2;",
                "    ",
                "    int actualSum = 0;",
                "    for (int num : nums) {",
                "        actualSum += num;",
                "    }",
                "    return expectedSum - actualSum;",
                "}"
              ]}
              pythonCode={[
                "def missingNumber(self, nums: list[int]) -> int:",
                "    n = len(nums)",
                "    expected_sum = n * (n + 1) // 2",
                "    ",
                "    actual_sum = 0",
                "    for num in nums:",
                "        actual_sum += num",
                "        ",
                "    return expected_sum - actual_sum"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Calculate the expected sum of numbers from 0 to N using Gauss's formula." },
                { num: 2, txt: "Iterate through the array and sum all the actual numbers." },
                { num: 3, txt: "Keep track of the actual sum." },
                { num: 4, txt: "The missing number is exactly the difference between the expected sum and the actual sum!" }
              ]} 
            />
            <Complexity time="O(N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Since we know the array should contain exactly all numbers from <code>0</code> to <code>N</code> except for one, the sum of all numbers from <code>0</code> to <code>N</code> is a known mathematical constant: <code>N * (N + 1) / 2</code>.</>,
              <>By calculating the actual sum of the array, the difference between what the sum <em>should</em> be and what it <em>actually</em> is must be the missing number! This avoids the <code>O(N log N)</code> cost of sorting.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
