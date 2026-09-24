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
  "    public void reorderList(ListNode head) {",
  "        if (head == null || head.next == null) return;",
  "        // 1. Find the middle",
  "        ListNode slow = head, fast = head.next;",
  "        while (fast != null && fast.next != null) {",
  "            slow = slow.next;",
  "            fast = fast.next.next;",
  "        }",
  "        // 2. Reverse the second half",
  "        ListNode second = slow.next;",
  "        slow.next = null;",
  "        ListNode prev = null;",
  "        while (second != null) {",
  "            ListNode tmp = second.next;",
  "            second.next = prev;",
  "            prev = second;",
  "            second = tmp;",
  "        }",
  "        // 3. Merge two halves",
  "        ListNode first = head;",
  "        second = prev;",
  "        while (second != null) {",
  "            ListNode tmp1 = first.next;",
  "            ListNode tmp2 = second.next;",
  "            first.next = second;",
  "            second.next = tmp1;",
  "            first = tmp1;",
  "            second = tmp2;",
  "        }",
  "    }",
  "}"
];

const pythonCode = [
  "class Solution:",
  "    def reorderList(self, head: Optional[ListNode]) -> None:",
  "        if not head or not head.next: return",
  "        # 1. Find the middle",
  "        slow, fast = head, head.next",
  "        while fast and fast.next:",
  "            slow = slow.next",
  "            fast = fast.next.next",
  "        # 2. Reverse the second half",
  "        second = slow.next",
  "        slow.next = None",
  "        prev = None",
  "        while second:",
  "            tmp = second.next",
  "            second.next = prev",
  "            prev = second",
  "            second = tmp",
  "        # 3. Merge two halves",
  "        first, second = head, prev",
  "        while second:",
  "            tmp1, tmp2 = first.next, second.next",
  "            first.next = second",
  "            second.next = tmp1",
  "            first, second = tmp1, tmp2"
];

function generateSteps(arr: number[]): State[] {
  const steps: State[] = [];
  if (arr.length <= 1) return steps;

  let nodes: LLNode[] = arr.map((val, i) => ({
    id: `node-${i}`,
    val,
    x: 80 + i * 110,
    y: 150,
    next: i < arr.length - 1 ? `node-${i + 1}` : null,
    color: 'var(--border)',
    bgColor: 'var(--surface)'
  }));
  nodes.push({ id: 'null', val: 'null', x: -50, y: 150, color: 'transparent', bgColor: 'transparent' }); // for prev = null

  const cloneNodes = (ns: LLNode[]) => ns.map(n => ({ ...n }));

  // Part 1: Find Middle
  let slowIdx = 0;
  let fastIdx = 1;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
      { label: 'fast', targetId: `node-${fastIdx}`, color: 'var(--viz-red-fg)' }
    ],
    activeLinesJava: [5],
    activeLinesPy: [5],
    explanation: 'Phase 1: Find the middle node using slow and fast pointers.'
  });

  while (fastIdx < arr.length && fastIdx + 1 < arr.length) {
    slowIdx++;
    fastIdx += 2;
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'fast', targetId: fastIdx < arr.length ? `node-${fastIdx}` : 'null', color: 'var(--viz-red-fg)' }
      ],
      activeLinesJava: [7, 8],
      activeLinesPy: [7, 8],
      explanation: 'Move slow 1 step and fast 2 steps.'
    });
  }

  // Part 2: Reverse second half
  let secondIdx: number | null = slowIdx + 1;
  if (secondIdx >= arr.length) secondIdx = null;

  nodes[slowIdx].next = null; // Split lists

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'slow', targetId: `node-${slowIdx}`, color: 'var(--viz-blue-fg)' },
      { label: 'second', targetId: secondIdx !== null ? `node-${secondIdx}` : 'null', color: 'var(--viz-orange-fg)' }
    ],
    activeLinesJava: [11, 12],
    activeLinesPy: [10, 11],
    explanation: 'Phase 2: Split the list at slow.next and prepare to reverse the second half.'
  });

  let prevIdx: string | null = 'null';
  let currIdx = secondIdx;

  while (currIdx !== null) {
    const nextIdx = currIdx + 1 < arr.length ? currIdx + 1 : null;

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevIdx, color: 'var(--viz-purple-fg)' },
        { label: 'second', targetId: `node-${currIdx}`, color: 'var(--viz-orange-fg)' }
      ],
      activeLinesJava: [15],
      activeLinesPy: [14],
      explanation: 'Reverse pointer for current node in second half.'
    });

    nodes[currIdx].next = prevIdx === 'null' ? null : prevIdx;
    nodes[currIdx].color = 'var(--viz-red-bd)';

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevIdx, color: 'var(--viz-purple-fg)' },
        { label: 'second', targetId: `node-${currIdx}`, color: 'var(--viz-orange-fg)' }
      ],
      activeLinesJava: [16],
      activeLinesPy: [15],
      explanation: 'second.next points to prev.'
    });

    nodes[currIdx].color = 'var(--border)';
    prevIdx = `node-${currIdx}`;
    currIdx = nextIdx;
  }

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'prev', targetId: prevIdx, color: 'var(--viz-purple-fg)' }
    ],
    activeLinesJava: [20],
    activeLinesPy: [19],
    explanation: 'Second half reversed. prev is the head of this reversed half.'
  });

  // Part 3: Merge
  let firstId: string | null = 'node-0';
  let secondId: string | null = prevIdx;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'first', targetId: firstId, color: 'var(--viz-blue-fg)' },
      { label: 'second', targetId: secondId, color: 'var(--viz-orange-fg)' }
    ],
    activeLinesJava: [22, 23],
    activeLinesPy: [20],
    explanation: 'Phase 3: Merge the two halves alternately.'
  });

  while (secondId !== null && secondId !== 'null') {
    const firstNode = nodes.find(n => n.id === firstId)!;
    const secondNode = nodes.find(n => n.id === secondId)!;

    const tmp1Id = firstNode.next || 'null';
    const tmp2Id = secondNode.next || 'null';

    firstNode.next = secondId;
    firstNode.color = 'var(--viz-green-bd)';

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'first', targetId: firstId, color: 'var(--viz-blue-fg)' },
        { label: 'second', targetId: secondId, color: 'var(--viz-orange-fg)' },
        { label: 'tmp1', targetId: tmp1Id, color: 'var(--muted)' }
      ],
      activeLinesJava: [27],
      activeLinesPy: [23],
      explanation: 'first.next = second'
    });

    firstNode.color = 'var(--border)';
    secondNode.next = tmp1Id === 'null' ? null : tmp1Id;
    secondNode.color = 'var(--viz-green-bd)';

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'first', targetId: firstId, color: 'var(--viz-blue-fg)' },
        { label: 'second', targetId: secondId, color: 'var(--viz-orange-fg)' }
      ],
      activeLinesJava: [28],
      activeLinesPy: [24],
      explanation: 'second.next = tmp1 (the original next of first)'
    });

    secondNode.color = 'var(--border)';
    firstId = tmp1Id === 'null' ? null : tmp1Id;
    secondId = tmp2Id === 'null' ? null : tmp2Id;

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'first', targetId: firstId, color: 'var(--viz-blue-fg)' },
        { label: 'second', targetId: secondId, color: 'var(--viz-orange-fg)' }
      ],
      activeLinesJava: [29, 30],
      activeLinesPy: [25],
      explanation: 'Advance first and second pointers.'
    });
  }

  // Final highlight
  steps.push({
    nodes: cloneNodes(nodes).map(n => ({ ...n, bgColor: n.id !== 'null' ? 'var(--viz-green-bg)' : n.bgColor, color: n.id !== 'null' ? 'var(--viz-green-bd)' : n.color })),
    pointers: [],
    activeLinesJava: [32],
    activeLinesPy: [25],
    explanation: 'Merge complete. The linked list is now reordered.'
  });

  return steps;
}

const defaultArr = [1, 2, 3, 4, 5];

export default function ReorderList({ onBack }: { onBack?: () => void }) {
  const [arr, setArr] = useState<number[]>([1, 2, 3, 4, 5]);
  const [customInputArr, setCustomInputArr] = useState(arr.join(','));
  const [steps, setSteps] = useState<State[]>([]);

  useEffect(() => {
    setSteps(generateSteps(arr));
  }, [arr]);

  const { currentStep, setCurrentStep, isPlaying, speed, play, pause, reset, stepForward, stepBackward, setSpeed } = useAnimationController(steps.length);

  const state = steps[currentStep] || steps[0];

  const handleCustomInput = () => {
    const a = customInputArr.split(',').map(s => parseInt(s.trim())).filter(num => !isNaN(num));
    if (a.length > 0 && a.length <= 8) {
      setArr(a);
      reset();
    } else {
      alert('Please enter 1-8 comma-separated numbers');
    }
  };

  const examples = [
    { 
      shortLabel: "head = [1,2,3,4]", shortOutput: "[1,4,2,3]", 
      inputBlock: <code>head = [1,2,3,4]</code>, outputBlock: <code>[1,4,2,3]</code>, 
      explanation: <span>The list is reordered to L0 → Ln → L1 → Ln-1.</span>, value: [1, 2, 3, 4] 
    },
    { 
      shortLabel: "head = [1,2,3,4,5]", shortOutput: "[1,5,2,4,3]", 
      inputBlock: <code>head = [1,2,3,4,5]</code>, outputBlock: <code>[1,5,2,4,3]</code>, 
      explanation: <span>The list is reordered to L0 → Ln → L1 → Ln-1 → L2.</span>, value: [1, 2, 3, 4, 5] 
    }
  ];

  if (steps.length === 0) return null;

  return (
    <VisualizerLayout
      title="Reorder List"
      problemStatement="You are given the head of a singly linked list. Reorder the list to be: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ..."
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
          <input type="text" className="ex-custom-input" value={customInputArr} onChange={e => setCustomInputArr(e.target.value)} />
          <button className="ex-custom-run" onClick={handleCustomInput}>Run</button>
        </div>
      }
      examples={examples}
      edgeCases={[
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4]
      ]}
      onExampleSelect={(val) => { 
        setArr(val); 
        setCustomInputArr(val.join(',')); 
        reset(); 
      }}
      currentExample={arr}
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      algorithmSteps={[
        { num: 1, txt: "Find the middle of the list using slow and fast pointers." },
        { num: 2, txt: "Split the list into two halves: head to slow, and slow.next to the end." },
        { num: 3, txt: "Reverse the second half of the list (using the standard reverse linked list technique)." },
        { num: 4, txt: "Merge the two halves by taking nodes alternately from the first half and the reversed second half." }
      ]}
      whyItWorks={[
        <React.Fragment key="1">The problem asks us to interleave nodes from the beginning and the end of the list: L0 → Ln → L1 → Ln-1...</React.Fragment>,
        <React.Fragment key="2">By reversing the second half of the list, we get the nodes in the exact order we need them (Ln, Ln-1, ...). Then, interleaving is simply weaving two lists together.</React.Fragment>
      ]}
    >
      <GenericLinkedListCanvas 
        nodes={state.nodes} 
        pointers={state.pointers} 
        svgWidth={1000} 
        svgHeight={400} 
      />
    </VisualizerLayout>
  );
}
