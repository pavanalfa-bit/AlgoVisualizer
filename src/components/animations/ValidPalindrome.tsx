import React, { useState } from 'react';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>
    <p>Given a string <code>s</code>, return <code>true</code><em> if it is a <strong>palindrome</strong>, or </em><code>false</code><em> otherwise</em>.</p>
  </>
);

const INITIAL_EXAMPLES = [
  { 
    label: 's = "A man, a plan, a canal: Panama"',
    s: 'A man, a plan, a canal: Panama',
    input: 's = "A man, a plan, a canal: Panama"', 
    output: 'true',
    explanation: <>"amanaplanacanalpanama" is a palindrome.</>
  },
  { 
    label: 's = "race a car"',
    s: 'race a car',
    input: 's = "race a car"', 
    output: 'false',
    explanation: <>"raceacar" is not a palindrome.</>
  },
  { 
    label: 's = " "',
    s: ' ',
    input: 's = " "', 
    output: 'true',
    explanation: <>An empty string reads the same forward and backward.</>
  }
];

const EDGE_CASES = [
  '"A man, a plan, a canal: Panama"',
  '"   "',
  '"0P"',
  '"race a E-car"',
  '"Are we not pure? “No, sir!” Panama’s moody Noriega brags. “It is garbage!” Irony dooms a man—a prisoner up to new era."'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 2 * 10⁵</code></div>
    <div><code>s</code> consists only of printable ASCII characters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String s = "A man, a plan, a canal: Panama";\n        System.out.println("Result: " + isPalindrome(s));\n    }\n}`;
const DEFAULT_PYTHON = `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        pass\n\nif __name__ == "__main__":\n    s = "A man, a plan, a canal: Panama"\n    print(f"Result: {Solution().isPalindrome(s)}")`;

const isAlphaNumeric = (char: string) => {
  const code = char.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) || // 0-9
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122)   // a-z
  );
};

const generateTimeline = (str: string) => {
  const timeline: any[] = [];
  const chars = str.split('');
  
  timeline.push({
    l: 0, r: chars.length - 1, status: 'running',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize a left pointer at index 0 and a right pointer at the last index.",
    logic: `<strong>Init:</strong> L = 0, R = ${chars.length - 1}`, logicClass: 'info'
  });

  let l = 0;
  let r = chars.length - 1;
  let isValid = true;

  while (l < r) {
    timeline.push({
      l, r, status: 'running',
      activeLines: [4], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True, so proceed into the loop.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    // Skip non-alphanumeric from left
    let skippedL = false;
    while (l < r && !isAlphaNumeric(chars[l])) {
      skippedL = true;
      timeline.push({
        l, r, status: 'running',
        activeLines: [5, 6], activeStep: 3,
        desc: `Character at L ('${chars[l]}') is not alphanumeric. Skip it by incrementing L.`,
        logic: `Skipping <strong style="color:var(--muted)">'${chars[l]}'</strong>.`, logicClass: 'warning'
      });
      l++;
    }
    
    // Skip non-alphanumeric from right
    let skippedR = false;
    while (l < r && !isAlphaNumeric(chars[r])) {
      skippedR = true;
      timeline.push({
        l, r, status: 'running',
        activeLines: [7, 8], activeStep: 3,
        desc: `Character at R ('${chars[r]}') is not alphanumeric. Skip it by decrementing R.`,
        logic: `Skipping <strong style="color:var(--muted)">'${chars[r]}'</strong>.`, logicClass: 'warning'
      });
      r--;
    }

    if (skippedL || skippedR) {
      timeline.push({
        l, r, status: 'running',
        activeLines: [4], activeStep: 2,
        desc: `After skipping, L=${l} and R=${r}. Check loop condition again.`,
        logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
      });
    }

    if (l < r) {
      const charL = chars[l].toLowerCase();
      const charR = chars[r].toLowerCase();
      
      timeline.push({
        l, r, status: 'running',
        activeLines: [10], activeStep: 4,
        desc: `Compare the lowercase versions of the characters at L and R.`,
        logic: `Comparing <strong style="color:var(--sky)">'${charL}'</strong> and <strong style="color:var(--pink)">'${charR}'</strong>.`, logicClass: 'info'
      });

      if (charL !== charR) {
        timeline.push({
          l, r, status: 'false',
          activeLines: [11], activeStep: 5,
          desc: `Mismatch! '${charL}' does not equal '${charR}'. Return false.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong> Return false.`, logicClass: 'error'
        });
        isValid = false;
        break;
      } else {
        timeline.push({
          l, r, status: 'running',
          activeLines: [13, 14], activeStep: 6,
          desc: `Characters match! Move both pointers inwards (L++ and R--).`,
          logic: `Match! L = ${l + 1}, R = ${r - 1}`, logicClass: 'success'
        });
        l++;
        r--;
      }
    }
  }

  if (isValid) {
    timeline.push({
      l, r, status: 'true',
      activeLines: [16], activeStep: 7,
      desc: `L >= R. We successfully checked all valid characters from the outside inwards. Return true!`,
      logic: `<strong style="color:var(--green)">Done!</strong> It is a valid palindrome.`, logicClass: 'success'
    });
  }

  return timeline;
};

export default function ValidPalindrome({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [examples, setExamples] = useState(INITIAL_EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [s, setS] = useState(INITIAL_EXAMPLES[0].s);
  const [timeline, setTimeline] = useState(() => generateTimeline(INITIAL_EXAMPLES[0].s));
  
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    let clean = val;
    if (val.startsWith('s = ')) clean = val.substring(4);
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.substring(1, clean.length - 1);
    }

    const formattedLabel = `${isEdgeCase ? '✨ ' : ''}s = "${clean}"`;
    let outputStr = 'true';
    let l = 0; let r = clean.length - 1;
    while(l < r) {
       while(l < r && !isAlphaNumeric(clean[l])) l++;
       while(l < r && !isAlphaNumeric(clean[r])) r--;
       if(l < r && clean[l].toLowerCase() !== clean[r].toLowerCase()) { outputStr = 'false'; break; }
       l++; r--;
    }

    const newEx = {
      label: formattedLabel,
      s: clean,
      input: formattedLabel,
      output: outputStr,
      explanation: undefined as any
    };

    const newExamples = [...examples, newEx];
    setExamples(newExamples);
    setActiveEx(newExamples.length - 1);
    setS(clean);
    setTimeline(generateTimeline(clean));
    reset();
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    const match = exampleStr.match(/s = "(.*)"/);
    if (!match) return code;
    const strVal = match[1];

    if (lang === 'java') {
      return code.replace(/String s = ".*?";/, `String s = "${strVal}";`);
    } else {
      return code.replace(/s = ".*"/, `s = "${strVal}"`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Valid Palindrome" lcNum="125" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                setS(examples[idx].s); 
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
      <VPHeader title="Valid Palindrome" lcNum="125" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            setS(examples[idx].s); 
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
            
            <ApproachBanner icon={<RefreshCcw size={20} />} title="Two Pointers (Inwards)"
              lines={["Use a left pointer at the start and a right pointer at the end.", "Skip over any characters that are not letters or numbers.", "Compare the lowercase versions. If they differ, it's not a palindrome. Otherwise, move them inwards."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap' }}>
                  {s.split('').map((char: string, i: number) => {
                    const isL = current.l === i && current.status === 'running';
                    const isR = current.r === i && current.status === 'running';
                    const isProcessed = (i < current.l || i > current.r);
                    const isError = (i === current.l || i === current.r) && current.status === 'false';
                    const isAlpha = isAlphaNumeric(char);
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {(isL || isError) && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isError ? 'var(--pink)' : 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isL || isR || isError ? 'highlight' : ''}`}
                          style={{
                            width: '40px', height: '40px',
                            background: isError ? 'rgba(255, 107, 107, 0.2)' : isL ? 'rgba(78, 205, 196, 0.2)' : isR ? 'rgba(255, 107, 107, 0.15)' : isProcessed ? 'var(--surface2)' : 'var(--surface)',
                            borderColor: isError ? 'var(--pink)' : isL ? 'var(--sky)' : isR ? 'var(--pink)' : isProcessed ? 'var(--border-strong)' : 'var(--border)',
                            color: isAlpha ? 'var(--text)' : 'var(--muted)',
                            opacity: isAlpha ? 1 : 0.5,
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {(isR || (isError && current.l !== current.r)) && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>R</span>}
                        </div>
                      </div>
                    );
                  })}
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
            <StepCard title={step === timeline.length - 1 ? "Done!" : "Comparing Characters"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Valid Palindrome"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean isPalindrome(String s) {",
                "    int l = 0;",
                "    int r = s.length() - 1;",
                "    while (l < r) {",
                "        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) {",
                "            l++;",
                "        }",
                "        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) {",
                "            r--;",
                "        }",
                "        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {",
                "            return false;",
                "        }",
                "        l++;",
                "        r--;",
                "    }",
                "    return true;",
                "}"
              ]}
              pythonCode={[
                "def isPalindrome(s: str) -> bool:",
                "    l = 0",
                "    r = len(s) - 1",
                "    while l < r:",
                "        while l < r and not s[l].isalnum():",
                "            l += 1",
                "            ",
                "        while l < r and not s[r].isalnum():",
                "            r -= 1",
                "            ",
                "        if s[l].lower() != s[r].lower():",
                "            return False",
                "            ",
                "        l += 1",
                "        r -= 1",
                "        ",
                "    return True"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize two pointers, L at the start and R at the end." },
                { num: 2, txt: "Loop while L is strictly less than R." },
                { num: 3, txt: "Inner while loops: advance L if it's not alphanumeric, and decrement R if it's not alphanumeric." },
                { num: 4, txt: "Compare the lowercase forms of the alphanumeric characters." },
                { num: 5, txt: "If they do not match, it's not a palindrome. Return false." },
                { num: 6, txt: "If they match, move both pointers inward." },
                { num: 7, txt: "If the outer loop finishes without mismatches, return true." }
              ]} 
            />
            <Complexity time="O(N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Instead of creating a completely new string with all the punctuation removed (which takes <code>O(N)</code> extra space and multiple passes), we can just skip the punctuation on the fly!</>,
              <>By moving pointers from both ends, we achieve a single <code>O(N)</code> pass and <code>O(1)</code> space efficiency.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
