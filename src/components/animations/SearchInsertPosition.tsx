import React, { useState } from 'react';
import { ArrowDownToLine, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [1,3,5,6], target = 5', 
    output: '2',
    explanation: <>5 is found at index 2.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [1,3,5,6], target = 2', 
    output: '1',
    explanation: <>2 is not in the array, but it would be inserted at index 1 (between 1 and 3).</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁴</code></div>
    <div><code>-10⁴ &lt;= nums[i], target &lt;= 10⁴</code></div>
    <div><code>nums</code> contains <strong>distinct</strong> values sorted in ascending order.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int searchInsert(int[] nums, int target) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def searchInsert(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        pass`;

const NUMS = [1, 3, 5, 6, 8, 10];
const TARGET = 7;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  timeline.push({
    l: 0, r: NUMS.length - 1, mid: -1, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize the left (L) pointer and right (R) pointer for Binary Search.",
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
      desc: `Check if nums[mid] (${NUMS[mid]}) equals the target (${TARGET}).`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> == <strong style="color:var(--green)">${TARGET}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] === TARGET) {
      timeline.push({
        l, r, mid, returned: mid, phase: 'found',
        activeLines: [7], activeStep: 5,
        desc: `Match found! Return the index ${mid}.`,
        logic: `<strong style="color:var(--green)">Match!</strong> Return ${mid}.`, logicClass: 'success'
      });
      break; 
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
          desc: `Yes, ${NUMS[mid]} < ${TARGET}. Target is to the right. Move L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'success'
        });
      } else {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'adjust_r',
          activeLines: [10, 11], activeStep: 8,
          desc: `No, ${NUMS[mid]} > ${TARGET}. Target is to the left. Move R to mid - 1 (${r}).`,
          logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
        });
      }
    }
  }

  if (l > r) {
    timeline.push({
      l, r, mid: -1, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) <= R (${r}). False! The search space is exhausted and L has crossed R.`,
      logic: `L <= R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
    });

    timeline.push({
      l, r, mid: -1, returned: l, phase: 'insert_pos',
      activeLines: [14], activeStep: 9,
      desc: `Target not found! BUT notice how L is exactly at the index where ${TARGET} should be inserted to keep the array sorted! Return L (${l}).`,
      logic: `<strong style="color:var(--green)">Return L (${l})</strong>`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function SearchInsertPosition({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Search Insert Position" lcNum="35" difficulty="Easy" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Search Insert Position" lcNum="35" difficulty="Easy" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<ArrowDownToLine size={20} />} title="Binary Search -> Lower Bound"
              lines={["Perform a standard Binary Search.", "If we find the element, great, return the mid index.", "If the element doesn't exist, the loop will break when L crosses R. Amazingly, L will ALWAYS point to the exact correct insertion index!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', position: 'relative' }}>
                    Target = <strong style={{ color: 'var(--green)' }}>{TARGET}</strong>
                    
                    {current.phase === 'insert_pos' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ position: 'absolute', right: '-160px', top: '10px', fontSize: '0.8rem', color: 'var(--sky)', background: 'var(--viz-sky-bg)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--sky)' }}
                      >
                        Insertion Index = {current.l}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap', position: 'relative' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    const isTarget = isMid && current.phase === 'found';
                    const isComparing = isMid && (current.phase === 'compare' || current.phase === 'compare_less');
                    
                    const isInsertPos = current.phase === 'insert_pos' && idx === current.l;

                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let opacity = 1;

                    if (!isActive && current.phase !== 'insert_pos') {
                      bg = 'var(--surface2)';
                      border = 'var(--border-strong)';
                      opacity = 0.2;
                    } else if (isTarget) {
                      bg = 'var(--viz-green-bg)';
                      border = 'var(--green)';
                    } else if (isComparing) {
                      bg = 'var(--viz-yellow-bg)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'var(--viz-blue-bg)';
                      border = 'var(--accent)';
                    } else if (isInsertPos) {
                      border = 'var(--sky)';
                      bg = 'var(--viz-sky-bg)';
                      opacity = 1; // Highlight the insertion point explicitly
                    } else if (current.phase === 'insert_pos') {
                      opacity = 0.4;
                    }

                    return (
                      <div key={idx} className="array-block-wrapper" style={{ zIndex: 1, opacity }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {idx === current.l && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <div style={{ display: 'flex' }}>
                          {/* Visual Insertion Gap */}
                          {isInsertPos && (
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: 40 }}
                              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                              <div style={{ height: '48px', width: '2px', background: 'var(--sky)', position: 'relative' }}>
                                <motion.div 
                                  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                                  style={{ position: 'absolute', top: '-25px', left: '-15px', color: 'var(--sky)' }}
                                >
                                  <ArrowDownToLine size={20} />
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                          
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
                        </div>
                        
                        <div style={{ height: '40px', textAlign: 'center', marginTop: '4px', display: 'flex', flexDirection: 'column' }}>
                          {isMid && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>mid</span>}
                          {idx === current.r && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)', marginTop: isMid ? '0px' : '0px' }}>R</span>}
                        </div>
                      </div>
                    );
                  })}
                  {/* Handle edge case where L goes out of bounds to the right */}
                  {current.phase === 'insert_pos' && current.l === NUMS.length && (
                    <div className="array-block-wrapper" style={{ zIndex: 1 }}>
                      <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                        <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>L</span>
                      </div>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: 40 }}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '48px' }}
                      >
                        <div style={{ height: '48px', width: '2px', background: 'var(--sky)', position: 'relative' }}>
                          <motion.div 
                            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                            style={{ position: 'absolute', top: '-25px', left: '-15px', color: 'var(--sky)' }}
                          >
                            <ArrowDownToLine size={20} />
                          </motion.div>
                        </div>
                      </motion.div>
                      <div style={{ height: '40px' }} />
                    </div>
                  )}
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
              title="Search Insert Position"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int searchInsert(int[] nums, int target) {",
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
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "def searchInsert(self, nums: list[int], target: int) -> int:",
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
                "    return l"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize two pointers, L at 0 and R at the end of the array." },
                { num: 2, txt: "Loop while L <= R." },
                { num: 3, txt: "Calculate the middle index." },
                { num: 4, txt: "Check if the middle element is the target." },
                { num: 5, txt: "If it is, we found it! Return the middle index." },
                { num: 6, txt: "Check if the middle element is less than the target." },
                { num: 7, txt: "If less, the target must be to the right. Move L to mid + 1." },
                { num: 8, txt: "If greater, the target must be to the left. Move R to mid - 1." },
                { num: 9, txt: "If the loop finishes, the target doesn't exist. Amazingly, L is exactly the insertion index! Return L." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is a standard binary search, but the magic happens at the very end when the target is <em>not</em> found.</>,
              <>When the search space narrows down to a single element (<code>L == R</code>), we check that element. If the target is greater, <code>L</code> moves one to the right, which is the correct insertion index. If the target is less, <code>R</code> moves to the left, leaving <code>L</code> pointing exactly at the current element, which is also the correct insertion index to shift the current element to the right!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
