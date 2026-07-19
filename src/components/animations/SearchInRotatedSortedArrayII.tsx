import React, { useState } from 'react';
import { Route, CheckCircle2, SplitSquareHorizontal, Shrink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with <strong>distinct</strong> values).</p>
    <p>Before being passed to your function, <code>nums</code> is <strong>rotated</strong> at an unknown pivot index <code>k</code> (<code>0 &lt;= k &lt; nums.length</code>).</p>
    <p>Given the array <code>nums</code> <strong>after</strong> the rotation and an integer <code>target</code>, return <code>true</code> if <code>target</code> is in <code>nums</code>, or <code>false</code> if it is not in <code>nums</code>.</p>
    <p>You must decrease the overall operation steps as much as possible.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [2,5,6,0,0,1,2], target = 0', 
    output: 'true'
  },
  { 
    label: 'Example 2', 
    input: 'nums = [2,5,6,0,0,1,2], target = 3', 
    output: 'false'
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 5000</code></div>
    <div><code>-10⁴ &lt;= nums[i] &lt;= 10⁴</code></div>
    <div><code>nums</code> is guaranteed to be rotated at some pivot.</div>
    <div><code>-10⁴ &lt;= target &lt;= 10⁴</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean search(int[] nums, int target) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def search(self, nums: list[int], target: int) -> bool:\n        # Write your code here\n        pass`;

// Example that specifically hits the tricky edge case
const NUMS = [3, 1, 3, 3, 3, 3, 3];
const TARGET = 1;

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
        l, r, mid, returned: 'true', phase: 'found',
        activeLines: [7], activeStep: 5,
        desc: `Match found! Return true.`,
        logic: `<strong style="color:var(--green)">Match!</strong> Return true.`, logicClass: 'success'
      });
      break; 
    }

    timeline.push({
      l, r, mid, returned: null, phase: 'check_duplicates',
      activeLines: [9], activeStep: 6,
      desc: `Check for the tricky edge case: Are nums[L], nums[mid], and nums[R] all the same value? (${NUMS[l]} == ${NUMS[mid]} == ${NUMS[r]})`,
      logic: `Is <strong style="color:var(--sky)">${NUMS[l]}</strong> == <strong style="color:var(--accent)">${NUMS[mid]}</strong> == <strong style="color:var(--pink)">${NUMS[r]}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[l] === NUMS[mid] && NUMS[mid] === NUMS[r]) {
      l++;
      r--;
      timeline.push({
        l, r, mid, returned: null, phase: 'shrink',
        activeLines: [10, 11], activeStep: 7,
        desc: `Yes, they are all ${NUMS[mid]}. We can't tell which half is sorted! The only safe move is to shrink the window by 1 on both sides: L++ and R--.`,
        logic: `Shrink window: L = ${l}, R = ${r}`, logicClass: 'error'
      });
      continue; // Skip the rest of the loop
    }

    timeline.push({
      l, r, mid, returned: null, phase: 'compare_halves',
      activeLines: [14], activeStep: 8,
      desc: `Check if the LEFT half is sorted by comparing nums[L] to nums[mid]: ${NUMS[l]} <= ${NUMS[mid]}.`,
      logic: `Is <strong style="color:var(--sky)">${NUMS[l]}</strong> <= <strong style="color:var(--accent)">${NUMS[mid]}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[l] <= NUMS[mid]) {
      timeline.push({
        l, r, mid, returned: null, phase: 'left_sorted',
        activeLines: [14], activeStep: 9,
        desc: `Yes. The LEFT half is perfectly sorted. Now check if the target (${TARGET}) lies within this sorted left half [${NUMS[l]}, ${NUMS[mid]}].`,
        logic: `Left half is sorted.`, logicClass: 'success'
      });

      timeline.push({
        l, r, mid, returned: null, phase: 'check_left_bounds',
        activeLines: [15], activeStep: 10,
        desc: `Is ${NUMS[l]} <= ${TARGET} < ${NUMS[mid]}?`,
        logic: `Is <strong style="color:var(--sky)">${NUMS[l]}</strong> <= <strong style="color:var(--green)">${TARGET}</strong> < <strong style="color:var(--accent)">${NUMS[mid]}</strong>?`, logicClass: 'warning'
      });

      if (NUMS[l] <= TARGET && TARGET < NUMS[mid]) {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_left',
          activeLines: [16], activeStep: 11,
          desc: `Yes! The target is definitely in the left half. Discard the right half by moving R to mid - 1 (${r}).`,
          logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'info'
        });
      } else {
        l = mid + 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_right',
          activeLines: [17, 18], activeStep: 12,
          desc: `No, the target is NOT in the left half. It must be in the right half! Discard the left half by moving L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'info'
        });
      }

    } else {
      timeline.push({
        l, r, mid, returned: null, phase: 'right_sorted',
        activeLines: [19], activeStep: 13,
        desc: `No, ${NUMS[l]} > ${NUMS[mid]}. This means the LEFT half contains the rotation. Therefore, the RIGHT half MUST be perfectly sorted. Check if target lies within (${NUMS[mid]}, ${NUMS[r]}].`,
        logic: `Right half is sorted.`, logicClass: 'success'
      });

      timeline.push({
        l, r, mid, returned: null, phase: 'check_right_bounds',
        activeLines: [20], activeStep: 14,
        desc: `Is ${NUMS[mid]} < ${TARGET} <= ${NUMS[r]}?`,
        logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> < <strong style="color:var(--green)">${TARGET}</strong> <= <strong style="color:var(--pink)">${NUMS[r]}</strong>?`, logicClass: 'warning'
      });

      if (NUMS[mid] < TARGET && TARGET <= NUMS[r]) {
        l = mid + 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_right',
          activeLines: [21], activeStep: 15,
          desc: `Yes! The target is definitely in the right half. Discard the left half by moving L to mid + 1 (${l}).`,
          logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'info'
        });
      } else {
        r = mid - 1;
        timeline.push({
          l, r, mid, returned: null, phase: 'go_left',
          activeLines: [22, 23], activeStep: 16,
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
      l, r, mid: -1, returned: 'false', phase: 'not_found',
      activeLines: [27], activeStep: 17,
      desc: `Target was not found in the array. Return false.`,
      logic: `<strong style="color:var(--pink)">Not found.</strong> Return false.`, logicClass: 'error'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function SearchInRotatedSortedArrayII({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Search in Rotated Array II" lcNum="81" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Search in Rotated Array II" lcNum="81" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Shrink size={20} />} title="The Duplicate Trap"
              lines={["When the array has duplicates, we might encounter a state where nums[L] == nums[mid] == nums[R].", "In this state, we cannot determine which half is sorted! (e.g. is it [3, 1, 3, 3, 3] or [3, 3, 3, 1, 3]?)", "The only safe operation is to shrink the search space by 1 from both sides (L++ and R--) until the ambiguity is resolved."]}
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
                    const isFound = current.phase === 'found' && idx === current.mid; // Target found at mid
                    
                    const isComparingDuplicates = current.phase === 'check_duplicates' || current.phase === 'shrink';
                    
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
                    } else if (isComparingDuplicates && (isMid || isL || isR)) {
                      bg = 'rgba(255, 107, 107, 0.2)';
                      border = 'var(--pink)';
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
                  <div className="st-lbl">Returned</div>
                  <div className="st-val" style={{ color: current.returned !== null ? (current.returned === 'false' ? 'var(--pink)' : 'var(--green)') : 'var(--muted)' }}>
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
              title="Search in Rotated Sorted Array II"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean search(int[] nums, int target) {",
                "    int l = 0;",
                "    int r = nums.length - 1;",
                "    while (l <= r) {",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] == target) return true;",
                "        ",
                "        // TRICKY EDGE CASE: Can't tell which half is sorted",
                "        if (nums[l] == nums[mid] && nums[mid] == nums[r]) {",
                "            l++;",
                "            r--;",
                "            continue;",
                "        }",
                "        ",
                "        if (nums[l] <= nums[mid]) {",
                "            if (nums[l] <= target && target < nums[mid]) {",
                "                r = mid - 1;",
                "            } else {",
                "                l = mid + 1;",
                "            }",
                "        } else { ",
                "            if (nums[mid] < target && target <= nums[r]) {",
                "                l = mid + 1;",
                "            } else {",
                "                r = mid - 1;",
                "            }",
                "        }",
                "    }",
                "    return false;",
                "}"
              ]}
              pythonCode={[
                "def search(self, nums: list[int], target: int) -> bool:",
                "    l, r = 0, len(nums) - 1",
                "    while l <= r:",
                "        mid = (l + r) // 2",
                "        if nums[mid] == target: return True",
                "        ",
                "        # TRICKY EDGE CASE",
                "        if nums[l] == nums[mid] == nums[r]:",
                "            l += 1",
                "            r -= 1",
                "            continue",
                "            ",
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
                "    return False"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to 0 and R to the end." },
                { num: 2, txt: "Loop while L <= R." },
                { num: 3, txt: "Calculate the middle index." },
                { num: 4, txt: "Check if the middle element is the target." },
                { num: 5, txt: "Return true if matched." },
                { num: 6, txt: "Check if nums[L] == nums[mid] == nums[R]." },
                { num: 7, txt: "If they are equal, we can't tell which half is sorted. Shrink the window by moving L right and R left. Then continue to the next iteration." },
                { num: 8, txt: "Otherwise, proceed normally: determine if the left half is sorted." },
                { num: 9, txt: "If the left half is sorted, check if target falls within its bounds." },
                { num: 10, txt: "If yes, discard the right half (R = mid - 1)." },
                { num: 11, txt: "If no, the target MUST be in the right half (L = mid + 1)." },
                { num: 12, txt: "If the left half wasn't sorted, the RIGHT half MUST be sorted." },
                { num: 13, txt: "Check if target falls within the right half's bounds." },
                { num: 14, txt: "If yes, discard the left half (L = mid + 1)." },
                { num: 15, txt: "If no, the target MUST be in the left half (R = mid - 1)." },
                { num: 16, txt: "Return false if target is not found." },
                { num: 17, txt: "Return false." }
              ]} 
            />
            <Complexity time="O(log N) avg, O(N) worst" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is almost identical to the standard Rotated Sorted Array problem, but duplicates break our logic for finding the sorted half.</>,
              <>If the array is <code>[3, 1, 3, 3, 3]</code>, <code>nums[L] (3) == nums[mid] (3)</code>. The left half looks sorted, but it actually contains the rotation! If the array is <code>[3, 3, 3, 1, 3]</code>, <code>nums[L] == nums[mid]</code> again, but this time the left half IS sorted.</>,
              <>When <code>nums[L] == nums[mid] == nums[R]</code>, we have zero information. We can't eliminate half the array. But since <code>nums[L]</code> and <code>nums[R]</code> are not the target (we already checked mid), we can safely eliminate <em>just those two elements</em> by shrinking the window (<code>L++</code>, <code>R--</code>) until the ambiguity clears up.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
