import React, { useState } from 'react';
import { Mountain, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>A peak element is an element that is strictly greater than its neighbors.</p>
    <p>Given a <strong>0-indexed</strong> integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to <strong>any of the peaks</strong>.</p>
    <p>You may imagine that <code>nums[-1] = nums[n] = -∞</code>. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.</p>
    <p>You must write an algorithm that runs in <code>O(log n)</code> time.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [1,2,3,1]', 
    output: '2',
    explanation: <>3 is a peak element and your function should return the index number 2.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [1,2,1,3,5,6,4]', 
    output: '5',
    explanation: <>Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 1000</code></div>
    <div><code>-2³¹ &lt;= nums[i] &lt;= 2³¹ - 1</code></div>
    <div><code>nums[i] != nums[i + 1]</code> for all valid <code>i</code>.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int findPeakElement(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def findPeakElement(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [1, 2, 1, 3, 5, 6, 4];

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

  while (l < r) {
    timeline.push({
      l, r, mid: -1, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True, so the search space is valid.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
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
      desc: `Compare nums[mid] (${NUMS[mid]}) with its right neighbor nums[mid + 1] (${NUMS[mid+1]}). Are we on a downward slope?`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> > <strong style="color:var(--accent)">${NUMS[mid+1]}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] > NUMS[mid + 1]) {
      r = mid;
      timeline.push({
        l, r, mid, returned: null, phase: 'downward',
        activeLines: [7], activeStep: 5,
        desc: `Yes! The slope is going DOWN. This means there MUST be a peak to the left (including mid). Discard the right half by moving R to mid (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, returned: null, phase: 'upward',
        activeLines: [8, 9], activeStep: 6,
        desc: `No, ${NUMS[mid]} < ${NUMS[mid+1]}. The slope is going UP. This means there MUST be a peak to the right. Discard the left half by moving L to mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'success'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, returned: null, phase: 'check_loop',
    activeLines: [4], activeStep: 2,
    desc: `Check if L (${l}) < R (${r}). False! The search space has converged to a single element.`,
    logic: `L < R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  timeline.push({
    l, r, mid: -1, returned: l, phase: 'found',
    activeLines: [11], activeStep: 7,
    desc: `L and R have met at index ${l}. This element (${NUMS[l]}) is a guaranteed peak! Return L.`,
    logic: `<strong style="color:var(--green)">Return ${l}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function FindPeakElement({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Find Peak Element" lcNum="162" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Find Peak Element" lcNum="162" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Mountain size={20} />} title="Following the Slope"
              lines={["Even though the array isn't sorted, we can still use Binary Search by looking at the local slope!", "If we are on a downward slope (nums[mid] > nums[mid+1]), there MUST be a peak to our left (or we are the peak).", "If we are on an upward slope (nums[mid] < nums[mid+1]), there MUST be a peak to our right."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space (Topographical)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '160px', gap: '8px', marginBottom: '40px', padding: '0 20px', position: 'relative' }}>
                  {/* -Infinity visual bounds */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                    <div style={{ height: '10px', width: '30px', background: 'var(--surface2)', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>-∞</div>
                  </div>
                  
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    const isMidPlusOne = idx === current.mid + 1;
                    const isComparing = current.phase.startsWith('compare') || current.phase === 'downward' || current.phase === 'upward';
                    const isFound = current.phase === 'found' && idx === current.returned;
                    
                    const heightPercent = Math.max(15, (num / maxVal) * 100);

                    let bg = 'var(--surface)';
                    let border = 'var(--border-strong)';
                    let opacity = 1;

                    if (!isActive && current.phase !== 'found') {
                      bg = 'var(--surface2)';
                      border = 'transparent';
                      opacity = 0.2;
                    } else if (isFound) {
                      bg = 'var(--viz-green-bg)';
                      border = 'var(--green)';
                    } else if (isComparing && (isMid || isMidPlusOne)) {
                      bg = 'var(--viz-yellow-bg)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'var(--viz-blue-bg)';
                      border = 'var(--accent)';
                    }

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity, zIndex: isActive ? 2 : 1 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold', marginBottom: '8px' }}>
                          {num}
                        </div>
                        
                        <motion.div 
                          layout
                          style={{
                            width: '40px', height: `${heightPercent}px`,
                            background: bg, border: `2px solid ${border}`,
                            borderBottom: 'none', borderRadius: '8px 8px 0 0',
                            position: 'relative'
                          }}
                        >
                          {isFound && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: -30, opacity: 1 }} style={{ position: 'absolute', top: 0, left: '50%', x: '-50%', color: 'var(--green)' }}>
                              <Mountain size={24} />
                            </motion.div>
                          )}
                        </motion.div>

                        <div style={{ height: '40px', textAlign: 'center', marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>idx {idx}</span>
                          {idx === current.l && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--sky)', fontWeight: 'bold' }}>&uarr; L</span>}
                          {idx === current.r && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--pink)', fontWeight: 'bold' }}>&uarr; R</span>}
                          {isMid && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold' }}>&uarr; mid</span>}
                        </div>
                      </div>
                    );
                  })}

                  {/* -Infinity visual bounds */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                    <div style={{ height: '10px', width: '30px', background: 'var(--surface2)', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>-∞</div>
                  </div>
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
                  <div className="st-lbl">Returned Peak Index</div>
                  <div className="st-val" style={{ color: current.returned !== null ? 'var(--green)' : 'var(--muted)' }}>
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
              title="Find Peak Element"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int findPeakElement(int[] nums) {",
                "    int l = 0;",
                "    int r = nums.length - 1;",
                "    while (l < r) {",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] > nums[mid + 1]) {",
                "            r = mid;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "def findPeakElement(self, nums: list[int]) -> int:",
                "    l, r = 0, len(nums) - 1",
                "    ",
                "    while l < r:",
                "        mid = (l + r) // 2",
                "        if nums[mid] > nums[mid + 1]:",
                "            r = mid",
                "        else:",
                "            l = mid + 1",
                "            ",
                "    return l"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to 0 and R to the last index." },
                { num: 2, txt: "Loop while L < R. (Notice it's < not <=, because we compare mid to mid+1)." },
                { num: 3, txt: "Calculate the middle index." },
                { num: 4, txt: "Compare the middle element to its right neighbor." },
                { num: 5, txt: "If mid is GREATER than mid+1, we are on a downward slope. The peak must be to the left (or mid itself is the peak). Set R = mid." },
                { num: 6, txt: "If mid is LESS than mid+1, we are on an upward slope. The peak must be to the right. Set L = mid + 1." },
                { num: 7, txt: "When L and R meet, they will point to a peak element. Return L." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>How can we use binary search on an unsorted array? The trick relies on the problem statement: adjacent elements are strictly different, and edges are considered <code>-∞</code>.</>,
              <>If you stand on an element and the element to your right is smaller (downward slope), you can walk left to find a peak. If the element to your right is larger (upward slope), you can walk right to find a peak. Binary search just jumps to the middle and follows the slope, guaranteed to hit a peak eventually!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
