import React, { useState } from 'react';
import { Sigma, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const ROMAN_MAP: Record<string, number> = {
  'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
};

const PROBLEM_STATEMENT = (
  <>
    <p>Roman numerals are represented by seven different symbols: <code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code> and <code>M</code>.</p>
    <p>Given a roman numeral, convert it to an integer.</p>
  </>
);

const EXAMPLES = [
  { label: 's = "III"', input: 's = "III"', s: "III", output: '3', explanation: <>III = 3.</> },
  { label: 's = "LVIII"', input: 's = "LVIII"', s: "LVIII", output: '58', explanation: <>L = 50, V= 5, III = 3.</> },
  { label: 's = "MCMXCIV"', input: 's = "MCMXCIV"', s: "MCMXCIV", output: '1994', explanation: <>M = 1000, CM = 900, XC = 90 and IV = 4.</> }
];

const EDGE_CASES = [
  's = "MMMCMXCIX"',
  's = "I"',
  's = "MDCLXVI"'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 15</code></div>
    <div><code>s</code> contains only the characters <code>('I', 'V', 'X', 'L', 'C', 'D', 'M')</code>.</div>
    <div>It is guaranteed that <code>s</code> is a valid roman numeral in the range <code>[1, 3999]</code>.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int romanToInt(String s) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def romanToInt(self, s: str) -> int:\n        # Write your code here\n        pass`;

export default function RomanToInteger({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s, setS] = useState(EXAMPLES[0].s);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('s = ')) clean = val.substring(4);
      const parsed = JSON.parse(clean);
      if (typeof parsed !== 'string' || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${parsed}"`;
      
      let total = 0;
      for (let i = 0; i < parsed.length; i++) {
        const char = parsed[i];
        const valChar = ROMAN_MAP[char];
        if (i < parsed.length - 1 && valChar < ROMAN_MAP[parsed[i+1]]) {
          total -= valChar;
        } else {
          total += valChar;
        }
      }
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        s: parsed,
        output: total.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setS(parsed);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: s = "IX"');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('s = ')) clean = clean.substring(4);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String s = ${clean};\n        int res = romanToInt(s);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    s = ${clean}\n    res = Solution().romanToInt(s)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  let total = 0;
  
  steps.push({
    curr: -1, total,
    activeLines: [3, 4], activeStep: 1,
    desc: "Initialize a total sum to 0. We'll iterate through the string.",
    logic: `<strong>Init:</strong> total = 0`, logicClass: 'info'
  });

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const val = ROMAN_MAP[char];
    let isSubtractive = false;

    if (i < s.length - 1) {
      const nextChar = s[i + 1];
      const nextVal = ROMAN_MAP[nextChar];
      if (val < nextVal) {
        isSubtractive = true;
      }
    }

    if (isSubtractive) {
      total -= val;
      steps.push({
        curr: i, total, isSubtractive, val,
        activeLines: [5, 6, 7], activeStep: 2,
        desc: `Current value '${char}' (${val}) is LESS than the next value. This means it's a subtractive combination! Subtract ${val} from total.`,
        logic: `Current: ${val} < Next: ${ROMAN_MAP[s[i + 1]]}.<br/>Subtracting <strong style="color:var(--pink)">${val}</strong>. total = ${total}`, logicClass: 'warning'
      });
    } else {
      total += val;
      steps.push({
        curr: i, total, isSubtractive, val,
        activeLines: [8, 9], activeStep: 3,
        desc: `Current value '${char}' (${val}) is >= the next value (or is the last char). Add ${val} to total.`,
        logic: `Adding <strong style="color:var(--sky)">${val}</strong>. total = ${total}`, logicClass: 'success'
      });
    }
  }

  steps.push({
    curr: s.length, total,
    activeLines: [11], activeStep: 4,
    desc: `Finished traversing the string. The total integer value is ${total}.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Final result is <strong>${total}</strong>.`, logicClass: 'success',
    finalRes: `${total}`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Roman to Integer" lcNum="13" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={EXAMPLES}
          constraints={CONSTRAINTS}
          defaultCodeJava={DEFAULT_JAVA}
          defaultCodePython={DEFAULT_PYTHON}
        />
      </VisualizerLayout>
    );
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Roman to Integer" lcNum="13" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
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
            
            <ApproachBanner icon={<Sigma size={20} />} title="Left-to-Right Scan"
              lines={["Usually, Roman numerals are written largest to smallest from left to right (e.g. XII). We just add them up.", "If a smaller numeral appears BEFORE a larger numeral (e.g. IX), it's a subtractive form. We subtract it instead of adding!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'wrap' }}>
                  {s.split('').map((char: string, i: number) => {
                    const isCurr = current.curr === i;
                    const isProcessed = i < current.curr;
                    const isSubtractive = isCurr && current.isSubtractive;
                    const val = ROMAN_MAP[char];
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isCurr && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isSubtractive ? 'var(--pink)' : 'var(--sky)' }}>↓</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: '48px',
                            height: '48px',
                            background: isCurr ? (isSubtractive ? 'var(--viz-red-bg)' : 'var(--viz-sky-bg)') : isProcessed ? 'var(--surface2)' : 'var(--surface)',
                            borderColor: isCurr ? (isSubtractive ? 'var(--pink)' : 'var(--sky)') : isProcessed ? 'var(--border-strong)' : 'var(--border)',
                            color: 'var(--text)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px', fontSize: '0.8rem', color: isCurr ? (isSubtractive ? 'var(--pink)' : 'var(--sky)') : 'var(--muted)', fontWeight: isCurr ? 'bold' : 'normal' }}>
                          {isProcessed || isCurr ? (isSubtractive ? `-${val}` : `+${val}`) : val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox" style={{ gridColumn: 'span 2' }}>
                  <div className="st-lbl">Total</div>
                  <div className="st-val" style={{ color: 'var(--easy)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {current.total}
                  </div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Action</div>
                  <div className="st-val" style={{ color: current.isSubtractive ? 'var(--pink)' : 'var(--sky)' }}>
                    {current.curr >= 0 && current.curr < s.length ? (current.isSubtractive ? 'Subtracting' : 'Adding') : '-'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === steps.length - 1 ? "Done!" : "Scanning"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Roman to Integer"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int romanToInt(String s) {",
                "    Map<Character, Integer> map = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);",
                "    int total = 0;",
                "    for (int i = 0; i < s.length(); i++) {",
                "        if (i < s.length() - 1 && map.get(s.charAt(i)) < map.get(s.charAt(i + 1))) {",
                "            total -= map.get(s.charAt(i));",
                "        } else {",
                "            total += map.get(s.charAt(i));",
                "        }",
                "    }",
                "    return total;",
                "}"
              ]}
              pythonCode={[
                "def romanToInt(s: str) -> int:",
                "    roman_map = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}",
                "    total = 0",
                "    for i in range(len(s)):",
                "        if i < len(s) - 1 and roman_map[s[i]] < roman_map[s[i + 1]]:",
                "            total -= roman_map[s[i]]",
                "        else:",
                "            total += roman_map[s[i]]",
                "            ",
                "    return total"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize a total sum to 0." },
                { num: 2, txt: "Iterate left-to-right. If the current numeral is smaller than the next one, subtract its value from the total." },
                { num: 3, txt: "Otherwise, add its value to the total." },
                { num: 4, txt: "Return the accumulated total." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Roman numerals are essentially a summation sequence. The only exception is when a smaller numeral is placed before a larger one to save space (e.g. IV instead of IIII).</>,
              <>By checking the immediate right neighbor, we can deterministically know whether we should add or subtract the current numeral.</>
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
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static int romanToInt(String s) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        String s = "MCMXCIV";\n        System.out.println("Output: " + romanToInt(s));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def romanToInt(self, s: str) -> int:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    s = "MCMXCIV"\n    print(f"Output: {Solution().romanToInt(s)}")`}
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
