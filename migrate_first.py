import sys

with open('src/components/animations/FirstMissingPositive.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement\n} from './VisualizerLayout';",
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker\n} from './VisualizerLayout';"
)

timeline_logic = """
const EDGE_CASES = [
  "nums = [1,2,3,4,5]",
  "nums = [7,8,9,11,12]",
  "nums = [3,4,-1,1]",
  "nums = [1,1,1]"
];

const generateTimeline = (nums: number[]) => {
  const timeline: any[] = [];
  const arr = [...nums];
  const n = arr.length;
  
  timeline.push({
    arr: [...arr], i: 0, scanI: -1, foundResult: -1,
    activeLines: [2], activeStep: 1,
    desc: "Start iterating through the array to place each number in its 'correct' index (i.e., number X should be at index X-1).",
    logic: `<strong>Phase 1: Cyclic Sort</strong><br/>Target: value <strong style="color:var(--sky)">X</strong> should be at index <strong style="color:var(--sky)">X-1</strong>.`, logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i, scanI: -1, foundResult: -1,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if nums[${i}] (${arr[i]}) can be placed at its correct index (${arr[i] - 1}).`,
      logic: `Checking value <strong style="color:var(--sky)">${arr[i]}</strong> at index ${i}.`, logicClass: 'info'
    });

    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
      const val = arr[i];
      const targetIdx = val - 1;
      
      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapReady: true,
        activeLines: [4, 5], activeStep: 3,
        desc: `${val} belongs at index ${targetIdx}. It's currently at index ${i}. We need to swap them!`,
        logic: `Value <strong style="color:var(--sky)">${val}</strong> belongs at index <strong style="color:var(--pink)">${targetIdx}</strong>.<br/>Swapping ${arr[i]} and ${arr[targetIdx]}...`, logicClass: 'warning'
      });

      // Swap
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;

      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapped: true,
        activeLines: [6, 7], activeStep: 4,
        desc: `Swapped! Now index ${targetIdx} has the correct value ${val}. We check the new value at index ${i} (${arr[i]}).`,
        logic: `Successfully placed <strong style="color:var(--sky)">${val}</strong> at index ${targetIdx}.<br/>Checking new value at index ${i}...`, logicClass: 'success'
      });
    }

    if (arr[i] <= 0 || arr[i] > n || arr[arr[i] - 1] === arr[i]) {
      timeline.push({
        arr: [...arr], i, scanI: -1, foundResult: -1,
        activeLines: [4], activeStep: 2,
        desc: `Value ${arr[i]} at index ${i} is either out of bounds (<= 0 or > ${n}) or already in its correct place. Move to next index.`,
        logic: `Value <strong style="color:var(--sky)">${arr[i]}</strong> is ignored or already correct.<br/>Moving on.`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    arr: [...arr], i: n, scanI: 0, foundResult: -1,
    activeLines: [10], activeStep: 5,
    desc: "Phase 1 complete! The array now acts as a Hash Table. Phase 2: Scan to find the first missing positive.",
    logic: `<strong>Phase 2: Scanning</strong><br/>Find the first index 'i' where nums[i] != i+1.`, logicClass: 'info'
  });

  let result = n + 1;
  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i: n, scanI: i, foundResult: -1,
      activeLines: [11], activeStep: 6,
      desc: `Check if index ${i} holds the value ${i + 1}.`,
      logic: `Is nums[${i}] == ${i + 1}?<br/>${arr[i] === i + 1 ? 'Yes.' : `<strong style="color:var(--pink)">No! (${arr[i]} != ${i + 1})</strong>`}`, logicClass: arr[i] === i + 1 ? 'info' : 'warning'
    });

    if (arr[i] !== i + 1) {
      result = i + 1;
      timeline.push({
        arr: [...arr], i: n, scanI: i, foundResult: result,
        activeLines: [12], activeStep: 7,
        desc: `Index ${i} does NOT hold the value ${i + 1}. Therefore, ${i + 1} is the first missing positive!`,
        logic: `<strong style="color:var(--green)">Success!</strong> First missing positive is <strong>${result}</strong>.`, logicClass: 'success'
      });
      break;
    }
  }

  if (result === n + 1) {
    timeline.push({
      arr: [...arr], i: n, scanI: n, foundResult: result,
      activeLines: [14], activeStep: 8,
      desc: `All values from 1 to ${n} are present. The first missing positive is ${n + 1}.`,
      logic: `<strong style="color:var(--green)">Success!</strong> All present. Next missing is <strong>${result}</strong>.`, logicClass: 'success'
    });
  }

  return timeline;
};
"""

old_timeline_block = """const generateTimeline = () => {
  const timeline: any[] = [];
  const arr = [...NUMS];
  const n = arr.length;
  
  timeline.push({
    arr: [...arr], i: 0, scanI: -1, foundResult: -1,
    activeLines: [2], activeStep: 1,
    desc: "Start iterating through the array to place each number in its 'correct' index (i.e., number X should be at index X-1).",
    logic: `<strong>Phase 1: Cyclic Sort</strong><br/>Target: value <strong style="color:var(--sky)">X</strong> should be at index <strong style="color:var(--sky)">X-1</strong>.`, logicClass: 'info'
  });

  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i, scanI: -1, foundResult: -1,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if nums[${i}] (${arr[i]}) can be placed at its correct index (${arr[i] - 1}).`,
      logic: `Checking value <strong style="color:var(--sky)">${arr[i]}</strong> at index ${i}.`, logicClass: 'info'
    });

    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
      const val = arr[i];
      const targetIdx = val - 1;
      
      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapReady: true,
        activeLines: [4, 5], activeStep: 3,
        desc: `${val} belongs at index ${targetIdx}. It's currently at index ${i}. We need to swap them!`,
        logic: `Value <strong style="color:var(--sky)">${val}</strong> belongs at index <strong style="color:var(--pink)">${targetIdx}</strong>.<br/>Swapping ${arr[i]} and ${arr[targetIdx]}...`, logicClass: 'warning'
      });

      // Swap
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;

      timeline.push({
        arr: [...arr], i, targetIdx, scanI: -1, foundResult: -1, swapped: true,
        activeLines: [6, 7], activeStep: 4,
        desc: `Swapped! Now index ${targetIdx} has the correct value ${val}. We check the new value at index ${i} (${arr[i]}).`,
        logic: `Successfully placed <strong style="color:var(--sky)">${val}</strong> at index ${targetIdx}.<br/>Checking new value at index ${i}...`, logicClass: 'success'
      });
    }

    if (arr[i] <= 0 || arr[i] > n || arr[arr[i] - 1] === arr[i]) {
      timeline.push({
        arr: [...arr], i, scanI: -1, foundResult: -1,
        activeLines: [4], activeStep: 2,
        desc: `Value ${arr[i]} at index ${i} is either out of bounds (<= 0 or > ${n}) or already in its correct place. Move to next index.`,
        logic: `Value <strong style="color:var(--sky)">${arr[i]}</strong> is ignored or already correct.<br/>Moving on.`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    arr: [...arr], i: n, scanI: 0, foundResult: -1,
    activeLines: [10], activeStep: 5,
    desc: "Phase 1 complete! The array now acts as a Hash Table. Phase 2: Scan to find the first missing positive.",
    logic: `<strong>Phase 2: Scanning</strong><br/>Find the first index 'i' where nums[i] != i+1.`, logicClass: 'info'
  });

  let result = n + 1;
  for (let i = 0; i < n; i++) {
    timeline.push({
      arr: [...arr], i: n, scanI: i, foundResult: -1,
      activeLines: [11], activeStep: 6,
      desc: `Check if index ${i} holds the value ${i + 1}.`,
      logic: `Is nums[${i}] == ${i + 1}?<br/>${arr[i] === i + 1 ? 'Yes.' : `<strong style="color:var(--pink)">No! (${arr[i]} != ${i + 1})</strong>`}`, logicClass: arr[i] === i + 1 ? 'info' : 'warning'
    });

    if (arr[i] !== i + 1) {
      result = i + 1;
      timeline.push({
        arr: [...arr], i: n, scanI: i, foundResult: result,
        activeLines: [12], activeStep: 7,
        desc: `Index ${i} does NOT hold the value ${i + 1}. Therefore, ${i + 1} is the first missing positive!`,
        logic: `<strong style="color:var(--green)">Success!</strong> First missing positive is <strong>${result}</strong>.`, logicClass: 'success'
      });
      break;
    }
  }

  if (result === n + 1) {
    timeline.push({
      arr: [...arr], i: n, scanI: n, foundResult: result,
      activeLines: [14], activeStep: 8,
      desc: `All values from 1 to ${n} are present. The first missing positive is ${n + 1}.`,
      logic: `<strong style="color:var(--green)">Success!</strong> All present. Next missing is <strong>${result}</strong>.`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();"""

content = content.replace(old_timeline_block, timeline_logic)

new_vars = """  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([3, 4, -1, 1]);
  const [timeline, setTimeline] = useState(() => generateTimeline([3, 4, -1, 1]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('nums = ')) clean = val.substring(7);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}nums = [${parsed.join(',')}]`;
      
      const arr = [...parsed];
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
          const target = arr[i] - 1;
          const temp = arr[i];
          arr[i] = arr[target];
          arr[target] = temp;
        }
      }
      let res = n + 1;
      for (let i = 0; i < n; i++) {
        if (arr[i] !== i + 1) {
          res = i + 1;
          break;
        }
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: res.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: nums = [3,4,-1,1]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('nums = ')) clean = clean.substring(7);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] nums = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int res = firstMissingPositive(nums);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    nums = ${clean}\n    res = Solution().firstMissingPositive(nums)\n    print(res)`);
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
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('nums = ')) pr = pr.substring(7);
                const inputArr = examples[idx].nums || JSON.parse(pr);
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
content = content.replace("current.i < NUMS.length", "current.i < nums.length")
content = content.replace("step === TIMELINE.length - 1", "step === timeline.length - 1")

with open('src/components/animations/FirstMissingPositive.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
