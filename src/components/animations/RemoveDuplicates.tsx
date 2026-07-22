import React, { useState } from 'react';
import { Filter, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
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

const EDGE_CASES = [
  "nums = [1,1,1,1,1]",
  "nums = [1,2,3,4,5]",
  "nums = [-100,-100,0,0,100,100]",
  "nums = [1]"
];

const generateTimeline = (arr: number[]) => {
  const timeline: any[] = [];
  const nums = [...arr];
  let i = 0;
  
  if (nums.length === 0) return timeline;

  timeline.push({
    nums: [...nums], i, j: 1,
    desc: "Initialize slow pointer `i = 0`. Fast pointer `j` starts at 1 to scan the array.",
    activeLines: [2, 3],
    logic: '<strong>Init:</strong> Set `i = 0` (write pointer) and `j = 1` (read pointer).', logicClass: 'info', activeStep: 1
  });

  for (let j = 1; j < nums.length; j++) {
    if (nums[j] == nums[i]) {
      timeline.push({
        nums: [...nums], i, j,
        desc: `Compare nums[j] (${nums[j]}) and nums[i] (${nums[i]}). They are equal, so it's a duplicate. Just increment j.`,
        activeLines: [4, 8],
        logic: `nums[j] == nums[i] (<strong style="color:var(--yellow)">${nums[j]}</strong> == <strong style="color:var(--red)">${nums[i]}</strong>).<br/>Duplicate found! Skip it by incrementing \`j\`.`, logicClass: 'info', activeStep: 2
      });
    } else {
      timeline.push({
        nums: [...nums], i, j,
        desc: `Compare nums[j] (${nums[j]}) and nums[i] (${nums[i]}). They are different! A new unique element is found.`,
        activeLines: [4, 5],
        logic: `nums[j] != nums[i] (<strong style="color:var(--yellow)">${nums[j]}</strong> != <strong style="color:var(--red)">${nums[i]}</strong>).<br/>Found a new unique element!`, logicClass: 'success', activeStep: 3
      });
      i++;
      nums[i] = nums[j];
      timeline.push({
        nums: [...nums], i, j,
        desc: `Increment i, and copy nums[j] to nums[i]. nums[${i}] becomes ${nums[i]}.`,
        activeLines: [5, 6],
        logic: `Increment \`i\` to ${i}, then write <strong style="color:var(--yellow)">${nums[i]}</strong> at index \`i\`.`, logicClass: 'info', activeStep: 3
      });
    }
  }

  timeline.push({
    nums: [...nums], i, j: nums.length,
    desc: `j reaches the end of the array. The loop terminates. The number of unique elements is i + 1 (${i + 1}).`,
    activeLines: [9],
    logic: `Array fully scanned.<br/><strong style="color:var(--green)">Done!</strong> Return \`i + 1\` = ${i + 1}.`, logicClass: 'success', activeStep: 4
  });

  return timeline;
};

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
  
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([1,1,2]);
  const [timeline, setTimeline] = useState(() => generateTimeline([1,1,2]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      const res = [...parsed];
      let k = 0;
      if (res.length > 0) {
        let i = 0;
        for (let j = 1; j < res.length; j++) {
          if (res[j] !== res[i]) {
            i++;
            res[i] = res[j];
          }
        }
        k = i + 1;
      }

      for (let i = k; i < res.length; i++) res[i] = '_' as any;

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: `${k}, nums = [${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [1,1,2]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int k = removeDuplicates(nums);\n        System.out.println(k);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    k = Solution().removeDuplicates(nums)\n    print(k)`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Remove Duplicates from Sorted Array" lcNum="26" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={examples}
          constraints={CONSTRAINTS}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const ex = examples[idx];
                const inputArr = ex.nums || JSON.parse(ex.input.replace('nums = ', ''));
                setNums(inputArr);
                setTimeline(generateTimeline(inputArr));
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
      <VPHeader title="Remove Duplicates from Sorted Array" lcNum="26" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            const ex = examples[idx];
            const inputArr = ex.nums || JSON.parse(ex.input.replace('nums = ', ''));
            setNums(inputArr);
            setTimeline(generateTimeline(inputArr));
            reset(); 
          }} 
          onCustomInput={handleCustomInput}
          onGenerateEdgeCase={async () => {
            await new Promise(r => setTimeout(r, 1000));
            return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
          }}
        />
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
                  <div className="st-val">{current.j < nums.length ? current.j : '—'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[i]</div>
                  <div className="st-val">{current.nums[current.i]}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">nums[j]</div>
                  <div className="st-val">{current.j < nums.length ? current.nums[current.j] : '—'}</div>
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
