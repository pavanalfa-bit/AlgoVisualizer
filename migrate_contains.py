import sys

with open('src/components/animations/ContainsDuplicate.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement\n} from './VisualizerLayout';",
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker\n} from './VisualizerLayout';"
)

timeline_logic = """
const EDGE_CASES = [
  "nums = [1000, 2000, 3000, 4000]",
  "nums = [-5, -5]",
  "nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]",
  "nums = [0, 0, 0]"
];

const generateTimeline = (arr: number[]) => {
  const timeline: any[] = [];
  const nums = [...arr];
  const set = new Set<number>();
  
  timeline.push({
    curr: -1, set: [], found: false,
    activeLines: [2], activeStep: 1,
    desc: "Initialize an empty Hash Set to keep track of elements we've seen.",
    logic: `<strong>Init:</strong> Set is empty.`, logicClass: 'info'
  });

  let found = false;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    
    timeline.push({
      curr: i, set: Array.from(set), found: false,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if ${num} is already in the Hash Set.`,
      logic: `Scanning <strong style="color:var(--sky)">${num}</strong>...<br/>Is it in the Set?`, logicClass: 'info'
    });

    if (set.has(num)) {
      found = true;
      timeline.push({
        curr: i, set: Array.from(set), found: true,
        activeLines: [5], activeStep: 3,
        desc: `${num} is already in the Set! We found a duplicate. Return true.`,
        logic: `<strong style="color:var(--pink)">Yes! Duplicate found.</strong><br/>Return true.`, logicClass: 'success'
      });
      break;
    } else {
      set.add(num);
      timeline.push({
        curr: i, set: Array.from(set), found: false,
        activeLines: [7], activeStep: 4,
        desc: `${num} is not in the Set. Add it to the Set and continue.`,
        logic: `No. Add <strong style="color:var(--sky)">${num}</strong> to the Set.`, logicClass: 'info'
      });
    }
  }

  if (!found) {
    timeline.push({
      curr: nums.length, set: Array.from(set), found: false,
      activeLines: [9], activeStep: 5,
      desc: `Finished scanning the array. No duplicates were found. Return false.`,
      logic: `<strong style="color:var(--easy)">Finished!</strong> No duplicates found.`, logicClass: 'success'
    });
  }

  return timeline;
};
"""

old_timeline_block = """const generateTimeline = () => {
  const timeline: any[] = [];
  const set = new Set<number>();
  
  timeline.push({
    curr: -1, set: [], found: false,
    activeLines: [2], activeStep: 1,
    desc: "Initialize an empty Hash Set to keep track of elements we've seen.",
    logic: `<strong>Init:</strong> Set is empty.`, logicClass: 'info'
  });

  let found = false;
  for (let i = 0; i < NUMS.length; i++) {
    const num = NUMS[i];
    
    timeline.push({
      curr: i, set: Array.from(set), found: false,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if ${num} is already in the Hash Set.`,
      logic: `Scanning <strong style="color:var(--sky)">${num}</strong>...<br/>Is it in the Set?`, logicClass: 'info'
    });

    if (set.has(num)) {
      found = true;
      timeline.push({
        curr: i, set: Array.from(set), found: true,
        activeLines: [5], activeStep: 3,
        desc: `${num} is already in the Set! We found a duplicate. Return true.`,
        logic: `<strong style="color:var(--pink)">Yes! Duplicate found.</strong><br/>Return true.`, logicClass: 'success'
      });
      break;
    } else {
      set.add(num);
      timeline.push({
        curr: i, set: Array.from(set), found: false,
        activeLines: [7], activeStep: 4,
        desc: `${num} is not in the Set. Add it to the Set and continue.`,
        logic: `No. Add <strong style="color:var(--sky)">${num}</strong> to the Set.`, logicClass: 'info'
      });
    }
  }

  if (!found) {
    timeline.push({
      curr: NUMS.length, set: Array.from(set), found: false,
      activeLines: [9], activeStep: 5,
      desc: `Finished scanning the array. No duplicates were found. Return false.`,
      logic: `<strong style="color:var(--easy)">Finished!</strong> No duplicates found.`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();"""

content = content.replace(old_timeline_block, timeline_logic)

new_vars = """  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([1, 2, 3, 1]);
  const [timeline, setTimeline] = useState(() => generateTimeline([1, 2, 3, 1]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      const s = new Set<number>();
      let found = false;
      for (const num of parsed) {
        if (s.has(num)) { found = true; break; }
        s.add(num);
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: found.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [1,2,3,1]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        boolean res = containsDuplicate(nums);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().containsDuplicate(nums)\n    print(res)`);
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
content = content.replace("NUMS[current.curr]", "nums[current.curr]")

with open('src/components/animations/ContainsDuplicate.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
