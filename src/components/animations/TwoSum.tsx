import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, PracticeWorkspace, ProblemStatement 
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [2,7,11,15], target = 9', 
    output: '[0,1]',
    explanation: <>Because <code>nums[0] + nums[1] == 9</code>, we return <code>[0, 1]</code>.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [3,2,4], target = 6', 
    output: '[1,2]',
  },
  { 
    label: 'Example 3', 
    input: 'nums = [3,3], target = 6', 
    output: '[0,1]',
  }
];

const CONSTRAINTS = (
  <>
    <div><code>2 &lt;= nums.length &lt;= 10⁴</code></div>
    <div><code>-10⁹ &lt;= nums[i] &lt;= 10⁹</code></div>
    <div><code>-10⁹ &lt;= target &lt;= 10⁹</code></div>
    <div><strong>Only one valid answer exists.</strong></div>
    <div style={{ marginTop: '12px', color: 'var(--text)' }}><strong>Follow-up: </strong>Can you come up with an algorithm that is less than <code>O(n²)</code> time complexity?</div>
  </>
);

const arr = [2, 7, 11, 15];
const target = 9;

export default function TwoSum({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  const steps = [
    { i: 0, map: {}, highlight: 0, line: 2, msg: 'Initialize empty hash map.', logic: '<strong>Init:</strong> Create an empty hash map to store `value: index` pairs.', logicClass: 'info', activeStep: 1 },
    { i: 0, map: {}, highlight: 0, line: 4, msg: 'i = 0. Current val = 2. Complement = 9 - 2 = 7.', logic: 'Current element: <strong style="color:var(--blue)">2</strong>. <br/>Complement needed: 9 - 2 = <strong style="color:var(--orange)">7</strong>.', logicClass: '', activeStep: 2 },
    { i: 0, map: {}, highlight: 0, line: 5, msg: 'Does map contain 7? No.', logic: 'Check map for <strong style="color:var(--orange)">7</strong>. Not found.', logicClass: '', activeStep: 2 },
    { i: 0, map: { 2: 0 }, highlight: 0, line: 8, msg: 'Add (2: index 0) to map.', logic: 'Add <strong style="color:var(--blue)">2</strong> to map with index <strong>0</strong>.', logicClass: '', activeStep: 3 },
    { i: 1, map: { 2: 0 }, highlight: 1, line: 4, msg: 'i = 1. Current val = 7. Complement = 9 - 7 = 2.', logic: 'Current element: <strong style="color:var(--blue)">7</strong>. <br/>Complement needed: 9 - 7 = <strong style="color:var(--orange)">2</strong>.', logicClass: '', activeStep: 2 },
    { i: 1, map: { 2: 0 }, highlight: 1, line: 5, msg: 'Does map contain 2? Yes! (At index 0)', logic: 'Check map for <strong style="color:var(--orange)">2</strong>. Found it at index <strong>0</strong>!', logicClass: 'success', activeStep: 4 },
    { i: 1, map: { 2: 0 }, highlight: 1, line: 6, msg: 'Return [0, 1]. Solved!', logic: '<strong style="color:var(--green)">Success!</strong> Return [map[2], 1] → <strong>[0, 1]</strong>.', logicClass: 'success', activeStep: 4, success: true },
  ];

  const currentStep = steps[step];

  useEffect(() => {
    let timer: any;
    if (isPlaying && step < steps.length - 1) {
      const speeds = [1500, 1000, 700, 400, 200];
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, speeds[speed]);
    } else if (step >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, steps.length, speed]);

  if (tab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Two Sum" lcNum="1" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={tab} onTabChange={setTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={EXAMPLES}
          constraints={CONSTRAINTS}
          defaultCodeJava={`class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`}
          defaultCodePython={`class Solution:\n    def twoSum(self, nums, target):\n        # Write your code here\n        pass`}
        />
      </VisualizerLayout>
    );
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Two Sum" lcNum="1" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={tab} onTabChange={setTab} />
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>
      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={setStep} onPlayToggle={() => setIsPlaying(!isPlaying)} onSpeedChange={setSpeed} />
            <ApproachBanner icon={<Search size={20} />} title="One-Pass Hash Map"
              lines={["Iterate through the array.", "For each element, check if (target - element) exists in our hash map.", "If it does, we found our pair! If not, add the current element and its index to the map."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Arrays & Hash Map
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>nums array</div>
                <div style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Target: {target}
                </div>
              </div>

              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto' }}>
                  {arr.map((val, idx) => {
                    const isHighlight = currentStep.highlight === idx;
                    const isSuccess = currentStep.success && (idx === currentStep.highlight || (currentStep.map as any)[target - val] === idx);
                    return (
                      <div key={idx} className="array-block-wrapper">
                        {currentStep.i === idx && (
                          <motion.div layoutId="pointer" className="pointer pointer-left">
                            i
                          </motion.div>
                        )}
                        <motion.div 
                          layout
                          className={`array-block ${isHighlight ? 'highlight' : ''} ${isSuccess ? 'success' : ''}`}
                        >
                          {val}
                        </motion.div>
                        <div className="array-index">{idx}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Hash Map visualization */}
                <div style={{ marginTop: '40px', width: '200px', margin: '40px auto 0', background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Hash Map</h3>
                  {Object.keys(currentStep.map).length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>Empty</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(currentStep.map).map(([key, val]) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={key} 
                          style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          <span style={{ color: 'var(--accent)' }}>Key: {key}</span>
                          <span style={{ color: 'var(--muted)' }}>Idx: {val as number}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">i (index)</div>
                  <div className="st-val">{currentStep.i}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current val</div>
                  <div className="st-val">{arr[currentStep.highlight]}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Complement</div>
                  <div className="st-val">{target - arr[currentStep.highlight]}</div>
                </div>
              </div>
            </div>

            <StepLogic html={currentStep.logic} logicClass={currentStep.logicClass} />

            <StepCard title={step === steps.length - 1 ? "Done!" : "Hashing Array"} desc={currentStep.msg} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Two Sum"
              activeLinesJava={[currentStep.line]}
              activeLinesPy={[currentStep.line]}
              javaCode={[
                "public int[] twoSum(int[] nums, int target) {",
                "    Map<Integer, Integer> map = new HashMap<>();",
                "    for (int i = 0; i < nums.length; i++) {",
                "        int complement = target - nums[i];",
                "        if (map.containsKey(complement)) {",
                "            return new int[]{map.get(complement), i};",
                "        }",
                "        map.put(nums[i], i);",
                "    }",
                "    return new int[]{};",
                "}"
              ]}
              pythonCode={[
                "def twoSum(nums, target):",
                "    map = {}",
                "    for i, num in enumerate(nums):",
                "        complement = target - num",
                "        if complement in map:",
                "            return [map[complement], i]",
                "        map[num] = i",
                "    return []"
              ]}
            />
            <AlgorithmList 
              activeStep={currentStep.activeStep}
              steps={[
                { num: 1, txt: "Create an empty hash map" },
                { num: 2, txt: "Iterate through the array. Calculate complement = target - num" },
                { num: 3, txt: "If complement is not in map, add (num, index) to map" },
                { num: 4, txt: "If complement is in map, we found a match! Return indices." }
              ]} 
            />
            <Complexity time="O(n)" space="O(n)" />
            <WhyItWorks paragraphs={[
              <>Instead of checking every pair with a nested loop (<code>O(n²)</code>), we trade space for time.</>,
              <>By storing numbers we've seen in a hash map, we can check if the needed complement exists in <code>O(1)</code> time. This drops the total time complexity to <code>O(n)</code>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
