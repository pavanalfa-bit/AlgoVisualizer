import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
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

const EDGE_CASES = [
  "nums = [-5,-4,-3,-2,-1]",
  "nums = [1,2,3,4,5]",
  "nums = [-100,0,100]",
  "nums = [-2,-1,0]"
];

const generateTimeline = (arr: number[]) => {
  const timeline: any[] = [];
  const nums = [...arr];
  const n = nums.length;
  const res = Array(n).fill(null);
  let l = 0;
  let r = n - 1;
  let p = n - 1;
  
  timeline.push({
    nums: [...nums], res: [...res],
    l, r, p,
    desc: "Initialize left pointer (l) at the start, right pointer (r) at the end, and p at the end of the result array.",
    activeLines: [2, 3, 4],
    logic: `<strong>Init:</strong> Set \`l = 0\`, \`r = ${n - 1}\`, and \`p = ${n - 1}\` (write backwards).`, logicClass: 'info', activeStep: 1
  });

  while (l <= r) {
    if (Math.abs(nums[l]) > Math.abs(nums[r])) {
      const sq = nums[l] * nums[l];
      res[p] = sq;
      timeline.push({
        nums: [...nums], res: [...res],
        l, r, p,
        desc: `|${nums[l]}| > |${nums[r]}|, so square ${nums[l]} (${sq}) and place at result[p]. Increment l, decrement p.`,
        activeLines: [5, 6, 7, 8],
        logic: `|${nums[l]}| > |${nums[r]}|. <strong style="color:var(--pink)">(${nums[l]})² = ${sq}</strong>.<br/>Write ${sq} to result array. Move \`l\` right.`, logicClass: 'info', activeStep: 2
      });
      l++;
    } else {
      const sq = nums[r] * nums[r];
      res[p] = sq;
      timeline.push({
        nums: [...nums], res: [...res],
        l, r, p,
        desc: `|${nums[r]}| >= |${nums[l]}|, so square ${nums[r]} (${sq}) and place at result[p]. Decrement r and p.`,
        activeLines: [5, 6, 10, 11],
        logic: `|${nums[r]}| >= |${nums[l]}|. <strong style="color:var(--sky)">(${nums[r]})² = ${sq}</strong>.<br/>Write ${sq} to result array. Move \`r\` left.`, logicClass: 'info', activeStep: 2
      });
      r--;
    }
    p--;
  }

  timeline.push({
    nums: [...nums], res: [...res],
    l, r, p,
    desc: "l > r. The loop terminates and the result array is fully populated.",
    activeLines: [13],
    logic: '`l` > `r`. Array fully processed.<br/><strong style="color:var(--green)">Done!</strong>', logicClass: 'success', activeStep: 3
  });

  return timeline;
};

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
  
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([-4, -1, 0, 3, 10]);
  const [timeline, setTimeline] = useState(() => generateTimeline([-4, -1, 0, 3, 10]));

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
      const res = Array(n).fill(0);
      let l = 0, r = n - 1, p = n - 1;
      while (l <= r) {
        if (Math.abs(parsed[l]) > Math.abs(parsed[r])) {
          res[p] = parsed[l] * parsed[l];
          l++;
        } else {
          res[p] = parsed[r] * parsed[r];
          r--;
        }
        p--;
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: `[${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [-4,-1,0,3,10]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int[] res = sortedSquares(nums);\n        System.out.println(java.util.Arrays.toString(res));\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().sortedSquares(nums)\n    print(res)`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Squares of a Sorted Array" lcNum="977" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Squares of a Sorted Array" lcNum="977" difficulty="Easy" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
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
