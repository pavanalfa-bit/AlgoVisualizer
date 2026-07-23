import React, { useState } from 'react';
import { Replace, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an unsorted integer array <code>nums</code>. Return the <em>smallest positive integer</em> that is not present in <code>nums</code>.</p>
    <p>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [1,2,0]', 
    output: '3',
    explanation: <>The numbers in the range [1,2] are all in the array.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [3,4,-1,1]', 
    output: '2',
    explanation: <>1 is in the array but 2 is missing.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [7,8,9,11,12]', 
    output: '1',
    explanation: <>The smallest positive integer 1 is missing.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁵</code></div>
    <div><code>-2³¹ &lt;= nums[i] &lt;= 2³¹ - 1</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int firstMissingPositive(int[] nums) {\n        // Write your code here\n        return 1;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def firstMissingPositive(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [3, 4, -1, 1];


const EDGE_CASES = [
  "nums = [1,2,3,4,5]",
  "nums = [7,8,9,11,12]",
  "nums = [3,4,-1,1]",
  "nums = [1,1,1]"
];

const generateTimeline = (nums: number[]) => {
  const timeline: any[] = [];
  const arr = [...nums];
  const n = arr.length;
  
  timeline.push({
    arr: [...arr], i: 0, scanI: -1, foundResult: -1,
    activeLines: [2], activeStep: 1,
    desc: "Start iterating through the array to place each number in its 'correct' index (i.e., number X should be at index X-1).",
    logic: `<strong>Phase 1: Cyclic Sort</strong><br/>Target: value <strong style="color:var(--sky)">X</strong> should be at index <strong style="color:var(--sky)">X-1</strong>.`, logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i, scanI: -1, foundResult: -1,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if nums[${i}] (${arr[i]}) can be placed at its correct index (${arr[i] - 1}).`,
      logic: `Checking value <strong style="color:var(--sky)">${arr[i]}</strong> at index ${i}.`, logicClass: 'info'
    });

    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
      const val = arr[i];
      const targetIdx = val - 1;
      
      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapReady: true,
        activeLines: [4, 5], activeStep: 3,
        desc: `${val} belongs at index ${targetIdx}. It's currently at index ${i}. We need to swap them!`,
        logic: `Value <strong style="color:var(--sky)">${val}</strong> belongs at index <strong style="color:var(--pink)">${targetIdx}</strong>.<br/>Swapping ${arr[i]} and ${arr[targetIdx]}...`, logicClass: 'warning'
      });

      // Swap
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;

      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapped: true,
        activeLines: [6, 7], activeStep: 4,
        desc: `Swapped! Now index ${targetIdx} has the correct value ${val}. We check the new value at index ${i} (${arr[i]}).`,
        logic: `Successfully placed <strong style="color:var(--sky)">${val}</strong> at index ${targetIdx}.<br/>Checking new value at index ${i}...`, logicClass: 'success'
      });
    }

    if (arr[i] <= 0 || arr[i] > n || arr[arr[i] - 1] === arr[i]) {
      timeline.push({
        arr: [...arr], i, scanI: -1, foundResult: -1,
        activeLines: [4], activeStep: 2,
        desc: `Value ${arr[i]} at index ${i} is either out of bounds (<= 0 or > ${n}) or already in its correct place. Move to next index.`,
        logic: `Value <strong style="color:var(--sky)">${arr[i]}</strong> is ignored or already correct.<br/>Moving on.`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    arr: [...arr], i: n, scanI: 0, foundResult: -1,
    activeLines: [10], activeStep: 5,
    desc: "Phase 1 complete! The array now acts as a Hash Table. Phase 2: Scan to find the first missing positive.",
    logic: `<strong>Phase 2: Scanning</strong><br/>Find the first index 'i' where nums[i] != i+1.`, logicClass: 'info'
  });

  let result = n + 1;
  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i: n, scanI: i, foundResult: -1,
      activeLines: [11], activeStep: 6,
      desc: `Check if index ${i} holds the value ${i + 1}.`,
      logic: `Is nums[${i}] == ${i + 1}?<br/>${arr[i] === i + 1 ? 'Yes.' : `<strong style="color:var(--pink)">No! (${arr[i]} != ${i + 1})</strong>`}`, logicClass: arr[i] === i + 1 ? 'info' : 'warning'
    });

    if (arr[i] !== i + 1) {
      result = i + 1;
      timeline.push({
        arr: [...arr], i: n, scanI: i, foundResult: result,
        activeLines: [12], activeStep: 7,
        desc: `Index ${i} does NOT hold the value ${i + 1}. Therefore, ${i + 1} is the first missing positive!`,
        logic: `<strong style="color:var(--green)">Success!</strong> First missing positive is <strong>${result}</strong>.`, logicClass: 'success'
      });
      break;
    }
  }

  if (result === n + 1) {
    timeline.push({
      arr: [...arr], i: n, scanI: n, foundResult: result,
      activeLines: [14], activeStep: 8,
      desc: `All values from 1 to ${n} are present. The first missing positive is ${n + 1}.`,
      logic: `<strong style="color:var(--green)">Success!</strong> All present. Next missing is <strong>${result}</strong>.`, logicClass: 'success'
    });
  }

  return timeline;
};


export default function FirstMissingPositive({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([3, 4, -1, 1]);
  const [timeline, setTimeline] = useState(() => generateTimeline([3, 4, -1, 1]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      const arr = [...parsed];
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
          const target = arr[i] - 1;
          const temp = arr[i];
          arr[i] = arr[target];
          arr[target] = temp;
        }
      }
      let res = n + 1;
      for (let i = 0; i < n; i++) {
        if (arr[i] !== i + 1) {
          res = i + 1;
          break;
        }
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: res.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [3,4,-1,1]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {
        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};
        int res = firstMissingPositive(nums);
        System.out.println(res);
    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":
    nums = ${clean}
    res = Solution().firstMissingPositive(nums)
    print(res)`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="First Missing Positive" lcNum="41" difficulty="Hard" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('nums = ')) pr = pr.substring(7);
                const inputArr = examples[idx].nums || JSON.parse(pr);
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
      <VPHeader title="First Missing Positive" lcNum="41" difficulty="Hard" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
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
            
            <ApproachBanner icon={<Replace size={20} />} title="In-place Hashing (Cyclic Sort)"
              lines={["Since we want O(1) space, we use the input array itself as a Hash Table!", "Goal: Place value 'X' at index 'X-1' (e.g., place '1' at index 0).", "After organizing, scan the array. The first index 'i' where nums[i] != i+1 means 'i+1' is missing."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Array (In-place Hash Table)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'wrap' }}>
                  <AnimatePresence mode="popLayout">
                    {current.arr.map((num: number, i: number) => {
                      const isI = current.i === i;
                      const isScan = current.scanI === i;
                      const isTarget = current.targetIdx === i && current.swapReady;
                      const isCorrect = num === i + 1;
                      
                      return (
                        <motion.div 
                          key={`${i}-${num}`} // Force re-render on swap to animate physically
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="array-block-wrapper" style={{ zIndex: 1 }}
                        >
                          <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                            {isI && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>i</span>}
                            {isTarget && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>Target</span>}
                            {isScan && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Scan</span>}
                          </div>
                          
                          <motion.div 
                            className={`array-block ${isI || isTarget || isScan ? 'highlight' : ''}`}
                            style={{
                              width: '48px',
                              height: '48px',
                              background: isScan && !isCorrect ? 'var(--viz-red-bg)' : isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'var(--surface)',
                              borderColor: isTarget ? 'var(--pink)' : isScan && !isCorrect ? 'var(--hard)' : isI ? 'var(--sky)' : isCorrect ? 'var(--easy)' : 'var(--border)',
                              color: 'var(--text)',
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {num}
                          </motion.div>
                          
                          <div className="array-index" style={{ fontSize: '0.8rem', color: isCorrect ? 'var(--easy)' : 'var(--muted)', marginTop: '4px' }}>
                            Idx {i} <br/> (Needs {i+1})
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Phase</div>
                  <div className="st-val">{current.i < nums.length ? '1 (Sorting)' : '2 (Scanning)'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Result</div>
                  <div className="st-val" style={{ color: current.foundResult !== -1 ? 'var(--easy)' : 'var(--muted)' }}>
                    {current.foundResult !== -1 ? current.foundResult : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === timeline.length - 1 ? "Done!" : "In-place Hashing"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="First Missing Positive"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int firstMissingPositive(int[] nums) {",
                "    int n = nums.length;",
                "    for (int i = 0; i < n; i++) {",
                "        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {",
                "            int targetIdx = nums[i] - 1;",
                "            int temp = nums[i];",
                "            nums[i] = nums[targetIdx];",
                "            nums[targetIdx] = temp;",
                "        }",
                "    }",
                "    for (int i = 0; i < n; i++) {",
                "        if (nums[i] != i + 1) {",
                "            return i + 1;",
                "        }",
                "    }",
                "    return n + 1;",
                "}"
              ]}
              pythonCode={[
                "def firstMissingPositive(nums):",
                "    n = len(nums)",
                "    for i in range(n):",
                "        while 0 < nums[i] <= n and nums[nums[i] - 1] != nums[i]:",
                "            target = nums[i] - 1",
                "            # Swap elements",
                "            nums[i], nums[target] = nums[target], nums[i]",
                "            ",
                "            ",
                "    for i in range(n):",
                "        if nums[i] != i + 1:",
                "            return i + 1",
                "            ",
                "    return n + 1"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Phase 1: Iterate through the array." },
                { num: 2, txt: "Check if the current number is positive, within the array bounds (<= n), and not already at its correct index." },
                { num: 3, txt: "If the conditions are met, we determine its correct target index (num - 1)." },
                { num: 4, txt: "Swap the current number with the number at the target index. Keep checking the new number at this index (using a while loop)." },
                { num: 5, txt: "Phase 2: Iterate through the sorted array." },
                { num: 6, txt: "Check if the value at index 'i' is exactly 'i + 1'." },
                { num: 7, txt: "If a mismatch is found, 'i + 1' is the first missing positive!" },
                { num: 8, txt: "If no mismatch is found, all numbers 1 to N are present. The first missing positive is N + 1." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Since we are looking for the first missing positive, the answer must be between <code>1</code> and <code>N + 1</code> (where <code>N</code> is the length of the array).</>,
              <>Because the answer is strictly bounded by the array's length, we can use the array itself as a Hash Table! We try to place <code>1</code> at index 0, <code>2</code> at index 1, etc.</>,
              <>After we finish sorting, we just scan from left to right. The first "empty" slot (where <code>nums[i] != i+1</code>) reveals our missing number. If all slots are filled correctly, the missing number is just <code>N + 1</code>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
