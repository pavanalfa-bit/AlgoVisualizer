import React, { useState } from 'react';
import { Circle, CheckCircle2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".</p>
    <p>Implement the <code>MyCircularQueue</code> class:</p>
    <ul>
      <li><code>MyCircularQueue(k)</code> Initializes the object with the size of the queue to be <code>k</code>.</li>
      <li><code>int Front()</code> Gets the front item from the queue. If the queue is empty, return <code>-1</code>.</li>
      <li><code>int Rear()</code> Gets the last item from the queue. If the queue is empty, return <code>-1</code>.</li>
      <li><code>boolean enQueue(int value)</code> Inserts an element into the circular queue. Return <code>true</code> if the operation is successful.</li>
      <li><code>boolean deQueue()</code> Deletes an element from the circular queue. Return <code>true</code> if the operation is successful.</li>
      <li><code>boolean isEmpty()</code> Checks whether the circular queue is empty or not.</li>
      <li><code>boolean isFull()</code> Checks whether the circular queue is full or not.</li>
    </ul>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: '["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]\n[[3], [1], [2], [3], [4], [], [], [], [4], []]', 
    output: '[null, true, true, true, false, 3, true, true, true, 4]',
    explanation: <>
      MyCircularQueue myCircularQueue = new MyCircularQueue(3);<br/>
      myCircularQueue.enQueue(1); // return True<br/>
      myCircularQueue.enQueue(2); // return True<br/>
      myCircularQueue.enQueue(3); // return True<br/>
      myCircularQueue.enQueue(4); // return False<br/>
      myCircularQueue.Rear();     // return 3<br/>
      myCircularQueue.isFull();   // return True<br/>
      myCircularQueue.deQueue();  // return True<br/>
      myCircularQueue.enQueue(4); // return True<br/>
      myCircularQueue.Rear();     // return 4
    </>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= k &lt;= 1000</code></div>
    <div><code>0 &lt;= value &lt;= 1000</code></div>
    <div>At most <code>3000</code> calls will be made to all functions.</div>
  </>
);

const DEFAULT_JAVA = `class MyCircularQueue {\n\n    public MyCircularQueue(int k) {\n        \n    }\n    \n    public boolean enQueue(int value) {\n        return false;\n    }\n    \n    public boolean deQueue() {\n        return false;\n    }\n    \n    public int Front() {\n        return -1;\n    }\n    \n    public int Rear() {\n        return -1;\n    }\n    \n    public boolean isEmpty() {\n        return false;\n    }\n    \n    public boolean isFull() {\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class MyCircularQueue:\n\n    def __init__(self, k: int):\n        pass\n\n    def enQueue(self, value: int) -> bool:\n        pass\n\n    def deQueue(self) -> bool:\n        pass\n\n    def Front(self) -> int:\n        pass\n\n    def Rear(self) -> int:\n        pass\n\n    def isEmpty(self) -> bool:\n        pass\n\n    def isFull(self) -> bool:\n        pass`;

const CALLS = [
  { name: 'enQueue(1)', type: 'enqueue', val: 1 },
  { name: 'enQueue(2)', type: 'enqueue', val: 2 },
  { name: 'enQueue(3)', type: 'enqueue', val: 3 },
  { name: 'enQueue(4)', type: 'enqueue', val: 4 },
  { name: 'Rear()', type: 'rear', val: null },
  { name: 'isFull()', type: 'isfull', val: null },
  { name: 'deQueue()', type: 'dequeue', val: null },
  { name: 'enQueue(4)', type: 'enqueue', val: 4 },
  { name: 'Rear()', type: 'rear', val: null }
];

const K = 3;

const generateTimeline = () => {
  const timeline: any[] = [];
  
  let q = Array(K).fill(null);
  let head = 0;
  let count = 0;
  
  timeline.push({
    q: [...q], head, count, capacity: K, activeLines: [4, 5], activeStep: 1, phase: 'init', returned: null, callIdx: -1,
    desc: `Initialize a fixed array of size K = ${K}. Also initialize head = 0 and count = 0.`,
    logic: `<strong>Init:</strong> array[${K}], head = 0, count = 0`, logicClass: 'info'
  });

  for (let i = 0; i < CALLS.length; i++) {
    const call = CALLS[i];
    
    // Call step
    let activeLines: number[] = [];
    let logic = ``;
    let activeStep = 1;
    let desc = ``;
    
    if (call.type === 'enqueue') {
      activeLines = [8]; activeStep = 2; logic = `<strong>${call.name}</strong>`; desc = `Call enQueue(${call.val}). Check if full.`;
    } else if (call.type === 'dequeue') {
      activeLines = [15]; activeStep = 6; logic = `<strong>deQueue()</strong>`; desc = `Call deQueue(). Check if empty.`;
    } else if (call.type === 'rear') {
      activeLines = [27]; activeStep = 9; logic = `<strong>Rear()</strong>`; desc = `Call Rear(). Check if empty.`;
    } else if (call.type === 'isfull') {
      activeLines = [37]; activeStep = 13; logic = `<strong>isFull()</strong>`; desc = `Call isFull(). Return count == capacity.`;
    }
    
    timeline.push({
      q: [...q], head, count, capacity: K, activeLines, activeStep, phase: 'call', returned: null, callIdx: i,
      desc, logic, logicClass: 'info'
    });

    // Execute logic
    if (call.type === 'enqueue') {
      if (count === K) {
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [9], activeStep: 3, phase: 'fail', returned: 'false', callIdx: i,
          desc: `The queue is full (count == ${K}). Cannot enqueue. Return false.`,
          logic: `<strong style="color:var(--pink)">Full!</strong> Return false`, logicClass: 'error'
        });
      } else {
        const tailIdx = (head + count) % K;
        q[tailIdx] = call.val;
        count++;
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [10, 11, 12], activeStep: 4, phase: 'success', returned: 'true', callIdx: i,
          desc: `Calculate insert index: (head + count) % K = (${head} + ${count - 1}) % ${K} = ${tailIdx}. Insert ${call.val} and increment count.`,
          logic: `q[<strong style="color:var(--sky)">${tailIdx}</strong>] = ${call.val}. Return true`, logicClass: 'success'
        });
      }
    } else if (call.type === 'dequeue') {
      if (count === 0) {
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [16], activeStep: 7, phase: 'fail', returned: 'false', callIdx: i,
          desc: `The queue is empty (count == 0). Cannot dequeue. Return false.`,
          logic: `<strong style="color:var(--pink)">Empty!</strong> Return false`, logicClass: 'error'
        });
      } else {
        q[head] = null; // for visual purposes, erase it
        head = (head + 1) % K;
        count--;
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [17, 18, 19], activeStep: 8, phase: 'success', returned: 'true', callIdx: i,
          desc: `Advance head pointer: (head + 1) % K = (${head === 0 ? K - 1 : head - 1} + 1) % ${K} = ${head}. Decrement count.`,
          logic: `head = <strong style="color:var(--sky)">${head}</strong>. Return true`, logicClass: 'success'
        });
      }
    } else if (call.type === 'rear') {
      if (count === 0) {
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [28], activeStep: 10, phase: 'fail', returned: '-1', callIdx: i,
          desc: `The queue is empty. Return -1.`,
          logic: `<strong style="color:var(--pink)">Empty!</strong> Return -1`, logicClass: 'error'
        });
      } else {
        const tailIdx = (head + count - 1) % K;
        timeline.push({
          q: [...q], head, count, capacity: K, activeLines: [29], activeStep: 11, phase: 'success', returned: String(q[tailIdx]), callIdx: i,
          desc: `Calculate tail index: (head + count - 1) % K = ${tailIdx}. Return q[tailIdx].`,
          logic: `tailIdx = ${tailIdx}. Return <strong style="color:var(--green)">${q[tailIdx]}</strong>`, logicClass: 'success'
        });
      }
    } else if (call.type === 'isfull') {
      const isFull = count === K;
      timeline.push({
        q: [...q], head, count, capacity: K, activeLines: [38], activeStep: 14, phase: 'success', returned: String(isFull), callIdx: i,
        desc: `Check if count (${count}) equals capacity (${K}).`,
        logic: `count == K -> <strong style="color:var(--green)">${isFull}</strong>`, logicClass: 'success'
      });
    }
  }

  timeline.push({
    q: [...q], head, count, capacity: K, activeLines: [], activeStep: 15, phase: 'done', returned: null, callIdx: CALLS.length,
    desc: `All operations complete! We successfully implemented a Circular Queue.`,
    logic: `<strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function DesignCircularQueue({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Design Circular Queue" lcNum="622" difficulty="Medium" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Design Circular Queue" lcNum="622" difficulty="Medium" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Circle size={20} />} title="Array with Modulo Arithmetic"
              lines={["Use a fixed-size array and keep track of a 'head' pointer and a 'count'.", "The 'tail' (where to insert) is always: (head + count) % capacity.", "The modulo operator (%) ensures that when our pointers reach the end of the array, they wrap around back to index 0!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Circular Array State
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px' }}>
                  
                  {/* Sequence of Calls */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {CALLS.map((c, i) => (
                      <div 
                        key={`call-${i}`} 
                        style={{ 
                          padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap',
                          background: current.callIdx === i ? 'var(--sky)' : current.callIdx > i ? 'var(--surface2)' : 'var(--surface)',
                          color: current.callIdx === i ? '#000' : current.callIdx > i ? 'var(--text)' : 'var(--muted)',
                          border: `1px solid ${current.callIdx === i ? 'var(--sky)' : 'var(--border)'}`,
                          fontWeight: current.callIdx === i ? 'bold' : 'normal'
                        }}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>

                  {/* Array Visual */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {current.q.map((val: number | null, idx: number) => {
                      const isHead = current.count > 0 && current.head === idx;
                      const tailIdx = (current.head + current.count - 1) % K;
                      const isTail = current.count > 0 && tailIdx === idx;
                      
                      const isEmpty = val === null;
                      
                      let bg = isEmpty ? 'var(--surface2)' : 'var(--surface)';
                      let border = isEmpty ? 'var(--border-strong)' : 'var(--border)';
                      
                      if (isHead) {
                        border = 'var(--sky)';
                      }
                      if (isTail) {
                        border = 'var(--pink)';
                      }
                      if (isHead && isTail) {
                        border = 'var(--accent)';
                      }
                      
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ height: '20px', fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 'bold' }}>
                            Index {idx}
                          </div>
                          <motion.div
                            layout
                            style={{
                              width: '50px', height: '50px', borderRadius: '8px', background: bg, border: `2px solid ${border}`,
                              display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: isEmpty ? 'transparent' : 'var(--text)', fontSize: '1.2rem'
                            }}
                          >
                            {isEmpty ? '-' : val}
                          </motion.div>
                          <div style={{ height: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {isHead && <div style={{ color: 'var(--sky)' }}>&uarr; HEAD</div>}
                            {isTail && <div style={{ color: 'var(--pink)' }}>&uarr; TAIL</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Head Index</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.head}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Count</div>
                  <div className="st-val">{current.count} / {K}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Returned</div>
                  <div className="st-val" style={{ color: current.returned === 'false' || current.returned === '-1' ? 'var(--pink)' : current.returned ? 'var(--green)' : 'var(--muted)' }}>
                    {current.returned !== null ? current.returned : '-'}
                  </div>
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
              title="MyCircularQueue"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "class MyCircularQueue {",
                "    int[] q;",
                "    int head = 0, count = 0, capacity;",
                "    public MyCircularQueue(int k) {",
                "        q = new int[k];",
                "        capacity = k;",
                "    }",
                "    ",
                "    public boolean enQueue(int value) {",
                "        if (isFull()) return false;",
                "        q[(head + count) % capacity] = value;",
                "        count++;",
                "        return true;",
                "    }",
                "    ",
                "    public boolean deQueue() {",
                "        if (isEmpty()) return false;",
                "        head = (head + 1) % capacity;",
                "        count--;",
                "        return true;",
                "    }",
                "    ",
                "    public int Front() {",
                "        if (isEmpty()) return -1;",
                "        return q[head];",
                "    }",
                "    ",
                "    public int Rear() {",
                "        if (isEmpty()) return -1;",
                "        return q[(head + count - 1) % capacity];",
                "    }",
                "    ",
                "    public boolean isEmpty() {",
                "        return count == 0;",
                "    }",
                "    ",
                "    public boolean isFull() {",
                "        return count == capacity;",
                "    }",
                "}"
              ]}
              pythonCode={[
                "class MyCircularQueue:",
                "    def __init__(self, k: int):",
                "        self.q = [0] * k",
                "        self.head = 0",
                "        self.count = 0",
                "        self.capacity = k",
                "        ",
                "    def enQueue(self, value: int) -> bool:",
                "        if self.isFull(): return False",
                "        self.q[(self.head + self.count) % self.capacity] = value",
                "        self.count += 1",
                "        return True",
                "        ",
                "    def deQueue(self) -> bool:",
                "        if self.isEmpty(): return False",
                "        self.head = (self.head + 1) % self.capacity",
                "        self.count -= 1",
                "        return True",
                "        ",
                "    def Front(self) -> int:",
                "        if self.isEmpty(): return -1",
                "        return self.q[self.head]",
                "        ",
                "    def Rear(self) -> int:",
                "        if self.isEmpty(): return -1",
                "        return self.q[(self.head + self.count - 1) % self.capacity]",
                "        ",
                "    def isEmpty(self) -> bool:",
                "        return self.count == 0",
                "        ",
                "    def isFull(self) -> bool:",
                "        return self.count == self.capacity"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize an array of size K, a head pointer, and a count of elements." },
                { num: 2, txt: "On enQueue, check if the queue is full." },
                { num: 3, txt: "If full, return false immediately." },
                { num: 4, txt: "Otherwise, calculate the tail index using (head + count) % capacity, insert the value, increment count, and return true." },
                { num: 5, txt: "On deQueue, check if the queue is empty." },
                { num: 6, txt: "If empty, return false immediately." },
                { num: 7, txt: "Otherwise, advance the head index using (head + 1) % capacity, decrement count, and return true." },
                { num: 8, txt: "On Front(), return the element at the head index if not empty." },
                { num: 9, txt: "On Rear(), return the element at (head + count - 1) % capacity if not empty." },
                { num: 10, txt: "isEmpty() is simply count == 0." },
                { num: 11, txt: "isFull() is simply count == capacity." },
                { num: 12, txt: "Done processing." }
              ]} 
            />
            <Complexity time="O(1) all ops" space="O(K)" />
            <WhyItWorks paragraphs={[
              <>A naive queue implementation using a standard array requires shifting all elements <code>O(N)</code> every time we dequeue from the front.</>,
              <>By using a circular queue, we leave dequeued spaces empty and use the modulo operator <code>%</code> to wrap our <code>head</code> and <code>tail</code> pointers around the end of the array back to the beginning. This enables true <code>O(1)</code> time complexity for all operations with a fixed memory footprint <code>O(K)</code>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
