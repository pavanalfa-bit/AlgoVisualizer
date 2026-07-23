import React, { useState } from 'react';
import { Scissors, CheckCircle2, SlidersHorizontal, SquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is <strong>minimized</strong>.</p>
    <p>Return the minimized largest sum of the split.</p>
    <p>A <strong>subarray</strong> is a contiguous part of the array.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [7,2,5,10,8], k = 2', 
    output: '18',
    explanation: <>There are four ways to split nums into two subarrays. The best way is to split it into [7,2,5] and [10,8], where the largest sum among the two subarrays is only 18.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [1,2,3,4,5], k = 2', 
    output: '9',
    explanation: <>Split into [1,2,3] and [4,5]. Largest sum is 9.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 1000</code></div>
    <div><code>0 &lt;= nums[i] &lt;= 10⁶</code></div>
    <div><code>1 &lt;= k &lt;= min(50, nums.length)</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int splitArray(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def splitArray(self, nums: list[int], k: int) -> int:\n        # Write your code here\n        pass`;

const NUMS = [7, 2, 5, 10, 8];
const K = 2;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const maxNum = Math.max(...NUMS);
  const sumNum = NUMS.reduce((a, b) => a + b, 0);
  
  timeline.push({
    l: maxNum, r: sumNum, mid: -1, splits: 0, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: `Initialize L = ${maxNum} (max element, since a subarray must hold at least the largest element) and R = ${sumNum} (sum of array, all in 1 subarray).`,
    logic: `<strong>Init:</strong> L = ${maxNum}, R = ${sumNum}`, logicClass: 'info'
  });

  let l = maxNum;
  let r = sumNum;

  while (l < r) {
    timeline.push({
      l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, splits: 0, returned: null, phase: 'calc_mid',
      activeLines: [5], activeStep: 3,
      desc: `Try a max subarray sum of mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `Max Sum = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    let splits = 1;
    let currentSum = 0;
    
    timeline.push({
      l, r, mid, splits, returned: null, phase: 'calc_splits_start',
      activeLines: [6, 7], activeStep: 4,
      desc: `Simulate splitting the array with max sum ${mid}. Start with 1 subarray.`,
      logic: `Simulating splits...`, logicClass: 'info'
    });

    for (let i = 0; i < NUMS.length; i++) {
      const num = NUMS[i];
      if (currentSum + num > mid) {
        splits++;
        currentSum = 0;
        timeline.push({
          l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_new',
          activeLines: [9, 10, 11], activeStep: 4,
          desc: `Adding ${num} exceeds the limit ${mid}! We must start a new subarray. Subarrays count is now ${splits}.`,
          logic: `Limit exceeded! New subarray: ${splits}`, logicClass: 'warning'
        });
      }
      currentSum += num;
      timeline.push({
        l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_step',
        activeLines: [13], activeStep: 4,
        desc: `Add ${num} to the current subarray. Current sum is ${currentSum} / ${mid}.`,
        logic: `Add: <strong style="color:var(--sky)">${currentSum}</strong> / ${mid}`, logicClass: 'info'
      });
    }

    timeline.push({
      l, r, mid, splits, returned: null, phase: 'compare_splits',
      activeLines: [16], activeStep: 5,
      desc: `It requires ${splits} subarrays if the max sum is ${mid}. We are allowed ${K} subarrays. Did we use too many?`,
      logic: `Is <strong style="color:var(--sky)">${splits}</strong> <= <strong style="color:var(--green)">${K}</strong>?`, logicClass: 'warning'
    });

    if (splits <= K) {
      r = mid;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_ok',
        activeLines: [17], activeStep: 6,
        desc: `Yes, ${splits} <= ${K}. We were able to split it into ${K} or fewer subarrays! This max sum works. Let's try to find a strictly smaller max sum by moving R to mid (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_bad',
        activeLines: [18, 19], activeStep: 7,
        desc: `No, ${splits} > ${K}. We used too many subarrays because our limit (${mid}) was too small! We MUST allow a larger max sum: L = mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
    activeLines: [4], activeStep: 2,
    desc: `Check if L (${l}) < R (${r}). False! L and R have converged.`,
    logic: `L < R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  timeline.push({
    l, r, mid: -1, splits: 0, returned: l, phase: 'found',
    activeLines: [22], activeStep: 8,
    desc: `The minimized largest sum is ${l}. Return it!`,
    logic: `<strong style="color:var(--green)">Return ${l}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function SplitArrayLargestSum({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Split Array Largest Sum" lcNum="410" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Split Array Largest Sum" lcNum="410" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Scissors size={20} />} title="Minimizing the Maximum"
              lines={["When a problem asks to 'minimize the largest' or 'maximize the smallest', it's almost always Binary Search on Answer.", "Guess the answer (the largest sum limit). If the limit is too small, it forces us to make too many splits.", "If the limit is large enough, we can easily fit the array into k or fewer splits!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Subarray Split Simulation
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Allowed Splits (k)</div>
                    <strong style={{ color: 'var(--green)', fontSize: '1.5rem' }}>{K}</strong>
                  </div>
                  
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: `2px dashed ${current.phase === 'compare_splits' ? (current.splits <= K ? 'var(--green)' : 'var(--pink)') : 'var(--sky)'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Used Splits @ limit={current.mid !== -1 ? current.mid : '?'}</div>
                    <strong style={{ color: current.phase === 'compare_splits' ? (current.splits <= K ? 'var(--green)' : 'var(--pink)') : 'var(--sky)', fontSize: '1.5rem' }}>{current.splits}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '0 20px', flexWrap: 'wrap' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = (current.phase === 'calc_splits_step' || current.phase === 'calc_splits_new') && current.activeItem === idx;
                    const isProcessed = (current.phase === 'calc_splits_step' || current.phase === 'calc_splits_new') && idx < current.activeItem;
                    const isFullyProcessed = ['compare_splits', 'splits_ok', 'splits_bad'].includes(current.phase);
                    
                    let bg = 'var(--surface)';
                    let border = 'var(--border-strong)';
                    let opacity = 1;

                    if (isActive) {
                      bg = 'var(--viz-blue-bg)';
                      border = 'var(--accent)';
                    } else if (isProcessed || isFullyProcessed) {
                      bg = 'var(--viz-sky-bg)';
                      border = 'var(--sky)';
                    }

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity }}>
                        <motion.div 
                          layout
                          style={{
                            width: `${Math.max(48, num * 8)}px`, height: '48px',
                            background: bg, border: `2px solid ${border}`,
                            borderRadius: '4px', position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <span style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 'bold' }}>{num}</span>
                        </motion.div>
                        {isActive && <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', marginTop: '55px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>+ {num}</motion.div>}
                      </div>
                    );
                  })}
                </div>
                
                {/* Subarray progress bar */}
                {(current.phase.startsWith('calc_splits') || ['compare_splits', 'splits_ok', 'splits_bad'].includes(current.phase)) && current.mid !== -1 && (
                  <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>Subarray {current.splits} Sum</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>{current.currentSum || 0} / {current.mid} Limit</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'var(--surface2)', borderRadius: '6px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={false}
                        animate={{ width: `${Math.min(100, ((current.currentSum || 0) / current.mid) * 100)}%` }}
                        style={{ height: '100%', background: 'var(--sky)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Search Space (Max Sum Limit)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Sum Limit</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid !== -1 ? current.mid : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned</div>
                  <div className="st-val" style={{ color: current.returned !== null ? 'var(--green)' : 'var(--muted)' }}>
                    {current.returned !== null ? current.returned : '-'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Simulating"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Split Array Largest Sum"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int splitArray(int[] nums, int k) {",
                "    int l = max(nums);",
                "    int r = sum(nums);",
                "    while (l < r) {",
                "        int mid = l + (r - l) / 2;",
                "        int splits = 1;",
                "        int currentSum = 0;",
                "        for (int num : nums) {",
                "            if (currentSum + num > mid) {",
                "                splits++;",
                "                currentSum = 0;",
                "            }",
                "            currentSum += num;",
                "        }",
                "        ",
                "        if (splits <= k) {",
                "            r = mid;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "def splitArray(self, nums: list[int], k: int) -> int:",
                "    l = max(nums)",
                "    r = sum(nums)",
                "    while l < r:",
                "        mid = (l + r) // 2",
                "        splits = 1",
                "        current_sum = 0",
                "        for num in nums:",
                "            if current_sum + num > mid:",
                "                splits += 1",
                "                current_sum = 0",
                "                ",
                "            current_sum += num",
                "            ",
                "        if splits <= k:",
                "            r = mid",
                "        else:",
                "            l = mid + 1",
                "            ",
                "            ",
                "    return l"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to max(nums) (the absolute minimum possible subarray sum is just the largest element by itself) and R to sum(nums) (if k=1, the sum is everything)." },
                { num: 2, txt: "Loop while L < R." },
                { num: 3, txt: "Calculate a mid capacity (our 'guess' for the max sum)." },
                { num: 4, txt: "Greedily simulate splitting. Iterate through nums, if adding the next number exceeds mid, we MUST make a cut here and start a new subarray." },
                { num: 5, txt: "Check if the total splits needed <= k." },
                { num: 6, txt: "If YES, we successfully split it in k or fewer pieces. But we want to MINIMIZE the sum, so try an even smaller limit: R = mid." },
                { num: 7, txt: "If NO, we used more than k splits. Our limit was too strict (too small). We MUST increase the limit: L = mid + 1." },
                { num: 8, txt: "When L meets R, we've found the exact minimized maximum sum. Return L." }
              ]} 
            />
            <Complexity time="O(N * log(sum - max))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is identical to "Capacity to Ship Packages Within D Days". Instead of shipping packages in D days, we are splitting numbers into K subarrays. The logic is exactly the same!</>,
              <>If we set a really small limit for our subarrays, we will be forced to make many cuts, resulting in many subarrays. If we set a really large limit, we can fit everything into fewer subarrays. We binary search the limit to find the sweet spot where the splits perfectly match <code>K</code>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
