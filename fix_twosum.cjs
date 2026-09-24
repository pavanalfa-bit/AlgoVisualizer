const fs = require('fs');

let content = fs.readFileSync('src/components/animations/TwoSumII.tsx', 'utf8');

content = content.replace(
  `AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement\n} from './VisualizerLayout';`,
  `AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker\n} from './VisualizerLayout';`
);

const timeline_logic = `
const EDGE_CASES = [
  "numbers = [1,2,3,4,4,9,56,90], target = 8",
  "numbers = [-5,-3,0,2,4,6,8], target = 5",
  "numbers = [5,25,75], target = 100",
  "numbers = [0,0,3,4], target = 0"
];

const generateTimeline = (numbers, target) => {
  const steps = [];
  const nums = [...numbers];
  let l = 0, r = nums.length - 1;
  
  steps.push({
    nums: [...nums], target, l, r, res: null,
    desc: "Initialize left pointer \`l\` at the start, right pointer \`r\` at the end.",
    activeLines: [2, 3],
    logic: '<strong>Init:</strong> Set \`l = 0\` (smallest) and \`r = ' + r + '\` (largest).', logicClass: 'info', activeStep: 1
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
        desc: "Sum = " + nums[l] + " + " + nums[r] + " = " + sum + ". " + sum + " < target (" + target + "). Move \`l\` right to increase sum.",
        activeLines: [5, 8, 9],
        logic: 'Sum = <strong style="color:var(--pink)">' + nums[l] + '</strong> + <strong style="color:var(--sky)">' + nums[r] + '</strong> = ' + sum + '.<br/>' + sum + ' < ' + target + ', so move \`l\` right to increase sum.', logicClass: 'info', activeStep: 2
      });
      l++;
    } else {
      steps.push({
        nums: [...nums], target, l, r, res: null,
        desc: "Sum = " + nums[l] + " + " + nums[r] + " = " + sum + ". " + sum + " > target (" + target + "). Move \`r\` left to decrease sum.",
        activeLines: [5, 10, 11],
        logic: 'Sum = <strong style="color:var(--pink)">' + nums[l] + '</strong> + <strong style="color:var(--sky)">' + nums[r] + '</strong> = ' + sum + '.<br/>' + sum + ' > ' + target + ', so move \`r\` left to decrease sum.', logicClass: 'info', activeStep: 2
      });
      r--;
    }
  }

  return steps;
};
`;

content = content.replace('export default function TwoSumII', timeline_logic + '\nexport default function TwoSumII');

const new_timeline_block = `
  const [examples, setExamples] = useState(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [nums, setNums] = useState([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [timeline, setTimeline] = useState(() => generateTimeline([2, 7, 11, 15], 9));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val, isEdgeCase) => {
    try {
      let clean = val;
      if (val.startsWith('numbers = ')) clean = val.substring(10);
      
      const parts = clean.split('], target = ');
      if (parts.length !== 2) throw new Error();
      
      const parsedArr = JSON.parse(parts[0] + ']');
      const parsedTarget = parseInt(parts[1].trim(), 10);
      
      if (!Array.isArray(parsedArr) || parsedArr.length < 2 || isNaN(parsedTarget)) throw new Error();

      const formattedLabel = \`\${isEdgeCase ? '✨ ' : ''}numbers = [\${parsedArr.join(',')}], target = \${parsedTarget}\`;
      
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
        output: \`[\${res.join(',')}]\`,
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

  const injectCode = (code, lang, exampleStr) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('numbers = ')) clean = clean.substring(10);
    const parts = clean.split('], target = ');
    const arrStr = parts[0] + ']';
    const targetStr = parts[1];
    
    if (lang === 'java') {
      return code.replace(/public\\s+static\\s+void\\s+main\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\}/, 
        \`public static void main(String[] args) {\\n        int[] numbers = new int[]{\${arrStr.replace(/[\\[\\]]/g, '')}};\\n        int target = \${targetStr};\\n        int[] res = twoSum(numbers, target);\\n        System.out.println(java.util.Arrays.toString(res));\\n    }\`);
    } else {
      return code.replace(/if\\s+__name__\\s*==\\s*['"]__main__['"]\\s*:[\\s\\S]*/, 
        \`if __name__ == "__main__":\\n    numbers = \${arrStr}\\n    target = \${targetStr}\\n    res = Solution().twoSum(numbers, target)\\n    print(res)\`);
    }
  };
`;

const old_timeline_block_re = /const timeline = \[\s*\{[\s\S]*?\n  \];\n\n  const \{ step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle \} = useAnimationController\(timeline\.length\);\n  const current = timeline\[step\];/;

content = content.replace(old_timeline_block_re, new_timeline_block);

const old_workspace_re = /<PracticeWorkspace\s*problemStatement=\{PROBLEM_STATEMENT\}\s*examples=\{EXAMPLES\}\s*constraints=\{CONSTRAINTS\}\s*defaultCodeJava=\{DEFAULT_JAVA\}\s*defaultCodePython=\{DEFAULT_PYTHON\}\s*\/>/g;

const new_workspace = \`<PracticeWorkspace 
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
        />\`;

content = content.replace(old_workspace_re, new_workspace);

content = content.replace(
  '<ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />',
  \`<ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
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
        />\`
);

fs.writeFileSync('src/components/animations/TwoSumII.tsx', content);
