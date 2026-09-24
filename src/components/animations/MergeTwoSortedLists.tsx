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
  "    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {",
  "        ListNode dummy = new ListNode(-1);",
  "        ListNode curr = dummy;",
  "        while (list1 != null && list2 != null) {",
  "            if (list1.val <= list2.val) {",
  "                curr.next = list1;",
  "                list1 = list1.next;",
  "            } else {",
  "                curr.next = list2;",
  "                list2 = list2.next;",
  "            }",
  "            curr = curr.next;",
  "        }",
  "        if (list1 != null) {",
  "            curr.next = list1;",
  "        } else {",
  "            curr.next = list2;",
  "        }",
  "        return dummy.next;",
  "    }",
  "}"
];

const pythonCode = [
  "class Solution:",
  "    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:",
  "        dummy = ListNode(-1)",
  "        curr = dummy",
  "        while list1 and list2:",
  "            if list1.val <= list2.val:",
  "                curr.next = list1",
  "                list1 = list1.next",
  "            else:",
  "                curr.next = list2",
  "                list2 = list2.next",
  "            curr = curr.next",
  "        ",
  "        curr.next = list1 if list1 else list2",
  "        return dummy.next"
];

function generateSteps(arr1: number[], arr2: number[]): State[] {
  const steps: State[] = [];
  
  let nodes: LLNode[] = [];
  
  // List 1 nodes (Y = 100)
  arr1.forEach((val, i) => {
    nodes.push({
      id: `l1-${i}`, val, x: 200 + i * 120, y: 100,
      next: i < arr1.length - 1 ? `l1-${i + 1}` : null,
      color: 'var(--border)', bgColor: 'var(--surface)'
    });
  });

  // List 2 nodes (Y = 250)
  arr2.forEach((val, i) => {
    nodes.push({
      id: `l2-${i}`, val, x: 200 + i * 120, y: 250,
      next: i < arr2.length - 1 ? `l2-${i + 1}` : null,
      color: 'var(--border)', bgColor: 'var(--surface)'
    });
  });

  // Dummy node (Y = 175)
  nodes.push({
    id: 'dummy', val: '-1', x: 50, y: 175,
    next: null,
    color: 'var(--border)', bgColor: 'var(--surface2)', isDummy: true
  });

  const cloneNodes = (ns: LLNode[]) => ns.map(n => ({ ...n }));

  let l1Idx = 0;
  let l2Idx = 0;
  let currId = 'dummy';
  let l1Id: string | null = arr1.length > 0 ? `l1-0` : null;
  let l2Id: string | null = arr2.length > 0 ? `l2-0` : null;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
      { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
      { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
    ],
    activeLinesJava: [3, 4],
    activeLinesPy: [3, 4],
    explanation: 'Initialize dummy node and set curr to dummy.'
  });

  while (l1Id !== null && l2Id !== null) {
    const val1 = arr1[l1Idx];
    const val2 = arr2[l2Idx];

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
        { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
        { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [5],
      activeLinesPy: [5],
      explanation: 'Both lists are non-null. Compare list1.val and list2.val.'
    });

    if (val1 <= val2) {
      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [6],
        activeLinesPy: [6],
        explanation: `${val1} <= ${val2}, so we pick from list1.`
      });

      const currNode = nodes.find(n => n.id === currId)!;
      currNode.next = l1Id;
      currNode.color = 'var(--viz-blue-bd)';

      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [7],
        activeLinesPy: [7],
        explanation: 'curr.next points to list1.'
      });

      l1Idx++;
      l1Id = l1Idx < arr1.length ? `l1-${l1Idx}` : null;
      currId = `l1-${l1Idx - 1}`;

      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [8, 13],
        activeLinesPy: [8, 12],
        explanation: 'Advance list1 and curr.'
      });
    } else {
      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [9],
        activeLinesPy: [9],
        explanation: `${val1} > ${val2}, so we pick from list2.`
      });

      const currNode = nodes.find(n => n.id === currId)!;
      currNode.next = l2Id;
      currNode.color = 'var(--viz-green-bd)';

      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [10],
        activeLinesPy: [10],
        explanation: 'curr.next points to list2.'
      });

      l2Idx++;
      l2Id = l2Idx < arr2.length ? `l2-${l2Idx}` : null;
      currId = `l2-${l2Idx - 1}`;

      steps.push({
        nodes: cloneNodes(nodes),
        pointers: [
          { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
          { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
          { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
        ],
        activeLinesJava: [11, 13],
        activeLinesPy: [11, 12],
        explanation: 'Advance list2 and curr.'
      });
    }
  }

  // Attach remaining
  const currNode = nodes.find(n => n.id === currId)!;
  if (l1Id !== null) {
    currNode.next = l1Id;
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
        { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
        { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [15, 16],
      activeLinesPy: [14],
      explanation: 'list1 is not empty, attach the rest of list1 to curr.next.'
    });
  } else {
    currNode.next = l2Id;
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'curr', targetId: currId, color: 'var(--viz-purple-fg)' },
        { label: 'list1', targetId: l1Id, color: 'var(--viz-blue-fg)' },
        { label: 'list2', targetId: l2Id, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [17, 18],
      activeLinesPy: [14],
      explanation: 'list2 is not empty, attach the rest of list2 to curr.next.'
    });
  }

  // Final return
  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'head', targetId: nodes.find(n => n.id === 'dummy')!.next ?? null, color: 'var(--viz-orange-fg)' }
    ],
    activeLinesJava: [20],
    activeLinesPy: [15],
    explanation: 'Return dummy.next as the head of the merged list.'
  });

  return steps;
}

const defaultArr1 = [1, 2, 4];
const defaultArr2 = [1, 3, 4];

export default function MergeTwoSortedLists({ onBack }: { onBack?: () => void }) {
  const [arr1, setArr1] = useState<number[]>([1, 2, 4]);
  const [arr2, setArr2] = useState(defaultArr2);
  const [customInput1, setCustomInput1] = useState(arr1.join(','));
  const [customInput2, setCustomInput2] = useState(arr2.join(','));
  const [steps, setSteps] = useState<State[]>([]);

  useEffect(() => {
    setSteps(generateSteps(arr1, arr2));
  }, [arr1, arr2]);

  const { currentStep, setCurrentStep, isPlaying, speed, play, pause, reset, stepForward, stepBackward, setSpeed } = useAnimationController(steps.length);

  const state = steps[currentStep] || steps[0];

  const handleCustomInput = () => {
    const a1 = customInput1.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const a2 = customInput2.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (a1.length <= 6 && a2.length <= 6) {
      setArr1(a1.sort((a,b) => a-b));
      setArr2(a2.sort((a,b) => a-b));
      reset();
    } else {
      alert('Please enter up to 6 comma-separated numbers per list');
    }
  };

  const examples = [
    { 
      shortLabel: "l1=[1,2,4], l2=[1,3,4]", shortOutput: "[1,1,2,3,4,4]", 
      inputBlock: <span><code>list1 = [1,2,4]</code>, <code>list2 = [1,3,4]</code></span>, outputBlock: <code>[1,1,2,3,4,4]</code>, 
      explanation: <span>The lists are merged in sorted order.</span>, value: { arr1: [1, 2, 4], arr2: [1, 3, 4] } 
    },
    { 
      shortLabel: "l1=[], l2=[]", shortOutput: "[]", 
      inputBlock: <span><code>list1 = []</code>, <code>list2 = []</code></span>, outputBlock: <code>[]</code>, 
      value: { arr1: [], arr2: [] } 
    },
    { 
      shortLabel: "l1=[], l2=[0]", shortOutput: "[0]", 
      inputBlock: <span><code>list1 = []</code>, <code>list2 = [0]</code></span>, outputBlock: <code>[0]</code>, 
      value: { arr1: [], arr2: [0] } 
    }
  ];

  if (steps.length === 0) return null;

  return (
    <VisualizerLayout
      title="Merge Two Sorted Lists"
      problemStatement="You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list."
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
          <span className="ex-custom-label">L1:</span>
          <input type="text" className="ex-custom-input" style={{ width: 80 }} value={customInput1} onChange={(e) => setCustomInput1(e.target.value)} />
          <span className="ex-custom-label" style={{ marginLeft: 8 }}>L2:</span>
          <input type="text" className="ex-custom-input" style={{ width: 80 }} value={customInput2} onChange={(e) => setCustomInput2(e.target.value)} />
          <button className="ex-custom-run" onClick={handleCustomInput}>Run</button>
        </div>
      }
      examples={examples}
      edgeCases={[
        { arr1: [], arr2: [1] },
        { arr1: [1], arr2: [] },
        { arr1: [], arr2: [] },
        { arr1: [1, 2, 3], arr2: [4, 5, 6] },
        { arr1: [1, 1, 1], arr2: [1, 1, 1] }
      ]}
      onExampleSelect={(val) => { 
        setArr1(val[0]); setArr2(val[1]); 
        setCustomInput1(val[0].join(',')); setCustomInput2(val[1].join(',')); 
        reset(); 
      }}
      currentExample={[arr1, arr2]}
      timeComplexity="O(n + m)"
      spaceComplexity="O(1)"
      algorithmSteps={[
        { num: 1, txt: "Create a dummy node to hold the head of the new merged list." },
        { num: 2, txt: "Maintain a curr pointer to track the tail of the new list." },
        { num: 3, txt: "While both list1 and list2 are not null, compare their current values." },
        { num: 4, txt: "Attach the smaller node to curr.next, and advance that list's pointer." },
        { num: 5, txt: "Once one list is exhausted, attach the remaining nodes of the other list." }
      ]}
      whyItWorks={[
        <React.Fragment key="1">Because the input lists are already sorted, we know the smallest overall element must be at the head of either <code>list1</code> or <code>list2</code>.</React.Fragment>,
        <React.Fragment key="2">By continually picking the smaller of the two heads and moving forward, we build a new sorted list in linear time. The dummy node prevents us from having to write edge-case logic for the very first node insertion.</React.Fragment>
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
