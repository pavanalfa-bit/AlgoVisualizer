import React, { useState } from 'react';
import { Users, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
    <p>Notice that the solution set must not contain duplicate triplets.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [-1,0,1,2,-1,-4]', 
    output: '[[-1,-1,2],[-1,0,1]]',
    explanation: <>
      <code>nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.</code><br/>
      <code>nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.</code><br/>
      <code>nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.</code><br/>
      The distinct triplets are <code>[-1,0,1]</code> and <code>[-1,-1,2]</code>.<br/>
      Notice that the order of the output and the order of the triplets does not matter.
    </>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [0,1,1]', 
    output: '[]',
    explanation: <>The only possible triplet does not sum up to 0.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [0,0,0]', 
    output: '[[0,0,0]]',
    explanation: <>The only possible triplet sums up to 0.</>
  }
];

const EDGE_CASES = [
  "nums = [-2,0,0,2,2]",
  "nums = [-1,0,1,2,-1,-4,-2,-3,3,0,4]",
  "nums = [0,0,0,0]",
  "nums = [1,2,-2,-1]"
];

const generateTimeline = (arr: number[]) => {
  const timeline: any[] = [];
  const orig = [...arr];
  const nums = [...arr].sort((a, b) => a - b);
  const n = nums.length;
  const res: number[][] = [];
  
  if (n < 3) return timeline;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      timeline.push({
        nums: [...nums], i, l: -1, r: -1, res: [...res],
        desc: `i = ${i} (val = ${nums[i]}). This is the same as the previous 'i', so we skip it to avoid duplicate triplets.`,
        activeLines: [4],
        logic: `nums[i] == nums[i-1] (${nums[i]} == ${nums[i-1]}).<br/><strong style="color:var(--orange)">Duplicate element!</strong> Skip 'i' to avoid duplicate triplets.`, logicClass: 'warning', activeStep: 4
      });
      continue;
    }
    
    let l = i + 1;
    let r = n - 1;

    timeline.push({
      nums: [...nums], i, l, r, res: [...res],
      desc: `For i = ${i} (val = ${nums[i]}), 'l' starts at ${l}, 'r' starts at ${r}.`,
      activeLines: [3, 5, 6],
      logic: `Fix 'i' at index ${i} (<strong style="color:var(--yellow)">${nums[i]}</strong>).<br/>Set 'l' to index ${l} and 'r' to ${r}.`, logicClass: 'info', activeStep: 1
    });

    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        timeline.push({
          nums: [...nums], i, l, r, res: [...res],
          desc: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = 0. Found a triplet! Add [${nums[i]}, ${nums[l]}, ${nums[r]}] to the result list.`,
          activeLines: [8, 9],
          logic: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = <strong>0</strong>.<br/><strong style="color:var(--green)">Triplet Found!</strong> Add to result.`, logicClass: 'success', activeStep: 3
        });
        
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        
        l++;
        r--;
        
        if (l < r) {
          timeline.push({
            nums: [...nums], i, l, r, res: [...res],
            desc: `Increment 'l' and decrement 'r' to find other possible pairs for this 'i'.`,
            activeLines: [10, 11],
            logic: `Move both 'l' and 'r' inwards to find more triplets for this 'i'.`, logicClass: 'info', activeStep: 3
          });
        }
      } else if (sum < 0) {
        timeline.push({
          nums: [...nums], i, l, r, res: [...res],
          desc: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}. Since sum < 0, we need a larger value, so we increment 'l'.`,
          activeLines: [7, 8, 12, 13],
          logic: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = <strong>${sum}</strong>.<br/>Sum < 0, so increment 'l' to get a larger sum.`, logicClass: 'info', activeStep: 2
        });
        l++;
      } else {
        timeline.push({
          nums: [...nums], i, l, r, res: [...res],
          desc: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}. Since sum > 0, we need a smaller value, so we decrement 'r'.`,
          activeLines: [7, 8, 14, 15],
          logic: `Sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = <strong>${sum}</strong>.<br/>Sum > 0, so decrement 'r' to get a smaller sum.`, logicClass: 'info', activeStep: 2
        });
        r--;
      }
    }
    
    timeline.push({
      nums: [...nums], i, l, r, res: [...res],
      desc: `l >= r, so inner loop ends for i=${i}.`,
      activeLines: [7],
      logic: `'l' >= 'r'. Inner loop finished for this 'i'.`, logicClass: 'info', activeStep: 4
    });
  }

  timeline.push({
    nums: [...nums], i: n, l: -1, r: -1, res: [...res],
    desc: `Skipping ahead, no more valid triplets can be formed. The algorithm is finished.`,
    activeLines: [16],
    logic: `No more valid triplets can be formed.<br/><strong style="color:var(--green)">Done!</strong>`, logicClass: 'success', activeStep: 4
  });

  return timeline;
};

const CONSTRAINTS = (
  <>
    <div><code>3 &lt;= nums.length &lt;= 3000</code></div>
    <div><code>-10⁵ &lt;= nums[i] &lt;= 10⁵</code></div>
  </>
);

const DEFAULT_JAVA = `import java.util.List;\nimport java.util.ArrayList;\n\nclass Main {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def threeSum(self, nums) -> list[list[int]]:\n        # Write your code here\n        pass`;

export default function ThreeSum({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([-1,0,1,2,-1,-4]);
  const [timeline, setTimeline] = useState(() => generateTimeline([-1,0,1,2,-1,-4]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      const n = parsed.length;
      const sorted = [...parsed].sort((a,b)=>a-b);
      const res: number[][] = [];
      for (let i = 0; i < n - 2; i++) {
        if (i > 0 && sorted[i] === sorted[i - 1]) continue;
        let l = i + 1, r = n - 1;
        while (l < r) {
          const sum = sorted[i] + sorted[l] + sorted[r];
          if (sum === 0) {
            res.push([sorted[i], sorted[l], sorted[r]]);
            while (l < r && sorted[l] === sorted[l+1]) l++;
            while (l < r && sorted[r] === sorted[r-1]) r--;
            l++; r--;
          } else if (sum < 0) l++;
          else r--;
        }
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: `[${res.map(t => `[${t.join(',')}]`).join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [-1,0,1,2,-1,-4]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        List<List<Integer>> res = threeSum(nums);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().threeSum(nums)\n    print(res)`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="3Sum" lcNum="15" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="3Sum" lcNum="15" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
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
            
            <ApproachBanner icon={<Users size={20} />} title="Sort & Reduce to Two Sum"
              lines={["1. Sort the array so we can easily skip duplicates.", "2. Fix one number (i), then use two pointers (l and r) to find the remaining sum."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays & Pointers
              </div>
              <div className="arr-section-label">Sorted nums</div>
              <div className="arr-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="arr-row">
                  {current.nums.map((val, idx) => {
                    let c = '';
                    if (current.i === idx) c = 'p2'; // Yellow/orange for fixed
                    else if (current.l === idx) c = 'l'; // Pink
                    else if (current.r === idx) c = 'r'; // Sky
                    else if (idx < current.i) c = 'visited';
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
                {current.nums.map((_, idx) => {
                  let lbl = ''; let c = '';
                  if (current.i === idx) { lbl = 'i'; c = 'yellow'; }
                  if (current.l === idx) { lbl = 'l'; c = 'pink'; }
                  if (current.r === idx) { lbl = 'r'; c = 'sky'; }
                  return <div key={idx} className={`ptr-cell ${c}`}>{lbl}</div>;
                })}
              </div>
              
              <div className="arr-section-label" style={{ marginTop: '32px' }}>Found Triplets</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', minHeight: '40px' }}>
                {current.res.length === 0 && <div style={{ color: 'var(--muted)' }}>No triplets found yet.</div>}
                {current.res.map((triplet, idx) => (
                  <div key={idx} style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                    [{triplet.join(', ')}]
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">i (fixed)</div>
                  <div className="st-val">{current.i < current.nums.length ? current.i : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">l (left ptr)</div>
                  <div className="st-val">{current.l !== -1 ? current.l : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">r (right ptr)</div>
                  <div className="st-val">{current.r !== -1 ? current.r : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Sum</div>
                  <div className="st-val">{(current.l !== -1 && current.r !== -1 && current.l < current.nums.length && current.r < current.nums.length) ? current.nums[current.i] + current.nums[current.l] + current.nums[current.r] : '-'}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Finding Triplets"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="3Sum"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public List<List<Integer>> threeSum(int[] nums) {",
                "    Arrays.sort(nums);",
                "    for (int i = 0; i < nums.length - 2; i++) {",
                "        if (i > 0 && nums[i] == nums[i - 1]) continue;",
                "        int l = i + 1;",
                "        int r = nums.length - 1;",
                "        while (l < r) {",
                "            int sum = nums[i] + nums[l] + nums[r];",
                "            if (sum == 0) {",
                "                res.add(Arrays.asList(nums[i], nums[l], nums[r]));",
                "                l++; r--;",
                "            } else if (sum < 0) {",
                "                l++;",
                "            } else {",
                "                r--;",
                "            }",
                "        }",
                "    }",
                "    return res;",
                "}"
              ]}
              pythonCode={[
                "def threeSum(nums):",
                "    nums.sort()",
                "    for i in range(len(nums) - 2):",
                "        if i > 0 and nums[i] == nums[i - 1]:",
                "            continue",
                "        l, r = i + 1, len(nums) - 1",
                "        while l < r:",
                "            s = nums[i] + nums[l] + nums[r]",
                "            if s == 0:",
                "                res.append([nums[i], nums[l], nums[r]])",
                "                l += 1; r -= 1",
                "            elif s < 0:",
                "                l += 1",
                "            else:",
                "                r -= 1",
                "    return res"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Sort the array. Iterate i from 0 to n-2." },
                { num: 2, txt: "Use two pointers, l and r, to find a sum of 0 for the fixed i." },
                { num: 3, txt: "If sum == 0, save triplet. Move both l and r inward." },
                { num: 4, txt: "Skip any duplicate elements for i, l, or r to avoid duplicate triplets." }
              ]} 
            />
            <Complexity time="O(n²)" space="O(1) or O(n) depending on sorting algorithm" />
            <WhyItWorks paragraphs={[
              <>Trying every combination of three numbers requires three nested loops, which takes <code>O(n³)</code> time.</>,
              <>By <strong>sorting the array</strong> first (which takes <code>O(n log n)</code>), we can fix one number (<code>i</code>), and then find the remaining two numbers using the optimal <code>O(n)</code> <strong>Two Pointers</strong> strategy.</>,
              <>This reduces our overall time complexity to <code>O(n²)</code>. Sorting also guarantees that duplicate elements are adjacent, making it trivial to skip them to ensure all returned triplets are unique!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
