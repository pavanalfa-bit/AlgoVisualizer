import React, { useState } from 'react';
import { Search, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>.</p>
    <p>If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [-1,0,3,5,9,12], target = 9', 
    output: '4',
    explanation: <>9 exists in nums and its index is 4.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [-1,0,3,5,9,12], target = 2', 
    output: '-1',
    explanation: <>2 does not exist in nums so return -1.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁴</code></div>
    <div><code>-10⁴ &lt;= nums[i], target &lt;= 10⁴</code></div>
    <div>All the integers in <code>nums</code> are <strong>unique</strong>.</div>
    <div><code>nums</code> is sorted in ascending order.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        pass`;

const NUMS = [-1, 0, 3, 5, 9, 12, 15];
const TARGET = 9;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  timeline.push({
    l: 0, r: NUMS.length - 1, mid: -1, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize the left (L) pointer to the start of the array and the right (R) pointer to the end.",
    logic: `<strong>Init:</strong> L = 0, R = ${NUMS.length - 1}`, logicClass: 'info'
  });

  let l = 0;
  let r = NUMS.length - 1;

  while (l <= r) {
    timeline.push({
      l, r, mid: -1, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) <= R (${r}). True, so the search space is valid.`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, returned: null, phase: 'calc_mid',
      activeLines: [5], activeStep: 3,
      desc: `Calculate the middle index: mid = (L + R) / 2 = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `mid = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    timeline.push({
      l, r, mid, returned: null, phase: 'compare',
      activeLines: [6], activeStep: 4,
      desc: `Check if the middle element nums[mid] (${NUMS[mid]}) equals the target (${TARGET}).`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> == <strong style="color:var(--green)">${TARGET}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] === TARGET) {
      timeline.push({
        l, r, mid, returned: mid, phase: 'found',
        activeLines: [7], activeStep: 5,
        desc: `Match found! Return the index ${mid}.`,
        logic: `<strong style="color:var(--green)">Match!</strong> Return ${mid}.`, logicClass: 'success'
      });
      break; // Exit loop, found it!
    } else {
      timeline.push({
        l, r, mid, returned: null, phase: 'compare_less',
        activeLines: [8], activeStep: 6,
        desc: `No match. Check if nums[mid] (${NUMS[mid]}) < target (${TARGET}).`,
        logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> < <strong style="color:var(--green)">${TARGET}</strong>?`, logicClass: 'warning'
      });

      if (NUMS[mid] < TARGET) {
        l = mid + 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'adjust_l',
          activeLines: [9], activeStep: 7,
          desc: `Yes, ${NUMS[mid]} < ${TARGET}. This means the target must be in the right half! Discard the left half by moving L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'success'
        });
      } else {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'adjust_r',
          activeLines: [10, 11], activeStep: 8,
          desc: `No, ${NUMS[mid]} > ${TARGET}. This means the target must be in the left half! Discard the right half by moving R to mid - 1 (${r}).`,
          logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
        });
      }
    }
  }

  if (l > r) {
    timeline.push({
      l, r, mid: -1, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) <= R (${r}). False! The search space is exhausted.`,
      logic: `L <= R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
    });

    timeline.push({
      l, r, mid: -1, returned: -1, phase: 'not_found',
      activeLines: [14], activeStep: 9,
      desc: `Target was not found in the array. Return -1.`,
      logic: `<strong style="color:var(--pink)">Not found.</strong> Return -1.`, logicClass: 'error'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function BinarySearch({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Binary Search" lcNum="704" difficulty="Easy" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Binary Search" lcNum="704" difficulty="Easy" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<SplitSquareHorizontal size={20} />} title="Divide and Conquer"
              lines={["Because the array is sorted, we can check the middle element.", "If it's smaller than the target, we know the target must be to its right. We discard the entire left half!", "If it's larger, we discard the right half. This halves the search space each time."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    Target = <strong style={{ color: 'var(--green)' }}>{TARGET}</strong>
                  </div>
                </div>

                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap' }}>
                  {NUMS.map((num: number, idx: number) => {
                    // Logic to determine states
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    const isTarget = isMid && current.phase === 'found';
                    const isComparing = isMid && (current.phase === 'compare' || current.phase === 'compare_less');
                    
                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let opacity = 1;

                    if (!isActive) {
                      bg = 'var(--surface2)';
                      border = 'var(--border-strong)';
                      opacity = 0.2; // Faded out entirely
                    } else if (isTarget) {
                      bg = 'var(--viz-green-bg)';
                      border = 'var(--green)';
                    } else if (isComparing) {
                      bg = 'var(--viz-yellow-bg)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'var(--viz-blue-bg)';
                      border = 'var(--accent)';
                    }

                    return (
                      <div key={idx} className="array-block-wrapper" style={{ zIndex: 1, opacity }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {idx === current.l && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className="array-block"
                          layout
                          style={{
                            width: '48px', height: '48px',
                            background: bg, borderColor: border,
                            color: 'var(--text)',
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {num}
                        </motion.div>
                        
                        <div style={{ height: '40px', textAlign: 'center', marginTop: '4px', display: 'flex', flexDirection: 'column' }}>
                          {isMid && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>mid</span>}
                          {idx === current.r && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)', marginTop: isMid ? '0px' : '0px' }}>R</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Index</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid !== -1 ? current.mid : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned Index</div>
                  <div className="st-val" style={{ color: current.returned !== null ? (current.returned === -1 ? 'var(--pink)' : 'var(--green)') : 'var(--muted)' }}>
                    {current.returned !== null ? current.returned : '-'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Searching"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Binary Search"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int search(int[] nums, int target) {",
                "    int l = 0;",
                "    int r = nums.length - 1;",
                "    while (l <= r) {",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] == target) {",
                "            return mid;",
                "        } else if (nums[mid] < target) {",
                "            l = mid + 1;",
                "        } else {",
                "            r = mid - 1;",
                "        }",
                "    }",
                "    return -1;",
                "}"
              ]}
              pythonCode={[
                "def search(self, nums: list[int], target: int) -> int:",
                "    l, r = 0, len(nums) - 1",
                "    ",
                "    while l <= r:",
                "        mid = (l + r) // 2",
                "        if nums[mid] == target:",
                "            return mid",
                "        elif nums[mid] < target:",
                "            l = mid + 1",
                "        else:",
                "            r = mid - 1",
                "            ",
                "    return -1"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize two pointers, L at 0 and R at the end of the array." },
                { num: 2, txt: "Loop while L <= R. This ensures we check the case where the search space is exactly 1 element." },
                { num: 3, txt: "Calculate the middle index. (In Java, use l + (r-l)/2 to prevent integer overflow)." },
                { num: 4, txt: "Check if the middle element is the target." },
                { num: 5, txt: "If it is, we found it! Return the middle index." },
                { num: 6, txt: "Check if the middle element is less than the target." },
                { num: 7, txt: "If less, the target must be to the right. Move L to mid + 1." },
                { num: 8, txt: "If greater, the target must be to the left. Move R to mid - 1." },
                { num: 9, txt: "If the loop finishes and we haven't returned, the target is not in the array. Return -1." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Because the array is sorted, every time we compare the middle element to the target, we can confidently eliminate half of the remaining elements.</>,
              <>If an array has <code>N</code> elements, eliminating half at each step means it takes at most <code>log₂(N)</code> steps to reach 1 element. This makes Binary Search incredibly fast—it can search a trillion elements in just 40 steps!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
