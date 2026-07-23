import React, { useState } from 'react';
import { SigmaSquare, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a string <code>s</code>, return <em>the number of <strong>palindromic substrings</strong> in it</em>.</p>
    <p>A string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 's = "abc"', 
    output: '3',
    explanation: <>Three palindromic strings: "a", "b", "c".</>
  },
  { 
    label: 'Example 2', 
    input: 's = "aaa"', 
    output: '6',
    explanation: <>Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 1000</code></div>
    <div><code>s</code> consists of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int countSubstrings(String s) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def countSubstrings(self, s: str) -> int:\n        # Write your code here\n        pass`;

const S = "aaa";

const generateTimeline = () => {
  const timeline: any[] = [];
  const chars = S.split('');
  
  timeline.push({
    currI: -1, expandL: -1, expandR: -1, count: 0, phase: 'init', palsFound: [],
    activeLines: [2], activeStep: 1,
    desc: "Initialize a counter for total palindromic substrings to 0.",
    logic: `<strong>Init:</strong> count = 0`, logicClass: 'info'
  });

  let count = 0;
  const palsFound: string[] = [];

  for (let i = 0; i < S.length; i++) {
    // ODD LENGTH
    timeline.push({
      currI: i, expandL: -1, expandR: -1, count, phase: 'center', palsFound: [...palsFound],
      activeLines: [4, 5], activeStep: 2,
      desc: `Let's use index ${i} ('${chars[i]}') as the center. Check for ODD length palindromes.`,
      logic: `<strong>Center:</strong> i = ${i} ('${chars[i]}')`, logicClass: 'info'
    });

    let l = i, r = i;
    while (l >= 0 && r < S.length) {
      timeline.push({
        currI: i, expandL: l, expandR: r, count, phase: 'expand_odd', palsFound: [...palsFound],
        activeLines: [6, 7], activeStep: 3,
        desc: `Odd expansion: Compare L (${l}) and R (${r}).`,
        logic: `Is <strong style="color:var(--sky)">'${chars[l]}'</strong> == <strong style="color:var(--pink)">'${chars[r]}'</strong>?`, logicClass: 'warning'
      });
      
      if (chars[l] === chars[r]) {
        count++;
        palsFound.push(S.substring(l, r + 1));
        
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'match', palsFound: [...palsFound],
          activeLines: [8], activeStep: 4,
          desc: `Match! We found a palindrome: "${S.substring(l, r + 1)}". Increment the counter.`,
          logic: `<strong style="color:var(--green)">Found Palindrome!</strong> Count = ${count}`, logicClass: 'success'
        });
        
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'expand_odd', palsFound: [...palsFound],
          activeLines: [9, 10], activeStep: 5,
          desc: `Expand outwards: L--, R++.`,
          logic: `Expanding L--, R++`, logicClass: 'info'
        });

        l -= 1;
        r += 1;
      } else {
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'mismatch', palsFound: [...palsFound],
          activeLines: [7], activeStep: 3,
          desc: `Mismatch ('${chars[l]}' != '${chars[r]}'). Stop expanding for this center.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong> Stop expansion.`, logicClass: 'error'
        });
        break;
      }
    }

    // EVEN LENGTH
    timeline.push({
      currI: i, expandL: -1, expandR: -1, count, phase: 'center', palsFound: [...palsFound],
      activeLines: [12, 13], activeStep: 6,
      desc: `Now look for EVEN length palindromes, using the gap between index ${i} and ${i + 1} as the center.`,
      logic: `<strong>Center Gap:</strong> i = ${i}, i+1 = ${i+1}`, logicClass: 'info'
    });

    l = i;
    r = i + 1;
    while (l >= 0 && r < S.length) {
      timeline.push({
        currI: i, expandL: l, expandR: r, count, phase: 'expand_even', palsFound: [...palsFound],
        activeLines: [14, 15], activeStep: 7,
        desc: `Even expansion: Compare L (${l}) and R (${r}).`,
        logic: `Is <strong style="color:var(--sky)">'${chars[l]}'</strong> == <strong style="color:var(--pink)">'${chars[r]}'</strong>?`, logicClass: 'warning'
      });
      
      if (chars[l] === chars[r]) {
        count++;
        palsFound.push(S.substring(l, r + 1));
        
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'match', palsFound: [...palsFound],
          activeLines: [16], activeStep: 4,
          desc: `Match! We found a palindrome: "${S.substring(l, r + 1)}". Increment the counter.`,
          logic: `<strong style="color:var(--green)">Found Palindrome!</strong> Count = ${count}`, logicClass: 'success'
        });
        
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'expand_even', palsFound: [...palsFound],
          activeLines: [17, 18], activeStep: 5,
          desc: `Expand outwards: L--, R++.`,
          logic: `Expanding L--, R++`, logicClass: 'info'
        });

        l -= 1;
        r += 1;
      } else {
        timeline.push({
          currI: i, expandL: l, expandR: r, count, phase: 'mismatch', palsFound: [...palsFound],
          activeLines: [15], activeStep: 7,
          desc: `Mismatch ('${chars[l]}' != '${chars[r]}'). Stop expanding for this center.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong> Stop expansion.`, logicClass: 'error'
        });
        break;
      }
    }
  }

  timeline.push({
    currI: S.length, expandL: -1, expandR: -1, count, phase: 'done', palsFound: [...palsFound],
    activeLines: [21], activeStep: 8,
    desc: `Finished checking all possible centers. Return the total count of palindromes found.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Found ${count} palindromes total.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function PalindromicSubstrings({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Palindromic Substrings" lcNum="647" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Palindromic Substrings" lcNum="647" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<SigmaSquare size={20} />} title="Expand Around Center"
              lines={["Exactly the same approach as Longest Palindromic Substring!", "Iterate through the string, treating each character as the 'center' of an odd palindrome, and each gap as an even palindrome.", "Instead of tracking the max length, simply increment a count every time you expand successfully!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Expansion
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'wrap' }}>
                  {S.split('').map((char: string, i: number) => {
                    const isCenter = i === current.currI;
                    const isL = current.expandL === i;
                    const isR = current.expandR === i;
                    
                    const isWithinExpansion = current.expandL !== -1 && i >= current.expandL && i <= current.expandR;
                    const isMismatch = (isL || isR) && current.phase === 'mismatch';
                    const isMatch = isWithinExpansion && current.phase === 'match';

                    let bg = 'var(--surface)';
                    let border = 'var(--border)';

                    if (isMismatch) {
                      bg = 'var(--viz-red-bg)';
                      border = 'var(--pink)';
                    } else if (isMatch) {
                      bg = 'var(--viz-green-bg)';
                      border = 'var(--easy)';
                    } else if (isWithinExpansion) {
                      bg = 'var(--viz-sky-bg)';
                      border = 'var(--sky)';
                    } else if (isCenter && current.phase === 'center') {
                      bg = 'var(--surface2)';
                      border = 'var(--sky)';
                    }

                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isMismatch ? 'var(--pink)' : 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className="array-block"
                          style={{
                            width: '40px', height: '40px',
                            background: bg, borderColor: border,
                            color: 'var(--text)',
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px', position: 'relative' }}>
                          {isR && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: isMismatch ? 'var(--pink)' : 'var(--sky)' }}>R</span>}
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
                <div className="stbox">
                  <div className="st-lbl">Total Palindromes</div>
                  <div className="st-val" style={{ color: 'var(--easy)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {current.count}
                  </div>
                </div>
                <div className="stbox" style={{ gridColumn: 'span 2' }}>
                  <div className="st-lbl">Found So Far</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px', minHeight: '30px' }}>
                    <AnimatePresence>
                      {current.palsFound.map((pal: string, idx: number) => {
                        const isNew = idx === current.palsFound.length - 1 && current.phase === 'match';
                        return (
                          <motion.div 
                            key={idx}
                            initial={isNew ? { scale: 0 } : { scale: 1 }}
                            animate={{ scale: 1 }}
                            style={{ 
                              background: isNew ? 'var(--sky)' : 'var(--surface2)', 
                              color: isNew ? '#000' : 'var(--text)', 
                              padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid ${isNew ? 'var(--sky)' : 'var(--border)'}`
                            }}
                          >
                            "{pal}"
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Expanding from Center"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Palindromic Substrings"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int countSubstrings(String s) {",
                "    int count = 0;",
                "    for (int i = 0; i < s.length(); i++) {",
                "        // Odd length",
                "        int l = i, r = i;",
                "        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {",
                "            count++;",
                "            l--; r++;",
                "        }",
                "        ",
                "        // Even length",
                "        l = i; r = i + 1;",
                "        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {",
                "            count++;",
                "            l--; r++;",
                "        }",
                "    }",
                "    return count;",
                "}"
              ]}
              pythonCode={[
                "def countSubstrings(self, s: str) -> int:",
                "    count = 0",
                "    for i in range(len(s)):",
                "        # odd length",
                "        l, r = i, i",
                "        while l >= 0 and r < len(s) and s[l] == s[r]:",
                "            count += 1",
                "            l -= 1",
                "            r += 1",
                "            ",
                "        # even length",
                "        l, r = i, i + 1",
                "        while l >= 0 and r < len(s) and s[l] == s[r]:",
                "            count += 1",
                "            l -= 1",
                "            r += 1",
                "            ",
                "    return count"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize a counter for the total number of palindromes." },
                { num: 2, txt: "Iterate through the string. Let the current index be the 'center' of an odd-length palindrome." },
                { num: 3, txt: "Expand left and right as long as the characters match." },
                { num: 4, txt: "For every successful expansion, increment the counter." },
                { num: 5, txt: "Move L outward and R outward." },
                { num: 6, txt: "Now let the 'center' be the gap between the current index and the next (even-length)." },
                { num: 7, txt: "Expand outwards and count successes." },
                { num: 8, txt: "Return the final count." }
              ]} 
            />
            <Complexity time="O(N²)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>This is identical to Longest Palindromic Substring! The core logic of "expanding around centers" discovers <em>every</em> palindrome exactly once.</>,
              <>Therefore, we just need to increment a counter every time the <code>while</code> loop runs successfully, rather than conditionally updating a <code>maxLen</code> variable.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
