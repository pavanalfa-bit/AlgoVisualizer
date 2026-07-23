import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,2,4,5,6,7]</code> might become:</p>
    <ul>
      <li><code>[4,5,6,7,0,1,2]</code> if it was rotated 4 times.</li>
      <li><code>[0,1,2,4,5,6,7]</code> if it was rotated 7 times.</li>
    </ul>
    <p>Notice that rotating an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>
    <p>Given the sorted rotated array <code>nums</code> of <strong>unique</strong> elements, return the minimum element of this array.</p>
    <p>You must write an algorithm that runs in <code>O(log n)</code> time.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [3,4,5,1,2]', 
    output: '1',
    explanation: <>The original array was [1,2,3,4,5] rotated 3 times.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [4,5,6,7,0,1,2]', 
    output: '0',
    explanation: <>The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [11,13,15,17]', 
    output: '11',
    explanation: <>The original array was [11,13,15,17] and it was rotated 4 times. (No visible rotation).</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>n == nums.length</code></div>
    <div><code>1 &lt;= n &lt;= 5000</code></div>
    <div><code>-5000 &lt;= nums[i] &lt;= 5000</code></div>
    <div>All the integers of <code>nums</code> are <strong>unique</strong>.</div>
    <div><code>nums</code> is sorted and rotated between <code>1</code> and <code>n</code> times.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int findMin(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def findMin(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [4, 5, 6, 7, 0, 1, 2];

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
      desc: `Compare nums[mid] (${NUMS[mid]}) with nums[R] (${NUMS[r]}). This tells us which half contains the 'inflection point' (the minimum).`,
      logic: `Is <strong style="color:var(--accent)">${NUMS[mid]}</strong> > <strong style="color:var(--pink)">${NUMS[r]}</strong>?`, logicClass: 'warning'
    });

    if (NUMS[mid] > NUMS[r]) {
      l = mid + 1;
      timeline.push({
        l, r, mid, returned: null, phase: 'greater',
        activeLines: [7], activeStep: 5,
        desc: `Yes, ${NUMS[mid]} > ${NUMS[r]}. This means the left half (L to mid) is perfectly sorted, so the minimum MUST be in the unsorted right half! Discard the left half by moving L to mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'success'
      });
    } else {
      r = mid;
      timeline.push({
        l, r, mid, returned: null, phase: 'less_equal',
        activeLines: [8, 9], activeStep: 6,
        desc: `No, ${NUMS[mid]} <= ${NUMS[r]}. This means the right half (mid to R) is perfectly sorted. The minimum must be in the left half, and COULD be mid itself. Discard the right half by moving R to mid (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
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
    l, r, mid: -1, returned: NUMS[l], phase: 'found',
    activeLines: [11], activeStep: 7,
    desc: `L and R have met at index ${l}. This element (${NUMS[l]}) is the minimum element! Return it.`,
    logic: `<strong style="color:var(--green)">Return ${NUMS[l]}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function FindMinimumInRotatedSortedArray({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Find Minimum in Rotated Sorted Array" lcNum="153" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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

  // To visually show the "drop" or "inflection point"
  const maxVal = Math.max(...NUMS);

  return (
    <VisualizerLayout>
      <VPHeader title="Find Minimum in Rotated Sorted Array" lcNum="153" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<RefreshCw size={20} />} title="Finding the Inflection Point"
              lines={["In a rotated sorted array, one half will ALWAYS be perfectly sorted.", "By comparing nums[mid] to the rightmost element nums[R], we can find out which half is sorted.", "The minimum element will always be located in the UNSORTED half (or it is the first element of the sorted half)."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Search Space (Bar Chart)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '160px', gap: '12px', marginBottom: '40px', padding: '0 20px' }}>
                  {NUMS.map((num: number, idx: number) => {
                    const isActive = idx >= current.l && idx <= current.r;
                    const isMid = idx === current.mid;
                    const isR = idx === current.r;
                    const isComparing = current.phase.startsWith('compare') || current.phase === 'greater' || current.phase === 'less_equal';
                    const isFound = current.phase === 'found' && idx === current.l;
                    
                    const heightPercent = Math.max(15, (num / maxVal) * 100);

                    let bg = 'var(--surface)';
                    let border = 'var(--border-strong)';
                    let opacity = 1;

                    if (!isActive && current.phase !== 'found') {
                      bg = 'var(--surface2)';
                      border = 'transparent';
                      opacity = 0.2;
                    } else if (isFound) {
                      bg = 'var(--viz-green-bd)';
                      border = 'var(--green)';
                    } else if (isComparing && (isMid || isR)) {
                      bg = 'var(--viz-yellow-bg)';
                      border = 'var(--warning)';
                    } else if (isMid) {
                      bg = 'var(--viz-blue-bg)';
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
                            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: -30, opacity: 1 }} style={{ position: 'absolute', top: 0, left: '50%', x: '-50%', color: 'var(--green)', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                              MINIMUM
                            </motion.div>
                          )}
                        </motion.div>

                        <div style={{ height: '40px', textAlign: 'center', marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>idx {idx}</span>
                          {idx === current.l && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--sky)', fontWeight: 'bold' }}>&uarr; L</span>}
                          {idx === current.r && current.phase !== 'found' && <span style={{ fontSize: '0.7rem', color: 'var(--pink)', fontWeight: 'bold', marginTop: isMid ? '0' : '0' }}>&uarr; R</span>}
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
                  <div className="st-lbl">Returned Minimum</div>
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
              title="Find Minimum in Rotated Sorted Array"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int findMin(int[] nums) {",
                "    int l = 0;",
                "    int r = nums.length - 1;",
                "    while (l < r) {",
                "        int mid = l + (r - l) / 2;",
                "        if (nums[mid] > nums[r]) {",
                "            l = mid + 1;",
                "        } else {",
                "            r = mid;",
                "        }",
                "    }",
                "    return nums[l];",
                "}"
              ]}
              pythonCode={[
                "def findMin(self, nums: list[int]) -> int:",
                "    l, r = 0, len(nums) - 1",
                "    ",
                "    while l < r:",
                "        mid = (l + r) // 2",
                "        if nums[mid] > nums[r]:",
                "            l = mid + 1",
                "        else:",
                "            r = mid",
                "            ",
                "    return nums[l]"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to 0 and R to the last index." },
                { num: 2, txt: "Loop while L < R." },
                { num: 3, txt: "Calculate the middle index." },
                { num: 4, txt: "Compare the middle element to the RIGHTMOST element nums[R]." },
                { num: 5, txt: "If nums[mid] > nums[R], it means the 'inflection point' (minimum) is to the right. Move L to mid + 1." },
                { num: 6, txt: "If nums[mid] <= nums[R], it means the right half is sorted, so the minimum is to the left (or is mid itself). Set R = mid." },
                { num: 7, txt: "When L and R meet, they will point to the minimum element. Return nums[L]." }
              ]} 
            />
            <Complexity time="O(log N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>If an array is sorted and rotated, visualizing it as a bar chart reveals two upward slopes separated by a sharp drop (the inflection point). Our goal is to find that drop.</>,
              <>By comparing the middle element to the very last element in our current window (<code>nums[R]</code>), we can easily deduce which slope we are on. If <code>nums[mid] &gt; nums[R]</code>, we must be on the taller left slope, meaning the drop is to our right. If <code>nums[mid] &lt;= nums[R]</code>, we are already on the lower right slope, meaning the drop is to our left!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
