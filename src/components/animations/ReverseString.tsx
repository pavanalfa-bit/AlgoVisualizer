import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>
    <p>You must do this by modifying the input array <strong>in-place</strong> with <code>O(1)</code> extra memory.</p>
  </>
);

const INITIAL_EXAMPLES = [
  { 
    label: 's = ["h","e","l","l","o"]', 
    s: ["h","e","l","l","o"],
    input: 's = ["h","e","l","l","o"]', 
    output: '["o","l","l","e","h"]'
  },
  { 
    label: 's = ["H","a","n","n","a","h"]', 
    s: ["H","a","n","n","a","h"],
    input: 's = ["H","a","n","n","a","h"]', 
    output: '["h","a","n","n","a","H"]'
  }
];

const EDGE_CASES = [
  's = ["a", "a", "a", "a"]',
  's = ["r", "a", "c", "e", "c", "a", "r"]',
  's = ["A", " ", "m", "a", "n"]'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 10⁵</code></div>
    <div><code>s[i]</code> is a printable ascii character.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static void reverseString(char[] s) {\n        // Write your code here\n        \n    }\n\n    public static void main(String[] args) {\n        char[] s = new char[]{'h', 'e', 'l', 'l', 'o'};\n        reverseString(s);\n        System.out.println(java.util.Arrays.toString(s));\n    }\n}`;
const DEFAULT_PYTHON = `class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        """\n        Do not return anything, modify s in-place instead.\n        """\n        pass\n\nif __name__ == "__main__":\n    s = ["h", "e", "l", "l", "o"]\n    Solution().reverseString(s)\n    print(s)`;

const generateTimeline = (chars: string[]) => {
  const timeline: any[] = [];
  const arr = [...chars];
  
  timeline.push({
    arr: [...arr], l: 0, r: arr.length - 1, isDone: false, isSwapping: false,
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize a left pointer at the beginning (0) and a right pointer at the end (len - 1).",
    logic: `<strong>Init:</strong> L = 0, R = ${arr.length - 1}`, logicClass: 'info'
  });

  let l = 0;
  let r = arr.length - 1;

  while (l < r) {
    timeline.push({
      arr: [...arr], l, r, isDone: false, isSwapping: false,
      activeLines: [4], activeStep: 2,
      desc: `Check loop condition: L (${l}) < R (${r}). We need to swap these characters.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>. Proceed to swap.`, logicClass: 'info'
    });

    timeline.push({
      arr: [...arr], l, r, isDone: false, isSwapping: true,
      activeLines: [5, 6, 7], activeStep: 3,
      desc: `Swap the character at index ${l} ('${arr[l]}') with the character at index ${r} ('${arr[r]}').`,
      logic: `Swapping <strong style="color:var(--accent)">'${arr[l]}'</strong> and <strong style="color:var(--accent)">'${arr[r]}'</strong>.`, logicClass: 'warning'
    });

    const temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;

    timeline.push({
      arr: [...arr], l, r, isDone: false, isSwapping: false,
      activeLines: [8, 9], activeStep: 4,
      desc: `Swap complete. Increment L and decrement R to move inwards.`,
      logic: `L = ${l + 1}, R = ${r - 1}`, logicClass: 'success'
    });

    l++;
    r--;
  }

  timeline.push({
    arr: [...arr], l, r, isDone: true, isSwapping: false,
    activeLines: [4], activeStep: 5,
    desc: `Check loop condition: L (${l}) is no longer less than R (${r}). The string is fully reversed!`,
    logic: `L >= R. <strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });

  return timeline;
};

export default function ReverseString({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [examples, setExamples] = useState(INITIAL_EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [sList, setSList] = useState(INITIAL_EXAMPLES[0].s);
  const [timeline, setTimeline] = useState(() => generateTimeline(INITIAL_EXAMPLES[0].s));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('s = ')) clean = val.substring(4);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || typeof parsed[0] !== 'string') throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = ${JSON.stringify(parsed)}`;
      const reversed = [...parsed].reverse();

      const newEx = {
        label: formattedLabel,
        s: parsed,
        input: formattedLabel,
        output: JSON.stringify(reversed)
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setSList(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: [\"h\", \"e\", \"l\", \"l\", \"o\"]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    const match = exampleStr.match(/s = (\[.*?\])/);
    if (!match) return code;
    const arrStr = match[1];

    if (lang === 'java') {
      const javaArray = arrStr.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"/g, "'");
      return code.replace(/char\[\] s = .*?;/, `char[] s = new char[]${javaArray};`);
    } else {
      return code.replace(/s = \[.*\]/, `s = ${arrStr}`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Reverse String" lcNum="344" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
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
                setSList(examples[idx].s); 
                setTimeline(generateTimeline(examples[idx].s));
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
      </VisualizerLayout>
    );
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Reverse String" lcNum="344" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            setSList(examples[idx].s); 
            setTimeline(generateTimeline(examples[idx].s));
            reset(); 
          }} 
          onCustomInput={handleCustomInput}
          onGenerateEdgeCase={async () => {
            await new Promise(r => setTimeout(r, 1000));
            return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
          }}
        />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={timeline.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<ArrowLeftRight size={20} />} title="Two Pointers (Inwards)"
              lines={["Place a Left pointer at the beginning and a Right pointer at the end.", "Swap the characters they point to.", "Move them inwards until they meet or cross over. O(1) memory!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Array State
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto' }}>
                  {current.arr.map((char: string, i: number) => {
                    const isL = current.l === i && !current.isDone;
                    const isR = current.r === i && !current.isDone;
                    const isSwapping = current.isSwapping && (isL || isR);
                    const isProcessed = (i < current.l || i > current.r) || current.isDone;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          layout
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className={`array-block ${isL || isR ? 'highlight' : ''}`}
                          style={{
                            width: '48px', height: '48px',
                            background: isSwapping ? 'rgba(255, 107, 107, 0.2)' : isL ? 'rgba(78, 205, 196, 0.2)' : isR ? 'rgba(255, 107, 107, 0.15)' : isProcessed ? 'var(--surface2)' : 'var(--surface)',
                            borderColor: isSwapping ? 'var(--pink)' : isL ? 'var(--sky)' : isR ? 'var(--pink)' : isProcessed ? 'var(--border-strong)' : 'var(--border)',
                            color: 'var(--text)',
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>R</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Pointers</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Left Pointer</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.l}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Right Pointer</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.r}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">L &lt; R</div>
                  <div className="st-val" style={{ color: current.isDone ? 'var(--pink)' : 'var(--easy)' }}>
                    {current.isDone ? 'False' : 'True'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === timeline.length - 1 ? "Done!" : "Swapping"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Reverse String"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public void reverseString(char[] s) {",
                "    int l = 0;",
                "    int r = s.length - 1;",
                "    while (l < r) {",
                "        char temp = s[l];",
                "        s[l] = s[r];",
                "        s[r] = temp;",
                "        l++;",
                "        r--;",
                "    }",
                "}"
              ]}
              pythonCode={[
                "def reverseString(s: list[str]) -> None:",
                "    l = 0",
                "    r = len(s) - 1",
                "    while l < r:",
                "        ",
                "        s[l], s[r] = s[r], s[l]",
                "        ",
                "        l += 1",
                "        r -= 1",
                "        ",
                "        "
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize two pointers, L at index 0 and R at the last index." },
                { num: 2, txt: "Loop as long as L is strictly less than R." },
                { num: 3, txt: "Swap the characters at the L and R indices." },
                { num: 4, txt: "Move L one step right (L++) and R one step left (R--)." },
                { num: 5, txt: "When L meets or crosses R, the entire array is reversed in-place!" }
              ]} 
            />
            <Complexity time="O(N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Since strings in languages like Java and Python are usually immutable, the problem provides an array of characters. The prompt asks for <code>O(1)</code> space, meaning we cannot allocate a new array.</>,
              <>By using two pointers from opposite ends and swapping them, we touch each character at most once, and we don't allocate any extra memory beyond a temporary variable for the swap.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
