import React, { useState } from 'react';
import { Network, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given two strings <code>s</code> and <code>t</code>, <em>determine if they are isomorphic</em>.</p>
    <p>Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.</p>
  </>
);

const EXAMPLES = [
  { label: 's = "egg", t = "add"', input: 's = "egg", t = "add"', s: "egg", t: "add", output: 'true', explanation: <>'e' maps to 'a', 'g' maps to 'd'. All characters map consistently.</> },
  { label: 's = "foo", t = "bar"', input: 's = "foo", t = "bar"', s: "foo", t: "bar", output: 'false', explanation: <>'o' attempts to map to both 'a' and 'r', which is invalid.</> },
  { label: 's = "paper", t = "title"', input: 's = "paper", t = "title"', s: "paper", t: "title", output: 'true', explanation: <>'p'-&gt;'t', 'a'-&gt;'i', 'e'-&gt;'l', 'r'-&gt;'e'.</> }
];

const EDGE_CASES = [
  's = "ab", t = "aa"',
  's = "a", t = "a"',
  's = "badc", t = "baba"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 5 * 10⁴</code></div>
    <div><code>t.length == s.length</code></div>
    <div><code>s</code> and <code>t</code> consist of any valid ascii character.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean isIsomorphic(String s, String t) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass`;

export default function IsomorphicStrings({ onBack }: { onBack?: () => void }) {
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
      
      if (typeof parsedS !== 'string' || typeof parsedT !== 'string' || parsedS.length !== parsedT.length) {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${parsedS}", t = "${parsedT}"`;
      
      let res = true;
      let map1: any = {};
      let map2: any = {};
      for (let i = 0; i < parsedS.length; i++) {
        const c1 = parsedS[i];
        const c2 = parsedT[i];
        if ((map1[c1] && map1[c1] !== c2) || (map2[c2] && map2[c2] !== c1)) {
          res = false;
          break;
        }
        map1[c1] = c2;
        map2[c2] = c1;
      }
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s: parsedS,
        t: parsedT,
        output: res ? 'true' : 'false',
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS(parsedS);
      setT(parsedT);
      reset();
    } catch (e) {
      alert('Invalid format or lengths differ! Please use: s = "abc", t = "def"');
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
        `public static void main(String[] args) {\n        String s = ${sPart};\n        String t = ${tPart};\n        boolean res = isIsomorphic(s, t);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s = ${sPart}\n    t = ${tPart}\n    res = Solution().isIsomorphic(s, t)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  const mapS: Record<string, string> = {};
  const mapT: Record<string, string> = {};
  
  steps.push({
    curr: -1, mapS: { ...mapS }, mapT: { ...mapT }, status: 'running',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize two empty Hash Maps. One to map characters from s to t, and another to map from t to s.",
    logic: `<strong>Init:</strong> Hash Maps are empty.`, logicClass: 'info'
  });

  let valid = true;
  for (let i = 0; i < s.length; i++) {
    const c1 = s[i];
    const c2 = tStr[i];
    
    steps.push({
      curr: i, mapS: { ...mapS }, mapT: { ...mapT }, status: 'running',
      activeLines: [5, 6, 7], activeStep: 2,
      desc: `Check character pair: s[${i}] = '${c1}' and t[${i}] = '${c2}'.`,
      logic: `Checking pair: <strong style="color:var(--sky)">'${c1}'</strong> ↔ <strong style="color:var(--accent)">'${c2}'</strong>`, logicClass: 'info'
    });

    if (
      (mapS[c1] && mapS[c1] !== c2) ||
      (mapT[c2] && mapT[c2] !== c1)
    ) {
      valid = false;
      steps.push({
        curr: i, mapS: { ...mapS }, mapT: { ...mapT }, status: 'false',
        activeLines: [9, 10, 11], activeStep: 3,
        desc: `Conflict found! ${mapS[c1] && mapS[c1] !== c2 ? `'${c1}' already maps to '${mapS[c1]}', not '${c2}'.` : `'${c2}' is already mapped from '${mapT[c2]}', not '${c1}'.`} Return false.`,
        logic: `<strong style="color:var(--pink)">Conflict!</strong> Mapping is inconsistent.<br/>Return false.`, logicClass: 'error',
        finalRes: 'false'
      });
      break;
    }

    mapS[c1] = c2;
    mapT[c2] = c1;

    steps.push({
      curr: i, mapS: { ...mapS }, mapT: { ...mapT }, status: 'running',
      activeLines: [13, 14], activeStep: 4,
      desc: `No conflict. Establish the mapping: '${c1}' ↔ '${c2}'.`,
      logic: `Mapped <strong style="color:var(--sky)">'${c1}'</strong> ↔ <strong style="color:var(--accent)">'${c2}'</strong>.`, logicClass: 'success'
    });
  }

  if (valid) {
    steps.push({
      curr: s.length, mapS: { ...mapS }, mapT: { ...mapT }, status: 'true',
      activeLines: [16], activeStep: 5,
      desc: `Finished scanning both strings without any mapping conflicts. Return true.`,
      logic: `<strong style="color:var(--green)">Success!</strong> Strings are isomorphic.`, logicClass: 'success',
      finalRes: 'true'
    });
  }

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  return (
    <VisualizerLayout>
      <VPHeader title="Isomorphic Strings" lcNum="205" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
            
            <ApproachBanner icon={<Network size={20} />} title="Two Hash Maps"
              lines={["We must ensure a 1-to-1 mapping. 's' maps to 't', AND 't' maps to 's'.", "Iterate through both strings simultaneously.", "If a character is already mapped to a different character, it's not isomorphic (return false). Otherwise, record the mapping."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'nowrap', flexDirection: 'column' }}>
                  {/* String S */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--sky)' }}>s:</div>
                    {s.split('').map((char: string, i: number) => {
                      const isCurr = current.curr === i;
                      const isConflict = current.status === 'false' && isCurr;
                      return (
                        <motion.div 
                          key={`s-${i}`}
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: '40px', height: '40px',
                            background: isConflict ? 'var(--viz-red-bg)' : isCurr ? 'rgba(78, 205, 196, 0.15)' : 'var(--surface)',
                            borderColor: isConflict ? 'var(--pink)' : isCurr ? 'var(--sky)' : 'var(--border)',
                            color: 'var(--text)'
                          }}
                        >
                          {char}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* String T */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--accent)' }}>t:</div>
                    {tStr.split('').map((char: string, i: number) => {
                      const isCurr = current.curr === i;
                      const isConflict = current.status === 'false' && isCurr;
                      return (
                        <motion.div 
                          key={`t-${i}`}
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: '40px', height: '40px',
                            background: isConflict ? 'var(--viz-red-bg)' : isCurr ? 'rgba(255, 107, 107, 0.15)' : 'var(--surface)',
                            borderColor: isConflict ? 'var(--pink)' : isCurr ? 'var(--accent)' : 'var(--border)',
                            color: 'var(--text)'
                          }}
                        >
                          {char}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Pointers */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '30px' }} />
                    {s.split('').map((_: any, i: number) => (
                      <div key={`ptr-${i}`} style={{ width: '40px', textAlign: 'center' }}>
                        {current.curr === i && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: current.status === 'false' ? 'var(--pink)' : 'var(--sky)' }}>↑</span>}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Map: s ➔ t</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '60px' }}>
                  {Object.keys(current.mapS).length === 0 ? (
                    <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Empty</div>
                  ) : (
                    <AnimatePresence>
                      {Object.entries(current.mapS).map(([k, v]: [string, any]) => (
                        <motion.div
                          key={k}
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          style={{ 
                            background: 'var(--surface2)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-strong)',
                            display: 'flex', alignItems: 'center', gap: '8px'
                          }}
                        >
                          <span style={{ fontWeight: 'bold', color: 'var(--sky)' }}>{k}</span>
                          <span>➔</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{v}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Map: t ➔ s</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '60px' }}>
                  {Object.keys(current.mapT).length === 0 ? (
                    <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Empty</div>
                  ) : (
                    <AnimatePresence>
                      {Object.entries(current.mapT).map(([k, v]: [string, any]) => (
                        <motion.div
                          key={k}
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          style={{ 
                            background: 'var(--surface2)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-strong)',
                            display: 'flex', alignItems: 'center', gap: '8px'
                          }}
                        >
                          <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{k}</span>
                          <span>➔</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--sky)' }}>{v}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
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
            <StepCard title={step === steps.length - 1 ? "Done!" : "Mapping Characters"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Isomorphic Strings"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean isIsomorphic(String s, String t) {",
                "    Map<Character, Character> mapS = new HashMap<>();",
                "    Map<Character, Character> mapT = new HashMap<>();",
                "    ",
                "    for (int i = 0; i < s.length(); i++) {",
                "        char c1 = s.charAt(i);",
                "        char c2 = t.charAt(i);",
                "        ",
                "        if ((mapS.containsKey(c1) && mapS.get(c1) != c2) ||",
                "            (mapT.containsKey(c2) && mapT.get(c2) != c1)) {",
                "            return false;",
                "        }",
                "        ",
                "        mapS.put(c1, c2);",
                "        mapT.put(c2, c1);",
                "    }",
                "    return true;",
                "}"
              ]}
              pythonCode={[
                "def isIsomorphic(s, t):",
                "    mapS, mapT = {}, {}",
                "    ",
                "    for c1, c2 in zip(s, t):",
                "        ",
                "        ",
                "        if ((c1 in mapS and mapS[c1] != c2) or",
                "            (c2 in mapT and mapT[c2] != c1)):",
                "            return False",
                "        ",
                "        mapS[c1] = c2",
                "        mapT[c2] = c1",
                "        ",
                "    return True"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Create two Hash Maps to store the 1-to-1 character mappings." },
                { num: 2, txt: "Iterate through both strings at the same time, looking at character pairs." },
                { num: 3, txt: "If 's' character is mapped to something other than 't' character (or vice versa), return false." },
                { num: 4, txt: "If the mapping is valid (or empty), update both Hash Maps with the new pair." },
                { num: 5, txt: "If we reach the end of the strings without any conflicts, return true." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Why do we need <strong>two</strong> hash maps? A single map from <code>s</code> to <code>t</code> isn't enough because multiple characters in <code>s</code> could map to the <em>same</em> character in <code>t</code> (e.g., <code>s="ab", t="xx"</code>). This violates the isomorphism rule.</>,
              <>By using two maps (or checking <code>map.containsValue</code>), we guarantee a strict 1-to-1 bijective mapping.</>,
              <>The space complexity is O(1) because the maps will store at most 256 key-value pairs (the size of the ASCII character set), regardless of the string length!</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static boolean isIsomorphic(String s, String t) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String s = "foo";\n        String t = "bar";\n        System.out.println("Output: " + isIsomorphic(s, t));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s = "foo"\n    t = "bar"\n    print(f"Output: {Solution().isIsomorphic(s, t)}")`}
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
