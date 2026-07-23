import React, { useState } from 'react';
import { Type, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a string <code>text</code>, you want to use the characters of <code>text</code> to form as many instances of the word <strong>"balloon"</strong> as possible.</p>
    <p>You can use each character in <code>text</code> <strong>at most once</strong>. Return the maximum number of instances that can be formed.</p>
  </>
);

const EXAMPLES = [
  { label: 'text = "nlaebolko"', input: 'text = "nlaebolko"', text: "nlaebolko", output: '1', explanation: <>We can form the word "balloon" exactly once using these characters.</> },
  { label: 'text = "loonbalxballpoon"', input: 'text = "loonbalxballpoon"', text: "loonbalxballpoon", output: '2', explanation: <>We can form the word "balloon" twice.</> },
  { label: 'text = "leetcode"', input: 'text = "leetcode"', text: "leetcode", output: '0', explanation: <>We cannot form "balloon".</> }
];

const EDGE_CASES = [
  'text = "bbaalllloooonn"',
  'text = "b"',
  'text = "balloonballoonballoon"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= text.length &lt;= 10⁴</code></div>
    <div><code>text</code> consists of lower case English letters only.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int maxNumberOfBalloons(String text) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def maxNumberOfBalloons(self, text: str) -> int:\n        # Write your code here\n        pass`;

const TEXT = "nlaebolko";

export default function MaximumNumberOfBalloons({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [text, setText] = useState(EXAMPLES[0].text);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('✨ ')) clean = val.substring(3);
      
      const parsedText = JSON.parse(clean.replace('text = ', '').trim());
      
      if (typeof parsedText !== 'string') {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}text = "${parsedText}"`;
      
      let b = 0, a = 0, l = 0, o = 0, n = 0;
      for (let i = 0; i < parsedText.length; i++) {
        const char = parsedText[i];
        if (char === 'b') b++;
        else if (char === 'a') a++;
        else if (char === 'l') l++;
        else if (char === 'o') o++;
        else if (char === 'n') n++;
      }
      l = Math.floor(l / 2);
      o = Math.floor(o / 2);
      const res = Math.min(b, a, l, o, n);

      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        text: parsedText,
        output: res.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setText(parsedText);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: text = "nlaebolko"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    const parsedText = clean.replace('text = ', '').trim();
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String text = ${parsedText};\n        int res = maxNumberOfBalloons(text);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    text = ${parsedText}\n    res = Solution().maxNumberOfBalloons(text)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  const map: Record<string, number> = { b: 0, a: 0, l: 0, o: 0, n: 0 };
  const targetChars = ['b', 'a', 'l', 'o', 'n'];
  
  steps.push({
    curr: -1, map: { ...map }, res: -1,
    activeLines: [2], activeStep: 1,
    desc: "Initialize a frequency map tracking only the characters we care about: b, a, l, o, n.",
    logic: `<strong>Init:</strong> Tracking counts for {b, a, l, o, n}.`, logicClass: 'info'
  });

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (targetChars.includes(char)) {
      map[char]++;
      steps.push({
        curr: i, map: { ...map }, res: -1,
        activeLines: [3, 4, 5], activeStep: 2,
        desc: `Character '${char}' is needed! Increment its count in our map.`,
        logic: `Found <strong style="color:var(--sky)">'${char}'</strong>!<br/>Count: ${map[char]}`, logicClass: 'success'
      });
    } else {
      steps.push({
        curr: i, map: { ...map }, res: -1,
        activeLines: [3, 4], activeStep: 2,
        desc: `Character '${char}' is not in the word "balloon". Ignore it.`,
        logic: `Ignored <strong style="color:var(--muted)">'${char}'</strong>.`, logicClass: 'info'
      });
    }
  }

  const b = map['b'];
  const a = map['a'];
  const l = Math.floor(map['l'] / 2);
  const o = Math.floor(map['o'] / 2);
  const n = map['n'];
  const res = Math.min(b, a, l, o, n);

  steps.push({
    curr: text.length, map: { ...map }, res,
    activeLines: [7, 8], activeStep: 3,
    desc: `Calculate how many times we can form "balloon". Since 'l' and 'o' appear twice in the word, divide their counts by 2. Then find the minimum of all available counts.`,
    logic: `b: ${b}, a: ${a}, l: ${map['l']}/2=${l}, o: ${map['o']}/2=${o}, n: ${n}<br/>Min = <strong style="color:var(--accent)">${res}</strong>`, logicClass: 'warning'
  });

  steps.push({
    curr: text.length, map: { ...map }, res,
    activeLines: [9], activeStep: 4,
    desc: `Return the result: ${res} balloons!`,
    logic: `<strong style="color:var(--green)">Done!</strong> Can form <strong>${res}</strong> balloon(s).`, logicClass: 'success',
    finalRes: res.toString()
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  return (
    <VisualizerLayout>
      <VPHeader title="Maximum Number of Balloons" lcNum="1189" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'visualizer' ? (
        <>
          <div style={{ marginBottom: '24px' }}>
            <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parsedText = examples[idx].text || JSON.parse(clean.replace('text = ', '').trim());
                setText(parsedText); 
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
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Type size={20} />} title="Frequency Map"
              lines={["Count frequencies of the characters we care about: b, a, l, o, n.", "Since 'l' and 'o' appear twice in 'balloon', divide their final counts by 2.", "The maximum words we can form is the minimum bottleneck count of all these characters!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'wrap' }}>
                  {text.split('').map((char: string, i: number) => {
                    const isCurr = current.curr === i;
                    const isProcessed = i < current.curr;
                    const isTarget = ['b','a','l','o','n'].includes(char);
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isCurr && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isTarget ? 'var(--sky)' : 'var(--muted)' }}>↓</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isCurr ? (isTarget ? 'var(--viz-sky-bg)' : 'var(--surface2)') : isProcessed ? (isTarget ? 'var(--viz-sky-bg)' : 'var(--surface)') : 'var(--surface)',
                            borderColor: isCurr ? (isTarget ? 'var(--sky)' : 'var(--muted)') : isProcessed ? (isTarget ? 'var(--viz-sky-bd)' : 'var(--border)') : 'var(--border)',
                            color: isTarget ? 'var(--text)' : 'var(--muted)'
                          }}
                        >
                          {char}
                        </motion.div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Character Requirements</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {['b', 'a', 'l', 'o', 'n'].map(char => {
                  const needed = char === 'l' || char === 'o' ? 2 : 1;
                  const count = current.map[char];
                  const sets = Math.floor(count / needed);
                  
                  return (
                    <div key={char} style={{ 
                      background: 'var(--surface2)', padding: '12px 8px', borderRadius: '8px', 
                      border: '1px solid var(--border-strong)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{char}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Have: <span style={{ color: 'var(--sky)', fontWeight: 'bold' }}>{count}</span></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Need: {needed}/word</div>
                      {current.activeStep >= 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ 
                          marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--border)', width: '100%', textAlign: 'center',
                          color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem'
                        }}>
                          Sets: {sets}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Max Balloons</div>
              <div className="st-val" style={{ 
                color: current.res !== -1 ? 'var(--easy)' : 'var(--muted)', 
                fontSize: '1.2rem', fontWeight: 'bold' 
              }}>
                {current.res !== -1 ? current.res : 'Pending'}
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === steps.length - 1 ? "Done!" : "Counting"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Max Balloons"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int maxNumberOfBalloons(String text) {",
                "    int b = 0, a = 0, l = 0, o = 0, n = 0;",
                "    for (char c : text.toCharArray()) {",
                "        if (c == 'b') b++;",
                "        else if (c == 'a') a++;",
                "        else if (c == 'l') l++;",
                "        else if (c == 'o') o++;",
                "        else if (c == 'n') n++;",
                "    }",
                "    l = l / 2;",
                "    o = o / 2;",
                "    return Math.min(b, Math.min(a, Math.min(l, Math.min(o, n))));",
                "}"
              ]}
              pythonCode={[
                "def maxNumberOfBalloons(text):",
                "    b = a = l = o = n = 0",
                "    for char in text:",
                "        if char == 'b': b += 1",
                "        elif char == 'a': a += 1",
                "        elif char == 'l': l += 1",
                "        elif char == 'o': o += 1",
                "        elif char == 'n': n += 1",
                "        ",
                "    l = l // 2",
                "    o = o // 2",
                "    return min(b, a, l, o, n)"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize variables to count occurrences of b, a, l, o, n." },
                { num: 2, txt: "Iterate through the string. Increment the respective variable if the character is one we need." },
                { num: 3, txt: "Divide the counts for 'l' and 'o' by 2, because we need two of each to form one word." },
                { num: 4, txt: "Return the minimum of these counts. The character we have the least of (relative to its requirement) forms our bottleneck!" }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is a classic "bottleneck" problem. You can only form as many full words as your most scarce letter allows.</>,
              <>By explicitly mapping out the requirements for each individual character and scaling down the ones that are required multiple times, we can reduce the problem to finding a simple minimum value.</>
            ]} />
          </div>
        }
      />
      </>
      ) : (
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={examples}
          constraints={CONSTRAINTS}
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static int maxNumberOfBalloons(String text) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        String text = "nlaebolko";\n        System.out.println("Output: " + maxNumberOfBalloons(text));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def maxNumberOfBalloons(self, text: str) -> int:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    text = "nlaebolko"\n    print(f"Output: {Solution().maxNumberOfBalloons(text)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parsedText = examples[idx].text || JSON.parse(clean.replace('text = ', '').trim());
                setText(parsedText); 
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
