import React, { useState } from 'react';
import { Merge, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>
    <p><strong>Merge</strong> <code>nums2</code> into <code>nums1</code> as one sorted array.</p>
    <p>The final sorted array should not be returned by the function, but instead be stored inside the array <code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>
  </>
);

const DEFAULT_JAVA = `class Main {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your code here
    }

    public static void main(String[] args) {
        // Add test cases here
    }
}`;

const DEFAULT_PYTHON = `class Solution:
    def merge(self, nums1, m, nums2, n) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # Write your code here
        pass`;

export default function MergeSortedArray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  // Hardcoded state timeline for nums1 = [1,2,3,0,0,0], nums2 = [2,5,6]
  const timeline = [
    {
      nums1: [1,2,3,null,null,null], nums2: [2,5,6],
      p1: 2, p2: 2, p: 5,
      desc: "Initialize pointers p1 at m-1 (end of nums1's data), p2 at n-1 (end of nums2), and p at m+n-1 (end of nums1 array).",
      activeLines: [2, 3, 4], logic: "p1 = 2, p2 = 2, p = 5"
    },
    {
      nums1: [1,2,3,null,null,6], nums2: [2,5,6],
      p1: 2, p2: 1, p: 4,
      desc: "Compare nums1[p1] (3) and nums2[p2] (6). 6 > 3, so place 6 at nums1[p]. Decrement p2 and p.",
      activeLines: [5, 9, 10, 11], logic: "nums2[p2] > nums1[p1] -> nums1[p] = 6"
    },
    {
      nums1: [1,2,3,null,5,6], nums2: [2,5,6],
      p1: 2, p2: 0, p: 3,
      desc: "Compare nums1[p1] (3) and nums2[p2] (5). 5 > 3, so place 5 at nums1[p]. Decrement p2 and p.",
      activeLines: [5, 9, 10, 11], logic: "nums2[p2] > nums1[p1] -> nums1[p] = 5"
    },
    {
      nums1: [1,2,3,3,5,6], nums2: [2,5,6],
      p1: 1, p2: 0, p: 2,
      desc: "Compare nums1[p1] (3) and nums2[p2] (2). 3 > 2, so place 3 at nums1[p]. Decrement p1 and p.",
      activeLines: [5, 6, 7], logic: "nums1[p1] >= nums2[p2] -> nums1[p] = 3"
    },
    {
      nums1: [1,2,2,3,5,6], nums2: [2,5,6],
      p1: 1, p2: -1, p: 1,
      desc: "Compare nums1[p1] (2) and nums2[p2] (2). 2 >= 2, so place 2 at nums1[p]. Decrement p1 and p.",
      activeLines: [5, 6, 7], logic: "nums1[p1] >= nums2[p2] -> nums1[p] = 2"
    },
    {
      nums1: [1,2,2,3,5,6], nums2: [2,5,6],
      p1: 1, p2: -1, p: 1,
      desc: "p2 < 0. We've merged all elements from nums2. The remaining elements in nums1 are already sorted in place.",
      activeLines: [13], logic: "Loop terminates since p2 < 0"
    }
  ];

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(timeline.length);
  const current = timeline[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Merge Sorted Array" lcNum="88" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={[
            { 
              label: 'Example 1', 
              input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', 
              output: '[1,2,2,3,5,6]', 
              explanation: <>The arrays we are merging are [1,2,3] and [2,5,6].<br/>The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.</> 
            },
            { 
              label: 'Example 2', 
              input: 'nums1 = [1], m = 1, nums2 = [], n = 0', 
              output: '[1]', 
              explanation: <>The arrays we are merging are [1] and [].<br/>The result of the merge is [1].</> 
            },
            { 
              label: 'Example 3', 
              input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', 
              output: '[1]', 
              explanation: <>The arrays we are merging are [] and [1].<br/>The result of the merge is [1].<br/>Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.</> 
            }
          ]}
          constraints={<>
            <div><code>nums1.length == m + n</code></div>
            <div><code>nums2.length == n</code></div>
            <div><code>0 &lt;= m, n &lt;= 200</code></div>
            <div><code>1 &lt;= m + n &lt;= 200</code></div>
            <div><code>-10⁹ &lt;= nums1[i], nums2[j] &lt;= 10⁹</code></div>
            <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow up:</strong> Can you come up with an algorithm that runs in <code>O(m + n)</code> time?</div>
          </>}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
        />
      </VisualizerLayout>
    );
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Merge Sorted Array" lcNum="88" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'visualizer' && (
        <div style={{ marginBottom: '24px' }}>
          <ProblemStatement 
            statement={PROBLEM_STATEMENT}
            examples={[
              { 
                label: 'Example 1', 
                input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', 
                output: '[1,2,2,3,5,6]', 
                explanation: <>The arrays we are merging are [1,2,3] and [2,5,6].<br/>The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.</> 
              },
              { 
                label: 'Example 2', 
                input: 'nums1 = [1], m = 1, nums2 = [], n = 0', 
                output: '[1]', 
                explanation: <>The arrays we are merging are [1] and [].<br/>The result of the merge is [1].</> 
              },
              { 
                label: 'Example 3', 
                input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', 
                output: '[1]', 
                explanation: <>The arrays we are merging are [] and [1].<br/>The result of the merge is [1].<br/>Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.</> 
              }
            ]}
            constraints={<>
              <div><code>nums1.length == m + n</code></div>
              <div><code>nums2.length == n</code></div>
              <div><code>0 &lt;= m, n &lt;= 200</code></div>
              <div><code>1 &lt;= m + n &lt;= 200</code></div>
              <div><code>-10⁹ &lt;= nums1[i], nums2[j] &lt;= 10⁹</code></div>
              <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow up:</strong> Can you come up with an algorithm that runs in <code>O(m + n)</code> time?</div>
            </>}
          />
        </div>
      )}
      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={timeline.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Merge size={20} />} title="Three Pointers — Fill from the Back"
              lines={["p1 starts at nums1[m-1], p2 at nums2[n-1], p (write) at m+n-1. Compare p1 and p2 values; write the larger one at position p. Move pointers left. Never overwrites unread values!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays
              </div>
              <div className="arr-section-label">nums1 (merge target, extra zeros at end)</div>
              <div className="arr-wrap">
                <div className="arr-row">
                  {current.nums1.map((val, i) => {
                    let c = '';
                    if (current.p === i && step < timeline.length - 1) c = 'write';
                    else if (current.p1 === i && step < timeline.length - 1) c = 'p1';
                    else if (val === null) c = 'empty';
                    return (
                      <motion.div key={i} layout className={`arr-cell ${c}`}>
                        {val === null ? '0' : val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="idx-row">
                {current.nums1.map((_, i) => <div key={i} className="idx-cell">{i}</div>)}
              </div>
              <div className="ptr-row">
                {current.nums1.map((_, i) => {
                  let lbl = ''; let c = '';
                  if (current.p1 === i && step < timeline.length - 1) { lbl = 'p1'; c = 'blue'; }
                  if (current.p === i && i !== current.p1 && step < timeline.length - 1) { lbl = 'p'; c = 'orange'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
              
              <div className="arr-section-label" style={{ marginTop: '24px' }}>nums2 (source)</div>
              <div className="arr-wrap">
                <div className="arr-row">
                  {current.nums2.map((val, i) => {
                    let c = '';
                    if (current.p2 === i && step < timeline.length - 1) c = 'p2';
                    else if (current.p2 !== -1 && i > current.p2) c = 'visited';
                    return (
                      <motion.div key={i} layout className={`arr-cell ${c}`}>
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="idx-row">
                {current.nums2.map((_, i) => <div key={i} className="idx-cell">{i}</div>)}
              </div>
              <div className="ptr-row">
                {current.nums2.map((_, i) => {
                  let lbl = ''; let c = '';
                  if (current.p2 === i && step < timeline.length - 1) { lbl = 'p2'; c = 'purple'; }
                  return <div key={i} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">p1 (nums1)</div>
                  <div className="st-val">{current.p1 === -1 ? '—' : current.p1}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">p2 (nums2)</div>
                  <div className="st-val">{current.p2 === -1 ? '—' : current.p2}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">p (write)</div>
                  <div className="st-val">{current.p === -1 ? '—' : current.p}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">written</div>
                  <div className="st-val">{timeline.length === 6 && step === 5 ? 6 : Math.max(0, 5 - current.p)}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={step === 5 ? 'success' : 'info'} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Merging"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <CodePanel 
              title="Merge Sorted Array"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public void merge(int[] nums1, int m, int[] nums2, int n) {",
                "    int p1 = m - 1;",
                "    int p2 = n - 1;",
                "    int p = m + n - 1;",
                "    while (p2 >= 0) {",
                "        if (p1 >= 0 && nums1[p1] > nums2[p2]) {",
                "            nums1[p--] = nums1[p1--];",
                "        } else {",
                "            nums1[p--] = nums2[p2--];",
                "        }",
                "    }",
                "}"
              ]}
              pythonCode={[
                "def merge(nums1, m, nums2, n):",
                "    p1 = m - 1",
                "    p2 = n - 1",
                "    p = m + n - 1",
                "    while p2 >= 0:",
                "        if p1 >= 0 and nums1[p1] > nums2[p2]:",
                "            nums1[p] = nums1[p1]",
                "            p1 -= 1",
                "        else:",
                "            nums1[p] = nums2[p2]",
                "            p2 -= 1",
                "        p -= 1"
              ]}
            />
            <AlgorithmList 
              activeStep={step === 0 ? 1 : step === 5 ? 4 : (current.p1 >= 0 && current.nums1[current.p1]! > current.nums2[current.p2]!) ? 3 : 2}
              steps={[
                { num: 1, txt: "Set p1=m-1, p2=n-1, p=m+n-1 (write from end)" },
                { num: 2, txt: "While p1≥0 and p2≥0: compare nums1[p1] vs nums2[p2]" },
                { num: 3, txt: "Write the larger value at nums1[p], advance that pointer left" },
                { num: 4, txt: "Copy remaining nums2 elements (if any)" }
              ]} 
            />
            <Complexity time="O(m+n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Merging from the front would overwrite unseen nums1 elements. By starting at the <strong style={{ color: 'var(--orange)' }}>end of nums1</strong> (where the zeros are), we fill the largest slot first. The write pointer p always lands in the "used-up" region — we can never clobber an unread value.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
