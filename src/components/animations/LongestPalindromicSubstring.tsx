import React, { useState } from 'react';
import { Maximize2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 's = "babad"', 
    output: '"bab"',
    explanation: <>"aba" is also a valid answer.</>
  },
  { 
    label: 'Example 2', 
    input: 's = "cbbd"', 
    output: '"bb"',
    explanation: <>The longest palindrome is the even-length string "bb".</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 1000</code></div>
    <div><code>s</code> consist of only digits and English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static String longestPalindrome(String s) {\n        // Write your code here\n        return "";\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Write your code here\n        pass`;

const S = "babad";

const generateTimeline = () => {
  const timeline: any[] = [];
  const chars = S.split('');
  
  timeline.push({
    currI: -1, expandL: -1, expandR: -1, maxLen: 0, resStart: 0, resEnd: 0, phase: 'init',
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize variables to track the longest palindrome found so far (start index and max length).",
    logic: `<strong>Init:</strong> maxLen = 0, start = 0`, logicClass: 'info'
  });

  let maxLen = 0;
  let resStart = 0;
  let resEnd = 0;

  for (let i = 0; i < S.length; i++) {
    // ODD LENGTH
    timeline.push({
      currI: i, expandL: -1, expandR: -1, maxLen, resStart, resEnd, phase: 'center',
      activeLines: [5], activeStep: 2,
      desc: `Let's use index ${i} ('${chars[i]}') as the center. First, look for ODD length palindromes.`,
      logic: `<strong>Center:</strong> i = ${i} ('${chars[i]}')`, logicClass: 'info'
    });

    let l = i, r = i;
    while (l >= 0 && r < S.length) {
      timeline.push({
        currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'expand_odd',
        activeLines: [6, 7, 8], activeStep: 3,
        desc: `Odd expansion: Compare L (${l}) and R (${r}).`,
        logic: `Is <strong style="color:var(--sky)">'${chars[l]}'</strong> == <strong style="color:var(--pink)">'${chars[r]}'</strong>?`, logicClass: 'warning'
      });
      
      if (chars[l] === chars[r]) {
        if (r - l + 1 > maxLen) {
          maxLen = r - l + 1;
          resStart = l;
          resEnd = r;
          timeline.push({
            currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'update',
            activeLines: [9, 10, 11], activeStep: 4,
            desc: `Match! The palindrome length is ${maxLen}. This is our new maximum!`,
            logic: `<strong style="color:var(--green)">New Max!</strong> "${S.substring(resStart, resEnd + 1)}" (Length: ${maxLen})`, logicClass: 'success'
          });
        } else {
          timeline.push({
            currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'expand_odd',
            activeLines: [13, 14], activeStep: 3,
            desc: `Match! Expanding outwards.`,
            logic: `Match! Expanding L--, R++`, logicClass: 'success'
          });
        }
        l -= 1;
        r += 1;
      } else {
        timeline.push({
          currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'mismatch',
          activeLines: [8], activeStep: 3,
          desc: `Mismatch ('${chars[l]}' != '${chars[r]}'). Stop expanding for this center.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong> Stop expansion.`, logicClass: 'error'
        });
        break;
      }
    }

    // EVEN LENGTH
    timeline.push({
      currI: i, expandL: -1, expandR: -1, maxLen, resStart, resEnd, phase: 'center',
      activeLines: [16], activeStep: 5,
      desc: `Now look for EVEN length palindromes, using the gap between index ${i} and ${i + 1} as the center.`,
      logic: `<strong>Center Gap:</strong> i = ${i}, i+1 = ${i+1}`, logicClass: 'info'
    });

    l = i;
    r = i + 1;
    while (l >= 0 && r < S.length) {
      timeline.push({
        currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'expand_even',
        activeLines: [17, 18], activeStep: 6,
        desc: `Even expansion: Compare L (${l}) and R (${r}).`,
        logic: `Is <strong style="color:var(--sky)">'${chars[l]}'</strong> == <strong style="color:var(--pink)">'${chars[r]}'</strong>?`, logicClass: 'warning'
      });
      
      if (chars[l] === chars[r]) {
        if (r - l + 1 > maxLen) {
          maxLen = r - l + 1;
          resStart = l;
          resEnd = r;
          timeline.push({
            currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'update',
            activeLines: [19, 20], activeStep: 4,
            desc: `Match! The palindrome length is ${maxLen}. This is our new maximum!`,
            logic: `<strong style="color:var(--green)">New Max!</strong> "${S.substring(resStart, resEnd + 1)}" (Length: ${maxLen})`, logicClass: 'success'
          });
        } else {
          timeline.push({
            currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'expand_even',
            activeLines: [22, 23], activeStep: 6,
            desc: `Match! Expanding outwards.`,
            logic: `Match! Expanding L--, R++`, logicClass: 'success'
          });
        }
        l -= 1;
        r += 1;
      } else {
        timeline.push({
          currI: i, expandL: l, expandR: r, maxLen, resStart, resEnd, phase: 'mismatch',
          activeLines: [18], activeStep: 6,
          desc: `Mismatch ('${chars[l]}' != '${chars[r]}'). Stop expanding for this center.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong> Stop expansion.`, logicClass: 'error'
        });
        break;
      }
    }
  }

  timeline.push({
    currI: S.length, expandL: -1, expandR: -1, maxLen, resStart, resEnd, phase: 'done',
    activeLines: [26], activeStep: 7,
    desc: `Finished checking all possible centers. Return the longest palindrome found.`,
    logic: `<strong style="color:var(--green)">Done!</strong> Longest is "${S.substring(resStart, resEnd + 1)}"`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function LongestPalindromicSubstring({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Longest Palindromic Substring" lcNum="5" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Longest Palindromic Substring" lcNum="5" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Maximize2 size={20} />} title="Expand Around Center"
              lines={["Iterate through the string, treating each character as the 'center' of a potential palindrome.", "Expand outwards left and right as long as characters match.", "Don't forget that palindromes can be even length (center is the gap between characters) or odd length (center is one character)!"]}
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
                    const isWithinMax = current.maxLen > 0 && i >= current.resStart && i <= current.resEnd;
                    const isMismatch = (isL || isR) && current.phase === 'mismatch';

                    let bg = 'var(--surface)';
                    let border = 'var(--border)';

                    if (isMismatch) {
                      bg = 'rgba(255, 107, 107, 0.2)';
                      border = 'var(--pink)';
                    } else if (isWithinExpansion) {
                      bg = 'rgba(78, 205, 196, 0.2)';
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
                          {isWithinMax && !isL && !isR && (
                            <div style={{ position: 'absolute', bottom: '-10px', left: 0, right: 0, height: '4px', background: 'var(--easy)', borderRadius: '2px' }} />
                          )}
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
                  <div className="st-lbl">Longest Found So Far</div>
                  <div className="st-val" style={{ color: 'var(--easy)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {current.maxLen > 0 ? `"${S.substring(current.resStart, current.resEnd + 1)}"` : '""'}
                  </div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Center Index</div>
                  <div className="st-val">{current.currI !== -1 && current.currI !== S.length ? current.currI : '-'}</div>
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
              title="Longest Palindromic Substring"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public String longestPalindrome(String s) {",
                "    int maxLen = 0;",
                "    int start = 0;",
                "    ",
                "    for (int i = 0; i < s.length(); i++) {",
                "        // Odd length",
                "        int l = i, r = i;",
                "        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {",
                "            if (r - l + 1 > maxLen) {",
                "                maxLen = r - l + 1;",
                "                start = l;",
                "            }",
                "            l--; r++;",
                "        }",
                "        ",
                "        // Even length",
                "        l = i; r = i + 1;",
                "        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {",
                "            if (r - l + 1 > maxLen) {",
                "                maxLen = r - l + 1;",
                "                start = l;",
                "            }",
                "            l--; r++;",
                "        }",
                "    }",
                "    return s.substring(start, start + maxLen);",
                "}"
              ]}
              pythonCode={[
                "def longestPalindrome(self, s: str) -> str:",
                "    res = \"\"",
                "    resLen = 0",
                "    ",
                "    for i in range(len(s)):",
                "        # odd length",
                "        l, r = i, i",
                "        while l >= 0 and r < len(s) and s[l] == s[r]:",
                "            if (r - l + 1) > resLen:",
                "                res = s[l:r+1]",
                "                resLen = r - l + 1",
                "            l -= 1",
                "            r += 1",
                "            ",
                "        # even length",
                "        l, r = i, i + 1",
                "        while l >= 0 and r < len(s) and s[l] == s[r]:",
                "            if (r - l + 1) > resLen:",
                "                res = s[l:r+1]",
                "                resLen = r - l + 1",
                "            l -= 1",
                "            r += 1",
                "            ",
                "    return res"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Keep track of the starting index and max length of the longest palindrome found so far." },
                { num: 2, txt: "Iterate through the string. Let the current index be the 'center' of an odd-length palindrome." },
                { num: 3, txt: "Expand left and right while characters match. Update max if it's the longest seen." },
                { num: 4, txt: "Update the maximum." },
                { num: 5, txt: "Now let the 'center' be the gap between the current index and the next (even-length)." },
                { num: 6, txt: "Expand outwards just like before." },
                { num: 7, txt: "Return the substring using the longest start index and max length." }
              ]} 
            />
            <Complexity time="O(N²)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>Any palindrome must have a center. There are <code>2N - 1</code> possible centers (<code>N</code> individual characters for odd lengths, and <code>N - 1</code> gaps between characters for even lengths).</>,
              <>By expanding around every possible center until a mismatch occurs, we find every possible palindrome. The time complexity is <code>O(N²)</code> in the worst case (e.g. "aaaaa").</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
