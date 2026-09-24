import React, { useState, useEffect } from 'react';
import { LLVisualizerLayout as VisualizerLayout } from './LLVisualizerLayout';
import { useLLAnimationController as useAnimationController } from './useLLAnimationController';
import { GenericLinkedListCanvas, type LLNode, type LLPointer } from './GenericLinkedListCanvas';

interface State {
  nodes: LLNode[];
  pointers: LLPointer[];
  activeLinesJava: number[];
  activeLinesPy: number[];
  explanation: string;
}

const javaCode = [
  "public class Solution {",
  "    public boolean hasCycle(ListNode head) {",
  "        if (head == null || head.next == null) return false;",
  "        ListNode slow = head;",
  "        ListNode fast = head.next;",
  "        while (slow != fast) {",
  "            if (fast == null || fast.next == null) {",
  "                return false;",
  "            }",
  "            slow = slow.next;",
  "            fast = fast.next.next;",
  "        }",
  "        return true;",
  "    }",
  "}"
];

const pythonCode = [
  "class Solution:",
  "    def hasCycle(self, head: Optional[ListNode]) -> bool:",
  "        if not head or not head.next:",
  "            return False",
  "        slow = head",
  "        fast = head.next",
  "        while slow != fast:",
  "            if not fast or not fast.next:",
  "                return False",
  "            slow = slow.next",
  "            fast = fast.next.next",
  "        return True"
];

function generateSteps(arr: number[], pos: number): State[] {
  const steps: State[] = [];
  
  if (arr.length === 0) return steps;

  let nodes: LLNode[] = arr.map((val, i) => ({
    id: `node-${i}`,
    val,
    x: 100 + i * 140,
    y: 150,
    next: i < arr.length - 1 ? `node-${i + 1}` : (pos !== -1 ? `node-${pos}` : null),
    color: 'var(--border)',
    bgColor: 'var(--surface)'
  }));

  const cloneNodes = (ns: LLNode[]) => ns.map(n => ({ ...n }));

  if (arr.length < 2) {
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [{ label: 'head', targetId: 'node-0', color: 'var(--viz-blue-fg)' }],
      activeLinesJava: [3],
      activeLinesPy: [3, 4],
      explanation: 'List is too short to have a cycle, return false.'
    });
    return steps;
  }

  let slowIdx = 0;
  let fastIdx = 1;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
      { label: 'fast', targetId: `node-${fastIdx}`, color: 'var(--viz-red-fg)' }
    ],
    activeLinesJava: [4, 5],
    activeLinesPy: [5, 6],
    explanation: 'Initialize slow to head, and fast to head.next.'
  });

  let loopCount = 0;
  while (slowIdx !== fastIdx && loopCount < 20) { // Safety break
    loopCount++;

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'fast', targetId: `node-${fastIdx}`, color: 'var(--viz-red-fg)' }
      ],
      activeLinesJava: [6],
      activeLinesPy: [7],
      explanation: 'slow and fast meet? No, continue.'
    });

    if (fastIdx >= arr.length || (fastIdx === arr.length - 1 && pos === -1)) {
      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
          { label: 'fast', targetId: `node-${fastIdx}`, color: 'var(--viz-red-fg)' }
        ],
        activeLinesJava: [7, 8],
        activeLinesPy: [8, 9],
        explanation: 'fast reached the end. No cycle exists.'
      });
      return steps;
    }

    // move slow 1 step
    if (slowIdx === arr.length - 1 && pos !== -1) slowIdx = pos;
    else slowIdx++;

    // move fast 2 steps
    for (let step = 0; step < 2; step++) {
      if (fastIdx === arr.length - 1 && pos !== -1) fastIdx = pos;
      else fastIdx++;
    }

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'fast', targetId: `node-${fastIdx}`, color: 'var(--viz-red-fg)' }
      ],
      activeLinesJava: [10, 11],
      activeLinesPy: [10, 11],
      explanation: 'Move slow 1 step, fast 2 steps.'
    });
  }

  if (slowIdx === fastIdx) {
    let finalNodes = cloneNodes(nodes);
    finalNodes[slowIdx].color = 'var(--viz-green-bd)';
    finalNodes[slowIdx].bgColor = 'var(--viz-green-bg)';
    
    steps.push({
      nodes: finalNodes,
      pointers: [
        { label: 'slow & fast', targetId: `node-${slowIdx}`, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [13],
      activeLinesPy: [12],
      explanation: 'slow and fast met at the same node! A cycle exists, return true.'
    });
  }

  return steps;
}

const defaultArr = [3, 2, 0, -4];
const defaultPos = 1;

export default function LinkedListCycle({ onBack }: { onBack?: () => void }) {
  const [arr, setArr] = useState<number[]>([3, 2, 0, -4]);
  const [pos, setPos] = useState(defaultPos);
  
  const [customInputArr, setCustomInputArr] = useState(arr.join(','));
  const [customInputPos, setCustomInputPos] = useState(pos.toString());
  
  const [steps, setSteps] = useState<State[]>([]);

  useEffect(() => {
    setSteps(generateSteps(arr, pos));
  }, [arr, pos]);

  const { currentStep, setCurrentStep, isPlaying, speed, play, pause, reset, stepForward, stepBackward, setSpeed } = useAnimationController(steps.length);

  const state = steps[currentStep] || steps[0];

  const handleCustomInput = () => {
    const a = customInputArr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const p = parseInt(customInputPos.trim());
    if (a.length > 0 && a.length <= 7) {
      setArr(a);
      setPos(isNaN(p) ? -1 : p);
      reset();
    } else {
      alert('Please enter 1-7 comma-separated numbers');
    }
  };

  const examples = [
    { 
      shortLabel: "head=[3,2,0,-4], pos=1", shortOutput: "true", 
      inputBlock: <span><code>head = [3,2,0,-4]</code>, <code>pos = 1</code></span>, outputBlock: <code>true</code>, 
      explanation: <span>There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).</span>, value: { arr: [3, 2, 0, -4], pos: 1 } 
    },
    { 
      shortLabel: "head=[1,2], pos=0", shortOutput: "true", 
      inputBlock: <span><code>head = [1,2]</code>, <code>pos = 0</code></span>, outputBlock: <code>true</code>, 
      explanation: <span>There is a cycle in the linked list, where the tail connects to the 0th node.</span>, value: { arr: [1, 2], pos: 0 } 
    },
    { 
      shortLabel: "head=[1], pos=-1", shortOutput: "false", 
      inputBlock: <span><code>head = [1]</code>, <code>pos = -1</code></span>, outputBlock: <code>false</code>, 
      explanation: <span>There is no cycle in the linked list.</span>, value: { arr: [1], pos: -1 } 
    }
  ];

  if (steps.length === 0) return null;

  return (
    <VisualizerLayout
      title="Linked List Cycle"
      problemStatement="Given head, the head of a linked list, determine if the linked list has a cycle in it."
      difficulty="Easy"
      category="Linked Lists"
      javaCode={javaCode}
      pythonCode={pythonCode}
      activeLinesJava={state.activeLinesJava}
      activeLinesPy={state.activeLinesPy}
      explanation={state.explanation}
      isPlaying={isPlaying}
      speed={speed}
      onPlay={play}
      onPause={pause}
      onReset={reset}
      onStepForward={stepForward}
      onStepBackward={stepBackward}
      onSpeedChange={setSpeed}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      onBack={onBack}
      totalSteps={steps.length}
      customInput={
        <div className="ex-custom-row">
          <span className="ex-custom-label">Nodes:</span>
          <input type="text" className="ex-custom-input" style={{ width: 100 }} value={customInputArr} onChange={(e) => setCustomInputArr(e.target.value)} />
          <span className="ex-custom-label" style={{ marginLeft: 8 }}>pos:</span>
          <input type="number" className="ex-custom-input" style={{ width: 50 }} value={customInputPos} onChange={(e) => setCustomInputPos(e.target.value)} />
          <button className="ex-custom-run" onClick={handleCustomInput}>Run</button>
        </div>
      }
      examples={examples}
      edgeCases={[
        { arr: [1], pos: -1 },
        { arr: [1, 2], pos: 0 },
        { arr: [1, 2], pos: -1 },
        { arr: [1, 2, 3, 4, 5], pos: 2 },
        { arr: [1, 2, 3, 4, 5, 6], pos: -1 }
      ]}
      onExampleSelect={(val: any) => { 
        setArr(val.arr); setPos(val.pos); 
        setCustomInputArr(val.arr.join(',')); setCustomInputPos(val.pos.toString()); 
        reset(); 
      }}
      currentExample={null} // Hack to avoid type mismatch
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      algorithmSteps={[
        { num: 1, txt: "Initialize two pointers, slow and fast, pointing to the head." },
        { num: 2, txt: "Move slow one step at a time (slow = slow.next)." },
        { num: 3, txt: "Move fast two steps at a time (fast = fast.next.next)." },
        { num: 4, txt: "If they ever meet (slow == fast), there is a cycle." },
        { num: 5, txt: "If fast reaches the end (null), there is no cycle." }
      ]}
      whyItWorks={[
        <React.Fragment key="1">This is Floyd's Tortoise and Hare algorithm. The fast pointer moves twice as fast as the slow pointer.</React.Fragment>,
        <React.Fragment key="2">If there is no cycle, the fast pointer will eventually reach the end of the list. If there is a cycle, the fast pointer will enter the cycle first. When the slow pointer enters the cycle, the fast pointer will "lap" it, closing the distance by 1 node each step until they collide.</React.Fragment>
      ]}
    >
      <GenericLinkedListCanvas 
        nodes={state.nodes} 
        pointers={state.pointers} 
        svgWidth={1000} 
        svgHeight={350} 
      />
    </VisualizerLayout>
  );
}
