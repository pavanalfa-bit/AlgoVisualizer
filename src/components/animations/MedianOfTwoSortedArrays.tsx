import React, { useState } from 'react';
import { Slice, CheckCircle2, SlidersHorizontal, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p>
    <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums1 = [1,3], nums2 = [2]', 
    output: '2.00000',
    explanation: <>merged array = [1,2,3] and median is 2.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums1 = [1,2], nums2 = [3,4]', 
    output: '2.50000',
    explanation: <>merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>nums1.length == m</code>, <code>nums2.length == n</code></div>
    <div><code>0 &lt;= m &lt;= 1000</code>, <code>0 &lt;= n &lt;= 1000</code></div>
    <div><code>1 &lt;= m + n &lt;= 2000</code></div>
    <div><code>-10⁶ &lt;= nums1[i], nums2[i] &lt;= 10⁶</code></div>
  </>
);

const DEFAULT_JAVA = `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0.0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        # Write your code here\n        pass`;

const A = [1, 3, 8, 9, 15]; // Smaller array
const B = [7, 11, 18, 19, 21, 25]; // Larger array

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const m = A.length;
  const n = B.length;
  const total = m + n; // 11
  const half = Math.floor((total + 1) / 2); // 6
  
  timeline.push({
    l: 0, r: m, mid1: -1, mid2: -1, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: `We want to partition both arrays such that the left half has ${half} elements total. Always binary search on the smaller array (A) to minimize work. Initialize L = 0, R = ${m}.`,
    logic: `<strong>Init:</strong> L = 0, R = ${m}`, logicClass: 'info'
  });

  let l = 0;
  let r = m;

  while (l <= r) {
    timeline.push({
      l, r, mid1: -1, mid2: -1, returned: null, phase: 'check_loop',
      activeLines: [5], activeStep: 2,
      desc: `Check if L (${l}) <= R (${r}). True.`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid1 = Math.floor((l + r) / 2); // partition in A
    const mid2 = half - mid1; // partition in B
    
    timeline.push({
      l, r, mid1, mid2, returned: null, phase: 'calc_mids',
      activeLines: [6, 7], activeStep: 3,
      desc: `Partition A at i = ${mid1}. Since we need ${half} elements total in the left half, we MUST partition B at j = ${half} - ${mid1} = ${mid2}.`,
      logic: `i = ${mid1}, j = ${mid2}`, logicClass: 'info'
    });

    const left1 = mid1 === 0 ? -Infinity : A[mid1 - 1];
    const right1 = mid1 === m ? Infinity : A[mid1];
    const left2 = mid2 === 0 ? -Infinity : B[mid2 - 1];
    const right2 = mid2 === n ? Infinity : B[mid2];

    timeline.push({
      l, r, mid1, mid2, returned: null, phase: 'fetch_values',
      activeLines: [9, 10, 11, 12], activeStep: 4,
      desc: `Fetch the 4 boundary values around the partitions: L1 = ${left1 === -Infinity ? '-∞' : left1}, R1 = ${right1 === Infinity ? '∞' : right1}, L2 = ${left2 === -Infinity ? '-∞' : left2}, R2 = ${right2 === Infinity ? '∞' : right2}.`,
      logic: `L1=${left1 === -Infinity ? '-∞' : left1}, R1=${right1 === Infinity ? '∞' : right1} | L2=${left2 === -Infinity ? '-∞' : left2}, R2=${right2 === Infinity ? '∞' : right2}`, logicClass: 'info'
    });
    
    timeline.push({
      l, r, mid1, mid2, returned: null, phase: 'compare_cross',
      activeLines: [14], activeStep: 5,
      desc: `Check for a valid partition: L1 <= R2 AND L2 <= R1.`,
      logic: `Is ${left1 === -Infinity ? '-∞' : left1} <= ${right2 === Infinity ? '∞' : right2} AND ${left2 === -Infinity ? '-∞' : left2} <= ${right1 === Infinity ? '∞' : right1}?`, logicClass: 'warning'
    });

    if (left1 <= right2 && left2 <= right1) {
      // Valid partition found
      let res;
      if (total % 2 !== 0) {
          res = Math.max(left1, left2);
          timeline.push({
            l, r, mid1, mid2, returned: res, phase: 'found_odd',
            activeLines: [15, 16], activeStep: 6,
            desc: `Yes! Valid partition found. Total length is odd (${total}). The median is simply max(L1, L2) = max(${left1 === -Infinity ? '-∞' : left1}, ${left2 === -Infinity ? '-∞' : left2}) = ${res}.`,
            logic: `<strong style="color:var(--green)">Return ${res}</strong>`, logicClass: 'success'
          });
      } else {
          res = (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
          timeline.push({
            l, r, mid1, mid2, returned: res, phase: 'found_even',
            activeLines: [17, 18], activeStep: 6,
            desc: `Yes! Valid partition found. Total length is even (${total}). The median is (max(L1, L2) + min(R1, R2)) / 2 = ${res}.`,
            logic: `<strong style="color:var(--green)">Return ${res}</strong>`, logicClass: 'success'
          });
      }
      break;
    } else if (left1 > right2) {
      r = mid1 - 1;
      timeline.push({
        l, r, mid1, mid2, returned: null, phase: 'move_left',
        activeLines: [20, 21], activeStep: 7,
        desc: `No, L1 (${left1}) > R2 (${right2 === Infinity ? '∞' : right2}). L1 is too big! We must move the partition in A to the left. R = mid1 - 1 (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'error'
      });
    } else {
      l = mid1 + 1;
      timeline.push({
        l, r, mid1, mid2, returned: null, phase: 'move_right',
        activeLines: [22, 23], activeStep: 8,
        desc: `No, L2 (${left2}) > R1 (${right1 === Infinity ? '∞' : right1}). L2 is too big (meaning L1 is too small). We must move the partition in A to the right. L = mid1 + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function MedianOfTwoSortedArrays({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Median of Two Sorted Arrays" lcNum="4" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Median of Two Sorted Arrays" lcNum="4" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Scale size={20} />} title="Partitioning the Arrays"
              lines={["We need to divide both arrays into a left half and a right half. The total number of elements in the left halves must equal the total number of elements in the right halves.", "If we pick a partition index 'i' in array A, the partition index 'j' in array B is strictly determined by the math!", "We binary search 'i' in the smaller array until the largest element on the left <= smallest element on the right."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Partition Visualization
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                
                {/* Array A */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold', marginBottom: '12px' }}>Array A (Smaller)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {A.map((num, idx) => {
                      const isLeft = idx < current.mid1;
                      const isL1 = idx === current.mid1 - 1;
                      const isR1 = idx === current.mid1;

                      let bg = 'var(--surface)';
                      let border = 'var(--border-strong)';
                      
                      if (current.mid1 !== -1) {
                        bg = isLeft ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 107, 107, 0.2)';
                        border = isLeft ? 'var(--sky)' : 'var(--pink)';
                      }
                      if (['fetch_values', 'compare_cross'].includes(current.phase) && (isL1 || isR1)) {
                         bg = 'rgba(255, 193, 7, 0.4)';
                         border = 'var(--warning)';
                      }
                      if (current.phase.startsWith('found') && (isL1 || isR1)) {
                         bg = 'rgba(34, 197, 94, 0.4)';
                         border = 'var(--green)';
                      }

                      return (
                        <React.Fragment key={idx}>
                          {idx === current.mid1 && (
                            <motion.div layout style={{ width: '4px', height: '60px', background: 'var(--text)', borderRadius: '2px', opacity: 0.5 }} />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <motion.div 
                              layout
                              style={{
                                width: '48px', height: '48px',
                                background: bg, border: `2px solid ${border}`,
                                borderRadius: '8px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                              }}
                            >
                              <span style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 'bold' }}>{num}</span>
                            </motion.div>
                            <div style={{ height: '20px', marginTop: '4px' }}>
                              {isL1 && <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold' }}>L1</span>}
                              {isR1 && <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold' }}>R1</span>}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {current.mid1 === A.length && (
                      <motion.div layout style={{ width: '4px', height: '60px', background: 'var(--text)', borderRadius: '2px', opacity: 0.5 }} />
                    )}
                  </div>
                </div>

                {/* Array B */}
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold', marginBottom: '12px' }}>Array B (Larger)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {B.map((num, idx) => {
                      const isLeft = idx < current.mid2;
                      const isL2 = idx === current.mid2 - 1;
                      const isR2 = idx === current.mid2;

                      let bg = 'var(--surface)';
                      let border = 'var(--border-strong)';
                      
                      if (current.mid2 !== -1) {
                        bg = isLeft ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 107, 107, 0.2)';
                        border = isLeft ? 'var(--sky)' : 'var(--pink)';
                      }
                      if (['fetch_values', 'compare_cross'].includes(current.phase) && (isL2 || isR2)) {
                         bg = 'rgba(255, 193, 7, 0.4)';
                         border = 'var(--warning)';
                      }
                      if (current.phase.startsWith('found') && (isL2 || isR2)) {
                         bg = 'rgba(34, 197, 94, 0.4)';
                         border = 'var(--green)';
                      }

                      return (
                        <React.Fragment key={idx}>
                          {idx === current.mid2 && (
                            <motion.div layout style={{ width: '4px', height: '60px', background: 'var(--text)', borderRadius: '2px', opacity: 0.5 }} />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <motion.div 
                              layout
                              style={{
                                width: '48px', height: '48px',
                                background: bg, border: `2px solid ${border}`,
                                borderRadius: '8px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                              }}
                            >
                              <span style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 'bold' }}>{num}</span>
                            </motion.div>
                            <div style={{ height: '20px', marginTop: '4px' }}>
                              {isL2 && <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold' }}>L2</span>}
                              {isR2 && <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold' }}>R2</span>}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {current.mid2 === B.length && (
                      <motion.div layout style={{ width: '4px', height: '60px', background: 'var(--text)', borderRadius: '2px', opacity: 0.5 }} />
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="card">
              <div className="card-title">State</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R (in A)</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">i (A partition)</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid1 !== -1 ? current.mid1 : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">j (B partition)</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid2 !== -1 ? current.mid2 : '-'}</div>
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
              title="Median of Two Sorted Arrays"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public double findMedianSortedArrays(int[] A, int[] B) {",
                "    if (A.length > B.length) return findMedianSortedArrays(B, A);",
                "    int m = A.length, n = B.length;",
                "    int l = 0, r = m;",
                "    while (l <= r) {",
                "        int i = l + (r - l) / 2;",
                "        int j = (m + n + 1) / 2 - i;",
                "        ",
                "        int l1 = (i == 0) ? Integer.MIN_VALUE : A[i - 1];",
                "        int r1 = (i == m) ? Integer.MAX_VALUE : A[i];",
                "        int l2 = (j == 0) ? Integer.MIN_VALUE : B[j - 1];",
                "        int r2 = (j == n) ? Integer.MAX_VALUE : B[j];",
                "        ",
                "        if (l1 <= r2 && l2 <= r1) {",
                "            if ((m + n) % 2 != 0) return Math.max(l1, l2);",
                "            else return (Math.max(l1, l2) + Math.min(r1, r2)) / 2.0;",
                "        } else if (l1 > r2) {",
                "            r = i - 1;",
                "        } else {",
                "            l = i + 1;",
                "        }",
                "    }",
                "    return 0.0;",
                "}"
              ]}
              pythonCode={[
                "def findMedianSortedArrays(self, A: list[int], B: list[int]) -> float:",
                "    if len(A) > len(B): return self.findMedianSortedArrays(B, A)",
                "    m, n = len(A), len(B)",
                "    l, r = 0, m",
                "    while l <= r:",
                "        i = (l + r) // 2",
                "        j = (m + n + 1) // 2 - i",
                "        ",
                "        l1 = float('-inf') if i == 0 else A[i - 1]",
                "        r1 = float('inf') if i == m else A[i]",
                "        l2 = float('-inf') if j == 0 else B[j - 1]",
                "        r2 = float('inf') if j == n else B[j]",
                "        ",
                "        if l1 <= r2 and l2 <= r1:",
                "            if (m + n) % 2 != 0: return max(l1, l2)",
                "            else: return (max(l1, l2) + min(r1, r2)) / 2.0",
                "        elif l1 > r2:",
                "            r = i - 1",
                "        else:",
                "            l = i + 1",
                "            ",
                "    return 0.0"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Ensure A is the smaller array to optimize runtime." },
                { num: 2, txt: "Binary search on A: L = 0, R = len(A)." },
                { num: 3, txt: "Pick partition i in A. Calculate partition j in B so left halves have exactly (m+n+1)/2 elements." },
                { num: 4, txt: "Get the edge values around the partitions: L1, R1, L2, R2. Use +/- infinity for out-of-bounds." },
                { num: 5, txt: "Check cross constraints: L1 <= R2 and L2 <= R1. If true, partition is perfect!" },
                { num: 6, txt: "If total length is odd, median is max(L1, L2). If even, median is average of max(L1, L2) and min(R1, R2)." },
                { num: 7, txt: "If L1 > R2, we took too many from A. Move partition left: R = i - 1." },
                { num: 8, txt: "If L2 > R1, we took too few from A. Move partition right: L = i + 1." }
              ]} 
            />
            <Complexity time="O(log(min(m, n)))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>To find the median, we don't need to sort both arrays entirely. We just need to find a perfect <strong>cut</strong> through both arrays that separates the smaller half of elements from the larger half.</>,
              <>By binary searching the cut location in the smaller array, the cut location in the larger array is strictly determined by math (since the left half size is fixed). We then just check the four numbers on the boundaries of the cut to ensure everything on the left is smaller than everything on the right!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
