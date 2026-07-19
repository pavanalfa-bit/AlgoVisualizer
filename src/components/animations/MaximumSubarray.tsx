import React, { useState } from 'react';
import { MousePointerSquareDashed, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code>, find the <strong>subarray</strong> with the largest sum, and return <em>its sum</em>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', 
    output: '6',
    explanation: <>The subarray <code>[4,-1,2,1]</code> has the largest sum 6.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [1]', 
    output: '1',
    explanation: <>The subarray <code>[1]</code> has the largest sum 1.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [5,4,-1,7,8]', 
    output: '23',
    explanation: <>The subarray <code>[5,4,-1,7,8]</code> has the largest sum 23.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁵</code></div>
    <div><code>-10⁴ &lt;= nums[i] &lt;= 10⁴</code></div>
    <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow up: </strong>If you have figured out the <code>O(n)</code> solution, try coding another solution using the divide and conquer approach, which is more subtle.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

const generateTimeline = () => {
  const timeline: any[] = [];
  let maxSum = NUMS[0];
  let curSum = 0;
  let L = 0;
  
  timeline.push({
    L: 0, R: 0, curSum: 0, maxSum: NUMS[0],
    activeLines: [3, 4], activeStep: 1,
    desc: "Initialize maxSum to the first element and curSum to 0.",
    logic: `<strong>Init:</strong> maxSum = ${NUMS[0]}, curSum = 0.`, logicClass: 'info'
  });

  for (let R = 0; R < NUMS.length; R++) {
    if (curSum < 0) {
      curSum = 0;
      L = R;
      timeline.push({
        L, R, curSum, maxSum,
        activeLines: [6, 7], activeStep: 2,
        desc: `curSum is negative. Reset curSum to 0 and move the start of the window (L) to index ${R}.`,
        logic: `curSum < 0.<br/><span style="color:var(--pink)">Negative sum prefix discarded!</span> Reset curSum = 0.`, logicClass: 'info'
      });
    }

    curSum += NUMS[R];
    const oldMax = maxSum;
    maxSum = Math.max(maxSum, curSum);
    
    timeline.push({
      L, R, curSum, maxSum,
      activeLines: [8, 9], activeStep: 3,
      desc: `Add nums[${R}] (${NUMS[R]}) to curSum. curSum = ${curSum}.`,
      logic: `curSum += nums[${R}] (${NUMS[R]}).<br/>curSum = <strong>${curSum}</strong>.<br/>${maxSum > oldMax ? '<strong style="color:var(--green)">New max found!</strong>' : ''}`, 
      logicClass: maxSum > oldMax ? 'success' : ''
    });
  }

  timeline.push({
    L: -1, R: NUMS.length, curSum, maxSum,
    activeLines: [11], activeStep: 4,
    desc: `Iterated through the entire array. The maximum subarray sum is ${maxSum}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum subarray sum is <strong>${maxSum}</strong>.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function MaximumSubarray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Maximum Subarray" lcNum="53" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Maximum Subarray" lcNum="53" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<MousePointerSquareDashed size={20} />} title="Kadane's Algorithm"
              lines={["Maintain a running sum of the current subarray.", "If the running sum ever becomes negative, it's a useless prefix! We discard it by resetting the sum to 0 and starting a new window."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Subarray Sum Tracking
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {NUMS.map((n, i) => {
                    const isInWindow = i >= current.L && i <= current.R && current.L !== -1;
                    const isR = current.R === i;
                    const isL = current.L === i;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isInWindow ? 'highlight' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isInWindow ? 'var(--surface2)' : 'var(--surface)',
                            borderColor: isR ? 'var(--sky)' : isInWindow ? 'var(--border-strong)' : 'var(--border)',
                            color: n < 0 ? 'var(--hard)' : 'var(--easy)'
                          }}
                        >
                          {n}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>R</span>}
                        </div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L (Window Start)</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.L !== -1 ? current.L : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">R (Window End)</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.R < NUMS.length ? current.R : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Sum</div>
                  <div className="st-val" style={{ color: current.curSum < 0 ? 'var(--hard)' : 'var(--easy)' }}>{current.curSum}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Max Sum</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.maxSum}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Scanning Subarrays"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Kadane's Algorithm"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int maxSubArray(int[] nums) {",
                "    int maxSum = nums[0];",
                "    int curSum = 0;",
                "    for (int i = 0; i < nums.length; i++) {",
                "        if (curSum < 0) {",
                "            curSum = 0;",
                "        }",
                "        curSum += nums[i];",
                "        maxSum = Math.max(maxSum, curSum);",
                "    }",
                "    return maxSum;",
                "}"
              ]}
              pythonCode={[
                "def maxSubArray(nums):",
                "    max_sum = nums[0]",
                "    cur_sum = 0",
                "    for n in nums:",
                "        if cur_sum < 0:",
                "            cur_sum = 0",
                "        ",
                "        cur_sum += n",
                "        max_sum = max(max_sum, cur_sum)",
                "    ",
                "    return max_sum"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize max_sum to the first element and cur_sum to 0." },
                { num: 2, txt: "If cur_sum is negative, we discard the prefix because it would only decrease the sum of any subsequent subarray. Reset cur_sum to 0." },
                { num: 3, txt: "Add the current element to cur_sum. Update max_sum if cur_sum is larger." },
                { num: 4, txt: "After iterating through the array, max_sum holds the maximum subarray sum." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>If a subarray sum becomes negative, any element added to it will be smaller than if we just started a new subarray from that element. Therefore, a negative prefix can never contribute to a maximum subarray sum.</>,
              <>By resetting the sum to 0 whenever it drops below 0, we effectively "slide" the start of our window forward to the current element, abandoning the useless prefix.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
