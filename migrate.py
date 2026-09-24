import sys

with open('src/components/animations/TwoSumII.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement\n} from './VisualizerLayout';",
    "  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker\n} from './VisualizerLayout';"
)

timeline_logic = """
const EDGE_CASES = [
  "numbers = [1,2,3,4,4,9,56,90], target = 8",
  "numbers = [-5,-3,0,2,4,6,8], target = 5",
  "numbers = [5,25,75], target = 100",
  "numbers = [0,0,3,4], target = 0"
];

const generateTimeline = (numbers: number[], target: number) => {
  const steps: any[] = [];
  const nums = [...numbers];
  let l = 0, r = nums.length - 1;
  
  steps.push({
    nums: [...nums], target, l, r, res: null,
    desc: "Initialize left pointer `l` at the start, right pointer `r` at the end.",
    activeLines: [2, 3],
    logic: '<strong>Init:</strong> Set `l = 0` (smallest) and `r = ' + r + '` (largest).', logicClass: 'info', activeStep: 1
  });

  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) {
      steps.push({
        nums: [...nums], target, l, r, res: [l + 1, r + 1],
        desc: "Sum = " + nums[l] + " + " + nums[r] + " = " + sum + ". " + sum + " == target (" + target + "). We found our pair!",
        activeLines: [5, 6, 7],
        logic: 'Sum = <strong style="color:var(--pink)">' + nums[l] + '</strong> + <strong style="color:var(--sky)">' + nums[r] + '</strong> = ' + sum + '.<br/>' + sum + ' == ' + target + ', we found our pair!', logicClass: 'success', activeStep: 3
      });
      break;
    } else if (sum < target) {
      steps.push({
        nums: [...nums], target, l, r, res: null,
        desc: "Sum = " + nums[l] + " + " + nums[r] + " = " + sum + ". " + sum + " < target (" + target + "). Move `l` right to increase sum.",
        activeLines: [5, 8, 9],
        logic: 'Sum = <strong style="color:var(--pink)">' + nums[l] + '</strong> + <strong style="color:var(--sky)">' + nums[r] + '</strong> = ' + sum + '.<br/>' + sum + ' < ' + target + ', so move `l` right to increase sum.', logicClass: 'info', activeStep: 2
      });
      l++;
    } else {
      steps.push({
        nums: [...nums], target, l, r, res: null,
        desc: "Sum = " + nums[l] + " + " + nums[r] + " = " + sum + ". " + sum + " > target (" + target + "). Move `r` left to decrease sum.",
        activeLines: [5, 10, 11],
        logic: 'Sum = <strong style="color:var(--pink)">' + nums[l] + '</strong> + <strong style="color:var(--sky)">' + nums[r] + '</strong> = ' + sum + '.<br/>' + sum + ' > ' + target + ', so move `r` left to decrease sum.', logicClass: 'info', activeStep: 2
      });
      r--;
    }
  }

  return steps;
};
"""

content = content.replace("export default function TwoSumII", timeline_logic + "\nexport default function TwoSumII")


old_timeline_block = """  const timeline = [
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 3, res: null,
      desc: "Initialize left pointer `l` at the start, right pointer `r` at the end.",
      activeLines: [2, 3],
      logic: '<strong>Init:</strong> Set `l = 0` (smallest) and `r = 3` (largest).', logicClass: 'info', activeStep: 1
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 3, res: null,
      desc: "Sum = 2 + 15 = 17. 17 > target (9). Since the array is sorted, to get a smaller sum we must move the right pointer left.",
      activeLines: [5, 9, 10],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">15</strong> = 17.<br/>17 > 9, so move `r` left to decrease sum.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 2, res: null,
      desc: "Sum = 2 + 11 = 13. 13 > target (9). Still too large, move `r` left again.",
      activeLines: [5, 9, 10],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">11</strong> = 13.<br/>13 > 9, so move `r` left to decrease sum.', logicClass: 'info', activeStep: 2
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 1, res: null,
      desc: "Sum = 2 + 7 = 9. 9 == target (9). We found our pair!",
      activeLines: [5, 6],
      logic: 'Sum = <strong style="color:var(--pink)">2</strong> + <strong style="color:var(--sky)">7</strong> = 9.<br/>9 == 9, we found our pair!', logicClass: 'success', activeStep: 3
    },
    {
      nums: [2, 7, 11, 15], target: 9, l: 0, r: 1, res: [1, 2],
      desc: "Return the 1-based indices: [l + 1, r + 1] -> [1, 2].",
      activeLines: [7],
      logic: '<strong style="color:var(--green)">Success!</strong> Return 1-based indices [1, 2].', logicClass: 'success', activeStep: 3
    }
  ];

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(timeline.length);
  const current = timeline[step];"""


new_timeline_block = """  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [timeline, setTimeline] = useState(() => generateTimeline([2, 7, 11, 15], 9));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('numbers = ')) clean = val.substring(10);
      
      const parts = clean.split('], target = ');
      if (parts.length !== 2) throw new Error();
      
      const parsedArr = JSON.parse(parts[0] + ']');
      const parsedTarget = parseInt(parts[1].trim(), 10);
      
      if (!Array.isArray(parsedArr) || parsedArr.length < 2 || isNaN(parsedTarget)) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}numbers = [${parsedArr.join(',')}], target = ${parsedTarget}`;
      
      let l = 0, r = parsedArr.length - 1;
      let res = [-1, -1];
      while (l < r) {
        let sum = parsedArr[l] + parsedArr[r];
        if (sum === parsedTarget) {
          res = [l + 1, r + 1];
          break;
        } else if (sum < parsedTarget) {
          l++;
        } else {
          r--;
        }
      }

      const newEx = {
        label: formattedLabel,
        nums: parsedArr,
        target: parsedTarget,
        input: formattedLabel,
        output: `[${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setNums(parsedArr);
      setTarget(parsedTarget);
      setTimeline(generateTimeline(parsedArr, parsedTarget));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: numbers = [2,7,11,15], target = 9");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('numbers = ')) clean = clean.substring(10);
    const parts = clean.split('], target = ');
    const arrStr = parts[0] + ']';
    const targetStr = parts[1];
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] numbers = new int[]{${arrStr.replace(/[\[\]]/g, '')}};\n        int target = ${targetStr};\n        int[] res = twoSum(numbers, target);\n        System.out.println(java.util.Arrays.toString(res));\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    numbers = ${arrStr}\n    target = ${targetStr}\n    res = Solution().twoSum(numbers, target)\n    print(res)`);
    }
  };"""

content = content.replace(old_timeline_block, new_timeline_block)

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
                let arr = ex.nums, t = ex.target;
                if (!arr) {
                  const parts = ex.input.replace('numbers = ', '').split('], target = ');
                  arr = JSON.parse(parts[0] + ']');
                  t = parseInt(parts[1], 10);
                }
                setNums(arr);
                setTarget(t);
                setTimeline(generateTimeline(arr, t));
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
            let arr = ex.nums, t = ex.target;
            if (!arr) {
              const parts = ex.input.replace('numbers = ', '').split('], target = ');
              arr = JSON.parse(parts[0] + ']');
              t = parseInt(parts[1], 10);
            }
            setNums(arr);
            setTarget(t);
            setTimeline(generateTimeline(arr, t));
            reset(); 
          }} 
          onCustomInput={handleCustomInput}
          onGenerateEdgeCase={async () => {
            await new Promise(r => setTimeout(r, 1000));
            return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
          }}
        />"""

content = content.replace(old_problem, new_problem)

with open('src/components/animations/TwoSumII.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
