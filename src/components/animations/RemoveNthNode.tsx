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
  "class Solution {",
  "    public ListNode removeNthFromEnd(ListNode head, int n) {",
  "        ListNode dummy = new ListNode(0);",
  "        dummy.next = head;",
  "        ListNode fast = dummy;",
  "        ListNode slow = dummy;",
  "        for (int i = 0; i <= n; i++) {",
  "            fast = fast.next;",
  "        }",
  "        while (fast != null) {",
  "            fast = fast.next;",
  "            slow = slow.next;",
  "        }",
  "        slow.next = slow.next.next;",
  "        return dummy.next;",
  "    }",
  "}"
];

const pythonCode = [
  "class Solution:",
  "    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:",
  "        dummy = ListNode(0)",
  "        dummy.next = head",
  "        fast = dummy",
  "        slow = dummy",
  "        for _ in range(n + 1):",
  "            fast = fast.next",
  "        while fast:",
  "            fast = fast.next",
  "            slow = slow.next",
  "        slow.next = slow.next.next",
  "        return dummy.next"
];

function generateSteps(arr: number[], n: number): State[] {
  const steps: State[] = [];
  
  if (arr.length === 0) return steps;

  let nodes: LLNode[] = arr.map((val, i) => ({
    id: `node-${i}`,
    val,
    x: 150 + i * 110,
    y: 150,
    next: i < arr.length - 1 ? `node-${i + 1}` : null,
    color: 'var(--border)',
    bgColor: 'var(--surface)'
  }));

  nodes.unshift({
    id: 'dummy', val: '0', x: 40, y: 150, next: 'node-0', color: 'var(--border)', bgColor: 'var(--surface2)', isDummy: true
  });

  const cloneNodes = (ns: LLNode[]) => ns.map(nd => ({ ...nd }));

  let fastId: string | null = 'dummy';
  let slowId: string | null = 'dummy';
  let fastIdx = -1; // -1 is dummy, 0 is head
  let slowIdx = -1;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'fast', targetId: fastId, color: 'var(--viz-red-fg)' },
      { label: 'slow', targetId: slowId, color: 'var(--viz-blue-fg)' }
    ],
    activeLinesJava: [3, 4, 5, 6],
    activeLinesPy: [3, 4, 5, 6],
    explanation: 'Initialize dummy node, slow, and fast pointers all pointing to dummy.'
  });

  for (let i = 0; i <= n; i++) {
    fastIdx++;
    fastId = fastIdx < arr.length ? `node-${fastIdx}` : null;
    
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'fast', targetId: fastId, color: 'var(--viz-red-fg)' },
        { label: 'slow', targetId: slowId, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [7, 8],
      activeLinesPy: [7, 8],
      explanation: `Move fast forward to establish a gap of n nodes. (Step ${i + 1} of ${n + 1})`
    });
  }

  while (fastId !== null) {
    fastIdx++;
    fastId = fastIdx < arr.length ? `node-${fastIdx}` : null;
    slowIdx++;
    slowId = slowIdx < arr.length ? `node-${slowIdx}` : null;

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'fast', targetId: fastId, color: 'var(--viz-red-fg)' },
        { label: 'slow', targetId: slowId, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [10, 11, 12],
      activeLinesPy: [9, 10, 11],
      explanation: 'Move both fast and slow forward until fast reaches the end.'
    });
  }

  // Removal
  const toRemoveIdx = slowIdx + 1;
  const toRemoveId = `node-${toRemoveIdx}`;
  const afterRemoveId = toRemoveIdx + 1 < arr.length ? `node-${toRemoveIdx + 1}` : null;

  let currentNodes = cloneNodes(nodes);
  
  if (toRemoveIdx < arr.length) {
    currentNodes.find(nd => nd.id === toRemoveId)!.color = 'var(--viz-red-bd)';
    currentNodes.find(nd => nd.id === toRemoveId)!.bgColor = 'var(--viz-red-bg)';
  }

  steps.push({
    nodes: cloneNodes(currentNodes),
    pointers: [
      { label: 'fast', targetId: fastId, color: 'var(--viz-red-fg)' },
      { label: 'slow', targetId: slowId, color: 'var(--viz-blue-fg)' }
    ],
    activeLinesJava: [14],
    activeLinesPy: [12],
    explanation: 'fast is null. slow is now right before the node to remove.'
  });

  const slowNode = currentNodes.find(nd => nd.id === slowId)!;
  slowNode.next = afterRemoveId;
  slowNode.color = 'var(--viz-blue-bd)';

  if (toRemoveIdx < arr.length) {
    const rmNode = currentNodes.find(nd => nd.id === toRemoveId)!;
    rmNode.color = 'transparent';
    rmNode.bgColor = 'transparent';
    rmNode.val = '';
    rmNode.next = null;
  }

  steps.push({
    nodes: currentNodes,
    pointers: [
      { label: 'fast', targetId: fastId, color: 'var(--viz-red-fg)' },
      { label: 'slow', targetId: slowId, color: 'var(--viz-blue-fg)' }
    ],
    activeLinesJava: [14],
    activeLinesPy: [12],
    explanation: 'Update slow.next to skip the removed node.'
  });

  steps.push({
    nodes: currentNodes,
    pointers: [
      { label: 'head', targetId: currentNodes.find(n => n.id === 'dummy')!.next ?? null, color: 'var(--viz-orange-fg)' }
    ],
    activeLinesJava: [15],
    activeLinesPy: [13],
    explanation: 'Return dummy.next as the new head.'
  });

  return steps;
}

const defaultArr = [1, 2, 3, 4, 5];
const defaultN = 2;

export default function RemoveNthNode({ onBack }: { onBack?: () => void }) {
  const [arr, setArr] = useState<number[]>([1, 2, 3, 4, 5]);
  const [nVal, setNVal] = useState(defaultN);
  
  const [customInputArr, setCustomInputArr] = useState(arr.join(','));
  const [customInputN, setCustomInputN] = useState(nVal.toString());
  
  const [steps, setSteps] = useState<State[]>([]);

  useEffect(() => {
    setSteps(generateSteps(arr, nVal));
  }, [arr, nVal]);

  const {
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed
  } = useAnimationController(steps.length);

  const state = steps[currentStep] || steps[0];

  const handleCustomInput = () => {
    const a = customInputArr.split(',').map(s => parseInt(s.trim())).filter(num => !isNaN(num));
    const p = parseInt(customInputN.trim());
    if (a.length > 0 && a.length <= 7 && p >= 1 && p <= a.length) {
      setArr(a);
      setNVal(p);
      reset();
    } else {
      alert('Please enter 1-7 comma-separated numbers, and a valid N (1 <= N <= length).');
    }
  };

  const examples = [
    { 
      shortLabel: "head=[1,2,3,4,5], n=2", shortOutput: "[1,2,3,5]", 
      inputBlock: <span><code>head = [1,2,3,4,5]</code>, <code>n = 2</code></span>, outputBlock: <code>[1,2,3,5]</code>, 
      explanation: <span>The 2nd node from the end is 4. Removing it results in [1,2,3,5].</span>, value: { arr: [1, 2, 3, 4, 5], nVal: 2 } 
    },
    { 
      shortLabel: "head=[1], n=1", shortOutput: "[]", 
      inputBlock: <span><code>head = [1]</code>, <code>n = 1</code></span>, outputBlock: <code>[]</code>, 
      value: { arr: [1], nVal: 1 } 
    },
    { 
      shortLabel: "head=[1,2], n=1", shortOutput: "[1]", 
      inputBlock: <span><code>head = [1,2]</code>, <code>n = 1</code></span>, outputBlock: <code>[1]</code>, 
      value: { arr: [1, 2], nVal: 1 } 
    }
  ];

  if (steps.length === 0) return null;

  return (
    <VisualizerLayout
      title="Remove Nth Node From End"
      problemStatement="Given the head of a linked list, remove the nth node from the end of the list and return its head."
      difficulty="Medium"
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
          <span className="ex-custom-label" style={{ marginLeft: 8 }}>n:</span>
          <input type="number" className="ex-custom-input" style={{ width: 50 }} value={customInputN} onChange={(e) => setCustomInputN(e.target.value)} />
          <button className="ex-custom-run" onClick={handleCustomInput}>Run</button>
        </div>
      }
      examples={examples}
      edgeCases={[
        { arr: [1], nVal: 1 },
        { arr: [1, 2], nVal: 2 },
        { arr: [1, 2], nVal: 1 },
        { arr: [1, 2, 3, 4], nVal: 4 }
      ]}
      onExampleSelect={(val: any) => { 
        setArr(val.arr); setNVal(val.nVal); 
        setCustomInputArr(val.arr.join(',')); setCustomInputN(val.nVal.toString()); 
        reset(); 
      }}
      currentExample={null}
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      algorithmSteps={[
        { num: 1, txt: "Initialize a dummy node pointing to head, and set both slow and fast to dummy." },
        { num: 2, txt: "Move fast pointer n steps forward to create a gap of n nodes between slow and fast." },
        { num: 3, txt: "Move both pointers one step at a time until fast reaches the end." },
        { num: 4, txt: "slow is now right before the node we want to delete. Set slow.next = slow.next.next." },
        { num: 5, txt: "Return dummy.next as the new head." }
      ]}
      whyItWorks={[
        <React.Fragment key="1">By moving the <code>fast</code> pointer <code>n</code> steps ahead first, we create a "ruler" of length <code>n</code>.</React.Fragment>,
        <React.Fragment key="2">When we move both pointers together, the <code>fast</code> pointer hitting the end means the <code>slow</code> pointer is exactly <code>n</code> steps from the end. This allows us to find the target node in a single pass.</React.Fragment>
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
