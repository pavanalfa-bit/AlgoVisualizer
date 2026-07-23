import React, { useState } from 'react';
import { Columns, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given two strings <code>s</code> and <code>p</code>, return <em>an array of all the start indices of </em><code>p</code><em>'s anagrams in </em><code>s</code>. You may return the answer in <strong>any order</strong>.</p>
  </>
);

const EXAMPLES = [
  { label: 's = "cbaebabacd", p = "abc"', input: 's = "cbaebabacd", p = "abc"', s: "cbaebabacd", p: "abc", output: '[0,6]', explanation: <>The substring with start index = 0 is "cba", which is an anagram of "abc".<br/>The substring with start index = 6 is "bac", which is an anagram of "abc".</> },
  { label: 's = "abab", p = "ab"', input: 's = "abab", p = "ab"', s: "abab", p: "ab", output: '[0,1,2]', explanation: <>The substring with start index = 0 is "ab", which is an anagram of "ab".<br/>The substring with start index = 1 is "ba", which is an anagram of "ab".<br/>The substring with start index = 2 is "ab", which is an anagram of "ab".</> }
];

const EDGE_CASES = [
  's = "a", p = "ab"',
  's = "abc", p = "cba"',
  's = "hello", p = "ooolleoooleh"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length, p.length &lt;= 3 * 10⁴</code></div>
    <div><code>s</code> and <code>p</code> consist of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `import java.util.List;\nimport java.util.ArrayList;\n\nclass Main {\n    public static List<Integer> findAnagrams(String s, String p) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def findAnagrams(self, s: str, p: str) -> list[int]:\n        # Write your code here\n        pass`;

const P = "abc";
const S = "cbaebabacd";

export default function FindAllAnagrams({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s, setS] = useState(EXAMPLES[0].s);
  const [pStr, setP] = useState(EXAMPLES[0].p);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('✨ ')) clean = val.substring(3);
      
      const parts = clean.split(', p = ');
      const sPart = parts[0].replace('s = ', '').trim();
      const pPart = parts[1].trim();
      
      const parsedS = JSON.parse(sPart);
      const parsedP = JSON.parse(pPart);
      
      if (typeof parsedS !== 'string' || typeof parsedP !== 'string') {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${parsedS}", p = "${parsedP}"`;
      
      const res: number[] = [];
      if (parsedP.length <= parsedS.length) {
        const countP = Array(26).fill(0);
        const countS = Array(26).fill(0);
        
        for (let i = 0; i < parsedP.length; i++) {
          countP[parsedP.charCodeAt(i) - 97]++;
          countS[parsedS.charCodeAt(i) - 97]++;
        }

        let matches = 0;
        for (let i = 0; i < 26; i++) {
          if (countP[i] === countS[i]) matches++;
        }

        if (matches === 26) {
          res.push(0);
        }

        let l = 0;
        for (let r = parsedP.length; r < parsedS.length; r++) {
          let index = parsedS.charCodeAt(r) - 97;
          countS[index]++;
          if (countP[index] === countS[index]) matches++;
          else if (countP[index] + 1 === countS[index]) matches--;

          index = parsedS.charCodeAt(l) - 97;
          countS[index]--;
          if (countP[index] === countS[index]) matches++;
          else if (countP[index] - 1 === countS[index]) matches--;
          
          l++;
          if (matches === 26) {
            res.push(l);
          }
        }
      }

      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s: parsedS,
        p: parsedP,
        output: `[${res.join(',')}]`,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS(parsedS);
      setP(parsedP);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: s = "cbaebabacd", p = "abc"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    const parts = clean.split(', p = ');
    const sPart = parts[0].replace('s = ', '').trim();
    const pPart = parts[1].trim();
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String s = ${sPart};\n        String p = ${pPart};\n        List<Integer> res = findAnagrams(s, p);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s = ${sPart}\n    p = ${pPart}\n    res = Solution().findAnagrams(s, p)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  const res: number[] = [];
  
  if (pStr.length > s.length) {
    steps.push({ activeLines: [], activeStep: 1, desc: "p is longer than s, impossible.", logic: "p > s", logicClass: 'error', finalRes: '[]' });
  } else {
    const countP = Array(26).fill(0);
    const countS = Array(26).fill(0);
    
    for (let i = 0; i < pStr.length; i++) {
      countP[pStr.charCodeAt(i) - 97]++;
      countS[s.charCodeAt(i) - 97]++;
    }

    let matches = 0;
    for (let i = 0; i < 26; i++) {
      if (countP[i] === countS[i]) matches++;
    }

    steps.push({
      L: 0, R: pStr.length - 1, matches, countP: [...countP], countS: [...countS], res: [...res], isAnagram: false,
      activeLines: [2, 3, 4, 5, 6, 7], activeStep: 1,
      desc: `Initialize frequency maps for p and the first window of s (length ${pStr.length}).`,
      logic: `<strong>Init:</strong> First window set up.<br/>matches = ${matches} (out of 26).`, logicClass: 'info'
    });

    if (matches === 26) {
      res.push(0);
      steps.push({
        L: 0, R: pStr.length - 1, matches, countP: [...countP], countS: [...countS], res: [...res], isAnagram: true,
        activeLines: [9, 10], activeStep: 2,
        desc: `First window is an anagram! Add index 0 to result.`,
        logic: `<strong style="color:var(--green)">Success!</strong> matches == 26!<br/>Added index 0 to result.`, logicClass: 'success'
      });
    }

    let l = 0;
    for (let r = pStr.length; r < s.length; r++) {
      // Add right char
      let index = s.charCodeAt(r) - 97;
      countS[index]++;
      
      if (countP[index] === countS[index]) matches++;
      else if (countP[index] + 1 === countS[index]) matches--;

      // Remove left char
      index = s.charCodeAt(l) - 97;
      countS[index]--;
      
      if (countP[index] === countS[index]) matches++;
      else if (countP[index] - 1 === countS[index]) matches--;
      
      l++;

      steps.push({
        L: l, R: r, matches, countP: [...countP], countS: [...countS], res: [...res], isAnagram: false,
        activeLines: [13, 14, 15, 16, 17, 18, 19, 20], activeStep: 3,
        desc: `Slide window. Add '${s[r]}', remove '${s[l - 1]}'. Update matches to ${matches}.`,
        logic: `Added <strong style="color:var(--sky)">'${s[r]}'</strong>, Removed <strong style="color:var(--pink)">'${s[l - 1]}'</strong>.<br/>matches = ${matches}`, logicClass: 'info'
      });

      if (matches === 26) {
        res.push(l);
        steps.push({
          L: l, R: r, matches, countP: [...countP], countS: [...countS], res: [...res], isAnagram: true,
          activeLines: [21, 22], activeStep: 4,
          desc: `Window is an anagram! Add index ${l} to result.`,
          logic: `<strong style="color:var(--green)">Anagram Found!</strong><br/>Added index ${l}.`, logicClass: 'success'
        });
      }
    }

    steps.push({
      L: l, R: s.length - 1, matches, countP: [...countP], countS: [...countS], res: [...res], isAnagram: false,
      activeLines: [24], activeStep: 5,
      desc: `Finished scanning string s. Total anagrams found: ${res.length}.`,
      logic: `Complete! Returning result array.`, logicClass: 'success',
      finalRes: `[${res.join(', ')}]`
    });
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];

  return (
    <VisualizerLayout>
      <VPHeader title="Find All Anagrams in a String" lcNum="438" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                const parts = clean.split(', p = ');
                const sPart = parts[0].replace('s = ', '').trim();
                const pPart = parts[1].trim();
                const inputS = examples[idx].s || JSON.parse(sPart);
                const inputP = examples[idx].p || JSON.parse(pPart);
                setS(inputS); 
                setP(inputP);
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
            
            <ApproachBanner icon={<Columns size={20} />} title="Fixed Sliding Window (Matches Counter)"
              lines={["Exact same logic as 'Permutation in String'.", "Instead of returning true on the first match, we append the Left pointer index to a result array.", "Continue sliding until the end of the string."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal (s)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {s.split('').map((char: string, i: number) => {
                    const isR = current.R === i;
                    const isL = current.L === i;
                    const isInWindow = i >= current.L && i <= current.R;
                    const isSuccess = current.isAnagram && isInWindow;
                    const isResultStart = current.res.includes(i);
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isInWindow ? 'highlight' : ''}`}
                          style={{
                            width: '32px',
                            height: '32px',
                            background: isSuccess ? 'var(--viz-green-bg)' : isResultStart ? 'var(--viz-green-bg)' : isInWindow ? 'rgba(78, 205, 196, 0.15)' : 'var(--surface)',
                            borderColor: isSuccess ? 'var(--easy)' : isResultStart ? 'var(--easy)' : isR ? 'var(--sky)' : isL ? 'var(--pink)' : isInWindow ? 'var(--viz-sky-bd)' : 'var(--border)',
                            color: 'var(--text)',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>R</span>}
                        </div>
                        <div className="array-index" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Frequencies Matrix (Non-zero only)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
                {Array.from({ length: 26 }).map((_, i) => {
                  const char = String.fromCharCode(i + 97);
                  const cp = current.countP[i];
                  const cs = current.countS[i];
                  if (cp === 0 && cs === 0) return null;
                  
                  const isMatch = cp === cs;
                  
                  return (
                    <div key={char} style={{ 
                      background: 'var(--surface)', 
                      padding: '4px', borderRadius: '4px', 
                      border: `1px solid ${isMatch ? 'var(--easy)' : 'var(--border-strong)'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{char}</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--muted)' }}>{cp}</span>
                        <span style={{ color: isMatch ? 'var(--easy)' : 'var(--hard)' }}>{cs}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Matches</div>
                  <div className="st-val" style={{ color: current.matches === 26 ? 'var(--easy)' : 'var(--accent)' }}>{current.matches} / 26</div>
                </div>
                <div className="stbox" style={{ gridColumn: 'span 3' }}>
                  <div className="st-lbl">Result Array</div>
                  <div className="st-val" style={{ color: 'var(--easy)', fontSize: '1.2rem' }}>
                    [{current.res.join(', ')}]
                  </div>
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
              title="Find All Anagrams"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public List<Integer> findAnagrams(String s, String p) {",
                "    List<Integer> res = new ArrayList<>();",
                "    if (p.length() > s.length()) return res;",
                "    int[] countP = new int[26], countS = new int[26];",
                "    for (int i = 0; i < p.length(); i++) {",
                "        countP[p.charAt(i) - 'a']++; countS[s.charAt(i) - 'a']++;",
                "    }",
                "    int matches = 0;",
                "    for (int i = 0; i < 26; i++) if (countP[i] == countS[i]) matches++;",
                "    if (matches == 26) res.add(0);",
                "    ",
                "    int l = 0;",
                "    for (int r = p.length(); r < s.length(); r++) {",
                "        int index = s.charAt(r) - 'a';",
                "        countS[index]++;",
                "        if (countP[index] == countS[index]) matches++;",
                "        else if (countP[index] + 1 == countS[index]) matches--;",
                "        ",
                "        index = s.charAt(l) - 'a';",
                "        countS[index]--;",
                "        if (countP[index] == countS[index]) matches++;",
                "        else if (countP[index] - 1 == countS[index]) matches--;",
                "        l++;",
                "        if (matches == 26) res.add(l);",
                "    }",
                "    return res;",
                "}"
              ]}
              pythonCode={[
                "def findAnagrams(s, p):",
                "    if len(p) > len(s): return []",
                "    countP, countS = [0] * 26, [0] * 26",
                "    for i in range(len(p)):",
                "        countP[ord(p[i]) - ord('a')] += 1",
                "        countS[ord(s[i]) - ord('a')] += 1",
                "    matches = 0",
                "    for i in range(26):",
                "        if countP[i] == countS[i]: matches += 1",
                "    res = [0] if matches == 26 else []",
                "    ",
                "    l = 0",
                "    for r in range(len(p), len(s)):",
                "        index = ord(s[r]) - ord('a')",
                "        countS[index] += 1",
                "        if countP[index] == countS[index]: matches += 1",
                "        elif countP[index] + 1 == countS[index]: matches -= 1",
                "        ",
                "        index = ord(s[l]) - ord('a')",
                "        countS[index] -= 1",
                "        if countP[index] == countS[index]: matches += 1",
                "        elif countP[index] - 1 == countS[index]: matches -= 1",
                "        l += 1",
                "        if matches == 26: res.append(l)",
                "    return res"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize maps. Count frequencies for p and the first window of s." },
                { num: 2, txt: "Check if the first window is already an anagram. If so, add index 0 to result." },
                { num: 3, txt: "Slide the window by 1: Add right character, remove left character, and update matches." },
                { num: 4, txt: "If matches reaches 26, the current window is an anagram! Add the left pointer index to the result array." },
                { num: 5, txt: "Return the result array containing all start indices." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Just like Permutation in String, we maintain a fixed-size window and update a <code>matches</code> count in <code>O(1)</code> time.</>,
              <>By sweeping across the entire string without early termination, we can find and record every single anagram location with extreme efficiency.</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static List<Integer> findAnagrams(String s, String p) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        String s = "cbaebabacd";\n        String p = "abc";\n        System.out.println("Output: " + findAnagrams(s, p));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def findAnagrams(self, s: str, p: str) -> list[int]:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s = "cbaebabacd"\n    p = "abc"\n    print(f"Output: {Solution().findAnagrams(s, p)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parts = clean.split(', p = ');
                const sPart = parts[0].replace('s = ', '').trim();
                const pPart = parts[1].trim();
                const inputS = examples[idx].s || JSON.parse(sPart);
                const inputP = examples[idx].p || JSON.parse(pPart);
                setS(inputS); 
                setP(inputP);
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
