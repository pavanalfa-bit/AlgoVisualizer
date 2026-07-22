import React, { useState } from 'react';
import { Merge, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
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

const EXAMPLES = [
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
];

const EDGE_CASES = [
  "nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3",
  "nums1 = [2,0], m = 1, nums2 = [1], n = 1"
];

const generateTimeline = (n1: number[], m: number, n2: number[], n: number) => {
  const timeline: any[] = [];
  
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;

  const arr1 = [...n1];
  for (let i = m; i < m + n; i++) arr1[i] = null as any;
  const arr2 = [...n2];

  timeline.push({
    nums1: [...arr1], nums2: [...arr2],
    p1, p2, p,
    desc: "Initialize pointers p1 at m-1 (end of nums1's data), p2 at n-1 (end of nums2), and p at m+n-1 (end of nums1 array).",
    activeLines: [2, 3, 4], logic: `p1 = ${p1}, p2 = ${p2}, p = ${p}`
  });

  while (p2 >= 0) {
    if (p1 >= 0 && arr1[p1] > arr2[p2]) {
      arr1[p] = arr1[p1];
      timeline.push({
        nums1: [...arr1], nums2: [...arr2],
        p1, p2, p,
        desc: `Compare nums1[p1] (${arr1[p]}) and nums2[p2] (${arr2[p2]}). ${arr1[p]} > ${arr2[p2]}, so place ${arr1[p]} at nums1[p]. Decrement p1 and p.`,
        activeLines: [5, 6, 7], logic: `nums1[p1] > nums2[p2] -> nums1[p] = ${arr1[p]}`
      });
      p1--;
    } else {
      arr1[p] = arr2[p2];
      timeline.push({
        nums1: [...arr1], nums2: [...arr2],
        p1, p2, p,
        desc: `Compare nums1[p1] (${p1>=0?arr1[p1]:'-'}) and nums2[p2] (${arr2[p2]}). ${arr2[p2]} >= ${p1>=0?arr1[p1]:'-'}, so place ${arr2[p2]} at nums1[p]. Decrement p2 and p.`,
        activeLines: [5, 8, 9, 10], logic: `nums2[p2] >= nums1[p1] -> nums1[p] = ${arr2[p2]}`
      });
      p2--;
    }
    p--;
  }
  
  timeline.push({
    nums1: [...arr1], nums2: [...arr2],
    p1, p2, p,
    desc: "p2 < 0. We've merged all elements from nums2. The remaining elements in nums1 are already sorted in place.",
    activeLines: [12], logic: "Loop terminates since p2 < 0"
  });

  return timeline;
};

export default function MergeSortedArray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums1, setNums1] = useState([1,2,3,0,0,0]);
  const [m, setM] = useState(3);
  const [nums2, setNums2] = useState([2,5,6]);
  const [n, setN] = useState(3);
  const [timeline, setTimeline] = useState(() => generateTimeline([1,2,3,0,0,0], 3, [2,5,6], 3));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      const parts = val.split('nums2');
      if (parts.length < 2) throw new Error();
      
      const p1 = parts[0].split('m');
      let n1Str = p1[0].replace('nums1', '').replace('=', '').trim();
      if(n1Str.endsWith(',')) n1Str = n1Str.substring(0, n1Str.length-1);
      
      let mStr = p1[1].replace('=', '').trim();
      if(mStr.endsWith(',')) mStr = mStr.substring(0, mStr.length-1);
      
      const p2 = parts[1].split('n');
      let n2Str = p2[0].replace('=', '').trim();
      if(n2Str.endsWith(',')) n2Str = n2Str.substring(0, n2Str.length-1);
      
      let nnStr = p2[1].replace('=', '').trim();
      
      const parsedN1 = JSON.parse(n1Str);
      const parsedM = parseInt(mStr);
      const parsedN2 = JSON.parse(n2Str);
      const parsedN = parseInt(nnStr);

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums1 = [${parsedN1}], m = ${parsedM}, nums2 = [${parsedN2}], n = ${parsedN}`;
      
      const res = [...parsedN1];
      let p1_ = parsedM - 1, p2_ = parsedN - 1, p_ = parsedM + parsedN - 1;
      while(p2_ >= 0) {
        if(p1_ >= 0 && res[p1_] > parsedN2[p2_]) res[p_--] = res[p1_--];
        else res[p_--] = parsedN2[p2_--];
      }

      const newEx = {
        label: formattedLabel,
        n1: parsedN1, m: parsedM, n2: parsedN2, n: parsedN,
        input: formattedLabel,
        output: JSON.stringify(res),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums1(parsedN1); setM(parsedM); setNums2(parsedN2); setN(parsedN);
      setTimeline(generateTimeline(parsedN1, parsedM, parsedN2, parsedN));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\
        // Setup based on: ${clean}\
    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\
    # Setup based on: ${clean}`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Merge Sorted Array" lcNum="88" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={examples}
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
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const ex = examples[idx];
                if(ex.n1) {
                  setNums1(ex.n1); setM(ex.m); setNums2(ex.n2); setN(ex.n);
                  setTimeline(generateTimeline(ex.n1, ex.m, ex.n2, ex.n));
                } else {
                  setTimeline(generateTimeline([1,2,3,0,0,0], 3, [2,5,6], 3));
                }
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
            examples={examples}
            constraints={<>
              <div><code>nums1.length == m + n</code></div>
              <div><code>nums2.length == n</code></div>
              <div><code>0 &lt;= m, n &lt;= 200</code></div>
              <div><code>1 &lt;= m + n &lt;= 200</code></div>
              <div><code>-10⁹ &lt;= nums1[i], nums2[j] &lt;= 10⁹</code></div>
              <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow up:</strong> Can you come up with an algorithm that runs in <code>O(m + n)</code> time?</div>
            </>}
          />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { 
              setActiveEx(idx); 
              const ex = examples[idx];
              if(ex.n1) {
                setNums1(ex.n1); setM(ex.m); setNums2(ex.n2); setN(ex.n);
                setTimeline(generateTimeline(ex.n1, ex.m, ex.n2, ex.n));
              } else {
                setTimeline(generateTimeline([1,2,3,0,0,0], 3, [2,5,6], 3));
              }
              reset(); 
            }} 
            onCustomInput={handleCustomInput}
            onGenerateEdgeCase={async () => {
              await new Promise(r => setTimeout(r, 1000));
              return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
            }}
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
