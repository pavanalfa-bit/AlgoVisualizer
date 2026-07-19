import React, { useState } from 'react';
import { Layers, CheckCircle2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (<code>push</code>, <code>top</code>, <code>pop</code>, and <code>empty</code>).</p>
    <p>Implement the <code>MyStack</code> class:</p>
    <ul>
      <li><code>void push(int x)</code> Pushes element x to the top of the stack.</li>
      <li><code>int pop()</code> Removes the element on the top of the stack and returns it.</li>
      <li><code>int top()</code> Returns the element on the top of the stack.</li>
      <li><code>boolean empty()</code> Returns <code>true</code> if the stack is empty, <code>false</code> otherwise.</li>
    </ul>
    <p><em>Follow-up: Can you implement the stack using only <strong>one</strong> queue?</em></p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: '["MyStack", "push", "push", "top", "pop", "empty"]\n[[], [1], [2], [], [], []]', 
    output: '[null, null, null, 2, 2, false]',
    explanation: <>
      MyStack myStack = new MyStack();<br/>
      myStack.push(1);<br/>
      myStack.push(2);<br/>
      myStack.top(); // return 2<br/>
      myStack.pop(); // return 2<br/>
      myStack.empty(); // return False
    </>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= x &lt;= 9</code></div>
    <div>At most <code>100</code> calls will be made to <code>push</code>, <code>pop</code>, <code>top</code>, and <code>empty</code>.</div>
    <div>All the calls to <code>pop</code> and <code>top</code> are valid.</div>
  </>
);

const DEFAULT_JAVA = `class MyStack {\n\n    public MyStack() {\n        \n    }\n    \n    public void push(int x) {\n        \n    }\n    \n    public int pop() {\n        return 0;\n    }\n    \n    public int top() {\n        return 0;\n    }\n    \n    public boolean empty() {\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class MyStack:\n\n    def __init__(self):\n        pass\n\n    def push(self, x: int) -> None:\n        pass\n\n    def pop(self) -> int:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def empty(self) -> bool:\n        pass`;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  // We use objects to track uniqueness for Framer Motion keys across re-orders
  let q: {id: string, val: number}[] = []; 
  let idCounter = 0;
  
  timeline.push({
    q: [...q], activeLines: [3, 4], activeStep: 1, phase: 'init', returned: null, callIdx: -1,
    desc: "Initialize a single Queue. We'll use the one-queue follow-up approach because it's much more elegant!",
    logic: `<strong>Init:</strong> queue = []`, logicClass: 'info'
  });

  // Call 1: push(1)
  let callIdx = 0;
  timeline.push({
    q: [...q], activeLines: [6], activeStep: 2, phase: 'call', returned: null, callIdx,
    desc: `Call push(1).`,
    logic: `<strong>push(1)</strong>`, logicClass: 'info'
  });
  const obj1 = { id: `id-${idCounter++}`, val: 1 };
  q.push(obj1);
  timeline.push({
    q: [...q], activeLines: [7], activeStep: 3, phase: 'enqueue', returned: null, callIdx,
    desc: `Enqueue 1 to the back of the queue.`,
    logic: `queue.add(<strong style="color:var(--sky)">1</strong>)`, logicClass: 'info'
  });
  timeline.push({
    q: [...q], activeLines: [8, 9, 10], activeStep: 4, phase: 'rotate_check', returned: null, callIdx,
    desc: `Rotate the queue. Loop size - 1 times (1 - 1 = 0 times). So we do nothing!`,
    logic: `Rotate <strong style="color:var(--sky)">0</strong> times.`, logicClass: 'success'
  });

  // Call 2: push(2)
  callIdx = 1;
  timeline.push({
    q: [...q], activeLines: [6], activeStep: 2, phase: 'call', returned: null, callIdx,
    desc: `Call push(2).`,
    logic: `<strong>push(2)</strong>`, logicClass: 'info'
  });
  const obj2 = { id: `id-${idCounter++}`, val: 2 };
  q.push(obj2);
  timeline.push({
    q: [...q], activeLines: [7], activeStep: 3, phase: 'enqueue', returned: null, callIdx,
    desc: `Enqueue 2 to the back of the queue.`,
    logic: `queue.add(<strong style="color:var(--sky)">2</strong>)`, logicClass: 'info'
  });
  timeline.push({
    q: [...q], activeLines: [8], activeStep: 4, phase: 'rotate_check', returned: null, callIdx,
    desc: `Rotate the queue to make 2 the front. Loop size - 1 times (2 - 1 = 1 time).`,
    logic: `Rotate <strong style="color:var(--sky)">1</strong> time.`, logicClass: 'warning'
  });
  
  // Rotate 1 time
  const rot1 = q.shift()!;
  q.push(rot1);
  timeline.push({
    q: [...q], activeLines: [9], activeStep: 5, phase: 'rotate', returned: null, callIdx,
    desc: `Dequeue ${rot1.val} from the front and enqueue it to the back.`,
    logic: `queue.add(queue.poll()) -> <strong style="color:var(--sky)">${rot1.val}</strong>`, logicClass: 'info'
  });

  // Call 3: top()
  callIdx = 2;
  timeline.push({
    q: [...q], activeLines: [17], activeStep: 8, phase: 'call', returned: null, callIdx,
    desc: `Call top(). Return the front of the queue.`,
    logic: `<strong>top()</strong>`, logicClass: 'info'
  });
  timeline.push({
    q: [...q], activeLines: [18], activeStep: 9, phase: 'return', returned: q[0].val, callIdx,
    desc: `The front is ${q[0].val}. Since we rotated on push, the front is exactly the top of the stack!`,
    logic: `<strong style="color:var(--green)">Return ${q[0].val}</strong>`, logicClass: 'success'
  });

  // Call 4: pop()
  callIdx = 3;
  timeline.push({
    q: [...q], activeLines: [13], activeStep: 6, phase: 'call', returned: null, callIdx,
    desc: `Call pop(). Remove and return the front of the queue.`,
    logic: `<strong>pop()</strong>`, logicClass: 'info'
  });
  const popVal = q.shift()!;
  timeline.push({
    q: [...q], activeLines: [14], activeStep: 7, phase: 'return', returned: popVal.val, callIdx,
    desc: `Dequeued ${popVal.val}. This correctly simulates popping the top of the stack.`,
    logic: `<strong style="color:var(--green)">Return ${popVal.val}</strong>`, logicClass: 'success'
  });

  // Call 5: empty()
  callIdx = 4;
  timeline.push({
    q: [...q], activeLines: [21], activeStep: 10, phase: 'call', returned: null, callIdx,
    desc: `Call empty(). Check if the queue is empty.`,
    logic: `<strong>empty()</strong>`, logicClass: 'info'
  });
  const isEmpty = q.length === 0;
  timeline.push({
    q: [...q], activeLines: [22], activeStep: 11, phase: 'return', returned: isEmpty ? 'true' : 'false', callIdx,
    desc: `Queue size is ${q.length}, so it is ${isEmpty ? 'empty' : 'not empty'}.`,
    logic: `<strong style="color:var(--green)">Return ${isEmpty ? 'true' : 'false'}</strong>`, logicClass: 'success'
  });

  timeline.push({
    q: [...q], activeLines: [], activeStep: 12, phase: 'done', returned: null, callIdx: 5,
    desc: `All operations complete! We successfully built a Stack using just 1 Queue.`,
    logic: `<strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();
const CALLS = ["push(1)", "push(2)", "top()", "pop()", "empty()"];

export default function ImplementStackUsingQueues({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Implement Stack using Queues" lcNum="225" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Implement Stack using Queues" lcNum="225" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<RotateCw size={20} />} title="The 1-Queue 'Rotate' Trick"
              lines={["While you can use 2 queues, it's actually possible with just 1!", "Whenever we push a new element to the back, we want it to be at the front so it's popped first (LIFO).", "So, we just dequeue all the OTHER elements and enqueue them to the back, effectively rotating the new element to the front!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Queue State
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px' }}>
                  
                  {/* Sequence of Calls */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {CALLS.map((c, i) => (
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
                        {c}
                      </div>
                    ))}
                  </div>

                  {/* Queue Visual */}
                  <div style={{ position: 'relative', padding: '16px', border: '2px dashed var(--border-strong)', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--surface)', padding: '0 8px', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>
                      FRONT (Stack Top)
                    </div>
                    <div style={{ position: 'absolute', top: '-10px', right: '16px', background: 'var(--surface)', padding: '0 8px', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'bold' }}>
                      BACK
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%', overflowX: 'auto' }}>
                      <AnimatePresence mode="popLayout">
                        {current.q.map((obj: {id: string, val: number}, idx: number) => {
                          const isNew = idx === current.q.length - 1 && current.phase === 'enqueue';
                          
                          let bg = 'var(--surface2)';
                          let border = 'var(--border-strong)';
                          if (isNew) {
                            bg = 'rgba(78, 205, 196, 0.2)';
                            border = 'var(--sky)';
                          }
                          
                          return (
                            <motion.div
                              layout
                              key={obj.id}
                              initial={{ scale: 0, opacity: 0, x: 20 }}
                              animate={{ scale: 1, opacity: 1, x: 0 }}
                              exit={{ scale: 0, opacity: 0, x: -20, transition: { duration: 0.2 } }}
                              style={{
                                width: '40px', height: '40px', borderRadius: '4px', background: bg, border: `1px solid ${border}`,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'var(--text)'
                              }}
                            >
                              {obj.val}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {current.q.length === 0 && (
                        <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>Queue is empty</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Returned Value</div>
              <div className="st-val" style={{ color: 'var(--green)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {current.returned !== null ? String(current.returned) : '-'}
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Queue Operations"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="MyStack"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "class MyStack {",
                "    Queue<Integer> q;",
                "    public MyStack() {",
                "        q = new LinkedList<>();",
                "    }",
                "    public void push(int x) {",
                "        q.add(x);",
                "        for (int i = 0; i < q.size() - 1; i++) {",
                "            q.add(q.poll());",
                "        }",
                "    }",
                "    ",
                "    public int pop() {",
                "        return q.poll();",
                "    }",
                "    ",
                "    public int top() {",
                "        return q.peek();",
                "    }",
                "    ",
                "    public boolean empty() {",
                "        return q.isEmpty();",
                "    }",
                "}"
              ]}
              pythonCode={[
                "from collections import deque",
                "class MyStack:",
                "    def __init__(self):",
                "        self.q = deque()",
                "        ",
                "    def push(self, x: int) -> None:",
                "        self.q.append(x)",
                "        for _ in range(len(self.q) - 1):",
                "            self.q.append(self.q.popleft())",
                "            ",
                "            ",
                "    def pop(self) -> int:",
                "        return self.q.popleft()",
                "        ",
                "    def top(self) -> int:",
                "        return self.q[0]",
                "        ",
                "    def empty(self) -> bool:",
                "        return len(self.q) == 0",
                "        "
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize a single Queue in the constructor." },
                { num: 2, txt: "On push(x), we want x to become the top of the stack (front of queue)." },
                { num: 3, txt: "First, enqueue x to the back normally." },
                { num: 4, txt: "Then, find how many elements were already in the queue (size - 1)." },
                { num: 5, txt: "Dequeue each old element and immediately enqueue it to the back. This 'rotates' the new element to the front!" },
                { num: 6, txt: "On pop(), just dequeue normally. It's guaranteed to be the LIFO element!" },
                { num: 7, txt: "Return the popped element." },
                { num: 8, txt: "On top(), peek the front of the queue." },
                { num: 9, txt: "Return the peeked element." },
                { num: 10, txt: "On empty(), just check if the queue's size is 0." },
                { num: 11, txt: "Return the boolean result." },
                { num: 12, txt: "Done processing." }
              ]} 
            />
            <Complexity time="O(N) push, O(1) pop" space="O(N)" />
            <WhyItWorks paragraphs={[
              <>Since a queue is FIFO (First-In-First-Out) and a stack is LIFO (Last-In-First-Out), we need the most recently added item to sit at the <em>front</em> of the queue.</>,
              <>When we add a new item, it lands at the back. By immediately taking all the older items from the front and moving them to the back, we shift the new item directly to the front! Thus, <code>pop()</code> and <code>top()</code> become <code>O(1)</code> operations.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
