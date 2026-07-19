import React, { useState } from 'react';
import { Split, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given a string <code>s</code>, return <code>true</code><em> if the </em><code>s</code><em> can be palindrome after deleting <strong>at most one</strong> character from it</em>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 's = "aba"', 
    output: 'true',
    explanation: <>It's already a palindrome, no deletions needed.</>
  },
  { 
    label: 'Example 2', 
    input: 's = "abca"', 
    output: 'true',
    explanation: <>You could delete the character 'c' to make it "aba".</>
  },
  { 
    label: 'Example 3', 
    input: 's = "abc"', 
    output: 'false',
    explanation: <>Deleting any one character does not make it a palindrome.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 10⁵</code></div>
    <div><code>s</code> consists of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean validPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def validPalindrome(self, s: str) -> bool:\n        # Write your code here\n        pass`;

const S = "radccecar"; // Should be false? wait. r==r, a==a. d!=c. Delete d -> cceca (not pal). Delete c -> adcca (not pal). 
// Let's use s = "radcecar", Wait: "racecar" with a 'd' inserted. "radcecar" -> r==r, a==a, d!=c. Delete d -> "ceca" (Wait, racecar is r a c e c a r. Let's insert 'd' -> r a d c e c a r.
// Let's use s = "abecba"

const STR_INPUT = "abecba";

const isPal = (s: string, i: number, j: number) => {
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++;
    j--;
  }
  return true;
};

const generateTimeline = () => {
  const timeline: any[] = [];
  const chars = STR_INPUT.split('');
  
  timeline.push({
    l: 0, r: chars.length - 1, mode: 'normal', skipType: null, status: 'running', checkL: -1, checkR: -1, checkStatus: 'pending',
    activeLines: [15, 16], activeStep: 1,
    desc: "Initialize a left pointer at the start and a right pointer at the end.",
    logic: `<strong>Init:</strong> L = 0, R = ${chars.length - 1}`, logicClass: 'info'
  });

  let l = 0;
  let r = chars.length - 1;
  let foundMismatch = false;

  while (l < r) {
    timeline.push({
      l, r, mode: 'normal', skipType: null, status: 'running', checkL: -1, checkR: -1, checkStatus: 'pending',
      activeLines: [17], activeStep: 2,
      desc: `Check if L (${l}) < R (${r}). True, so we continue checking.`,
      logic: `L < R is <strong style="color:var(--sky)">true</strong>.`, logicClass: 'info'
    });

    timeline.push({
      l, r, mode: 'normal', skipType: null, status: 'running', checkL: -1, checkR: -1, checkStatus: 'pending',
      activeLines: [18], activeStep: 3,
      desc: `Compare character at L ('${chars[l]}') with character at R ('${chars[r]}').`,
      logic: `Comparing <strong style="color:var(--sky)">'${chars[l]}'</strong> and <strong style="color:var(--pink)">'${chars[r]}'</strong>.`, logicClass: 'info'
    });

    if (chars[l] !== chars[r]) {
      foundMismatch = true;
      timeline.push({
        l, r, mode: 'mismatch', skipType: null, status: 'running', checkL: -1, checkR: -1, checkStatus: 'pending',
        activeLines: [19], activeStep: 4,
        desc: `Mismatch found! '${chars[l]}' != '${chars[r]}'. We can use our 1 allowed deletion here.`,
        logic: `<strong style="color:var(--pink)">Mismatch!</strong> Forking options...`, logicClass: 'error'
      });

      // Try skipping Left
      const skipLValid = isPal(STR_INPUT, l + 1, r);
      timeline.push({
        l, r, mode: 'checking_skip', skipType: 'left', status: 'running', checkL: l + 1, checkR: r, checkStatus: skipLValid ? 'true' : 'false',
        activeLines: [20], activeStep: 5,
        desc: `Option 1: Delete the character at L ('${chars[l]}'). Check if the remaining substring from L+1 to R is a valid palindrome.`,
        logic: `Checking: isPalindrome(s, ${l + 1}, ${r}) -> <strong style="color:var(--${skipLValid ? 'green' : 'pink'})">${skipLValid}</strong>`, logicClass: skipLValid ? 'success' : 'error'
      });

      // Try skipping Right
      const skipRValid = isPal(STR_INPUT, l, r - 1);
      timeline.push({
        l, r, mode: 'checking_skip', skipType: 'right', status: 'running', checkL: l, checkR: r - 1, checkStatus: skipRValid ? 'true' : 'false',
        activeLines: [20], activeStep: 6,
        desc: `Option 2: Delete the character at R ('${chars[r]}'). Check if the remaining substring from L to R-1 is a valid palindrome.`,
        logic: `Checking: isPalindrome(s, ${l}, ${r - 1}) -> <strong style="color:var(--${skipRValid ? 'green' : 'pink'})">${skipRValid}</strong>`, logicClass: skipRValid ? 'success' : 'error'
      });

      if (skipLValid || skipRValid) {
        timeline.push({
          l, r, mode: 'checking_skip', skipType: skipLValid ? 'left' : 'right', status: 'true', checkL: -1, checkR: -1, checkStatus: 'pending',
          activeLines: [20], activeStep: 7,
          desc: `Since one of the options was valid, we return true! We successfully made it a palindrome with 1 deletion.`,
          logic: `<strong style="color:var(--green)">Success!</strong> 1 deletion worked.`, logicClass: 'success'
        });
      } else {
        timeline.push({
          l, r, mode: 'checking_skip', skipType: 'none', status: 'false', checkL: -1, checkR: -1, checkStatus: 'pending',
          activeLines: [20], activeStep: 7,
          desc: `Neither option worked. Even with 1 deletion, it's not a palindrome. Return false.`,
          logic: `<strong style="color:var(--pink)">Failed!</strong> >1 deletions needed.`, logicClass: 'error'
        });
      }
      break; // End after mismatch fork
    } else {
      timeline.push({
        l, r, mode: 'normal', skipType: null, status: 'running', checkL: -1, checkR: -1, checkStatus: 'pending',
        activeLines: [22, 23], activeStep: 8,
        desc: `Characters match! Move both pointers inwards.`,
        logic: `Match! L = ${l + 1}, R = ${r - 1}`, logicClass: 'success'
      });
      l++;
      r--;
    }
  }

  if (!foundMismatch) {
    timeline.push({
      l, r, mode: 'normal', skipType: null, status: 'true', checkL: -1, checkR: -1, checkStatus: 'pending',
      activeLines: [25], activeStep: 9,
      desc: `L >= R. We successfully checked all characters with 0 deletions! Return true.`,
      logic: `<strong style="color:var(--green)">Done!</strong> It's a perfect palindrome.`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function ValidPalindromeII({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Valid Palindrome II" lcNum="680" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Valid Palindrome II" lcNum="680" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Split size={20} />} title="Two Pointers + One Fork"
              lines={["Move L and R inwards as long as characters match.", "When a mismatch occurs, we have 1 'get out of jail free' card. We can either delete L (check L+1 to R) or delete R (check L to R-1).", "If either resulting substring is a perfect palindrome, return true!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', flexWrap: 'wrap' }}>
                  {STR_INPUT.split('').map((char: string, i: number) => {
                    const isL = current.l === i;
                    const isR = current.r === i;
                    const isProcessed = (i < current.l || i > current.r);
                    const isMismatch = (isL || isR) && current.mode === 'mismatch';
                    
                    const isSkipped = (isL && current.skipType === 'left') || (isR && current.skipType === 'right');
                    const isCheckSub = current.mode === 'checking_skip' && i >= current.checkL && i <= current.checkR && current.checkL !== -1;

                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let op = 1;

                    if (isProcessed && current.mode === 'normal') {
                      bg = 'var(--surface2)';
                      border = 'var(--border-strong)';
                    } else if (isMismatch) {
                      bg = 'rgba(255, 107, 107, 0.2)';
                      border = 'var(--pink)';
                    } else if (isSkipped) {
                      bg = 'rgba(255, 107, 107, 0.5)';
                      border = 'var(--pink)';
                      op = 0.3; // faded out
                    } else if (isCheckSub) {
                      bg = current.checkStatus === 'true' ? 'rgba(34, 197, 94, 0.2)' : current.checkStatus === 'false' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(78, 205, 196, 0.1)';
                      border = current.checkStatus === 'true' ? 'var(--easy)' : current.checkStatus === 'false' ? 'var(--pink)' : 'var(--sky)';
                    } else if (isL && current.mode === 'normal') {
                      bg = 'rgba(78, 205, 196, 0.2)';
                      border = 'var(--sky)';
                    } else if (isR && current.mode === 'normal') {
                      bg = 'rgba(78, 205, 196, 0.2)';
                      border = 'var(--sky)';
                    }
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isMismatch ? 'var(--pink)' : 'var(--sky)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${(isL || isR || isCheckSub) && !isSkipped ? 'highlight' : ''}`}
                          style={{
                            width: '40px', height: '40px',
                            background: bg, borderColor: border,
                            color: 'var(--text)', opacity: op,
                            fontSize: '1.2rem', fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: isMismatch ? 'var(--pink)' : 'var(--sky)' }}>R</span>}
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
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Checking with 1 Deletion"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Valid Palindrome II"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "private boolean isPalindrome(String s, int i, int j) {",
                "    while (i < j) {",
                "        if (s.charAt(i) != s.charAt(j)) {",
                "            return false;",
                "        }",
                "        i++;",
                "        j--;",
                "    }",
                "    return true;",
                "}",
                "",
                "public boolean validPalindrome(String s) {",
                "    int l = 0;",
                "    int r = s.length() - 1;",
                "    while (l < r) {",
                "        if (s.charAt(l) != s.charAt(r)) {",
                "            return isPalindrome(s, l + 1, r) || ",
                "                   isPalindrome(s, l, r - 1);",
                "        }",
                "        l++;",
                "        r--;",
                "    }",
                "    return true;",
                "}"
              ]}
              pythonCode={[
                "def isPalindromeRange(s: str, i: int, j: int) -> bool:",
                "    while i < j:",
                "        if s[i] != s[j]:",
                "            return False",
                "        i += 1",
                "        j -= 1",
                "    return True",
                "",
                "def validPalindrome(self, s: str) -> bool:",
                "    l = 0",
                "    r = len(s) - 1",
                "    while l < r:",
                "        if s[l] != s[r]:",
                "            return (isPalindromeRange(s, l + 1, r) or",
                "                    isPalindromeRange(s, l, r - 1))",
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
                { num: 1, txt: "Create a helper function to verify if a substring is a perfect palindrome." },
                { num: 2, txt: "Initialize L at 0 and R at the end." },
                { num: 3, txt: "Move L and R inwards as long as characters match." },
                { num: 4, txt: "If a mismatch occurs, we have two choices: delete L or delete R." },
                { num: 5, txt: "Check if the substring from L+1 to R is a palindrome." },
                { num: 6, txt: "Check if the substring from L to R-1 is a palindrome." },
                { num: 7, txt: "If either is true, return true. Otherwise false." },
                { num: 8, txt: "If they match, move inward." },
                { num: 9, txt: "If loop finishes without mismatches, it's a palindrome with 0 deletions!" }
              ]} 
            />
            <Complexity time="O(N)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>When a mismatch occurs, we MUST delete one of the two characters that mismatched to have any hope of forming a palindrome.</>,
              <>By branching into exactly two possibilities and running a standard <code>O(N)</code> palindrome check on the remaining substring, we guarantee an <code>O(N)</code> overall runtime since we only branch <em>once</em>.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
