import React, { useState } from 'react';
import { Paintbrush, CheckCircle2, SlidersHorizontal, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given 2 integers <code>A</code> and <code>B</code> and an array of integers <code>C</code> of size <code>N</code>.</p>
    <p>Board <code>i</code> has length <code>C[i]</code>. 1 unit of board takes <code>B</code> units of time to paint.</p>
    <p>You have <code>A</code> painters available. A painter can only paint contiguous sections of board. Find the minimum time to get this job done.</p>
    <p>Return the answer modulo <code>10000003</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'A = 2, B = 5, C = [1, 10]', 
    output: '50',
    explanation: <>Painter 1 paints board 1 (length 1). Painter 2 paints board 2 (length 10). Max length painted by a painter is 10. Time = 10 * 5 = 50.</>
  },
  { 
    label: 'Example 2', 
    input: 'A = 10, B = 1, C = [1, 8, 11, 3]', 
    output: '11',
    explanation: <>Max length painted by a painter is 11. Time = 11 * 1 = 11.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= A &lt;= 1000</code></div>
    <div><code>1 &lt;= B &lt;= 10⁶</code></div>
    <div><code>1 &lt;= N &lt;= 10⁵</code></div>
    <div><code>1 &lt;= C[i] &lt;= 10⁶</code></div>
  </>
);

const DEFAULT_JAVA = `public class Solution {\n    public int paint(int A, int B, int[] C) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def paint(self, A: int, B: int, C: list[int]) -> int:\n        # Write your code here\n        pass`;

const NUMS = [1, 8, 11, 3];
const A = 2; // Painters
const B_VAL = 1; // Time per unit

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const maxNum = Math.max(...NUMS);
  const sumNum = NUMS.reduce((a, b) => a + b, 0);
  
  timeline.push({
    l: maxNum, r: sumNum, mid: -1, splits: 0, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: `Initialize L = ${maxNum} (max board, since a painter must paint at least one whole board) and R = ${sumNum} (sum of boards, if A=1 painter does everything).`,
    logic: `<strong>Init:</strong> L = ${maxNum}, R = ${sumNum}`, logicClass: 'info'
  });

  let l = maxNum;
  let r = sumNum;

  while (l <= r) {
    timeline.push({
      l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) <= R (${r}). True.`,
      logic: `L <= R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, splits: 0, returned: null, phase: 'calc_mid',
      activeLines: [5], activeStep: 3,
      desc: `Try a maximum board length limit of mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `Board Limit = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    let splits = 1;
    let currentSum = 0;
    
    timeline.push({
      l, r, mid, splits, returned: null, phase: 'calc_splits_start',
      activeLines: [6, 7], activeStep: 4,
      desc: `Simulate assigning boards with a max limit of ${mid} units per painter. Start with Painter 1.`,
      logic: `Simulating assignment...`, logicClass: 'info'
    });

    for (let i = 0; i < NUMS.length; i++) {
      const num = NUMS[i];
      if (currentSum + num > mid) {
        splits++;
        currentSum = 0;
        timeline.push({
          l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_new',
          activeLines: [9, 10, 11], activeStep: 4,
          desc: `Adding ${num} exceeds the limit ${mid}! We must give this board to the next painter. Painters count is now ${splits}.`,
          logic: `Limit exceeded! Next Painter: ${splits}`, logicClass: 'warning'
        });
      }
      currentSum += num;
      timeline.push({
        l, r, mid, splits, currentSum, activeItem: i, returned: null, phase: 'calc_splits_step',
        activeLines: [13], activeStep: 4,
        desc: `Assign board of length ${num} to current painter. Their total is ${currentSum} / ${mid}.`,
        logic: `Assign: <strong style="color:var(--sky)">${currentSum}</strong> / ${mid}`, logicClass: 'info'
      });
    }

    timeline.push({
      l, r, mid, splits, returned: null, phase: 'compare_splits',
      activeLines: [16], activeStep: 5,
      desc: `It requires ${splits} painters if the max limit is ${mid}. We have ${A} painters available. Did we need too many painters?`,
      logic: `Is <strong style="color:var(--sky)">${splits}</strong> <= <strong style="color:var(--green)">${A}</strong>?`, logicClass: 'warning'
    });

    if (splits <= A) {
      r = mid - 1;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_ok',
        activeLines: [17], activeStep: 6,
        desc: `Yes, ${splits} <= ${A}. We were able to assign to ${A} or fewer painters! This limit works. Let's try to find a strictly SMALLER limit by moving R to mid - 1 (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, splits, returned: null, phase: 'splits_bad',
        activeLines: [18, 19], activeStep: 7,
        desc: `No, ${splits} > ${A}. We needed too many painters because our board limit (${mid}) was too small! We MUST increase the limit: L = mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, splits: 0, returned: null, phase: 'check_loop',
    activeLines: [4], activeStep: 2,
    desc: `Check if L (${l}) <= R (${r}). False! L and R have crossed.`,
    logic: `L <= R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  const finalResult = (l * B_VAL) % 10000003;

  timeline.push({
    l, r, mid: -1, splits: 0, returned: finalResult, phase: 'found',
    activeLines: [22], activeStep: 8,
    desc: `The minimized largest board length is ${l}. We multiply by time B (${B_VAL}) and return modulo 10000003. Result: ${finalResult}.`,
    logic: `<strong style="color:var(--green)">Return ${finalResult}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function PaintersPartitionProblem({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Painter's Partition Problem" lcNum="IB" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Painter's Partition Problem" lcNum="IB" difficulty="Hard" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Paintbrush size={20} />} title="Classic Binary Search on Answer"
              lines={["This problem is exactly the same as 'Allocate Minimum Pages' and 'Split Array Largest Sum'.", "The only difference is that after finding the minimum max board length, we multiply it by B (time to paint 1 unit) and take modulo 10000003."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Painting Simulation
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Available Painters (A)</div>
                    <strong style={{ color: 'var(--green)', fontSize: '1.5rem' }}>{A}</strong>
                  </div>
                  
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: `2px dashed ${current.phase === 'compare_splits' ? (current.splits <= A ? 'var(--green)' : 'var(--pink)') : 'var(--sky)'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Used Painters @ limit={current.mid !== -1 ? current.mid : '?'}</div>
                    <strong style={{ color: current.phase === 'compare_splits' ? (current.splits <= A ? 'var(--green)' : 'var(--pink)') : 'var(--sky)', fontSize: '1.5rem' }}>{current.splits}</strong>
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
                      bg = 'rgba(108, 142, 245, 0.4)';
                      border = 'var(--accent)';
                    } else if (isProcessed || isFullyProcessed) {
                      bg = 'rgba(78, 205, 196, 0.2)';
                      border = 'var(--sky)';
                    }

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity }}>
                        <motion.div 
                          layout
                          style={{
                            width: `${Math.max(40, num * 12)}px`, height: '48px',
                            background: bg, border: `2px solid ${border}`,
                            borderRadius: '4px', position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <Square size={16} style={{ position: 'absolute', top: 4, left: 4, opacity: 0.3 }} />
                          <span style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 'bold' }}>{num}</span>
                        </motion.div>
                        {isActive && <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', marginTop: '55px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>+ {num}</motion.div>}
                      </div>
                    );
                  })}
                </div>
                
                {/* Painter progress bar */}
                {(current.phase.startsWith('calc_splits') || ['compare_splits', 'splits_ok', 'splits_bad'].includes(current.phase)) && current.mid !== -1 && (
                  <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>Painter {current.splits} Load</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>{current.currentSum || 0} / {current.mid} Units</span>
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
              <div className="card-title">Search Space (Board Limit)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Board Limit</div>
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
              title="Painter's Partition Problem"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int paint(int A, int B, int[] C) {",
                "    long l = max(C);",
                "    long r = sum(C);",
                "    while (l <= r) {",
                "        long mid = l + (r - l) / 2;",
                "        int painters = 1;",
                "        long currentBoards = 0;",
                "        for (int b : C) {",
                "            if (currentBoards + b > mid) {",
                "                painters++;",
                "                currentBoards = 0;",
                "            }",
                "            currentBoards += b;",
                "        }",
                "        ",
                "        if (painters <= A) {",
                "            r = mid - 1;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return (int) ((l * B) % 10000003);",
                "}"
              ]}
              pythonCode={[
                "def paint(self, A: int, B: int, C: list[int]) -> int:",
                "    l = max(C)",
                "    r = sum(C)",
                "    while l <= r:",
                "        mid = (l + r) // 2",
                "        painters = 1",
                "        current_boards = 0",
                "        for b in C:",
                "            if current_boards + b > mid:",
                "                painters += 1",
                "                current_boards = 0",
                "                ",
                "            current_boards += b",
                "            ",
                "        if painters <= A:",
                "            r = mid - 1",
                "        else:",
                "            l = mid + 1",
                "            ",
                "    return (l * B) % 10000003"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L to max(C) and R to sum(C)." },
                { num: 2, txt: "Loop while L <= R." },
                { num: 3, txt: "Calculate a mid capacity (our 'guess' for the max board length)." },
                { num: 4, txt: "Greedily simulate painting. Iterate through boards, if giving the next board exceeds mid, we MUST give it to the next painter." },
                { num: 5, txt: "Check if the total painters needed <= A." },
                { num: 6, txt: "If YES, we successfully assigned it! Try an even SMALLER limit: R = mid - 1." },
                { num: 7, txt: "If NO, we used more than A painters. Our limit was too strict. We MUST increase the limit: L = mid + 1." },
                { num: 8, txt: "Return (L * B) % 10000003 as the final answer." }
              ]} 
            />
            <Complexity time="O(N * log(sum - max))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is identical to "Allocate Minimum Pages" and "Split Array Largest Sum". The story changes, but the math does not!</>,
              <>Boards = Array elements. Painters = Subarrays/Students. Max length limit = Subarray Sum.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
