import React, { useState, useEffect } from 'react';
import { LLVisualizerLayout as VisualizerLayout, type PredictionPrompt } from './LLVisualizerLayout';
import { useLLAnimationController as useAnimationController } from './useLLAnimationController';
import { GenericLinkedListCanvas, type LLNode, type LLPointer } from './GenericLinkedListCanvas';

interface State {
  nodes: LLNode[];
  pointers: LLPointer[];
  activeLinesJava: number[];
  activeLinesPy: number[];
  explanation: string;
  predictionPrompt?: PredictionPrompt;
}

const javaCode = [
  "class Solution {",
  "    public ListNode reverseList(ListNode head) {",
  "        ListNode prev = null;",
  "        ListNode curr = head;",
  "        while (curr != null) {",
  "            ListNode nextNode = curr.next;",
  "            curr.next = prev;",
  "            prev = curr;",
  "            curr = nextNode;",
  "        }",
  "        return prev;",
  "    }",
  "}"
];

const pythonCode = [
  "class Solution:",
  "    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        prev = None",
  "        curr = head",
  "        while curr:",
  "            nxt = curr.next",
  "            curr.next = prev",
  "            prev = curr",
  "            curr = nxt",
  "        return prev"
];

const BUGGY_JAVA_CODE = [
  "class Solution {",
  "    public ListNode reverseList(ListNode head) {",
  "        ListNode prev = null;",
  "        ListNode curr = head;",
  "        while (curr != null) {",
  "            // BUG: We forgot to save curr.next!",
  "            curr.next = prev;",
  "            prev = curr;",
  "            curr = curr.next; // We lost the rest of the list!",
  "        }",
  "        return prev;",
  "    }",
  "}"
];

const BUGGY_PYTHON_CODE = [
  "class Solution:",
  "    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        prev = None",
  "        curr = head",
  "        while curr:",
  "            # BUG: We forgot to save curr.next!",
  "            curr.next = prev",
  "            prev = curr",
  "            curr = curr.next # We lost the rest of the list!",
  "        return prev"
];

const DEBUG_TEST_CASES = [
  {
    input: '1 → 2 → 3 → 4 → 5',
    expected: '5 → 4 → 3 → 2 → 1',
    description: 'Standard 5-node list'
  },
  {
    input: '1 → 2',
    expected: '2 → 1',
    description: 'Two-node list'
  },
  {
    input: '42',
    expected: '42',
    description: 'Single node — returns unchanged'
  }
];

const DEBUG_HINTS = [
  {
    level: 'vague' as const,
    text: 'Look at the order of operations inside the while loop. What is the value of curr.next immediately after line 7 executes?'
  },
  {
    level: 'specific' as const,
    text: 'Line 7 (curr.next = prev) overwrites the pointer to the rest of the list. After that, curr.next no longer leads forward — it points backward to prev. So line 9 (curr = curr.next) jumps backwards, not forwards, losing the rest of the list.'
  },
  {
    level: 'near-answer' as const,
    text: 'Save the next node BEFORE overwriting curr.next. Add ListNode nextNode = curr.next; as the very first line inside the loop body, then replace curr = curr.next on line 9 with curr = nextNode.'
  }
];

function generateSteps(input: number[]): State[] {
  const steps: State[] = [];
  
  // Create initial nodes
  let nodes: LLNode[] = input.map((val, i) => ({
    id: `node-${i}`,
    val,
    x: 100 + i * 120,
    y: 150,
    next: i < input.length - 1 ? `node-${i + 1}` : null,
    color: 'var(--border)',
    bgColor: 'var(--surface)'
  }));

  // Add a "null" visual node for prev initially, and for the end
  // We don't strictly need a node for null, but if prev is null, where does the pointer go?
  // We can set pointer targetId to null, and GenericLinkedListCanvas won't draw the pointer, 
  // or we can create a dummy null node. Let's create a dummy null node for prev.
  nodes.push({ id: 'null-prev', val: 'null', x: -20, y: 150, color: 'transparent', bgColor: 'transparent' });

  const cloneNodes = (ns: LLNode[]) => ns.map(n => ({ ...n }));

  let prevId: string | null = 'null-prev';
  let currIdx = 0;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
      { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
    ],
    activeLinesJava: [3, 4],
    activeLinesPy: [3, 4],
    explanation: 'Initialize prev to null and curr to head.'
  });

  while (currIdx < input.length) {
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [5],
      activeLinesPy: [5],
      explanation: 'Check if curr is not null. It is, so we continue.'
    });

    const nextIdx = currIdx + 1;
    const nextId = nextIdx < input.length ? `node-${nextIdx}` : 'null-prev'; // reuse null node if it's the end

    let prompt: PredictionPrompt | undefined = undefined;
    if (currIdx === 0 && input.length > 1) {
      prompt = {
        id: 'pred-1',
        question: 'Predict: What will the next pointer of the current node (Node 1) point to after the upcoming line executes?',
        options: [
          { label: 'Node 2', value: 'node2' },
          { label: 'NULL', value: 'null' },
          { label: 'Node 3', value: 'node3' }
        ],
        correctValue: 'null',
        explanation: 'Since this is the first node (head), its next pointer will be reversed to point to `prev`. Since `prev` is initialized to NULL, it will point to NULL.'
      };
    } else if (currIdx === 1 && input.length > 2) {
      prompt = {
        id: 'pred-2',
        question: 'Predict: We are on Node 2. Where will its next pointer point to?',
        options: [
          { label: 'Node 3', value: 'node3' },
          { label: 'Node 1', value: 'node1' },
          { label: 'NULL', value: 'null' }
        ],
        correctValue: 'node1',
        explanation: 'The list is being reversed. Node 2\'s next pointer will break its link to Node 3 and point backwards to `prev` (which is Node 1).'
      };
    }

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'next', targetId: nextId, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [6],
      activeLinesPy: [6],
      explanation: 'Save the next node before we overwrite curr.next.',
      predictionPrompt: prompt
    });

    // Break the link and point backwards
    nodes[currIdx].next = prevId === 'null-prev' ? null : prevId;
    nodes[currIdx].color = 'var(--viz-red-bd)';
    
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'next', targetId: nextId, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [7],
      activeLinesPy: [7],
      explanation: 'Reverse the pointer: curr.next now points to prev.'
    });

    nodes[currIdx].color = 'var(--viz-blue-bd)'; // Reset color
    prevId = `node-${currIdx}`;
    
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' },
        { label: 'next', targetId: nextId, color: 'var(--viz-green-fg)' }
      ],
      activeLinesJava: [8],
      activeLinesPy: [8],
      explanation: 'Move prev forward to curr.'
    });

    currIdx = nextIdx;

    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: currIdx < input.length ? `node-${currIdx}` : 'null-prev', color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [9],
      activeLinesPy: [9],
      explanation: 'Move curr forward to next.'
    });
  }

  // Final step
  steps.push({
    nodes: cloneNodes(nodes).map(n => ({ ...n, color: n.id !== 'null-prev' ? 'var(--viz-green-bd)' : n.color, bgColor: n.id !== 'null-prev' ? 'var(--viz-green-bg)' : n.bgColor })),
    pointers: [
      { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' }
    ],
    activeLinesJava: [11],
    activeLinesPy: [10],
    explanation: 'curr is null, loop ends. prev is now the new head of the reversed list.'
  });

  return steps;
}

function generateBuggySteps(input: number[]): State[] {
  const steps: State[] = [];
  const cloneNodes = (ns: LLNode[]) => ns.map(n => ({ ...n }));
  
  let nodes: LLNode[] = input.map((val, i) => ({
    id: `node-${i}`, val, x: 100 + i * 120, y: 150, next: i < input.length - 1 ? `node-${i + 1}` : null,
    color: 'var(--border)', bgColor: 'var(--surface)'
  }));
  nodes.push({ id: 'null-prev', val: 'null', x: -20, y: 150, color: 'transparent', bgColor: 'transparent' });

  let prevId: string | null = 'null-prev';
  let currIdx = 0;

  steps.push({
    nodes: cloneNodes(nodes),
    pointers: [
      { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
      { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
    ],
    activeLinesJava: [3, 4], activeLinesPy: [3, 4],
    explanation: 'Initialize prev to null and curr to head.'
  });

  if (currIdx < input.length) {
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [5], activeLinesPy: [5],
      explanation: 'Check if curr is not null. It is, so we continue.'
    });

    // BUGGY LOGIC: curr.next = prev; prev = curr; curr = curr.next;
    nodes[currIdx].next = prevId === 'null-prev' ? null : prevId;
    nodes[currIdx].color = 'var(--viz-red-bd)';
    
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [7], activeLinesPy: [7],
      explanation: 'BUG: We reverse the pointer, BUT we forgot to save the old curr.next! The rest of the list is now completely lost.'
    });

    prevId = `node-${currIdx}`;
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: `node-${currIdx}`, color: 'var(--viz-blue-fg)' }
      ],
      activeLinesJava: [8], activeLinesPy: [8],
      explanation: 'Move prev to curr.'
    });

    // Next step is curr = curr.next. But curr.next is now prev!
    steps.push({
      nodes: cloneNodes(nodes),
      pointers: [
        { label: 'prev', targetId: prevId, color: 'var(--viz-purple-fg)' },
        { label: 'curr', targetId: nodes[currIdx].next ? prevId : 'null-prev', color: 'var(--viz-red-fg)' } // Pointer goes back to prev!
      ],
      activeLinesJava: [9], activeLinesPy: [9],
      explanation: 'CRITICAL FAILURE: We set curr = curr.next. But because we reversed it on line 7, curr now points backwards to prev! Infinite loop created.'
    });
  }

  return steps;
}

import { useSearchParams } from 'react-router-dom';

export default function ReverseLinkedList({ onBack }: { onBack?: () => void }) {
  const [input, setInput] = useState<number[]>([1, 2, 3, 4, 5]);
  const [customInput, setCustomInput] = useState(input.join(','));
  const [steps, setSteps] = useState<State[]>([]);
  
  const [searchParams] = useSearchParams();
  const isDebug = searchParams.get('mode') === 'debug';

  useEffect(() => {
    if (isDebug) {
      setSteps(generateBuggySteps(input));
    } else {
      setSteps(generateSteps(input));
    }
  }, [input, isDebug]);

  const { currentStep, setCurrentStep, isPlaying, speed, play, pause, reset, stepForward, stepBackward, setSpeed } = useAnimationController(Math.max(1, steps.length));

  const state = steps[currentStep] || steps[0];

  const handleCustomInput = () => {
    const arr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length > 0 && arr.length <= 8) {
      setInput(arr);
      reset();
    } else {
      alert('Please enter 1-8 comma-separated numbers');
    }
  };

  const examples = [
    { 
      shortLabel: "head = [1,2,3,4,5]", shortOutput: "[5,4,3,2,1]", 
      inputBlock: <code>head = [1,2,3,4,5]</code>, outputBlock: <code>[5,4,3,2,1]</code>, 
      explanation: <span>The list is reversed.</span>, value: [1, 2, 3, 4, 5] 
    },
    { 
      shortLabel: "head = [1,2]", shortOutput: "[2,1]", 
      inputBlock: <code>head = [1,2]</code>, outputBlock: <code>[2,1]</code>, 
      value: [1, 2] 
    },
    { 
      shortLabel: "head = []", shortOutput: "[]", 
      inputBlock: <code>head = []</code>, outputBlock: <code>[]</code>, 
      value: [] 
    }
  ];

  if (steps.length === 0) return null;

  return (
    <VisualizerLayout
      title="Reverse Linked List"
      problemStatement="Given the head of a singly linked list, reverse the list, and return the reversed list."
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
      predictionPrompt={state?.predictionPrompt}
      buggyJavaCode={BUGGY_JAVA_CODE}
      buggyPythonCode={BUGGY_PYTHON_CODE}
      buggyLines={isDebug ? [6, 7, 9] : undefined}
      debugTestCases={isDebug ? DEBUG_TEST_CASES : undefined}
      debugHints={isDebug ? DEBUG_HINTS : undefined}
      onBack={onBack}
      totalSteps={steps.length}
      customInput={
        <div className="ex-custom-row">
          <span className="ex-custom-label">Nodes:</span>
          <input 
            type="text" 
            className="ex-custom-input" 
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="1,2,3"
          />
          <button className="ex-custom-run" onClick={handleCustomInput}>Run</button>
        </div>
      }
      examples={examples}
      edgeCases={[
        [1],
        [],
        [1, 1, 1],
        [1, 2],
        [5, 4, 3, 2, 1]
      ]}
      onExampleSelect={(val) => { setInput(val); setCustomInput(val.join(',')); reset(); }}
      currentExample={input}
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      algorithmSteps={[
        { num: 1, txt: "Initialize three pointers: prev as NULL, curr as head, and next as NULL." },
        { num: 2, txt: "Iterate through the linked list. In loop, do following." },
        { num: 3, txt: "Store next node (next = curr.next)." },
        { num: 4, txt: "Change next of current (curr.next = prev)." },
        { num: 5, txt: "Move prev and curr one step forward (prev = curr, curr = next)." }
      ]}
      whyItWorks={[
        <React.Fragment key="1">Reversing a linked list in place requires changing the <code>next</code> pointers of each node to point to the previous node instead of the next one.</React.Fragment>,
        <React.Fragment key="2">We use three pointers to keep track of the current node, the previous node we just processed, and the next node we need to process (so we don't lose the rest of the list when we change <code>curr.next</code>). This allows us to do it in a single pass without extra memory.</React.Fragment>
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
