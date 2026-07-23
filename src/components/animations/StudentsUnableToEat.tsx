import React, { useState } from 'react';
import { Users, CheckCircle2, RotateCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>The school cafeteria offers circular and square sandwiches at lunch break, referred to by numbers <code>0</code> and <code>1</code> respectively. All students stand in a queue. Each student either prefers square or circular sandwiches.</p>
    <p>The number of sandwiches in the cafeteria is equal to the number of students. The sandwiches are placed in a <strong>stack</strong>. At each step:</p>
    <ul>
      <li>If the student at the front of the queue <strong>prefers</strong> the sandwich on the top of the stack, they will <strong>take it</strong> and leave the queue.</li>
      <li>Otherwise, they will <strong>leave it</strong> and go to the queue's end.</li>
    </ul>
    <p>This continues until none of the queue students want to take the top sandwich and are thus unable to eat. Return the number of students that are unable to eat.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'students = [1,1,0,0], sandwiches = [0,1,0,1]', 
    output: '0',
    explanation: <>
      - Front student leaves the top sandwich and returns to the end of the line making students = [1,0,0,1].<br/>
      - Front student leaves the top sandwich and returns to the end of the line making students = [0,0,1,1].<br/>
      - Front student takes the top sandwich and leaves the line making students = [0,1,1] and sandwiches = [1,0,1].<br/>
      ...and so on until everyone eats.
    </>
  },
  { 
    label: 'Example 2', 
    input: 'students = [1,1,1,0,0,1], sandwiches = [1,0,0,0,1,1]', 
    output: '3',
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= students.length, sandwiches.length &lt;= 100</code></div>
    <div><code>students.length == sandwiches.length</code></div>
    <div><code>sandwiches[i]</code> is 0 or 1.</div>
    <div><code>students[i]</code> is 0 or 1.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int countStudents(int[] students, int[] sandwiches) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def countStudents(self, students: list[int], sandwiches: list[int]) -> int:\n        # Write your code here\n        pass`;

// 0: Circular, 1: Square
const INIT_STUDENTS = [1, 0, 1];
const INIT_SANDWICHES = [0, 1, 1];
// Idx helps track unique elements for React keys
const mapWithId = (arr: number[], prefix: string) => arr.map((val, i) => ({ id: `${prefix}-${i}`, val }));

const generateTimeline = () => {
  const timeline: any[] = [];
  
  let students = mapWithId(INIT_STUDENTS, 'stu');
  let sandwiches = mapWithId(INIT_SANDWICHES, 'san');
  let rejectedCount = 0;
  
  timeline.push({
    students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize a Queue for the students and a Stack for the sandwiches. Also initialize a count of consecutive rejections to 0.",
    logic: `<strong>Init:</strong> rejections = 0`, logicClass: 'info'
  });

  while (students.length > 0 && rejectedCount < students.length) {
    timeline.push({
      students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'check_condition',
      activeLines: [5], activeStep: 2,
      desc: `Check if we should keep simulating: Queue is not empty (${students.length} > 0), and rejections (${rejectedCount}) is less than queue size (${students.length}).`,
      logic: `rejections < queue.size() is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    const student = students[0];
    const sandwich = sandwiches[0];

    timeline.push({
      students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'compare',
      activeLines: [6], activeStep: 3,
      desc: `Compare the front student's preference (${student.val}) with the top sandwich (${sandwich.val}).`,
      logic: `Does Student <strong style="color:var(--sky)">${student.val}</strong> == Sandwich <strong style="color:var(--pink)">${sandwich.val}</strong>?`, logicClass: 'warning'
    });

    if (student.val === sandwich.val) {
      students.shift();
      sandwiches.shift();
      rejectedCount = 0;

      timeline.push({
        students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'eat',
        activeLines: [7, 8, 9], activeStep: 4,
        desc: `Match! The student takes the sandwich and leaves. Reset the consecutive rejection counter to 0.`,
        logic: `<strong style="color:var(--green)">Match!</strong> Rejections = 0`, logicClass: 'success'
      });
    } else {
      const removedStu = students.shift()!;
      students.push(removedStu);
      rejectedCount++;

      timeline.push({
        students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'rotate',
        activeLines: [11, 12], activeStep: 5,
        desc: `Mismatch! The student doesn't want it and goes to the back of the queue. Increment rejection counter to ${rejectedCount}.`,
        logic: `<strong style="color:var(--pink)">Mismatch.</strong> Student rotates. Rejections = ${rejectedCount}`, logicClass: 'error'
      });
    }
  }

  timeline.push({
    students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'check_condition_fail',
    activeLines: [5], activeStep: 2,
    desc: `Check condition: Queue size is ${students.length}, rejections is ${rejectedCount}. Condition fails! Simulation ends.`,
    logic: students.length === 0 ? `<strong style="color:var(--green)">Queue is empty!</strong>` : `<strong style="color:var(--pink)">Rejections == Queue Size!</strong> Break.`, logicClass: students.length === 0 ? 'success' : 'error'
  });

  timeline.push({
    students: [...students], sandwiches: [...sandwiches], rejectedCount, phase: 'done',
    activeLines: [15], activeStep: 6,
    desc: `Return the number of students left in the queue: ${students.length}.`,
    logic: `<strong style="color:var(--green)">Return ${students.length}</strong>`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function StudentsUnableToEat({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Number of Students Unable to Eat Lunch" lcNum="1700" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Number of Students Unable to Eat Lunch" lcNum="1700" difficulty="Easy" tag="Queue" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<RotateCw size={20} />} title="Simulation with Queue & Stack"
              lines={["Simulate exactly what the problem describes!", "Use a Queue for the students and a Stack for the sandwiches.", "To prevent an infinite loop, keep a 'rejection count'. If every student in the queue rejects the top sandwich, we're stuck! Break and return the size."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Cafeteria State
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: '150px' }}>
                  
                  {/* Students Queue */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sky)', fontWeight: 'bold' }}>FRONT &larr; STUDENTS QUEUE</div>
                    <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '200px', overflowX: 'auto', minHeight: '66px' }}>
                      <AnimatePresence mode="popLayout">
                        {current.students.map((stu: {id: string, val: number}, idx: number) => {
                          const isComparing = idx === 0 && current.phase === 'compare';
                          const isRotating = idx === current.students.length - 1 && current.phase === 'rotate';
                          
                          return (
                            <motion.div
                              layout
                              key={stu.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0, y: -20 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              style={{
                                width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                borderRadius: stu.val === 0 ? '50%' : '4px',
                                background: isComparing ? 'var(--viz-sky-bg)' : isRotating ? 'var(--viz-yellow-bg)' : 'var(--viz-sky-bg)',
                                border: `2px solid ${isComparing ? 'var(--sky)' : 'var(--border-strong)'}`,
                                color: 'var(--text)', fontWeight: 'bold'
                              }}
                            >
                              {stu.val}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {current.students.length === 0 && (
                        <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center', lineHeight: '40px' }}>Empty</div>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>
                    {current.phase === 'compare' ? '🤔' : current.phase === 'eat' ? '✅' : current.phase === 'rotate' ? '❌' : '...'}
                  </div>

                  {/* Sandwiches Stack (Horizontal for layout) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--pink)', fontWeight: 'bold' }}>TOP &larr; SANDWICH STACK</div>
                    <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '200px', overflowX: 'auto', minHeight: '66px' }}>
                      <AnimatePresence mode="popLayout">
                        {current.sandwiches.map((san: {id: string, val: number}, idx: number) => {
                          const isComparing = idx === 0 && current.phase === 'compare';
                          
                          return (
                            <motion.div
                              layout
                              key={san.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0, y: -20 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              style={{
                                width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                borderRadius: san.val === 0 ? '50%' : '4px',
                                background: isComparing ? 'var(--viz-red-bg)' : 'var(--viz-red-bg)',
                                border: `2px solid ${isComparing ? 'var(--pink)' : 'var(--border-strong)'}`,
                                color: 'var(--text)', fontWeight: 'bold'
                              }}
                            >
                              {san.val}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {current.sandwiches.length === 0 && (
                        <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center', lineHeight: '40px' }}>Empty</div>
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
                  <div className="st-lbl">Students Left</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.students.length}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Sandwiches Left</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.sandwiches.length}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Consecutive Rejections</div>
                  <div className="st-val" style={{ color: current.rejectedCount >= current.students.length && current.students.length > 0 ? 'var(--pink)' : 'var(--warning)' }}>
                    {current.rejectedCount}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Simulation Step"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Number of Students Unable to Eat Lunch"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int countStudents(int[] students, int[] sandwiches) {",
                "    Queue<Integer> q = new LinkedList<>();",
                "    for (int s : students) q.add(s);",
                "    ",
                "    int top = 0; // index simulating stack top",
                "    int rejections = 0;",
                "    ",
                "    while (!q.isEmpty() && rejections < q.size()) {",
                "        if (q.peek() == sandwiches[top]) {",
                "            q.poll();",
                "            top++;",
                "            rejections = 0;",
                "        } else {",
                "            q.add(q.poll());",
                "            rejections++;",
                "        }",
                "    }",
                "    return q.size();",
                "}"
              ]}
              pythonCode={[
                "from collections import deque",
                "def countStudents(students: list[int], sandwiches: list[int]) -> int:",
                "    q = deque(students)",
                "    top = 0",
                "    rejections = 0",
                "    ",
                "    while q and rejections < len(q):",
                "        if q[0] == sandwiches[top]:",
                "            q.popleft()",
                "            top += 1",
                "            rejections = 0",
                "        else:",
                "            q.append(q.popleft())",
                "            rejections += 1",
                "            ",
                "    return len(q)"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize a Queue for students. The sandwiches array naturally acts as a stack if we use an index pointer." },
                { num: 2, txt: "Loop condition: Continue while there are students AND the number of consecutive rejections is less than the number of students." },
                { num: 3, txt: "Check if the student at the front of the queue wants the sandwich at the top of the stack." },
                { num: 4, txt: "If yes, remove the student, pop the sandwich, and reset the rejection counter to 0." },
                { num: 5, txt: "If no, move the student to the back of the queue, and increment the rejection counter." },
                { num: 6, txt: "Return the number of students left in the queue. (0 means everyone ate!)." }
              ]} 
            />
            <Complexity time="O(N)" space="O(N)" />
            <WhyItWorks paragraphs={[
              <>This simulates exactly what the problem describes. The only tricky part is knowing when to stop.</>,
              <>If every student currently in the line rejects the top sandwich, moving them to the back of the line just brings the same students to the front again. Thus, if <code>rejections == queue.size()</code>, we are in an infinite loop and no one else will eat.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
