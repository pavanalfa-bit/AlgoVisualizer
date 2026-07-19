import React, { useState } from 'react';
import { Filter, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <strong>in-place</strong> such that each unique element appears only <strong>once</strong>. The <em>relative order</em> of the elements should be kept the same. Then return the number of unique elements in <code>nums</code>.</p>
    <p>Consider the number of unique elements of <code>nums</code> to be <code>k</code>, to get accepted, you need to do the following things:</p>
    <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
      <li>Change the array <code>nums</code> such that the first <code>k</code> elements of <code>nums</code> contain the unique elements in the order they were present in <code>nums</code> initially. The remaining elements of <code>nums</code> are not important as well as the size of <code>nums</code>.</li>
      <li>Return <code>k</code>.</li>
    </ul>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [1,1,2]', 
    output: '2, nums = [1,2,_]',
    explanation: <>Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.<br/>It does not matter what you leave beyond the returned k (hence they are underscores).</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [0,0,1,1,1,2,2,3,3,4]', 
    output: '5, nums = [0,1,2,3,4,_,_,_,_,_]',
    explanation: <>Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.<br/>It does not matter what you leave beyond the returned k (hence they are underscores).</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 3 * 10⁴</code></div>
    <div><code>-100 &lt;= nums[i] &lt;= 100</code></div>
    <div><code>nums</code> is sorted in <strong>non-decreasing</strong> order.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int removeDuplicates(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def removeDuplicates(self, nums) -> int:\n        # Write your code here\n        pass`;

export default function RemoveDuplicates({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const timeline = [
    {
      nums: [1, 1, 2], i: 0, j: 1,
      desc: "Initialize slow pointer `i = 0`. Fast pointer `j` starts at 1 to scan the array.",
      activeLines: [2, 3],
      logic: '<strong>Init:</strong> Set `i = 0` (write pointer) and `j = 1` (read pointer).', logicClass: 'info', activeStep: 1
    },
    {
      nums: [1, 1, 2], i: 0, j: 1,
      desc: "Compare nums[j] (1) and nums[i] (1). They are equal, so it's a duplicate. Just increment j.",
      activeLines: [4, 8],
      logic: 'nums[j] == nums[i] (<strong style="color:var(--yellow)">1</strong> == <strong style="color:var(--red)">1</strong>).<br/>Duplicate found! Skip it by incrementing `j`.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [1, 1, 2], i: 0, j: 2,
      desc: "j increments to 2.",
      activeLines: [3],
      logic: 'Moved read pointer `j` to index 2.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [1, 1, 2], i: 0, j: 2,
      desc: "Compare nums[j] (2) and nums[i] (1). They are different! A new unique element is found.",
      activeLines: [4, 5],
      logic: 'nums[j] != nums[i] (<strong style="color:var(--yellow)">2</strong> != <strong style="color:var(--red)">1</strong>).<br/>Found a new unique element!', logicClass: 'success', activeStep: 3
    },
    {
      nums: [1, 2, 2], i: 1, j: 2,
      desc: "Increment i, and copy nums[j] to nums[i]. nums[1] becomes 2.",
      activeLines: [5, 6],
      logic: 'Increment `i` to 1, then write <strong style="color:var(--yellow)">2</strong> at index `i`.', logicClass: 'info', activeStep: 3
    },
    {
      nums: [1, 2, 2], i: 1, j: 3,
      desc: "j reaches the end of the array. The loop terminates. The number of unique elements is i + 1.",
      activeLines: [9],
      logic: 'Array fully scanned.<br/><strong style="color:var(--green)">Done!</strong> Return `i + 1` = 2.', logicClass: 'success', activeStep: 4
    }
  ];

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(timeline.length);
  const current = timeline[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Remove Duplicates from Sorted Array" lcNum="26" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Remove Duplicates from Sorted Array" lcNum="26" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={timeline.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Filter size={20} />} title="Slow & Fast Pointers"
              lines={["Use `i` (slow) to point to the last unique element.", "Use `j` (fast) to scan through the array finding new unique elements."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays & Pointers
              </div>
              <div className="arr-section-label">nums array (in-place modification)</div>
              <div className="arr-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="arr-row">
                  {current.nums.map((val, idx) => {
                    let c = '';
                    if (current.j === idx && step < timeline.length - 1) c = 'j';
                    else if (idx <= current.i) c = 'done';
                    else c = 'empty';
                    return (
                      <motion.div key={idx} layout className={`arr-cell ${c}`}>
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
                  if (current.i === i && step < timeline.length - 1) { lbl = 'i'; c = 'red'; }
                  if (current.j === i && i !== current.i && step < timeline.length - 1) { lbl = 'j'; c = 'yellow'; }
                  if (current.i === i && current.j === i && step < timeline.length - 1) { lbl = 'i,j'; c = 'orange'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">i (slow pointer)</div>
                  <div className="st-val">{current.i}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">j (fast pointer)</div>
                  <div className="st-val">{current.j < 3 ? current.j : '—'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[i]</div>
                  <div className="st-val">{current.nums[current.i]}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[j]</div>
                  <div className="st-val">{current.j < 3 ? current.nums[current.j] : '—'}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Finding Uniques"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Remove Duplicates"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int removeDuplicates(int[] nums) {",
                "    int i = 0;",
                "    for (int j = 1; j < nums.length; j++) {",
                "        if (nums[j] != nums[i]) {",
                "            i++;",
                "            nums[i] = nums[j];",
                "        }",
                "    }",
                "    return i + 1;",
                "}"
              ]}
              pythonCode={[
                "def removeDuplicates(nums):",
                "    i = 0",
                "    for j in range(1, len(nums)):",
                "        if nums[j] != nums[i]:",
                "            i += 1",
                "            nums[i] = nums[j]",
                "    return i + 1"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Place slow pointer (i) at index 0 and fast pointer (j) at index 1." },
                { num: 2, txt: "Iterate j through the array. If nums[j] == nums[i], it's a duplicate. Skip it." },
                { num: 3, txt: "If nums[j] != nums[i], it's a new unique! Increment i, and write nums[j] to nums[i]." },
                { num: 4, txt: "When j reaches the end, return i + 1 (the count of uniques)." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Because the array is <strong>sorted</strong>, all duplicate elements are guaranteed to be adjacent.</>,
              <>By using a fast pointer (<code>j</code>) to scan ahead and a slow pointer (<code>i</code>) to keep track of the end of our "unique elements" sub-array, we can safely overwrite duplicates without losing data.</>,
              <>This performs an in-place array compaction in a single pass without any extra space!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
