import React, { useState } from 'react';
import { BarChart2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code><em> if </em><code>t</code><em> is an anagram of </em><code>s</code><em>, and </em><code>false</code><em> otherwise</em>.</p>
    <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
  </>
);

const EXAMPLES = [
  { label: 's = "anagram", t = "nagaram"', input: 's = "anagram", t = "nagaram"', s: "anagram", t: "nagaram", output: 'true', explanation: <>Both strings contain exactly the same letters in the same frequencies.</> },
  { label: 's = "rat", t = "car"', input: 's = "rat", t = "car"', s: "rat", t: "car", output: 'false', explanation: <>'rat' has an 'r', 'a', 't'. 'car' has a 'c', 'a', 'r'. They do not match.</> }
];

const EDGE_CASES = [
  's = "a", t = "a"',
  's = "a", t = "b"',
  's = "hello", t = "ooolle"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length, t.length &lt;= 5 * 10⁴</code></div>
    <div><code>s</code> and <code>t</code> consist of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass`;

const S = "tea";
const T = "eat";

export default function ValidAnagram({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s, setS] = useState(EXAMPLES[0].s);
  const [tStr, setT] = useState(EXAMPLES[0].t);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('✨ ')) clean = val.substring(3);
      
      const parts = clean.split(', t = ');
      const sPart = parts[0].replace('s = ', '').trim();
      const tPart = parts[1].trim();
      
      const parsedS = JSON.parse(sPart);
      const parsedT = JSON.parse(tPart);
      
      if (typeof parsedS !== 'string' || typeof parsedT !== 'string') {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${parsedS}", t = "${parsedT}"`;
      
      let isValid = true;
      if (parsedS.length !== parsedT.length) {
        isValid = false;
      } else {
        const count = Array(26).fill(0);
        for (let i = 0; i < parsedS.length; i++) {
          count[parsedS.charCodeAt(i) - 97]++;
          count[parsedT.charCodeAt(i) - 97]--;
        }
        for (let i = 0; i < 26; i++) {
          if (count[i] !== 0) {
            isValid = false;
            break;
          }
        }
      }

      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s: parsedS,
        t: parsedT,
        output: isValid ? 'true' : 'false',
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS(parsedS);
      setT(parsedT);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: s = "anagram", t = "nagaram"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    const parts = clean.split(', t = ');
    const sPart = parts[0].replace('s = ', '').trim();
    const tPart = parts[1].trim();
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String s = ${sPart};\n        String t = ${tPart};\n        boolean res = isAnagram(s, t);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s = ${sPart}\n    t = ${tPart}\n    res = Solution().isAnagram(s, t)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  
  if (s.length !== tStr.length) {
    steps.push({ activeLines: [], activeStep: 1, desc: "Lengths differ. Return false.", logic: "Length mismatch", logicClass: 'error', finalRes: 'false' });
  } else {
    const count = Array(26).fill(0);
    
    steps.push({
      curr: -1, scan: -1, count: [...count], valid: true, status: 'running',
      activeLines: [2, 3], activeStep: 1,
      desc: "Initialize a frequency array of size 26 (for 'a' to 'z') with all zeros.",
      logic: `<strong>Init:</strong> Frequency array created.`, logicClass: 'info'
    });

    for (let i = 0; i < s.length; i++) {
      const c1 = s[i];
      const c2 = tStr[i];
      
      count[c1.charCodeAt(0) - 97]++;
      count[c2.charCodeAt(0) - 97]--;
      
      steps.push({
        curr: i, scan: -1, count: [...count], valid: true, status: 'running',
        activeLines: [5, 6, 7], activeStep: 2,
        desc: `Add '${c1}' (from s) and subtract '${c2}' (from t) in the frequency array.`,
        logic: `<strong style="color:var(--sky)">+1</strong> for '${c1}'.<br/><strong style="color:var(--pink)">-1</strong> for '${c2}'.`, logicClass: 'info'
      });
    }

    steps.push({
      curr: s.length, scan: -1, count: [...count], valid: true, status: 'running',
      activeLines: [10], activeStep: 3,
      desc: "Finished building the frequency array. Now scan it to ensure all counts are 0.",
      logic: `Start checking frequencies...`, logicClass: 'info'
    });

    let isValid = true;
    for (let i = 0; i < 26; i++) {
      if (count[i] !== 0) {
        isValid = false;
        steps.push({
          curr: s.length, scan: i, count: [...count], valid: false, status: 'false',
          activeLines: [11, 12], activeStep: 4,
          desc: `Found a non-zero count at '${String.fromCharCode(i + 97)}' (${count[i]}). Return false.`,
          logic: `Count for '${String.fromCharCode(i + 97)}' is <strong style="color:var(--pink)">${count[i]}</strong> (not 0).<br/>Return false.`, logicClass: 'error',
          finalRes: 'false'
        });
        break;
      }
    }

    if (isValid) {
      steps.push({
        curr: s.length, scan: 26, count: [...count], valid: true, status: 'true',
        activeLines: [15], activeStep: 5,
        desc: "All frequencies are 0. The strings are anagrams!",
        logic: `<strong style="color:var(--green)">Success!</strong> All counts are 0.<br/>Return true.`, logicClass: 'success',
        finalRes: 'true'
      });
    }
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  return (
    <VisualizerLayout>
      <VPHeader title="Valid Anagram" lcNum="242" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                const parts = clean.split(', t = ');
                const sPart = parts[0].replace('s = ', '').trim();
                const tPart = parts[1].trim();
                const inputS = examples[idx].s || JSON.parse(sPart);
                const inputT = examples[idx].t || JSON.parse(tPart);
                setS(inputS); 
                setT(inputT);
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
            
            <ApproachBanner icon={<BarChart2 size={20} />} title="Frequency Array"
              lines={["Initialize an integer array of size 26.", "Iterate through both strings. Increment the frequency for chars in `s`, and decrement for chars in `t`.", "Scan the array. If any value is not 0, it's not an anagram."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent', display: 'flex', gap: '48px', justifyContent: 'center' }}>
                
                {/* String S */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--sky)', marginBottom: '8px' }}>String s</div>
                  <div className="array-container" style={{ gap: '8px' }}>
                    {s.split('').map((char: string, i: number) => {
                      const isCurr = current.curr === i;
                      return (
                        <div key={`s-${i}`} className="array-block-wrapper">
                          <motion.div 
                            className={`array-block ${isCurr ? 'highlight' : ''}`}
                            style={{
                              width: '40px', height: '40px',
                              background: isCurr ? 'var(--viz-sky-bg)' : 'var(--surface)',
                              borderColor: isCurr ? 'var(--sky)' : 'var(--border)',
                              color: 'var(--text)'
                            }}
                          >
                            {char}
                          </motion.div>
                          <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                            {isCurr && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>+1</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* String T */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--pink)', marginBottom: '8px' }}>String t</div>
                  <div className="array-container" style={{ gap: '8px' }}>
                    {tStr.split('').map((char: string, i: number) => {
                      const isCurr = current.curr === i;
                      return (
                        <div key={`t-${i}`} className="array-block-wrapper">
                          <motion.div 
                            className={`array-block ${isCurr ? 'highlight' : ''}`}
                            style={{
                              width: '40px', height: '40px',
                              background: isCurr ? 'var(--viz-red-bg)' : 'var(--surface)',
                              borderColor: isCurr ? 'var(--pink)' : 'var(--border)',
                              color: 'var(--text)'
                            }}
                          >
                            {char}
                          </motion.div>
                          <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                            {isCurr && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>-1</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Frequencies Matrix (Non-zero only)</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '60px', background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {current.count.every((val: number) => val === 0) ? (
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>All counts are zero</div>
                ) : (
                  <AnimatePresence>
                    {Array.from({ length: 26 }).map((_, i) => {
                      const count = current.count[i];
                      if (count === 0) return null;
                      
                      const char = String.fromCharCode(i + 97);
                      const isScanTarget = current.scan === i;
                      
                      return (
                        <motion.div
                          key={char}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          style={{ 
                            background: isScanTarget ? 'var(--viz-red-bg)' : 'var(--surface2)', 
                            padding: '4px 12px', borderRadius: '8px', 
                            border: `1px solid ${isScanTarget ? 'var(--pink)' : 'var(--border-strong)'}`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>{char}</span>
                          <span style={{ color: count > 0 ? 'var(--sky)' : count < 0 ? 'var(--pink)' : 'var(--muted)', fontWeight: 'bold' }}>
                            {count > 0 ? `+${count}` : count}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Result</div>
              <div className="st-val" style={{ 
                color: current.status === 'running' ? 'var(--muted)' : current.status === 'true' ? 'var(--easy)' : 'var(--hard)', 
                fontSize: '1.2rem', fontWeight: 'bold' 
              }}>
                {current.status === 'running' ? 'Pending' : current.status === 'true' ? 'True' : 'False'}
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === steps.length - 1 ? "Done!" : "Calculating Frequencies"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Valid Anagram"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean isAnagram(String s, String t) {",
                "    if (s.length() != t.length()) return false;",
                "    int[] count = new int[26];",
                "    ",
                "    for (int i = 0; i < s.length(); i++) {",
                "        count[s.charAt(i) - 'a']++;",
                "        count[t.charAt(i) - 'a']--;",
                "    }",
                "    ",
                "    for (int i = 0; i < 26; i++) {",
                "        if (count[i] != 0) {",
                "            return false;",
                "        }",
                "    }",
                "    return true;",
                "}"
              ]}
              pythonCode={[
                "def isAnagram(s, t):",
                "    if len(s) != len(t): return False",
                "    count = [0] * 26",
                "    ",
                "    for i in range(len(s)):",
                "        count[ord(s[i]) - ord('a')] += 1",
                "        count[ord(t[i]) - ord('a')] -= 1",
                "        ",
                "    ",
                "    for i in range(26):",
                "        if count[i] != 0:",
                "            return False",
                "            ",
                "            ",
                "    return True"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize an integer array of size 26 to act as a frequency hash map for the alphabet." },
                { num: 2, txt: "Iterate through both strings. For string 's', increment the character's frequency. For string 't', decrement it." },
                { num: 3, txt: "Iterate through the frequency array to verify." },
                { num: 4, txt: "If any frequency is not exactly 0, the strings are not anagrams. Return false." },
                { num: 5, txt: "If all frequencies are 0, they are valid anagrams. Return true." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Since the problem guarantees only lowercase English letters, we don't need a heavy <code>HashMap</code> object. A fixed-size array of 26 integers is extremely fast and uses O(1) space.</>,
              <>By incrementing for <code>s</code> and decrementing for <code>t</code>, we essentially cancel out identical characters. If the strings are anagrams, the net result for every single character will be exactly 0.</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static boolean isAnagram(String s, String t) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String s = "anagram";\n        String t = "nagaram";\n        System.out.println("Output: " + isAnagram(s, t));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s = "anagram"\n    t = "nagaram"\n    print(f"Output: {Solution().isAnagram(s, t)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parts = clean.split(', t = ');
                const sPart = parts[0].replace('s = ', '').trim();
                const tPart = parts[1].trim();
                const inputS = examples[idx].s || JSON.parse(sPart);
                const inputT = examples[idx].t || JSON.parse(tPart);
                setS(inputS); 
                setT(inputT);
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
