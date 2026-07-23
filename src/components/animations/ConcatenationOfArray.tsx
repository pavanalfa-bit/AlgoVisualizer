import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'nums = [1,2,1]', input: 'nums = [1,2,1]', nums: [1,2,1], output: '[1,2,1,1,2,1]', explanation: <></> },
  { label: 'nums = [1,3,2,1]', input: 'nums = [1,3,2,1]', nums: [1,3,2,1], output: '[1,3,2,1,1,3,2,1]', explanation: <></> },
  { label: 'nums = [1,2,3,4,5]', input: 'nums = [1,2,3,4,5]', nums: [1,2,3,4,5], output: '[1,2,3,4,5,1,2,3,4,5]', explanation: <></> },
];

const EDGE_CASES = [
  "nums = [1000]",
  "nums = [0, 0, 0, 0]",
  "nums = [9, 8, 7, 6, 5, 4, 3, 2, 1]",
  "nums = [-1, -2, -3]"
];

const CODE_JAVA = [
  `public int[] getConcatenation(int[] nums) {`,
  `    int n = nums.length;`,
  `    int[] ans = new int[2 * n];`,
  `    for (int i = 0; i < n; i++) {`,
  `        ans[i]     = nums[i];`,
  `        ans[i + n] = nums[i];`,
  `    }`,
  `    return ans;`,
  `}`
];

const CODE_PY = [
  `def getConcatenation(self, nums):`,
  `    n = len(nums)`,
  `    ans = [0] * (2 * n)`,
  `    for i in range(n):`,
  `        ans[i] = nums[i]`,
  `        ans[i + n] = nums[i]`,
  `    return ans`
];

export function ConcatenationOfArray({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState(EXAMPLES[0].nums);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      const res = [...parsed, ...parsed];
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        nums: parsed,
        output: `[${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [1,2,3]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int[] res = getConcatenation(nums);\n        System.out.println(java.util.Arrays.toString(res));\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().getConcatenation(nums)\n    print(res)`);
    }
  };

  const n = nums.length;
  const ansSize = 2 * n;

  // Pre-compute steps
  const steps: any[] = [];
  const ans = new Array(ansSize).fill(null);

  steps.push({
    showApproach: true,
    title: `nums=[${nums}]  n=${n}  — create ans[${ansSize}]`,
    desc: `nums = [${nums.join(', ')}]  (n=${n})\nCreate result array of size 2*n = ${ansSize}\nFor each i: ans[i] = nums[i]  AND  ans[i+n] = nums[i]`,
    codeJava: [2, 3], codePy: [2, 3], algoStep: 1,
    ansArr: [...ans],
    state: { i: '—', v: '—', ai: '—', ain: '—' },
    logic: `<strong style="color:var(--cyan)">Init:</strong> nums has ${n} elements. We create ans of size 2×${n} = ${ansSize}.<br/>Every slot starts empty. We'll fill two positions per iteration.`,
    logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    ans[i] = nums[i];
    ans[i + n] = nums[i];
    steps.push({
      showApproach: false,
      title: `i=${i}: ans[${i}]=${nums[i]}  ans[${i+n}]=${nums[i]}`,
      desc: `i = ${i}   nums[${i}] = ${nums[i]}\nans[${i}] = ${nums[i]}  ← first copy\nans[${i+n}] = ${nums[i]}  ← second copy`,
      codeJava: [4, 5, 6], codePy: [4, 5, 6], algoStep: i === 0 ? 2 : 3,
      currI: i,
      ansArr: [...ans],
      state: { i, v: nums[i], ai: nums[i], ain: nums[i] },
      logic: `nums[<code>${i}</code>] = <strong style="color:var(--cyan)">${nums[i]}</strong><br/>→ Write to ans[${i}] (first half) and ans[${i+n}] (second half).<br/>${i === n - 1 ? '<strong style="color:var(--green)">Last element — done!</strong>' : ''}`,
      logicClass: i === n - 1 ? 'success' : ''
    });
  }

  steps.push({
    showApproach: false,
    title: `Done! ans = [${ans.join(', ')}]`,
    desc: `All ${n} elements copied to both halves.`,
    codeJava: [8], codePy: [7], algoStep: 4,
    currI: -1,
    ansArr: [...ans],
    state: { i: '✓', v: '✓', ai: '✓', ain: '✓' },
    logic: `<strong style="color:var(--green)">Complete!</strong> All elements copied twice. ans = [${ans.join(', ')}]`,
    logicClass: 'success',
    finalRes: `[${ans.join(', ')}]`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>Given an integer array <code>nums</code> of length <code>n</code>, create an array <code>ans</code> of length <code>2n</code> where <code>ans[i] == nums[i]</code> and <code>ans[i+n] == nums[i]</code> for all <code>0 ≤ i &lt; n</code>. Return <code>ans</code>.</>,
    examples: [
      { label: 'Example 1', input: 'nums = [1,2,1]', output: '[1,2,1,1,2,1]', explanation: 'ans = nums + nums.' },
      { label: 'Example 2', input: 'nums = [1,3,2,1]', output: '[1,3,2,1,1,3,2,1]', explanation: 'ans = nums + nums.' }
    ],
    constraints: <>1 ≤ n ≤ 1000 &nbsp;|&nbsp; 1 ≤ nums[i] ≤ 1000</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Concatenation of Array" 
        lcNum="1929" 
        difficulty="Easy" 
        tag="Array Basics" 
        onBack={onBack} 
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {tab === 'visualizer' ? (
        <>
          <ProblemStatement {...problemProps} examples={examples} />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { 
              setActiveEx(idx); 
              let pr = examples[idx].input;
              if (pr.startsWith('✨ ')) pr = pr.substring(3);
              if (pr.startsWith('nums = ')) pr = pr.substring(7);
              const inputArr = examples[idx].nums || JSON.parse(pr);
              setNums(inputArr); 
              reset(); 
            }} 
            onCustomInput={handleCustomInput}
            onGenerateEdgeCase={async () => {
              await new Promise(r => setTimeout(r, 1000));
              return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
            }}
          />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                {cs.showApproach && <ApproachBanner icon={<Copy size={20} />} title="Approach" lines={['Index Mapping — Copy Each Element Twice', 'Create ans[2n]. For each index i: set ans[i] = nums[i] and ans[i+n] = nums[i].']} />}
                
                <div className="card">
                  <div className="card-title">Array Visualization</div>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Input: nums[]</div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                    {nums.map((num: number, idx: number) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <motion.div 
                          layout
                          style={{
                            width: 48, height: 48, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid', borderRadius: '8px',
                            fontWeight: 'bold', fontSize: '1.1rem',
                            background: cs.currI === idx ? 'var(--viz-sky-bg)' : 'var(--surface)',
                            borderColor: cs.currI === idx ? 'var(--viz-sky-bd)' : 'var(--border)',
                            color: cs.currI === idx ? 'var(--viz-sky-fg)' : 'var(--text)'
                          }}
                        >
                          {num}
                        </motion.div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Result: ans[] (size 2n)</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {cs.ansArr.map((val: number | null, idx: number) => {
                      const isHighlighted = cs.currI !== undefined && cs.currI !== -1 && (idx === cs.currI || idx === cs.currI + n);
                      const isFilled = val !== null;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
                          <motion.div 
                            layout
                            style={{
                              width: 48, height: 48, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid', borderRadius: '8px',
                              fontWeight: 'bold', fontSize: '1.1rem',
                              background: isHighlighted ? 'var(--viz-sky-bg)' : (isFilled ? 'var(--viz-green-bg)' : 'var(--surface2)'),
                              borderColor: isHighlighted ? 'var(--viz-sky-bd)' : (isFilled ? 'var(--viz-green-bd)' : 'var(--border)'),
                              color: isHighlighted ? 'var(--viz-sky-fg)' : (isFilled ? 'var(--viz-green-fg)' : 'var(--muted)')
                            }}
                          >
                            {val !== null ? val : '_'}
                          </motion.div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Index i', value: cs.state.i },
                  { label: 'nums[i]', value: cs.state.v },
                  { label: 'ans[i]', value: cs.state.ai },
                  { label: 'ans[i+n]', value: cs.state.ain }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Result" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Concatenation of Array" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Get n = nums.length; create <code>ans[2*n]</code></> },
                    { num: 2, txt: <>For each i: copy <code>nums[i]</code> → <code>ans[i]</code> (first half)</> },
                    { num: 3, txt: <>Also copy <code>nums[i]</code> → <code>ans[i+n]</code> (second half)</> },
                    { num: 4, txt: <>Return ans — the concatenated array</> }
                  ]} 
                />
                <Complexity time="O(n)" space="O(n)" />
                <WhyItWorks paragraphs={[
                  'The result is simply nums repeated twice. We write each element to its original position i and also to position i+n (offset by the array length).',
                  'This can be done in a single pass without extra logic.'
                ]} />
              </>
            }
          />
        </>
      ) : (
        <PracticeWorkspace 
          problemStatement={problemProps.statement}
          examples={examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`import java.util.Arrays;\n\nclass Main {\n    public static int[] getConcatenation(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 1};\n        System.out.println("Input: " + Arrays.toString(nums));\n        System.out.println("Output: " + Arrays.toString(getConcatenation(nums)));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def getConcatenation(self, nums):\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    nums = [1, 2, 1]\n    print(f"Input: {nums}")\n    print(f"Output: {Solution().getConcatenation(nums)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('nums = ')) pr = pr.substring(7);
                const inputArr = examples[idx].nums || JSON.parse(pr);
                setNums(inputArr); 
                reset(); 
              }} 
              onCustomInput={handleCustomInput}
              onGenerateEdgeCase={async () => {
                await new Promise(r => setTimeout(r, 1000));
                return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
              }}
            />
          }
          activeExampleStr={examples[activeEx].label}
          codeInjector={injectCode}
        />
      )}
    </VisualizerLayout>
  );
}
