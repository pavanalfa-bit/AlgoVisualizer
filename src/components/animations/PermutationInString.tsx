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
    <p>Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code><em> if </em><code>s2</code><em> contains a permutation of </em><code>s1</code><em>, or </em><code>false</code><em> otherwise</em>.</p>
    <p>In other words, return <code>true</code> if one of <code>s1</code>'s permutations is the substring of <code>s2</code>.</p>
  </>
);

const EXAMPLES = [
  { label: 's1 = "ab", s2 = "eidbaooo"', input: 's1 = "ab", s2 = "eidbaooo"', s1: "ab", s2: "eidbaooo", output: 'true', explanation: <>s2 contains one permutation of s1 ("ba").</> },
  { label: 's1 = "ab", s2 = "eidboaoo"', input: 's1 = "ab", s2 = "eidboaoo"', s1: "ab", s2: "eidboaoo", output: 'false', explanation: <>s2 does not contain any permutation of s1.</> }
];

const EDGE_CASES = [
  's1 = "a", s2 = "ab"',
  's1 = "abc", s2 = "cba"',
  's1 = "hello", s2 = "ooolleoooleh"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s1.length, s2.length &lt;= 10⁴</code></div>
    <div><code>s1</code> and <code>s2</code> consist of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean checkInclusion(String s1, String s2) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def checkInclusion(self, s1: str, s2: str) -> bool:\n        # Write your code here\n        pass`;

const S1 = "ab";
const S2 = "eidbaooo";

export default function PermutationInString({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s1, setS1] = useState(EXAMPLES[0].s1);
  const [s2, setS2] = useState(EXAMPLES[0].s2);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('✨ ')) clean = val.substring(3);
      
      const parts = clean.split(', s2 = ');
      const s1Part = parts[0].replace('s1 = ', '').trim();
      const s2Part = parts[1].trim();
      
      const parsedS1 = JSON.parse(s1Part);
      const parsedS2 = JSON.parse(s2Part);
      
      if (typeof parsedS1 !== 'string' || typeof parsedS2 !== 'string') {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s1 = "${parsedS1}", s2 = "${parsedS2}"`;
      
      let found = false;
      if (parsedS1.length <= parsedS2.length) {
        const count1 = Array(26).fill(0);
        const count2 = Array(26).fill(0);
        
        for (let i = 0; i < parsedS1.length; i++) {
          count1[parsedS1.charCodeAt(i) - 97]++;
          count2[parsedS2.charCodeAt(i) - 97]++;
        }

        let matches = 0;
        for (let i = 0; i < 26; i++) {
          if (count1[i] === count2[i]) matches++;
        }

        if (matches === 26) found = true;
        
        if (!found) {
          let l = 0;
          for (let r = parsedS1.length; r < parsedS2.length; r++) {
            let index = parsedS2.charCodeAt(r) - 97;
            count2[index]++;
            if (count1[index] === count2[index]) matches++;
            else if (count1[index] + 1 === count2[index]) matches--;

            index = parsedS2.charCodeAt(l) - 97;
            count2[index]--;
            if (count1[index] === count2[index]) matches++;
            else if (count1[index] - 1 === count2[index]) matches--;
            
            l++;
            if (matches === 26) {
              found = true;
              break;
            }
          }
        }
      }

      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s1: parsedS1,
        s2: parsedS2,
        output: found ? 'true' : 'false',
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS1(parsedS1);
      setS2(parsedS2);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: s1 = "ab", s2 = "eidbaooo"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    const parts = clean.split(', s2 = ');
    const s1Part = parts[0].replace('s1 = ', '').trim();
    const s2Part = parts[1].trim();
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String s1 = ${s1Part};\n        String s2 = ${s2Part};\n        boolean res = checkInclusion(s1, s2);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s1 = ${s1Part}\n    s2 = ${s2Part}\n    res = Solution().checkInclusion(s1, s2)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  
  if (s1.length > s2.length) {
    steps.push({ activeLines: [], activeStep: 1, desc: "s1 is longer than s2, impossible.", logic: "s1 > s2", logicClass: 'error', finalRes: 'false' });
  } else {
    const count1 = Array(26).fill(0);
    const count2 = Array(26).fill(0);
    
    for (let i = 0; i < s1.length; i++) {
      count1[s1.charCodeAt(i) - 97]++;
      count2[s2.charCodeAt(i) - 97]++;
    }

    let matches = 0;
    for (let i = 0; i < 26; i++) {
      if (count1[i] === count2[i]) matches++;
    }

    steps.push({
      L: 0, R: s1.length - 1, matches, count1: [...count1], count2: [...count2], found: false,
      activeLines: [2, 3, 4], activeStep: 1,
      desc: `Initialize frequency maps for s1 and the first window of s2 (length ${s1.length}).`,
      logic: `<strong>Init:</strong> First window set up.<br/>matches = ${matches} (out of 26).`, logicClass: 'info'
    });

    let found = matches === 26;
    if (found) {
      steps.push({
        L: 0, R: s1.length - 1, matches, count1: [...count1], count2: [...count2], found: true,
        activeLines: [6], activeStep: 2,
        desc: `First window is a perfect match!`,
        logic: `<strong style="color:var(--green)">Success!</strong> matches == 26!`, logicClass: 'success',
        finalRes: 'true'
      });
    } else {
      let l = 0;
      for (let r = s1.length; r < s2.length; r++) {
        // Add right char
        let index = s2.charCodeAt(r) - 97;
        count2[index]++;
        
        if (count1[index] === count2[index]) matches++;
        else if (count1[index] + 1 === count2[index]) matches--;

        steps.push({
          L: l, R: r, matches, count1: [...count1], count2: [...count2], found: false,
          activeLines: [8, 9, 10, 11], activeStep: 3,
          desc: `Expand window to right. Add '${s2[r]}' to window map. Update matches to ${matches}.`,
          logic: `Added <strong style="color:var(--sky)">'${s2[r]}'</strong>.<br/>matches = ${matches}`, logicClass: 'info'
        });

        // Remove left char
        index = s2.charCodeAt(l) - 97;
        count2[index]--;
        
        if (count1[index] === count2[index]) matches++;
        else if (count1[index] - 1 === count2[index]) matches--;
        
        l++;

        steps.push({
          L: l, R: r, matches, count1: [...count1], count2: [...count2], found: false,
          activeLines: [13, 14, 15, 16], activeStep: 4,
          desc: `Shrink window from left to maintain fixed size. Remove '${s2[l - 1]}' from window map. Update matches to ${matches}.`,
          logic: `Removed <strong style="color:var(--pink)">'${s2[l - 1]}'</strong>.<br/>matches = ${matches}`, logicClass: 'info'
        });

        if (matches === 26) {
          found = true;
          steps.push({
            L: l, R: r, matches, count1: [...count1], count2: [...count2], found: true,
            activeLines: [18], activeStep: 5,
            desc: `Window is a permutation! (matches == 26)`,
            logic: `<strong style="color:var(--green)">Success!</strong> Valid permutation found!`, logicClass: 'success',
            finalRes: 'true'
          });
          break;
        }
      }

      if (!found) {
        steps.push({
          L: l, R: s2.length - 1, matches, count1: [...count1], count2: [...count2], found: false,
          activeLines: [20], activeStep: 6,
          desc: `Finished scanning s2. No permutation of s1 was found.`,
          logic: `<span style="color:var(--hard)">Failure.</span> No permutation found.`, logicClass: 'error',
          finalRes: 'false'
        });
      }
    }
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];

  return (
    <VisualizerLayout>
      <VPHeader title="Permutation in String" lcNum="567" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                const parts = clean.split(', s2 = ');
                const s1Part = parts[0].replace('s1 = ', '').trim();
                const s2Part = parts[1].trim();
                const inputS1 = examples[idx].s1 || JSON.parse(s1Part);
                const inputS2 = examples[idx].s2 || JSON.parse(s2Part);
                setS1(inputS1); 
                setS2(inputS2);
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
              lines={["Count frequencies for s1 and the first window of s2.", "Track how many character frequencies match exactly between the two maps (out of 26 possible).", "Slide the window by 1: add the right char, remove the left char. Update the `matches` count incrementally. Return true if `matches == 26`."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal (s2)
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {s2.split('').map((char: string, i: number) => {
                    const isR = current.R === i;
                    const isL = current.L === i;
                    const isInWindow = i >= current.L && i <= current.R && !current.found;
                    const isSuccess = current.found && i >= current.L && i <= current.R;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isInWindow || isSuccess ? 'highlight' : ''}`}
                          style={{
                            width: '32px',
                            height: '32px',
                            background: isSuccess ? 'var(--viz-green-bg)' : isInWindow ? 'rgba(78, 205, 196, 0.15)' : 'var(--surface)',
                            borderColor: isSuccess ? 'var(--easy)' : isR ? 'var(--sky)' : isL ? 'var(--pink)' : isInWindow ? 'var(--viz-sky-bd)' : 'var(--border)',
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
                  const c1 = current.count1[i];
                  const c2 = current.count2[i];
                  if (c1 === 0 && c2 === 0) return null;
                  
                  const isMatch = c1 === c2;
                  
                  return (
                    <div key={char} style={{ 
                      background: 'var(--surface)', 
                      padding: '4px', borderRadius: '4px', 
                      border: `1px solid ${isMatch ? 'var(--easy)' : 'var(--border-strong)'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{char}</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--muted)' }}>{c1}</span>
                        <span style={{ color: isMatch ? 'var(--easy)' : 'var(--hard)' }}>{c2}</span>
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
                <div className="stbox">
                  <div className="st-lbl">Target Length</div>
                  <div className="st-val">{s1.length}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Length</div>
                  <div className="st-val">{current.R - current.L + 1}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Result</div>
                  <div className="st-val" style={{ color: current.found ? 'var(--easy)' : 'var(--muted)', fontSize: '1rem' }}>
                    {current.found ? 'True' : 'Pending'}
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
              title="Permutation in String"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean checkInclusion(String s1, String s2) {",
                "    if (s1.length() > s2.length()) return false;",
                "    int[] count1 = new int[26], count2 = new int[26];",
                "    for (int i = 0; i < s1.length(); i++) {",
                "        count1[s1.charAt(i) - 'a']++; count2[s2.charAt(i) - 'a']++;",
                "    }",
                "    int matches = 0;",
                "    for (int i = 0; i < 26; i++) if (count1[i] == count2[i]) matches++;",
                "    ",
                "    int l = 0;",
                "    for (int r = s1.length(); r < s2.length(); r++) {",
                "        if (matches == 26) return true;",
                "        ",
                "        int index = s2.charAt(r) - 'a';",
                "        count2[index]++;",
                "        if (count1[index] == count2[index]) matches++;",
                "        else if (count1[index] + 1 == count2[index]) matches--;",
                "        ",
                "        index = s2.charAt(l) - 'a';",
                "        count2[index]--;",
                "        if (count1[index] == count2[index]) matches++;",
                "        else if (count1[index] - 1 == count2[index]) matches--;",
                "        l++;",
                "    }",
                "    return matches == 26;",
                "}"
              ]}
              pythonCode={[
                "def checkInclusion(s1, s2):",
                "    if len(s1) > len(s2): return False",
                "    count1, count2 = [0] * 26, [0] * 26",
                "    for i in range(len(s1)):",
                "        count1[ord(s1[i]) - ord('a')] += 1",
                "        count2[ord(s2[i]) - ord('a')] += 1",
                "    matches = 0",
                "    for i in range(26):",
                "        if count1[i] == count2[i]: matches += 1",
                "    ",
                "    l = 0",
                "    for r in range(len(s1), len(s2)):",
                "        if matches == 26: return True",
                "        index = ord(s2[r]) - ord('a')",
                "        count2[index] += 1",
                "        if count1[index] == count2[index]: matches += 1",
                "        elif count1[index] + 1 == count2[index]: matches -= 1",
                "        ",
                "        index = ord(s2[l]) - ord('a')",
                "        count2[index] -= 1",
                "        if count1[index] == count2[index]: matches += 1",
                "        elif count1[index] - 1 == count2[index]: matches -= 1",
                "        l += 1",
                "    return matches == 26"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Create frequency maps for s1 and the first window of s2 (length of s1). Calculate initial matches (0 to 26)." },
                { num: 2, txt: "Check if the first window is already a match (matches == 26)." },
                { num: 3, txt: "Expand the window to the right: Add the new character to the frequency map and update matches accordingly." },
                { num: 4, txt: "Shrink the window from the left to maintain fixed size: Remove the outgoing character and update matches." },
                { num: 5, txt: "If matches reaches 26, return true." },
                { num: 6, txt: "If the loop finishes without returning true, return false." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Comparing two frequency maps takes <code>O(26)</code> time. By using a <code>matches</code> variable, we can update our similarity score in <code>O(1)</code> time as we slide the window.</>,
              <>When a character enters the window, it might fix a mismatch or create a new one. When a character leaves, it might fix a mismatch or create a new one. We just carefully increment or decrement <code>matches</code> based on these boundaries!</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static boolean checkInclusion(String s1, String s2) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String s1 = "ab";\n        String s2 = "eidbaooo";\n        System.out.println("Output: " + checkInclusion(s1, s2));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def checkInclusion(self, s1: str, s2: str) -> bool:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s1 = "ab"\n    s2 = "eidbaooo"\n    print(f"Output: {Solution().checkInclusion(s1, s2)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parts = clean.split(', s2 = ');
                const s1Part = parts[0].replace('s1 = ', '').trim();
                const s2Part = parts[1].trim();
                const inputS1 = examples[idx].s1 || JSON.parse(s1Part);
                const inputS2 = examples[idx].s2 || JSON.parse(s2Part);
                setS1(inputS1); 
                setS2(inputS2);
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
