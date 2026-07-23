import React, { useState } from 'react';
import { Banana, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>iᵗʰ</code> pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours.</p>
    <p>Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour.</p>
    <p>Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.</p>
    <p>Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'piles = [3,6,7,11], h = 8', 
    output: '4'
  },
  { 
    label: 'Example 2', 
    input: 'piles = [30,11,23,4,20], h = 5', 
    output: '30'
  },
  { 
    label: 'Example 3', 
    input: 'piles = [30,11,23,4,20], h = 6', 
    output: '23'
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= piles.length &lt;= 10⁴</code></div>
    <div><code>piles.length &lt;= h &lt;= 10⁹</code></div>
    <div><code>1 &lt;= piles[i] &lt;= 10⁹</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int minEatingSpeed(int[] piles, int h) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def minEatingSpeed(self, piles: list[int], h: int) -> int:\n        # Write your code here\n        pass`;

const PILES = [3, 6, 7, 11];
const H = 8;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const maxPile = Math.max(...PILES);
  
  timeline.push({
    l: 1, r: maxPile, mid: -1, hours: 0, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: `Initialize L = 1 (minimum possible speed) and R = ${maxPile} (maximum possible speed, which is the largest pile).`,
    logic: `<strong>Init:</strong> L = 1, R = ${maxPile}`, logicClass: 'info'
  });

  let l = 1;
  let r = maxPile;

  while (l < r) {
    timeline.push({
      l, r, mid: -1, hours: 0, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, hours: 0, returned: null, phase: 'calc_mid',
      activeLines: [5], activeStep: 3,
      desc: `Try an eating speed of mid = (${l} + ${r}) / 2 = ${mid} bananas per hour.`,
      logic: `Speed = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    let hours = 0;
    timeline.push({
      l, r, mid, hours, returned: null, phase: 'calc_hours_start',
      activeLines: [6], activeStep: 4,
      desc: `Calculate how many hours it takes to eat all piles at speed ${mid}.`,
      logic: `Calculate hours`, logicClass: 'info'
    });

    for (let i = 0; i < PILES.length; i++) {
      const pile = PILES[i];
      const hrsForPile = Math.ceil(pile / mid);
      hours += hrsForPile;
      
      timeline.push({
        l, r, mid, hours, activePile: i, returned: null, phase: 'calc_hours_step',
        activeLines: [7, 8], activeStep: 4,
        desc: `Pile ${i} has ${pile} bananas. At speed ${mid}, it takes ceil(${pile} / ${mid}) = ${hrsForPile} hours. Total hours = ${hours}.`,
        logic: `Pile ${i}: +${hrsForPile} hrs`, logicClass: 'info'
      });
    }

    timeline.push({
      l, r, mid, hours, returned: null, phase: 'compare_hours',
      activeLines: [11], activeStep: 5,
      desc: `It takes ${hours} hours to eat everything at speed ${mid}. We have ${H} hours available. Can she finish in time?`,
      logic: `Is <strong style="color:var(--sky)">${hours}</strong> <= <strong style="color:var(--green)">${H}</strong>?`, logicClass: 'warning'
    });

    if (hours <= H) {
      r = mid;
      timeline.push({
        l, r, mid, hours, returned: null, phase: 'hours_ok',
        activeLines: [12], activeStep: 6,
        desc: `Yes, ${hours} <= ${H}. She CAN finish! But we want the MINIMUM speed. Let's try to eat slower by moving R to mid (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, hours, returned: null, phase: 'hours_bad',
        activeLines: [13, 14], activeStep: 7,
        desc: `No, ${hours} > ${H}. She is too slow and won't finish in time. She MUST eat faster! Move L to mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, hours: 0, returned: null, phase: 'check_loop',
    activeLines: [4], activeStep: 2,
    desc: `Check if L (${l}) < R (${r}). False! L and R have converged.`,
    logic: `L < R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  timeline.push({
    l, r, mid: -1, hours: 0, returned: l, phase: 'found',
    activeLines: [17], activeStep: 8,
    desc: `The minimum speed required is ${l}. Return it!`,
    logic: `<strong style="color:var(--green)">Return ${l}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function KokoEatingBananas({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Koko Eating Bananas" lcNum="875" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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

  const maxPile = Math.max(...PILES);

  return (
    <VisualizerLayout>
      <VPHeader title="Koko Eating Bananas" lcNum="875" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<SlidersHorizontal size={20} />} title="Binary Search on Answer"
              lines={["We aren't searching for an index in an array. We are searching for an ANSWER in a range of possible answers!", "The answer (speed k) must be between 1 and max(piles).", "Since speed is monotonically related to time (higher speed = less time), we can binary search the speed!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Eating Simulation
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Target Time</div>
                    <strong style={{ color: 'var(--green)', fontSize: '1.5rem' }}>{H} hrs</strong>
                  </div>
                  
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: `2px dashed ${current.phase === 'compare_hours' ? (current.hours <= H ? 'var(--green)' : 'var(--pink)') : 'var(--sky)'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Simulated Time @ k={current.mid !== -1 ? current.mid : '?'}</div>
                    <strong style={{ color: current.phase === 'compare_hours' ? (current.hours <= H ? 'var(--green)' : 'var(--pink)') : 'var(--sky)', fontSize: '1.5rem' }}>{current.hours} hrs</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '120px', gap: '16px', marginBottom: '24px', padding: '0 20px' }}>
                  {PILES.map((pile: number, idx: number) => {
                    const isActive = current.phase === 'calc_hours_step' && current.activePile === idx;
                    const isProcessed = current.phase === 'calc_hours_step' && idx < current.activePile;
                    const isFullyProcessed = ['compare_hours', 'hours_ok', 'hours_bad'].includes(current.phase);
                    
                    const heightPercent = Math.max(20, (pile / maxPile) * 100);

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

                    // How many hours did this pile take?
                    const hrs = current.mid !== -1 ? Math.ceil(pile / current.mid) : 0;

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity }}>
                        
                        <motion.div 
                          layout
                          style={{
                            width: '40px', height: `${heightPercent}px`,
                            background: bg, border: `2px solid ${border}`,
                            borderRadius: '4px', position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <Banana size={20} color={isActive ? "var(--accent)" : "var(--muted)"} />
                        </motion.div>

                        <div style={{ height: '40px', textAlign: 'center', marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 'bold' }}>{pile}</span>
                          {(isActive || isProcessed || isFullyProcessed) && current.mid !== -1 && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '0.7rem', color: 'var(--sky)', fontWeight: 'bold' }}>{hrs}h</motion.span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Search Space (Speed k)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Speed (k)</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid !== -1 ? current.mid : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned Speed</div>
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
              title="Koko Eating Bananas"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int minEatingSpeed(int[] piles, int h) {",
                "    int l = 1;",
                "    int r = 1000000000; // or max(piles)",
                "    while (l < r) {",
                "        int mid = l + (r - l) / 2;",
                "        int hours = 0;",
                "        for (int p : piles) {",
                "            hours += Math.ceil((double) p / mid);",
                "        }",
                "        ",
                "        if (hours <= h) {",
                "            r = mid;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "import math",
                "def minEatingSpeed(self, piles: list[int], h: int) -> int:",
                "    l, r = 1, max(piles)",
                "    while l < r:",
                "        mid = (l + r) // 2",
                "        hours = sum(math.ceil(p / mid) for p in piles)",
                "        ",
                "        ",
                "        ",
                "        ",
                "        if hours <= h:",
                "            r = mid",
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
                { num: 1, txt: "Initialize L to 1 (slowest speed) and R to the maximum pile size (fastest useful speed)." },
                { num: 2, txt: "Loop while L < R." },
                { num: 3, txt: "Calculate a mid speed." },
                { num: 4, txt: "Simulate eating all the piles at this speed. Hours for a pile = ceil(pile / speed). Add them up." },
                { num: 5, txt: "Check if the total hours <= target hours H." },
                { num: 6, txt: "If YES, Koko can finish in time! But we want the MINIMUM speed, so try slower speeds: R = mid." },
                { num: 7, txt: "If NO, Koko is too slow. She MUST eat faster: L = mid + 1." },
                { num: 8, txt: "When L meets R, we've found the absolute minimum speed required. Return L." }
              ]} 
            />
            <Complexity time="O(N * log(maxP))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>When you see a problem asking for the "minimum/maximum value that satisfies a condition" and the condition has a monotonic relationship with the value, it's a huge hint for <strong>Binary Search on Answer</strong>.</>,
              <>Here, eating faster ALWAYS decreases or maintains the time taken. Eating slower ALWAYS increases or maintains the time taken. Because this relationship is strictly monotonic, we don't have to check every speed from 1 to 1,000,000,000. We can just guess the middle, check if it works, and eliminate half the possible speeds!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
