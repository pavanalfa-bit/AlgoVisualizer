import React, { useState } from 'react';
import { Route, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>There is an integer array <code>nums</code> sorted in ascending order (with <strong>distinct</strong> values).</p>
    <p>Prior to being passed to your function, <code>nums</code> is <strong>possibly rotated</strong> at an unknown pivot index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,5,6,7]</code> might be rotated at pivot index 3 and become <code>[4,5,6,7,0,1,2]</code>.</p>
    <p>Given the array <code>nums</code> <strong>after</strong> the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [4,5,6,7,0,1,2], target = 0', 
    output: '4'
  },
  { 
    label: 'Example 2', 
    input: 'nums = [4,5,6,7,0,1,2], target = 3', 
    output: '-1'
  },
  { 
    label: 'Example 3', 
    input: 'nums = [1], target = 0', 
    output: '-1'
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 5000</code></div>
    <div><code>-10⁴ &lt;= nums[i] &lt;= 10⁴</code></div>
    <div>All values of <code>nums</code> are <strong>unique</strong>.</div>
    <div><code>nums</code> is an ascending array that is possibly rotated.</div>
    <div><code>-10⁴ &lt;= target &lt;= 10⁴</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        pass`;

const NUMS = [4, 5, 6, 7, 0, 1, 2];
const TARGET = 0;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  timeline.push({
    l: 0, r: NUMS.length - 1, mid: -1, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize the left (L) pointer to 0 and the right (R) pointer to the end of the array.",
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
      l, r, mid, returned: null, phase: 'compare_target',
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
    }

    timeline.push({
      l, r, mid, returned: null, phase: 'compare_halves',
      activeLines: [8], activeStep: 6,
      desc: `No match. Check if the LEFT half is sorted by comparing nums[L] to nums[mid]: ${NUMS[l]} <= ${NUMS[mid]}.`,
      logic: `Is <strong style="color:var(--sky)">${NUMS[l]}</strong> <= <strong style="color:var(--accent)">${NUMS[mid]}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[l] <= NUMS[mid]) {
      // Left half is sorted
      timeline.push({
        l, r, mid, returned: null, phase: 'left_sorted',
        activeLines: [8], activeStep: 7,
        desc: `Yes, ${NUMS[l]} <= ${NUMS[mid]}. The LEFT half is perfectly sorted. Now check if the target (${TARGET}) lies within this sorted left half [${NUMS[l]}, ${NUMS[mid]}].`,
        logic: `Left half is sorted.`, logicClass: 'success'
      });

      timeline.push({
        l, r, mid, returned: null, phase: 'check_left_bounds',
        activeLines: [9], activeStep: 8,
        desc: `Is ${NUMS[l]} <= ${TARGET} < ${NUMS[mid]}?`,
        logic: `Is <strong style="color:var(--sky)">${NUMS[l]}</strong> <= <strong style="color:var(--green)">${TARGET}</strong> < <strong style="color:var(--accent)">${NUMS[mid]}</strong>?`, logicClass: 'warning'
      });

      if (NUMS[l] <= TARGET && TARGET < NUMS[mid]) {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_left',
          activeLines: [10], activeStep: 9,
          desc: `Yes! The target is definitely in the left half. Discard the right half by moving R to mid - 1 (${r}).`,
          logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'info'
        });
      } else {
        l = mid + 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_right',
          activeLines: [11, 12], activeStep: 10,
          desc: `No, the target is NOT in the left half. It must be in the right half! Discard the left half by moving L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'info'
        });
      }

    } else {
      // Right half is sorted
      timeline.push({
        l, r, mid, returned: null, phase: 'right_sorted',
        activeLines: [13], activeStep: 11,
        desc: `No, ${NUMS[l]} > ${NUMS[mid]}. This means the LEFT half contains the rotation. Therefore, the RIGHT half MUST be perfectly sorted. Check if target (${TARGET}) lies within this sorted right half (${NUMS[mid]}, ${NUMS[r]}].`,
        logic: `Right half is sorted.`, logicClass: 'success'
      });

      timeline.push({
        l, r, mid, returned: null, phase: 'check_right_bounds',
        activeLines: [14], activeStep: 12,
        desc: `Is ${NUMS[mid]} < ${TARGET} <= ${NUMS[r]}?`,
        logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> < <strong style="color:var(--green)">${TARGET}</strong> <= <strong style="color:var(--pink)">${NUMS[r]}</strong>?`, logicClass: 'warning'
      });

      if (NUMS[mid] < TARGET && TARGET <= NUMS[r]) {
        l = mid + 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_right',
          activeLines: [15], activeStep: 13,
          desc: `Yes! The target is definitely in the right half. Discard the left half by moving L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'info'
        });
      } else {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_left',
          activeLines: [16, 17], activeStep: 14,
          desc: `No, the target is NOT in the right half. It must be in the left half! Discard the right half by moving R to mid - 1 (${r}).`,
          logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'info'
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
      activeLines: [21], activeStep: 15,
      desc: `Target was not found in the array. Return -1.`,
      logic: `<strong style="color:var(--pink)">Not found.</strong> Return -1.`, logicClass: 'error'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function SearchInRotatedSortedArray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Search in Rotated Sorted Array" lcNum="33" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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

  const maxVal = Math.max(...NUMS);

  return (
    <VisualizerLayout>
      <VPHeader title="Search in Rotated Sorted Array" lcNum="33" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Route size={20} />} title="Find the Sorted Half"
              lines={["When an array is rotated, dividing it in half guarantees that at least ONE half is perfectly sorted.", "By comparing nums[L] to nums[mid], we can figure out if the left half is the sorted one.", "Once we know which half is sorted, we check if the target falls within that sorted half's boundaries to decide which way to go!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space (Bar Chart)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    Target = <strong style={{ color: 'var(--green)' }}>{TARGET}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '160px', gap: '12px', marginBottom: '40px', padding: '0 20px' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    const isL = idx === current.l;
                    const isR = idx === current.r;
                    const isFound = current.phase === 'found' && idx === current.returned;
                    
                    const isComparingHalves = current.phase === 'compare_halves' || current.phase === 'left_sorted' || current.phase === 'right_sorted';
                    
                    const heightPercent = Math.max(15, (num / maxVal) * 100);

                    let bg = 'var(--surface)';
                    let border = 'var(--border-strong)';
                    let opacity = 1;

                    if (!isActive && current.phase !== 'found') {
                      bg = 'var(--surface2)';
                      border = 'transparent';
                      opacity = 0.2;
                    } else if (isFound) {
                      bg = 'rgba(34, 197, 94, 0.6)';
                      border = 'var(--green)';
                    } else if (isComparingHalves && (isMid || isL)) {
                      bg = 'rgba(255, 193, 7, 0.4)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'rgba(108, 142, 245, 0.4)';
                      border = 'var(--accent)';
                    }

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity, zIndex: isActive ? 2 : 1 }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 'bold', marginBottom: '8px' }}>
                          {num}
                        </div>
                        
                        <motion.div 
                          layout
                          style={{
                            width: '40px', height: `${heightPercent}px`,
                            background: bg, border: `2px solid ${border}`,
                            borderBottom: 'none', borderRadius: '4px 4px 0 0',
                            position: 'relative'
                          }}
                        >
                          {isFound && (
                            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: -30, opacity: 1 }} style={{ position: 'absolute', top: 0, left: '50%', x: '-50%', color: 'var(--green)', fontWeight: 'bold', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                              &darr; TARGET
                            </motion.div>
                          )}
                        </motion.div>

                        <div style={{ height: '40px', textAlign: 'center', marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>idx {idx}</span>
                          {isL && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--sky)', fontWeight: 'bold' }}>&uarr; L</span>}
                          {isR && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--pink)', fontWeight: 'bold', marginTop: isMid ? '0' : '0' }}>&uarr; R</span>}
                          {isMid && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold' }}>&uarr; mid</span>}
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
              title="Search in Rotated Sorted Array"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int search(int[] nums, int target) {",
                "    int l = 0;",
                "    int r = nums.length - 1;",
                "    while (l <= r) {",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] == target) return mid;",
                "        ",
                "        // Check if the left half is perfectly sorted",
                "        if (nums[l] <= nums[mid]) {",
                "            if (nums[l] <= target && target < nums[mid]) {",
                "                r = mid - 1; // Target is in the sorted left half",
                "            } else {",
                "                l = mid + 1; // Target is in the unsorted right half",
                "            }",
                "        } else { // The right half is perfectly sorted",
                "            if (nums[mid] < target && target <= nums[r]) {",
                "                l = mid + 1; // Target is in the sorted right half",
                "            } else {",
                "                r = mid - 1; // Target is in the unsorted left half",
                "            }",
                "        }",
                "    }",
                "    return -1;",
                "}"
              ]}
              pythonCode={[
                "def search(self, nums: list[int], target: int) -> int:",
                "    l, r = 0, len(nums) - 1",
                "    while l <= r:",
                "        mid = (l + r) // 2",
                "        if nums[mid] == target: return mid",
                "        ",
                "        if nums[l] <= nums[mid]:",
                "            if nums[l] <= target < nums[mid]:",
                "                r = mid - 1",
                "            else:",
                "                l = mid + 1",
                "        else:",
                "            if nums[mid] < target <= nums[r]:",
                "                l = mid + 1",
                "            else:",
                "                r = mid - 1",
                "                ",
                "    return -1"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to 0 and R to the end." },
                { num: 2, txt: "Loop while L <= R." },
                { num: 3, txt: "Calculate the middle index." },
                { num: 4, txt: "Check if the middle element is the target." },
                { num: 5, txt: "Return mid if matched." },
                { num: 6, txt: "If no match, determine if the LEFT half is sorted (nums[L] <= nums[mid])." },
                { num: 7, txt: "If the left half is sorted, we can easily check if the target falls within its bounds." },
                { num: 8, txt: "Is nums[L] <= target < nums[mid]?" },
                { num: 9, txt: "If yes, discard the right half (R = mid - 1)." },
                { num: 10, txt: "If no, the target MUST be in the right half (L = mid + 1)." },
                { num: 11, txt: "If the left half wasn't sorted, the RIGHT half MUST be sorted." },
                { num: 12, txt: "Is nums[mid] < target <= nums[R]?" },
                { num: 13, txt: "If yes, discard the left half (L = mid + 1)." },
                { num: 14, txt: "If no, the target MUST be in the left half (R = mid - 1)." },
                { num: 15, txt: "Return -1 if target is not found." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>When you split a rotated sorted array in half, one of those halves is guaranteed to be perfectly sorted. We can tell which one is sorted by comparing the ends: if <code>nums[L] &lt;= nums[mid]</code>, the left half is sorted.</>,
              <>Because it's perfectly sorted, we know the exact minimum and maximum values in that half. We can simply ask, "Does the target fall between this min and max?" If it does, we search that half. If it doesn't, we search the other half. Simple, elegant, and <code>O(log N)</code>!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
