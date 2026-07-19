import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, return an array of <strong>the squares of each number</strong> sorted in non-decreasing order.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [-4,-1,0,3,10]', 
    output: '[0,1,9,16,100]',
    explanation: <>After squaring, the array becomes [16,1,0,9,100].<br/>After sorting, it becomes [0,1,9,16,100].</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [-7,-3,2,3,11]', 
    output: '[4,9,9,49,121]',
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁴</code></div>
    <div><code>-10⁴ &lt;= nums[i] &lt;= 10⁴</code></div>
    <div><code>nums</code> is sorted in <strong>non-decreasing order</strong>.</div>
    <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow up:</strong> Squaring each element and sorting the new array is very trivial, could you find an <code>O(n)</code> solution using a different approach?</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int[] sortedSquares(int[] nums) {\n        // Write your code here\n        return new int[]{};\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def sortedSquares(self, nums) -> list[int]:\n        # Write your code here\n        pass`;

export default function SquaresSortedArray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const timeline = [
    {
      nums: [-4, -1, 0, 3, 10], res: [null, null, null, null, null],
      l: 0, r: 4, p: 4,
      desc: "Initialize left pointer (l) at the start, right pointer (r) at the end, and p at the end of the result array.",
      activeLines: [2, 3, 4],
      logic: '<strong>Init:</strong> Set `l = 0`, `r = 4`, and `p = 4` (write backwards).', logicClass: 'info', activeStep: 1
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [null, null, null, null, 100],
      l: 0, r: 3, p: 3,
      desc: "|10| > |-4|, so square 10 (100) and place at result[p]. Decrement r and p.",
      activeLines: [5, 6, 10, 11],
      logic: '|10| > |-4|. <strong style="color:var(--sky)">10² = 100</strong>.<br/>Write 100 to result array. Move `r` left.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [null, null, null, 16, 100],
      l: 1, r: 3, p: 2,
      desc: "|-4| > |3|, so square -4 (16) and place at result[p]. Increment l, decrement p.",
      activeLines: [5, 6, 7, 8],
      logic: '|-4| > |3|. <strong style="color:var(--pink)">(-4)² = 16</strong>.<br/>Write 16 to result array. Move `l` right.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [null, null, 9, 16, 100],
      l: 1, r: 2, p: 1,
      desc: "|3| > |-1|, so square 3 (9) and place at result[p]. Decrement r and p.",
      activeLines: [5, 6, 10, 11],
      logic: '|3| > |-1|. <strong style="color:var(--sky)">3² = 9</strong>.<br/>Write 9 to result array. Move `r` left.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [null, 1, 9, 16, 100],
      l: 2, r: 2, p: 0,
      desc: "|-1| > |0|, so square -1 (1) and place at result[p]. Increment l, decrement p.",
      activeLines: [5, 6, 7, 8],
      logic: '|-1| > |0|. <strong style="color:var(--pink)">(-1)² = 1</strong>.<br/>Write 1 to result array. Move `l` right.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [0, 1, 9, 16, 100],
      l: 2, r: 1, p: -1,
      desc: "|0| >= |0|, square 0 (0) and place at result[p].",
      activeLines: [5, 6, 7, 8],
      logic: '|0| >= |0|. <strong style="color:var(--pink)">0² = 0</strong>.<br/>Write 0 to result array. Move `l` right.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [-4, -1, 0, 3, 10], res: [0, 1, 9, 16, 100],
      l: 2, r: 1, p: -1,
      desc: "l > r. The loop terminates and the result array is fully populated.",
      activeLines: [13],
      logic: '`l` > `r`. Array fully processed.<br/><strong style="color:var(--green)">Done!</strong>', logicClass: 'success', activeStep: 3
    }
  ];

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(timeline.length);
  const current = timeline[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Squares of a Sorted Array" lcNum="977" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Squares of a Sorted Array" lcNum="977" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={timeline.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<ArrowUpRight size={20} />} title="Two Pointers (Outside In)"
              lines={["Since the array is sorted, the largest squares will always be at the ends (either highly negative or highly positive).", "Use two pointers at the ends and fill the result array backwards."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays & Pointers
              </div>
              <div className="arr-section-label">Original (nums)</div>
              <div className="arr-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="arr-row">
                  {current.nums.map((val, i) => {
                    let c = '';
                    if (current.l === i && step < timeline.length - 1) c = 'l';
                    else if (current.r === i && step < timeline.length - 1) c = 'r';
                    else if (i < current.l || i > current.r) c = 'visited';
                    return (
                      <motion.div key={i} layout className={`arr-cell ${c}`}>
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="idx-row" style={{ justifyContent: 'center' }}>
                {current.nums.map((_, i) => <div key={i} className="idx-cell">{i}</div>)}
              </div>
              <div className="ptr-row" style={{ justifyContent: 'center' }}>
                {current.nums.map((_, i) => {
                  let lbl = ''; let c = '';
                  if (current.l === i && step < timeline.length - 1) { lbl = 'l'; c = 'pink'; }
                  if (current.r === i && i !== current.l && step < timeline.length - 1) { lbl = 'r'; c = 'sky'; }
                  if (current.l === i && current.r === i && step < timeline.length - 1) { lbl = 'l,r'; c = 'purple'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
              
              <div className="arr-section-label" style={{ marginTop: '24px' }}>Result</div>
              <div className="arr-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="arr-row">
                  {current.res.map((val, i) => {
                    let c = '';
                    if (current.p === i && step < timeline.length - 1) c = 'write';
                    else if (val === null) c = 'empty';
                    else c = 'done';
                    return (
                      <motion.div key={i} layout className={`arr-cell ${c}`}>
                        {val === null ? '' : val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="idx-row" style={{ justifyContent: 'center' }}>
                {current.res.map((_, i) => <div key={i} className="idx-cell">{i}</div>)}
              </div>
              <div className="ptr-row" style={{ justifyContent: 'center' }}>
                {current.res.map((_, i) => {
                  let lbl = ''; let c = '';
                  if (current.p === i && step < timeline.length - 1) { lbl = 'p'; c = 'orange'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">l (left pointer)</div>
                  <div className="st-val">{current.l}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">r (right pointer)</div>
                  <div className="st-val">{current.r}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[l]²</div>
                  <div className="st-val">{Math.pow(current.nums[current.l] || 0, 2)}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[r]²</div>
                  <div className="st-val">{Math.pow(current.nums[current.r] || 0, 2)}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Calculating Squares"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Squares of a Sorted Array"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int[] sortedSquares(int[] nums) {",
                "    int n = nums.length;",
                "    int[] res = new int[n];",
                "    int l = 0, r = n - 1, p = n - 1;",
                "    while (l <= r) {",
                "        if (Math.abs(nums[l]) > Math.abs(nums[r])) {",
                "            res[p] = nums[l] * nums[l];",
                "            l++;",
                "        } else {",
                "            res[p] = nums[r] * nums[r];",
                "            r--;",
                "        }",
                "        p--;",
                "    }",
                "    return res;",
                "}"
              ]}
              pythonCode={[
                "def sortedSquares(nums):",
                "    n = len(nums)",
                "    res = [0] * n",
                "    l, r, p = 0, n - 1, n - 1",
                "    while l <= r:",
                "        if abs(nums[l]) > abs(nums[r]):",
                "            res[p] = nums[l] ** 2",
                "            l += 1",
                "        else:",
                "            res[p] = nums[r] ** 2",
                "            r -= 1",
                "        p -= 1",
                "    return res"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize l at index 0, r at the last index, and p at the end of the result array." },
                { num: 2, txt: "Compare the absolute values of nums[l] and nums[r]. Square the larger one and place it at result[p]." },
                { num: 3, txt: "Move the chosen pointer inward (l++ or r--), and decrement p." },
                { num: 4, txt: "Repeat until l > r." }
              ]} 
            />
            <Complexity time="O(n)" space="O(n)" />
            <WhyItWorks paragraphs={[
              <>Because the input is sorted, the largest squares will always be at the <strong>extremes</strong> (either the most negative numbers on the left, or the most positive numbers on the right).</>,
              <>By using two pointers at both ends and comparing their absolute values, we can determine the largest square in <code>O(1)</code> time.</>,
              <>We write these largest squares from the <em>back</em> of our new result array to the <em>front</em>, yielding a perfectly sorted array in <code>O(n)</code> time instead of <code>O(n log n)</code>!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
