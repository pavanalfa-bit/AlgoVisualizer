import React, { useState } from 'react';
import { Ship, CheckCircle2, SlidersHorizontal, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>A conveyor belt has packages that must be shipped from one port to another within <code>days</code> days.</p>
    <p>The <code>iᵗʰ</code> package on the conveyor belt has a weight of <code>weights[i]</code>. Each day, we load the ship with packages on the conveyor belt (in the order given by <code>weights</code>). We may not load more weight than the maximum weight capacity of the ship.</p>
    <p>Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within <code>days</code> days.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5', 
    output: '15',
    explanation: <>A ship capacity of 15 is the minimum to ship all the packages in 5 days.</>
  },
  { 
    label: 'Example 2', 
    input: 'weights = [3,2,2,4,1,4], days = 3', 
    output: '6',
    explanation: <>A ship capacity of 6 is the minimum to ship all the packages in 3 days.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= days &lt;= weights.length &lt;= 5 * 10⁴</code></div>
    <div><code>1 &lt;= weights[i] &lt;= 500</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int shipWithinDays(int[] weights, int days) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def shipWithinDays(self, weights: list[int], days: int) -> int:\n        # Write your code here\n        pass`;

const WEIGHTS = [3, 2, 2, 4, 1, 4];
const DAYS = 3;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const maxWeight = Math.max(...WEIGHTS);
  const sumWeight = WEIGHTS.reduce((a, b) => a + b, 0);
  
  timeline.push({
    l: maxWeight, r: sumWeight, mid: -1, daysNeeded: 0, returned: null, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: `Initialize L = ${maxWeight} (max weight, so we can carry the heaviest package) and R = ${sumWeight} (sum of weights, so we can carry everything in 1 day).`,
    logic: `<strong>Init:</strong> L = ${maxWeight}, R = ${sumWeight}`, logicClass: 'info'
  });

  let l = maxWeight;
  let r = sumWeight;

  while (l < r) {
    timeline.push({
      l, r, mid: -1, daysNeeded: 0, returned: null, phase: 'check_loop',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const mid = Math.floor((l + r) / 2);
    timeline.push({
      l, r, mid, daysNeeded: 0, returned: null, phase: 'calc_mid',
      activeLines: [5], activeStep: 3,
      desc: `Try a ship capacity of mid = (${l} + ${r}) / 2 = ${mid}.`,
      logic: `Capacity = <strong style="color:var(--accent)">${mid}</strong>`, logicClass: 'info'
    });

    let daysNeeded = 1;
    let currentWeight = 0;
    
    timeline.push({
      l, r, mid, daysNeeded, returned: null, phase: 'calc_days_start',
      activeLines: [6, 7], activeStep: 4,
      desc: `Simulate loading the ship with capacity ${mid}. Start on Day 1.`,
      logic: `Simulating load...`, logicClass: 'info'
    });

    for (let i = 0; i < WEIGHTS.length; i++) {
      const w = WEIGHTS[i];
      if (currentWeight + w > mid) {
        daysNeeded++;
        currentWeight = 0;
        timeline.push({
          l, r, mid, daysNeeded, currentWeight, activeItem: i, returned: null, phase: 'calc_days_new',
          activeLines: [9, 10, 11], activeStep: 4,
          desc: `Package ${i} (weight ${w}) doesn't fit! Send the ship. Increment to Day ${daysNeeded}.`,
          logic: `Too heavy! New Day: ${daysNeeded}`, logicClass: 'warning'
        });
      }
      currentWeight += w;
      timeline.push({
        l, r, mid, daysNeeded, currentWeight, activeItem: i, returned: null, phase: 'calc_days_step',
        activeLines: [13], activeStep: 4,
        desc: `Load Package ${i} (weight ${w}). Ship load is now ${currentWeight} / ${mid}.`,
        logic: `Load: <strong style="color:var(--sky)">${currentWeight}</strong> / ${mid}`, logicClass: 'info'
      });
    }

    timeline.push({
      l, r, mid, daysNeeded, returned: null, phase: 'compare_days',
      activeLines: [16], activeStep: 5,
      desc: `It takes ${daysNeeded} days to ship everything with capacity ${mid}. We have ${DAYS} days available. Can we finish in time?`,
      logic: `Is <strong style="color:var(--sky)">${daysNeeded}</strong> <= <strong style="color:var(--green)">${DAYS}</strong>?`, logicClass: 'warning'
    });

    if (daysNeeded <= DAYS) {
      r = mid;
      timeline.push({
        l, r, mid, daysNeeded, returned: null, phase: 'days_ok',
        activeLines: [17], activeStep: 6,
        desc: `Yes, ${daysNeeded} <= ${DAYS}. We CAN ship it! But we want the LEAST capacity. Let's try a smaller ship by moving R to mid (${r}).`,
        logic: `<strong style="color:var(--pink)">R = ${r}</strong>`, logicClass: 'success'
      });
    } else {
      l = mid + 1;
      timeline.push({
        l, r, mid, daysNeeded, returned: null, phase: 'days_bad',
        activeLines: [18, 19], activeStep: 7,
        desc: `No, ${daysNeeded} > ${DAYS}. We are too slow. We need a BIGGER ship! Move L to mid + 1 (${l}).`,
        logic: `<strong style="color:var(--sky)">L = ${l}</strong>`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    l, r, mid: -1, daysNeeded: 0, returned: null, phase: 'check_loop',
    activeLines: [4], activeStep: 2,
    desc: `Check if L (${l}) < R (${r}). False! L and R have converged.`,
    logic: `L < R is <strong style="color:var(--pink)">false</strong>.`, logicClass: 'error'
  });

  timeline.push({
    l, r, mid: -1, daysNeeded: 0, returned: l, phase: 'found',
    activeLines: [22], activeStep: 8,
    desc: `The minimum capacity required is ${l}. Return it!`,
    logic: `<strong style="color:var(--green)">Return ${l}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function CapacityToShipPackages({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Capacity to Ship Packages Within D Days" lcNum="1011" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Capacity to Ship Packages Within D Days" lcNum="1011" difficulty="Medium" tag="Binary Search" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<SlidersHorizontal size={20} />} title="Binary Search on Answer"
              lines={["Similar to Koko Eating Bananas, we binary search the ANSWER (the ship's capacity).", "The minimum possible capacity is the heaviest single package (otherwise we could never ship it).", "The maximum possible capacity is the sum of all packages (shipping everything in 1 day)."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Shipping Simulation
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Target Time</div>
                    <strong style={{ color: 'var(--green)', fontSize: '1.5rem' }}>{DAYS} days</strong>
                  </div>
                  
                  <div style={{ fontSize: '1.2rem', color: 'var(--text)', background: 'var(--surface)', padding: '12px 24px', borderRadius: '8px', border: `2px dashed ${current.phase === 'compare_days' ? (current.daysNeeded <= DAYS ? 'var(--green)' : 'var(--pink)') : 'var(--sky)'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>Days Needed @ cap={current.mid !== -1 ? current.mid : '?'}</div>
                    <strong style={{ color: current.phase === 'compare_days' ? (current.daysNeeded <= DAYS ? 'var(--green)' : 'var(--pink)') : 'var(--sky)', fontSize: '1.5rem' }}>{current.daysNeeded} days</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '0 20px', flexWrap: 'wrap' }}>
                  {WEIGHTS.map((w: number, idx: number) => {
                    const isActive = (current.phase === 'calc_days_step' || current.phase === 'calc_days_new') && current.activeItem === idx;
                    const isProcessed = (current.phase === 'calc_days_step' || current.phase === 'calc_days_new') && idx < current.activeItem;
                    const isFullyProcessed = ['compare_days', 'days_ok', 'days_bad'].includes(current.phase);
                    
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
                            width: `${Math.max(40, w * 12)}px`, height: '40px',
                            background: bg, border: `2px solid ${border}`,
                            borderRadius: '4px', position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 'bold' }}>{w}</span>
                          {isActive && <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: -25, opacity: 1 }} style={{ position: 'absolute', top: 0, color: 'var(--accent)' }}><Package size={16} /></motion.div>}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Ship progress bar */}
                {(current.phase.startsWith('calc_days') || ['compare_days', 'days_ok', 'days_bad'].includes(current.phase)) && current.mid !== -1 && (
                  <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>Ship Load (Day {current.daysNeeded})</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>{current.currentWeight || 0} / {current.mid}</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'var(--surface2)', borderRadius: '6px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={false}
                        animate={{ width: `${Math.min(100, ((current.currentWeight || 0) / current.mid) * 100)}%` }}
                        style={{ height: '100%', background: 'var(--sky)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Search Space (Capacity C)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L, R Bounds</div>
                  <div className="st-val">[{current.l}, {current.r}]</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Mid Capacity</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.mid !== -1 ? current.mid : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned Capacity</div>
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
              title="Capacity to Ship Packages"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int shipWithinDays(int[] weights, int days) {",
                "    int l = max(weights);",
                "    int r = sum(weights);",
                "    while (l < r) {",
                "        int mid = l + (r - l) / 2;",
                "        int daysNeeded = 1;",
                "        int currentWeight = 0;",
                "        for (int w : weights) {",
                "            if (currentWeight + w > mid) {",
                "                daysNeeded++;",
                "                currentWeight = 0;",
                "            }",
                "            currentWeight += w;",
                "        }",
                "        ",
                "        if (daysNeeded <= days) {",
                "            r = mid;",
                "        } else {",
                "            l = mid + 1;",
                "        }",
                "    }",
                "    return l;",
                "}"
              ]}
              pythonCode={[
                "def shipWithinDays(self, weights: list[int], days: int) -> int:",
                "    l = max(weights)",
                "    r = sum(weights)",
                "    while l < r:",
                "        mid = (l + r) // 2",
                "        days_needed = 1",
                "        current_weight = 0",
                "        for w in weights:",
                "            if current_weight + w > mid:",
                "                days_needed += 1",
                "                current_weight = 0",
                "                ",
                "            current_weight += w",
                "            ",
                "        if days_needed <= days:",
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
                { num: 1, txt: "Initialize L to max(weights) and R to sum(weights)." },
                { num: 2, txt: "Loop while L < R." },
                { num: 3, txt: "Calculate a mid capacity." },
                { num: 4, txt: "Simulate loading the ship. Iterate through packages, if adding a package exceeds mid, send the ship (days++) and start a new load." },
                { num: 5, txt: "Check if the total days needed <= target days." },
                { num: 6, txt: "If YES, we can finish in time! But we want the LEAST capacity, so try a smaller ship: R = mid." },
                { num: 7, txt: "If NO, we are too slow. We MUST use a bigger ship: L = mid + 1." },
                { num: 8, txt: "When L meets R, we've found the minimum capacity required. Return L." }
              ]} 
            />
            <Complexity time="O(N * log(sum - max))" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Just like Koko Eating Bananas, we have a strictly monotonic relationship: a larger ship capacity takes less (or equal) days. A smaller ship capacity takes more (or equal) days.</>,
              <>By binary searching the capacity, we can quickly hone in on the exact minimum capacity that perfectly satisfies the <code>days</code> constraint without testing every single possible capacity sequentially.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
