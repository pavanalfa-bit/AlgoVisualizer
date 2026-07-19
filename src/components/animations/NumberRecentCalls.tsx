import React, { useState } from 'react';
import { Clock, CheckCircle2, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You have a <code>RecentCounter</code> class which counts the number of recent requests within a certain time frame.</p>
    <p>Implement the <code>RecentCounter</code> class:</p>
    <ul>
      <li><code>RecentCounter()</code> Initializes the counter with zero recent requests.</li>
      <li><code>int ping(int t)</code> Adds a new request at time <code>t</code>, where <code>t</code> represents some time in milliseconds, and returns the number of requests that has happened in the past <code>3000</code> milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range <code>[t - 3000, t]</code>.</li>
    </ul>
    <p>It is guaranteed that every call to <code>ping</code> uses a strictly larger value of <code>t</code> than the previous call.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: '["RecentCounter", "ping", "ping", "ping", "ping"]\n[[], [1], [100], [3001], [3002]]', 
    output: '[null, 1, 2, 3, 3]',
    explanation: <>
      RecentCounter recentCounter = new RecentCounter();<br/>
      recentCounter.ping(1);     // requests = [1], range is [-2999,1], return 1<br/>
      recentCounter.ping(100);   // requests = [1, 100], range is [-2900,100], return 2<br/>
      recentCounter.ping(3001);  // requests = [1, 100, 3001], range is [1,3001], return 3<br/>
      recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002], range is [2,3002], return 3
    </>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= t &lt;= 10⁹</code></div>
    <div>Each test case will call <code>ping</code> with strictly increasing values of <code>t</code>.</div>
    <div>At most <code>10⁴</code> calls will be made to <code>ping</code>.</div>
  </>
);

const DEFAULT_JAVA = `class RecentCounter {\n\n    public RecentCounter() {\n        \n    }\n    \n    public int ping(int t) {\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class RecentCounter:\n\n    def __init__(self):\n        pass\n\n    def ping(self, t: int) -> int:\n        pass`;

const PING_CALLS = [1, 100, 3001, 3002];

const generateTimeline = () => {
  const timeline: any[] = [];
  let queue: number[] = [];
  
  timeline.push({
    queue: [...queue], t: null, returned: null, callIdx: -1, phase: 'init',
    activeLines: [2, 3, 4], activeStep: 1,
    desc: "Initialize a Queue to store the timestamps of recent requests.",
    logic: `<strong>Init:</strong> queue = []`, logicClass: 'info'
  });

  for (let i = 0; i < PING_CALLS.length; i++) {
    const t = PING_CALLS[i];
    
    timeline.push({
      queue: [...queue], t, returned: null, callIdx: i, phase: 'ping',
      activeLines: [6], activeStep: 2,
      desc: `Call ping(${t}).`,
      logic: `<strong>ping(${t})</strong> called.`, logicClass: 'info'
    });

    queue.push(t);
    
    timeline.push({
      queue: [...queue], t, returned: null, callIdx: i, phase: 'enqueue',
      activeLines: [7], activeStep: 3,
      desc: `Enqueue the new timestamp ${t} to the back of the queue.`,
      logic: `queue.add(<strong style="color:var(--sky)">${t}</strong>)`, logicClass: 'success'
    });

    while (queue.length > 0 && queue[0] < t - 3000) {
      const removed = queue[0];
      timeline.push({
        queue: [...queue], t, returned: null, callIdx: i, phase: 'check_front',
        activeLines: [8], activeStep: 4,
        desc: `Check the front of the queue: ${removed}. Is it older than ${t} - 3000 = ${t - 3000}? Yes!`,
        logic: `<strong style="color:var(--pink)">${removed}</strong> < ${t - 3000}. Must remove!`, logicClass: 'warning'
      });
      
      queue.shift(); // dequeue
      
      timeline.push({
        queue: [...queue], t, returned: null, callIdx: i, phase: 'dequeue',
        activeLines: [9], activeStep: 5,
        desc: `Dequeue ${removed} from the front of the queue.`,
        logic: `queue.poll() -> <strong style="color:var(--pink)">${removed}</strong>`, logicClass: 'info'
      });
    }

    if (queue.length > 0) {
      timeline.push({
        queue: [...queue], t, returned: null, callIdx: i, phase: 'check_front',
        activeLines: [8], activeStep: 4,
        desc: `Check the front of the queue: ${queue[0]}. Is it older than ${t} - 3000 = ${t - 3000}? No. The queue is now clean.`,
        logic: `<strong style="color:var(--sky)">${queue[0]}</strong> >= ${t - 3000}. Queue is clean.`, logicClass: 'success'
      });
    }

    const returned = queue.length;
    timeline.push({
      queue: [...queue], t, returned, callIdx: i, phase: 'return',
      activeLines: [11], activeStep: 6,
      desc: `Return the current size of the queue: ${returned}.`,
      logic: `<strong style="color:var(--green)">Return ${returned}</strong>`, logicClass: 'success'
    });
  }

  timeline.push({
    queue: [...queue], t: null, returned: null, callIdx: PING_CALLS.length, phase: 'done',
    activeLines: [], activeStep: 7,
    desc: `All ping calls have been processed.`,
    logic: `<strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function NumberRecentCalls({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Number of Recent Calls" lcNum="933" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Number of Recent Calls" lcNum="933" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Server size={20} />} title="Queue as a Sliding Window"
              lines={["A queue is perfect for this! We enqueue new timestamps at the back.", "Before returning the size, we just peek at the front.", "If the front timestamp is older than (t - 3000), we dequeue it. We repeat this until the front is within the 3000ms window."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Queue State
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px' }}>
                  
                  {/* Sequence of Calls */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {PING_CALLS.map((t, i) => (
                      <div 
                        key={`call-${i}`} 
                        style={{ 
                          padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem',
                          background: current.callIdx === i ? 'var(--sky)' : current.callIdx > i ? 'var(--surface2)' : 'var(--surface)',
                          color: current.callIdx === i ? '#000' : current.callIdx > i ? 'var(--text)' : 'var(--muted)',
                          border: `1px solid ${current.callIdx === i ? 'var(--sky)' : 'var(--border)'}`,
                          fontWeight: current.callIdx === i ? 'bold' : 'normal'
                        }}
                      >
                        ping({t})
                      </div>
                    ))}
                  </div>

                  {/* Queue Visual */}
                  <div style={{ position: 'relative', padding: '16px', border: '2px dashed var(--border-strong)', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--surface)', padding: '0 8px', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>
                      FRONT (Dequeue)
                    </div>
                    <div style={{ position: 'absolute', top: '-10px', right: '16px', background: 'var(--surface)', padding: '0 8px', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>
                      BACK (Enqueue)
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%', overflowX: 'auto' }}>
                      <AnimatePresence mode="popLayout">
                        {current.queue.map((qVal: number, idx: number) => {
                          const isFront = idx === 0;
                          const isNew = idx === current.queue.length - 1 && current.phase === 'enqueue';
                          const isBeingChecked = isFront && current.phase === 'check_front';
                          
                          let bg = 'var(--surface2)';
                          let border = 'var(--border-strong)';
                          if (isNew) {
                            bg = 'rgba(78, 205, 196, 0.2)';
                            border = 'var(--sky)';
                          } else if (isBeingChecked) {
                            bg = 'rgba(255, 193, 7, 0.2)';
                            border = 'var(--warning)';
                          }
                          
                          return (
                            <motion.div
                              layout
                              key={`q-${qVal}`}
                              initial={{ scale: 0, opacity: 0, x: 20 }}
                              animate={{ scale: 1, opacity: 1, x: 0 }}
                              exit={{ scale: 0, opacity: 0, x: -20, transition: { duration: 0.2 } }}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', background: bg, border: `1px solid ${border}`,
                                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
                              }}
                            >
                              <Clock size={16} style={{ color: 'var(--muted)' }} />
                              {qVal}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {current.queue.length === 0 && (
                        <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>Queue is empty</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Current <code>t</code></div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.t !== null ? current.t : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Threshold (<code>t - 3000</code>)</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.t !== null ? current.t - 3000 : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned Size</div>
                  <div className="st-val" style={{ color: 'var(--easy)' }}>{current.returned !== null ? current.returned : '-'}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Queue Operations"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="RecentCounter"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "class RecentCounter {",
                "    Queue<Integer> q;",
                "    public RecentCounter() {",
                "        q = new LinkedList<>();",
                "    }",
                "    public int ping(int t) {",
                "        q.add(t);",
                "        while (!q.isEmpty() && q.peek() < t - 3000) {",
                "            q.poll();",
                "        }",
                "        return q.size();",
                "    }",
                "}"
              ]}
              pythonCode={[
                "from collections import deque",
                "class RecentCounter:",
                "    def __init__(self):",
                "        self.q = deque()",
                "        ",
                "    def ping(self, t: int) -> int:",
                "        self.q.append(t)",
                "        while self.q and self.q[0] < t - 3000:",
                "            self.q.popleft()",
                "            ",
                "        return len(self.q)",
                "        ",
                "        "
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize a Queue (or Deque in Python) in the constructor." },
                { num: 2, txt: "When ping(t) is called, we process the new timestamp." },
                { num: 3, txt: "Enqueue the new timestamp 't' to the back of the queue." },
                { num: 4, txt: "Check the front of the queue using peek(). If it's strictly less than t - 3000, it's expired!" },
                { num: 5, txt: "Dequeue the expired timestamp using poll() or popleft(). Repeat step 4." },
                { num: 6, txt: "Once the front is valid (>= t - 3000), return the total size of the queue." },
                { num: 7, txt: "Done processing." }
              ]} 
            />
            <Complexity time="O(1) amortized" space="O(W)" />
            <WhyItWorks paragraphs={[
              <>Since time <code>t</code> is strictly increasing, the timestamps in our queue are always sorted! This means the oldest requests are <em>always</em> at the front of the queue.</>,
              <>By enqueueing at the back and dequeueing expired times from the front, the queue acts as a perfectly sliding 3000ms window. Each element is added once and removed at most once, making it <code>O(1)</code> amortized time per <code>ping</code>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
