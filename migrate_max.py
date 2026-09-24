import sys

with open('src/components/animations/MaximumSubarray.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement\n} from './VisualizerLayout';",
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker\n} from './VisualizerLayout';"
)

timeline_logic = """
const EDGE_CASES = [
  "nums = [-2,-3,-1,-5]",
  "nums = [1,2,3,4,5]",
  "nums = [-5,2,4,-3,6,1]",
  "nums = [0,0,0,0]"
];

const generateTimeline = (arr: number[]) => {
  const timeline: any[] = [];
  const NUMS = [...arr];
  if (NUMS.length === 0) return timeline;
  let maxSum = NUMS[0];
  let curSum = 0;
  let L = 0;
  
  timeline.push({
    L: 0, R: 0, curSum: 0, maxSum: NUMS[0],
    activeLines: [3, 4], activeStep: 1,
    desc: "Initialize maxSum to the first element and curSum to 0.",
    logic: `<strong>Init:</strong> maxSum = ${NUMS[0]}, curSum = 0.`, logicClass: 'info'
  });

  for (let R = 0; R < NUMS.length; R++) {
    if (curSum < 0) {
      curSum = 0;
      L = R;
      timeline.push({
        L, R, curSum, maxSum,
        activeLines: [6, 7], activeStep: 2,
        desc: `curSum is negative. Reset curSum to 0 and move the start of the window (L) to index ${R}.`,
        logic: `curSum < 0.<br/><span style="color:var(--pink)">Negative sum prefix discarded!</span> Reset curSum = 0.`, logicClass: 'info'
      });
    }

    curSum += NUMS[R];
    const oldMax = maxSum;
    maxSum = Math.max(maxSum, curSum);
    
    timeline.push({
      L, R, curSum, maxSum,
      activeLines: [8, 9], activeStep: 3,
      desc: `Add nums[${R}] (${NUMS[R]}) to curSum. curSum = ${curSum}.`,
      logic: `curSum += nums[${R}] (${NUMS[R]}).<br/>curSum = <strong>${curSum}</strong>.<br/>${maxSum > oldMax ? '<strong style="color:var(--green)">New max found!</strong>' : ''}`, 
      logicClass: maxSum > oldMax ? 'success' : ''
    });
  }

  timeline.push({
    L: -1, R: NUMS.length, curSum, maxSum,
    activeLines: [11], activeStep: 4,
    desc: `Iterated through the entire array. The maximum subarray sum is ${maxSum}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum subarray sum is <strong>${maxSum}</strong>.`, logicClass: 'success'
  });

  return timeline;
};
"""

old_timeline_block = """const generateTimeline = () => {
  const timeline: any[] = [];
  let maxSum = NUMS[0];
  let curSum = 0;
  let L = 0;
  
  timeline.push({
    L: 0, R: 0, curSum: 0, maxSum: NUMS[0],
    activeLines: [3, 4], activeStep: 1,
    desc: "Initialize maxSum to the first element and curSum to 0.",
    logic: `<strong>Init:</strong> maxSum = ${NUMS[0]}, curSum = 0.`, logicClass: 'info'
  });

  for (let R = 0; R < NUMS.length; R++) {
    if (curSum < 0) {
      curSum = 0;
      L = R;
      timeline.push({
        L, R, curSum, maxSum,
        activeLines: [6, 7], activeStep: 2,
        desc: `curSum is negative. Reset curSum to 0 and move the start of the window (L) to index ${R}.`,
        logic: `curSum < 0.<br/><span style="color:var(--pink)">Negative sum prefix discarded!</span> Reset curSum = 0.`, logicClass: 'info'
      });
    }

    curSum += NUMS[R];
    const oldMax = maxSum;
    maxSum = Math.max(maxSum, curSum);
    
    timeline.push({
      L, R, curSum, maxSum,
      activeLines: [8, 9], activeStep: 3,
      desc: `Add nums[${R}] (${NUMS[R]}) to curSum. curSum = ${curSum}.`,
      logic: `curSum += nums[${R}] (${NUMS[R]}).<br/>curSum = <strong>${curSum}</strong>.<br/>${maxSum > oldMax ? '<strong style="color:var(--green)">New max found!</strong>' : ''}`, 
      logicClass: maxSum > oldMax ? 'success' : ''
    });
  }

  timeline.push({
    L: -1, R: NUMS.length, curSum, maxSum,
    activeLines: [11], activeStep: 4,
    desc: `Iterated through the entire array. The maximum subarray sum is ${maxSum}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum subarray sum is <strong>${maxSum}</strong>.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();"""

content = content.replace(old_timeline_block, timeline_logic)


new_vars = """  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [timeline, setTimeline] = useState(() => generateTimeline([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      let maxSum = parsed[0];
      let curSum = 0;
      for (let i = 0; i < parsed.length; i++) {
        if (curSum < 0) curSum = 0;
        curSum += parsed[i];
        maxSum = Math.max(maxSum, curSum);
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: maxSum.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [-2,1,-3,4,-1,2,1,-5,4]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int res = maxSubArray(nums);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().maxSubArray(nums)\n    print(res)`);
    }
  };"""

old_vars = """  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];"""

content = content.replace(old_vars, new_vars)

old_workspace = """        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={EXAMPLES}
          constraints={CONSTRAINTS}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
        />"""

new_workspace = """        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={examples}
          constraints={CONSTRAINTS}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const ex = examples[idx];
                const inputArr = ex.nums || JSON.parse(ex.input.replace('nums = ', ''));
                setNums(inputArr);
                setTimeline(generateTimeline(inputArr));
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
        />"""

content = content.replace(old_workspace, new_workspace)

old_problem = """        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />"""

new_problem = """        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            const ex = examples[idx];
            const inputArr = ex.nums || JSON.parse(ex.input.replace('nums = ', ''));
            setNums(inputArr);
            setTimeline(generateTimeline(inputArr));
            reset(); 
          }} 
          onCustomInput={handleCustomInput}
          onGenerateEdgeCase={async () => {
            await new Promise(r => setTimeout(r, 1000));
            return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
          }}
        />"""

content = content.replace(old_problem, new_problem)

content = content.replace("maxSteps={TIMELINE.length}", "maxSteps={timeline.length}")
content = content.replace("NUMS.map", "nums.map")
content = content.replace("NUMS.length", "nums.length")

with open('src/components/animations/MaximumSubarray.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
