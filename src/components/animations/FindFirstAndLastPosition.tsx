import React, { useState } from 'react';
import { ChevronsLeftRight, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.</p>
    <p>If <code>target</code> is not found in the array, return <code>[-1, -1]</code>.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [5,7,7,8,8,10], target = 8', 
    output: '[3,4]',
    explanation: <>8 starts at index 3 and ends at index 4.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [5,7,7,8,8,10], target = 6', 
    output: '[-1,-1]'
  }
];

const CONSTRAINTS = (
  <>
    <div><code>0 &lt;= nums.length &lt;= 10⁵</code></div>
    <div><code>nums</code> is a non-decreasing array.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int[] searchRange(int[] nums, int target) {\n        // Write your code here\n        return new int[]{-1, -1};\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass`;

const NUMS = [5, 7, 7, 8, 8, 8, 10];
const TARGET = 8;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  timeline.push({
    l: -1, r: -1, mid: -1, leftBound: -1, rightBound: -1, phase: 'init',
    activeLines: [2], activeStep: 1,
    desc: "We will perform TWO separate binary searches. First, we find the leftmost index of the target.",
    logic: `<strong>Phase 1:</strong> Find Left Bound`, logicClass: 'info'
  });

  // --- Phase 1: Left Bound ---
  let l = 0;
  let r = NUMS.length - 1;
  let leftBound = -1;

  while (l <= r) {
    timeline.push({
      l, r, mid: -1, leftBound, rightBound: -1, phase: 'p1_check',
      activeLines: [3], activeStep: 2,
      desc: `Find Left Bound: Check if L (${l}) <= R (${r}).`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, leftBound, rightBound: -1, phase: 'p1_calc',
      activeLines: [4], activeStep: 3,
      desc: `mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `mid = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    timeline.push({
      l, r, mid, leftBound, rightBound: -1, phase: 'p1_compare',
      activeLines: [5], activeStep: 4,
      desc: `Is nums[mid] (${NUMS[mid]}) == target (${TARGET})?`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> == <strong style="color:var(--green)">${TARGET}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] === TARGET) {
      leftBound = mid;
      r = mid - 1;
      timeline.push({
        l, r, mid, leftBound, rightBound: -1, phase: 'p1_found',
        activeLines: [6, 7], activeStep: 5,
        desc: `Match! But is it the leftmost? Record leftBound = ${mid}, and continue searching the LEFT half by moving R to mid - 1 (${r}).`,
        logic: `Record leftBound = ${mid}, R = ${r}`, logicClass: 'success'
      });
    } else if (NUMS[mid] < TARGET) {
      l = mid + 1;
      timeline.push({
        l, r, mid, leftBound, rightBound: -1, phase: 'p1_less',
        activeLines: [8, 9], activeStep: 6,
        desc: `${NUMS[mid]} < ${TARGET}. Move L to mid + 1 (${l}).`,
        logic: `L = ${l}`, logicClass: 'info'
      });
    } else {
      r = mid - 1;
      timeline.push({
        l, r, mid, leftBound, rightBound: -1, phase: 'p1_greater',
        activeLines: [10, 11], activeStep: 6,
        desc: `${NUMS[mid]} > ${TARGET}. Move R to mid - 1 (${r}).`,
        logic: `R = ${r}`, logicClass: 'info'
      });
    }
  }

  // --- Phase 2: Right Bound ---
  timeline.push({
    l: -1, r: -1, mid: -1, leftBound, rightBound: -1, phase: 'init2',
    activeLines: [15], activeStep: 7,
    desc: `Left bound found at index ${leftBound}. Now, perform a second binary search to find the RIGHTMOST index.`,
    logic: `<strong>Phase 2:</strong> Find Right Bound`, logicClass: 'info'
  });

  l = 0;
  r = NUMS.length - 1;
  let rightBound = -1;

  while (l <= r) {
    timeline.push({
      l, r, mid: -1, leftBound, rightBound, phase: 'p2_check',
      activeLines: [16], activeStep: 8,
      desc: `Find Right Bound: Check if L (${l}) <= R (${r}).`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, leftBound, rightBound, phase: 'p2_calc',
      activeLines: [17], activeStep: 9,
      desc: `mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `mid = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    timeline.push({
      l, r, mid, leftBound, rightBound, phase: 'p2_compare',
      activeLines: [18], activeStep: 10,
      desc: `Is nums[mid] (${NUMS[mid]}) == target (${TARGET})?`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> == <strong style="color:var(--green)">${TARGET}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] === TARGET) {
      rightBound = mid;
      l = mid + 1;
      timeline.push({
        l, r, mid, leftBound, rightBound, phase: 'p2_found',
        activeLines: [19, 20], activeStep: 11,
        desc: `Match! But is it the rightmost? Record rightBound = ${mid}, and continue searching the RIGHT half by moving L to mid + 1 (${l}).`,
        logic: `Record rightBound = ${mid}, L = ${l}`, logicClass: 'success'
      });
    } else if (NUMS[mid] < TARGET) {
      l = mid + 1;
      timeline.push({
        l, r, mid, leftBound, rightBound, phase: 'p2_less',
        activeLines: [21, 22], activeStep: 12,
        desc: `${NUMS[mid]} < ${TARGET}. Move L to mid + 1 (${l}).`,
        logic: `L = ${l}`, logicClass: 'info'
      });
    } else {
      r = mid - 1;
      timeline.push({
        l, r, mid, leftBound, rightBound, phase: 'p2_greater',
        activeLines: [23, 24], activeStep: 12,
        desc: `${NUMS[mid]} > ${TARGET}. Move R to mid - 1 (${r}).`,
        logic: `R = ${r}`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    l: -1, r: -1, mid: -1, leftBound, rightBound, phase: 'done',
    activeLines: [27], activeStep: 13,
    desc: `Both searches complete! Left bound is ${leftBound}, right bound is ${rightBound}. Return [${leftBound}, ${rightBound}].`,
    logic: `<strong style="color:var(--green)">Return [${leftBound}, ${rightBound}]</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function FindFirstAndLastPosition({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Find First and Last Position" lcNum="34" difficulty="Medium" tag="Binary Search x2" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Find First and Last Position" lcNum="34" difficulty="Medium" tag="Binary Search x2" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<ChevronsLeftRight size={20} />} title="Double Binary Search"
              lines={["To find the boundaries, we run binary search TWICE.", "Search 1 (Left Bound): When we find the target, don't stop! Keep searching the LEFT half to see if there's an earlier occurrence.", "Search 2 (Right Bound): When we find the target, keep searching the RIGHT half to see if there's a later occurrence."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    Target = <strong style={{ color: 'var(--green)' }}>{TARGET}</strong>
                    <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {current.phase.startsWith('p1') ? '(Finding Left Bound)' : current.phase.startsWith('p2') ? '(Finding Right Bound)' : ''}
                    </span>
                  </div>
                </div>

                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    
                    const isLeftBound = idx === current.leftBound;
                    const isRightBound = idx === current.rightBound;
                    const isComparing = isMid && current.phase.includes('compare');

                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let opacity = 1;

                    if (current.l !== -1 && !isActive) {
                      bg = 'var(--surface2)';
                      border = 'var(--border-strong)';
                      opacity = 0.2;
                    } else if (isComparing) {
                      bg = 'rgba(255, 193, 7, 0.2)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'rgba(108, 142, 245, 0.2)';
                      border = 'var(--accent)';
                    }
                    
                    // Permanent highlights for found bounds
                    if (isLeftBound) {
                      border = 'var(--sky)';
                      if (current.phase === 'done' || current.phase.startsWith('p2')) {
                        bg = 'rgba(78, 205, 196, 0.2)';
                        opacity = 1;
                      }
                    }
                    if (isRightBound) {
                      border = 'var(--pink)';
                      if (current.phase === 'done') {
                        bg = 'rgba(255, 107, 107, 0.2)';
                        opacity = 1;
                      }
                    }
                    if (isLeftBound && isRightBound && current.phase === 'done') {
                       border = 'var(--green)';
                       bg = 'rgba(34, 197, 94, 0.2)';
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
                  <div className="st-val">{current.l !== -1 ? `[${current.l}, ${current.r}]` : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Left Bound</div>
                  <div className="st-val" style={{ color: current.leftBound !== -1 ? 'var(--sky)' : 'var(--muted)' }}>
                    {current.leftBound !== -1 ? current.leftBound : '-'}
                  </div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Right Bound</div>
                  <div className="st-val" style={{ color: current.rightBound !== -1 ? 'var(--pink)' : 'var(--muted)' }}>
                    {current.rightBound !== -1 ? current.rightBound : '-'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Searching bounds"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Find First and Last"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int[] searchRange(int[] nums, int target) {",
                "    int leftBound = -1;",
                "    int l = 0, r = nums.length - 1;",
                "    while (l <= r) { // Search 1: Left Bound",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] == target) {",
                "            leftBound = mid;",
                "            r = mid - 1; // KEEP SEARCHING LEFT",
                "        } else if (nums[mid] < target) {",
                "            l = mid + 1;",
                "        } else {",
                "            r = mid - 1;",
                "        }",
                "    }",
                "    ",
                "    int rightBound = -1;",
                "    l = 0; r = nums.length - 1;",
                "    while (l <= r) { // Search 2: Right Bound",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] == target) {",
                "            rightBound = mid;",
                "            l = mid + 1; // KEEP SEARCHING RIGHT",
                "        } else if (nums[mid] < target) {",
                "            l = mid + 1;",
                "        } else {",
                "            r = mid - 1;",
                "        }",
                "    }",
                "    ",
                "    return new int[]{leftBound, rightBound};",
                "}"
              ]}
              pythonCode={[
                "def searchRange(self, nums: list[int], target: int) -> list[int]:",
                "    left_bound = -1",
                "    l, r = 0, len(nums) - 1",
                "    while l <= r: # Search 1",
                "        mid = (l + r) // 2",
                "        if nums[mid] == target:",
                "            left_bound = mid",
                "            r = mid - 1 # KEEP SEARCHING LEFT",
                "        elif nums[mid] < target:",
                "            l = mid + 1",
                "        else:",
                "            r = mid - 1",
                "            ",
                "    right_bound = -1",
                "    l, r = 0, len(nums) - 1",
                "    while l <= r: # Search 2",
                "        mid = (l + r) // 2",
                "        if nums[mid] == target:",
                "            right_bound = mid",
                "            l = mid + 1 # KEEP SEARCHING RIGHT",
                "        elif nums[mid] < target:",
                "            l = mid + 1",
                "        else:",
                "            r = mid - 1",
                "            ",
                "    return [left_bound, right_bound]"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Phase 1: Find the Left Bound." },
                { num: 2, txt: "Run a binary search." },
                { num: 3, txt: "Calculate mid." },
                { num: 4, txt: "If nums[mid] == target, record the index." },
                { num: 5, txt: "CRITICAL: Instead of returning, move R to mid - 1 to see if there is an earlier occurrence!" },
                { num: 6, txt: "Adjust L or R normally if no match." },
                { num: 7, txt: "Phase 2: Find the Right Bound. Reset L and R to the ends of the array." },
                { num: 8, txt: "Run a second binary search." },
                { num: 9, txt: "Calculate mid." },
                { num: 10, txt: "If nums[mid] == target, record the index." },
                { num: 11, txt: "CRITICAL: Instead of returning, move L to mid + 1 to see if there is a later occurrence!" },
                { num: 12, txt: "Adjust L or R normally if no match." },
                { num: 13, txt: "Return [leftBound, rightBound]." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Standard binary search stops as soon as it finds the target. But what if there are duplicates? The one it found might be in the middle of a block of duplicates.</>,
              <>To find the bounds, we simply <em>don't stop</em> when we find the target. If we want the left bound, we record our find and immediately discard the right half to keep searching the left half for an even earlier occurrence. We do the opposite for the right bound.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
