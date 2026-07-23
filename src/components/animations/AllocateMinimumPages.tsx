import React, { useState } from 'react';
import { BookOpen, CheckCircle2, SlidersHorizontal, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You have <code>N</code> books, each with <code>A[i]</code> number of pages. <code>M</code> students need to be allocated contiguous books, with each student getting at least one book.</p>
    <p>Out of all the permutations, the goal is to find the permutation where the student with the most pages allocated to them gets the <strong>minimum</strong> number of pages, out of all possible permutations.</p>
    <p>If allocation is not possible, return -1.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'A = [12, 34, 67, 90], M = 2', 
    output: '113',
    explanation: <>Allocation can be done in following ways: [12] and [34, 67, 90] (Max = 191), [12, 34] and [67, 90] (Max = 157), [12, 34, 67] and [90] (Max = 113). The minimum of these max values is 113.</>
  },
  { 
    label: 'Example 2', 
    input: 'A = [15, 17, 20], M = 2', 
    output: '32',
    explanation: <>Allocation: [15, 17] and [20]. Maximum is 32.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= N &lt;= 10⁵</code></div>
    <div><code>1 &lt;= A[i] &lt;= 10⁶</code></div>
    <div><code>1 &lt;= M &lt;= 10⁵</code></div>
  </>
);

const DEFAULT_JAVA = `class Solution {\n    public static int findPages(int[]A,int N,int M) {\n        // Write your code here\n        return -1;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def findPages(self, A: list[int], N: int, M: int) -> int:\n        # Write your code here\n        pass`;

const NUMS = [12, 34, 67, 90];
const K = 2;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  if (K > NUMS.length) {
      timeline.push({
          l: -1, r: -1, mid: -1, splits: 0, returned: -1, phase: 'invalid',
          activeLines: [2], activeStep: 1,
          desc: `M (${K}) is strictly greater than N (${NUMS.length}). We cannot allocate at least one book to every student. Return -1.`,
          logic: `M > N`, logicClass: 'error'
      });
      return timeline;
  }
  
  const maxNum = Math.max(...NUMS);
  const sumNum = NUMS.reduce((a, b) => a + b, 0);
  
  timeline.push({
    l: maxNum, r: sumNum, mid: -1, splits: 0, returned: null, phase: 'init',
    activeLines: [4, 5], activeStep: 2,
    desc: `Initialize L = ${maxNum} (max pages, since a student must take at least one whole book) and R = ${sumNum} (sum of pages, if M=1 student reads everything).`,
    logic: `<strong>Init:</strong> L = ${maxNum}, R = ${sumNum}`, logicClass: 'info'
  });

  let l = maxNum;
  let r = sumNum;

  while (l <= r) {
    timeline.push({
      l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
      activeLines: [6], activeStep: 3,
      desc: `Check if L (${l}) <= R (${r}). True.`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, splits: 0, returned: null, phase: 'calc_mid',
      activeLines: [7], activeStep: 4,
      desc: `Try a maximum page limit of mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `Page Limit = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    let splits = 1;
    let currentSum = 0;
    
    timeline.push({
      l, r, mid, splits, returned: null, phase: 'calc_splits_start',
      activeLines: [8, 9], activeStep: 5,
      desc: `Simulate allocating books with a max limit of ${mid} pages per student. Start with Student 1.`,
      logic: `Simulating allocation...`, logicClass: 'info'
    });

    for (let i = 0; i < NUMS.length; i++) {
      const num = NUMS[i];
      if (currentSum + num > mid) {
        splits++;
        currentSum = 0;
        timeline.push({
          l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_new',
          activeLines: [11, 12, 13], activeStep: 5,
          desc: `Adding ${num} exceeds the limit ${mid}! We must give this book to the next student. Students count is now ${splits}.`,
          logic: `Limit exceeded! Next Student: ${splits}`, logicClass: 'warning'
        });
      }
      currentSum += num;
      timeline.push({
        l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_step',
        activeLines: [15], activeStep: 5,
        desc: `Allocate book with ${num} pages to current student. Their total is ${currentSum} / ${mid}.`,
        logic: `Allocate: <strong style="color:var(--sky)">${currentSum}</strong> / ${mid}`, logicClass: 'info'
      });
    }

    timeline.push({
      l, r, mid, splits, returned: null, phase: 'compare_splits',
      activeLines: [18], activeStep: 6,
      desc: `It requires ${splits} students if the max limit is ${mid}. We have ${K} students. Did we need too many students?`,
      logic: `Is <strong style="color:var(--sky)">${splits}</strong> <= <strong style="color:var(--green)">${K}</strong>?`, logicClass: 'warning'
    });

    if (splits <= K) {
      r = mid - 1;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_ok',
        activeLines: [19], activeStep: 7,
        desc: `Yes, ${splits} <= ${K}. We were able to allocate it to ${K} or fewer students! This limit works. Let's try to find a strictly SMALLER limit by moving R to mid - 1 (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_bad',
        activeLines: [20, 21], activeStep: 8,
        desc: `No, ${splits} > ${K}. We needed too many students because our page limit (${mid}) was too small! We MUST increase the limit: L = mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
    activeLines: [6], activeStep: 3,
    desc: `Check if L (${l}) <= R (${r}). False! L and R have crossed.`,
    logic: `L <= R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  timeline.push({
    l, r, mid: -1, splits: 0, returned: l, phase: 'found',
    activeLines: [24], activeStep: 9,
    desc: `The minimized largest allocation is ${l}. Return it!`,
    logic: `<strong style="color:var(--green)">Return ${l}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function AllocateMinimumPages({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Allocate Minimum Number of Pages" lcNum="GFG" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Allocate Minimum Number of Pages" lcNum="GFG" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<BookOpen size={20} />} title="Classic Binary Search on Answer"
              lines={["This problem is mathematically identical to 'Split Array Largest Sum'. Instead of subarrays, it's students. Instead of array elements, it's books.", "Guess the answer (the page limit). If the limit is too strict, we need more than M students.", "If the limit is generous, we can fit the books within M students!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Allocation Simulation
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Available Students (M)</div>
                    <strong style={{ color: 'var(--green)', fontSize: '1.5rem' }}>{K}</strong>
                  </div>
                  
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: `2px dashed ${current.phase === 'compare_splits' ? (current.splits <= K ? 'var(--green)' : 'var(--pink)') : 'var(--sky)'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Used Students @ limit={current.mid !== -1 ? current.mid : '?'}</div>
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
                            width: `${Math.max(48, (num/100) * 80)}px`, height: '48px',
                            background: bg, border: `2px solid ${border}`,
                            borderRadius: '4px', position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <BookMarked size={16} style={{ position: 'absolute', top: 4, left: 4, opacity: 0.5 }} />
                          <span style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 'bold' }}>{num}</span>
                        </motion.div>
                        {isActive && <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', marginTop: '55px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>+ {num}</motion.div>}
                      </div>
                    );
                  })}
                </div>
                
                {/* Allocation progress bar */}
                {(current.phase.startsWith('calc_splits') || ['compare_splits', 'splits_ok', 'splits_bad'].includes(current.phase)) && current.mid !== -1 && (
                  <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>Student {current.splits} Load</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>{current.currentSum || 0} / {current.mid} Pages</span>
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
              <div className="card-title">Search Space (Page Limit)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Page Limit</div>
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
              title="Allocate Minimum Pages"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int findPages(int[] A, int N, int M) {",
                "    if (M > N) return -1; // Edge case",
                "    ",
                "    int l = max(A);",
                "    int r = sum(A);",
                "    while (l <= r) {",
                "        int mid = l + (r - l) / 2;",
                "        int students = 1;",
                "        int currentPages = 0;",
                "        for (int pages : A) {",
                "            if (currentPages + pages > mid) {",
                "                students++;",
                "                currentPages = 0;",
                "            }",
                "            currentPages += pages;",
                "        }",
                "        ",
                "        if (students <= M) {",
                "            r = mid - 1;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "def findPages(self, A: list[int], N: int, M: int) -> int:",
                "    if M > N: return -1",
                "    ",
                "    l = max(A)",
                "    r = sum(A)",
                "    while l <= r:",
                "        mid = (l + r) // 2",
                "        students = 1",
                "        current_pages = 0",
                "        for pages in A:",
                "            if current_pages + pages > mid:",
                "                students += 1",
                "                current_pages = 0",
                "                ",
                "            current_pages += pages",
                "            ",
                "        if students <= M:",
                "            r = mid - 1",
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
                { num: 1, txt: "Check edge case: if students > books, allocation is impossible." },
                { num: 2, txt: "Initialize L to max(books) and R to sum(books)." },
                { num: 3, txt: "Loop while L <= R (standard binary search template)." },
                { num: 4, txt: "Calculate a mid capacity (our 'guess' for the max pages)." },
                { num: 5, txt: "Greedily simulate allocation. Iterate through books, if giving the next book exceeds mid, we MUST give it to the next student." },
                { num: 6, txt: "Check if the total students needed <= M." },
                { num: 7, txt: "If YES, we successfully allocated it! Try an even SMALLER limit: R = mid - 1." },
                { num: 8, txt: "If NO, we used more than M students. Our limit was too strict. We MUST increase the limit: L = mid + 1." },
                { num: 9, txt: "Return L as the final answer." }
              ]} 
            />
            <Complexity time="O(N * log(sum - max))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is identical to "Split Array Largest Sum" and "Capacity to Ship Packages Within D Days". The story changes, but the math does not!</>,
              <>Books = Array elements. Students = Subarrays/Days. Page Limit = Subarray Sum / Ship Capacity.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
