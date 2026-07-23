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
    <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
  </>
);

const EXAMPLES = [
  { label: 's = "abcabcbb"', input: 's = "abcabcbb"', s: "abcabcbb", output: '3', explanation: <>The answer is "abc", with the length of 3.</> },
  { label: 's = "bbbbb"', input: 's = "bbbbb"', s: "bbbbb", output: '1', explanation: <>The answer is "b", with the length of 1.</> },
  { label: 's = "pwwkew"', input: 's = "pwwkew"', s: "pwwkew", output: '3', explanation: <>The answer is "wke", with the length of 3.<br/>Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.</> }
];

const EDGE_CASES = [
  's = ""',
  's = "abcdef"',
  's = "abba"'
];

const CONSTRAINTS = (
  <>
    <div><code>0 &lt;= s.length &lt;= 5 * 10⁴</code></div>
    <div><code>s</code> consists of English letters, digits, symbols and spaces.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your code here\n        pass`;

export default function LongestSubstring({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s, setS] = useState(EXAMPLES[0].s);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('s = ')) clean = val.substring(4);
      const parsed = JSON.parse(clean);
      if (typeof parsed !== 'string') throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${parsed}"`;
      
      let L = 0;
      let maxL = 0;
      const set = new Set<string>();
      for (let R = 0; R < parsed.length; R++) {
        while (set.has(parsed[R])) {
          set.delete(parsed[L]);
          L++;
        }
        set.add(parsed[R]);
        maxL = Math.max(maxL, R - L + 1);
      }
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s: parsed,
        output: maxL.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS(parsed);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: s = "abc"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('s = ')) clean = clean.substring(4);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String s = ${clean};\n        int res = lengthOfLongestSubstring(s);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s = ${clean}\n    res = Solution().lengthOfLongestSubstring(s)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  let L = 0;
  let maxL = 0;
  const set = new Set<string>();
  
  steps.push({
    L: 0, R: 0, maxL: 0, setChars: [],
    activeLines: [2, 3, 4], activeStep: 1,
    desc: "Initialize Left and Right pointers to index 0. Create an empty character Set.",
    logic: `<strong>Init:</strong> L = 0, R = 0. Set is empty.`, logicClass: 'info'
  });

  for (let R = 0; R < s.length; R++) {
    const charR = s[R];
    
    // Check if character is in set
    steps.push({
      L, R, maxL, setChars: Array.from(set),
      activeLines: [6], activeStep: 2,
      desc: `Check if '${charR}' is already in our Set.`,
      logic: `Is <strong style="color:var(--sky)">'${charR}'</strong> in the Set?<br/>${set.has(charR) ? '<strong style="color:var(--pink)">Yes! Duplicate found!</strong>' : 'No.'}`, logicClass: set.has(charR) ? 'info' : ''
    });

    while (set.has(charR)) {
      const charL = s[L];
      set.delete(charL);
      L++;
      steps.push({
        L, R, maxL, setChars: Array.from(set),
        activeLines: [7, 8], activeStep: 3,
        desc: `'${charR}' is in the Set! Remove s[L] ('${charL}') from the Set and shrink the window from the left.`,
        logic: `Remove <strong style="color:var(--pink)">'${charL}'</strong> from Set.<br/>Increment L to ${L}.`, logicClass: 'info'
      });
    }

    set.add(charR);
    const oldMax = maxL;
    maxL = Math.max(maxL, R - L + 1);
    
    steps.push({
      L, R, maxL, setChars: Array.from(set),
      activeLines: [10, 11], activeStep: 4,
      desc: `Add '${charR}' to the Set. Update max length.`,
      logic: `Add <strong style="color:var(--sky)">'${charR}'</strong> to Set.<br/>Window size = R - L + 1 = ${R - L + 1}.<br/>${maxL > oldMax ? '<strong style="color:var(--green)">New max length found!</strong>' : ''}`, 
      logicClass: maxL > oldMax ? 'success' : ''
    });
  }

  steps.push({
    L, R: s.length, maxL, setChars: Array.from(set),
    activeLines: [13], activeStep: 5,
    desc: `Iterated through the entire string. The maximum substring length is ${maxL}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum length is <strong>${maxL}</strong>.`, logicClass: 'success',
    finalRes: `${maxL}`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  return (
    <VisualizerLayout>
      <VPHeader title="Longest Substring Without Repeating" lcNum="3" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'visualizer' ? (
        <>
          <div style={{ marginBottom: '24px' }}>
            <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('s = ')) pr = pr.substring(4);
                const inputStr = examples[idx].s || JSON.parse(pr);
                setS(inputStr); 
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
            
            <ApproachBanner icon={<Type size={20} />} title="Sliding Window + Hash Set"
              lines={["Use a sliding window defined by L and R pointers.", "Expand R to add characters. If a duplicate is found, shrink L until the duplicate is removed from the window."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {s.split('').map((char: string, i: number) => {
                    const isR = current.R === i;
                    const isL = current.L === i;
                    const isInWindow = i >= current.L && i <= current.R && current.R < s.length;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isInWindow ? 'highlight' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isInWindow ? 'var(--viz-sky-bg)' : 'var(--surface)',
                            borderColor: isR ? 'var(--sky)' : isL ? 'var(--pink)' : isInWindow ? 'var(--viz-sky-bd)' : 'var(--border)',
                            color: 'var(--text)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>R</span>}
                        </div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Current Character Set</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '44px', background: 'var(--surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {current.setChars.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Set is empty</div>
                ) : (
                  <AnimatePresence>
                    {current.setChars.map((char: string) => (
                      <motion.div
                        key={char}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{ 
                          width: '32px', height: '32px', 
                          background: 'var(--accent)', color: 'white', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          borderRadius: '8px', fontWeight: 'bold' 
                        }}
                      >
                        {char}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">L (Start)</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.L}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">R (End)</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.R < s.length ? current.R : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Window Size</div>
                  <div className="st-val">{current.R < s.length ? current.R - current.L + 1 : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Max Length</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.maxL}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === steps.length - 1 ? "Done!" : "Sliding Window"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Longest Substring Without Repeating"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int lengthOfLongestSubstring(String s) {",
                "    Set<Character> set = new HashSet<>();",
                "    int l = 0, max = 0;",
                "    for (int r = 0; r < s.length(); r++) {",
                "        char charR = s.charAt(r);",
                "        while (set.contains(charR)) {",
                "            set.remove(s.charAt(l));",
                "            l++;",
                "        }",
                "        set.add(charR);",
                "        max = Math.max(max, r - l + 1);",
                "    }",
                "    return max;",
                "}"
              ]}
              pythonCode={[
                "def lengthOfLongestSubstring(s):",
                "    char_set = set()",
                "    l = 0, max_l = 0",
                "    for r in range(len(s)):",
                "        char_r = s[r]",
                "        while char_r in char_set:",
                "            char_set.remove(s[l])",
                "            l += 1",
                "        ",
                "        char_set.add(char_r)",
                "        max_l = max(max_l, r - l + 1)",
                "    ",
                "    return max_l"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L pointer and an empty Set to track characters in the window." },
                { num: 2, txt: "Iterate R pointer through the string, checking if the current character is already in the Set." },
                { num: 3, txt: "If it is a duplicate, shrink the window from the left by advancing L and removing characters from the Set until the duplicate is gone." },
                { num: 4, txt: "Add the new character to the Set and update the maximum window length." },
                { num: 5, txt: "Return the maximum length." }
              ]} 
            />
            <Complexity time="O(n)" space="O(min(n, m))" />
            <WhyItWorks paragraphs={[
              <>A substring must be contiguous. By using two pointers, we represent exactly one contiguous block of characters.</>,
              <>The Set ensures our block has no duplicates. When we encounter a duplicate at <code>R</code>, we know that any valid substring ending at <code>R</code> must start <strong>after</strong> the previous occurrence of that character. Therefore, we advance <code>L</code> until the duplicate is evicted.</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        String s = "abcabcbb";\n        System.out.println("Output: " + lengthOfLongestSubstring(s));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s = "abcabcbb"\n    print(f"Output: {Solution().lengthOfLongestSubstring(s)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('s = ')) pr = pr.substring(4);
                const inputStr = examples[idx].s || JSON.parse(pr);
                setS(inputStr); 
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
