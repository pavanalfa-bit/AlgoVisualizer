import React, { useState } from 'react';
import { MousePointerSquareDashed, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <em>the <strong>minimum window substring</strong> of </em><code>s</code><em> such that every character in </em><code>t</code><em> (<strong>including duplicates</strong>) is included in the window</em>. If there is no such substring, return the empty string <code>""</code>.</p>
    <p>The testcases will be generated such that the answer is <strong>unique</strong>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 's = "ADOBECODEBANC", t = "ABC"', 
    output: '"BANC"',
    explanation: <>The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.</>
  },
  { 
    label: 'Example 2', 
    input: 's = "a", t = "a"', 
    output: '"a"',
    explanation: <>The entire string s is the minimum window.</>
  },
  { 
    label: 'Example 3', 
    input: 's = "a", t = "aa"', 
    output: '""',
    explanation: <>Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>m == s.length</code></div>
    <div><code>n == t.length</code></div>
    <div><code>1 &lt;= m, n &lt;= 10⁵</code></div>
    <div><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static String minWindow(String s, String t) {\n        // Write your code here\n        return "";\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Write your code here\n        pass`;

const S = "ADOBECODEBANC";
const T = "ABC";

const generateTimeline = () => {
  const timeline: any[] = [];
  
  const countT: Record<string, number> = {};
  for (const c of T) {
    countT[c] = (countT[c] || 0) + 1;
  }
  
  const need = Object.keys(countT).length;
  let have = 0;
  
  const window: Record<string, number> = {};
  
  let res: [number, number] = [-1, -1];
  let resLen = Infinity;
  let L = 0;
  
  timeline.push({
    L, R: 0, have, need, window: { ...window }, res, resLen,
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize count map for target string `t`. Set `have` = 0 and `need` = number of unique characters in `t`.",
    logic: `<strong>Init:</strong> need = ${need} (unique chars in "${T}").<br/>have = 0.`, logicClass: 'info'
  });

  for (let R = 0; R < S.length; R++) {
    const c = S[R];
    window[c] = (window[c] || 0) + 1;
    
    let addedToHave = false;
    if (countT[c] && window[c] === countT[c]) {
      have++;
      addedToHave = true;
    }
    
    timeline.push({
      L, R, have, need, window: { ...window }, res, resLen,
      activeLines: [5, 6, 7], activeStep: 2,
      desc: `Add '${c}' to window map. ${addedToHave ? `Frequency matches target! Increment 'have' to ${have}.` : ''}`,
      logic: `Added <strong style="color:var(--sky)">'${c}'</strong> to window.<br/>${addedToHave ? `<strong style="color:var(--green)">Met requirement for '${c}'!</strong> have = ${have}` : `have = ${have}`}`, logicClass: addedToHave ? 'success' : 'info'
    });

    while (have === need) {
      if ((R - L + 1) < resLen) {
        resLen = R - L + 1;
        res = [L, R];
      }
      
      const windowStr = S.substring(res[0], res[1] + 1);
      
      timeline.push({
        L, R, have, need, window: { ...window }, res, resLen,
        activeLines: [9, 10, 11], activeStep: 3,
        desc: `Window is valid (have == need)! Update minimum window string to "${windowStr}".`,
        logic: `<strong style="color:var(--green)">Valid Window Found!</strong><br/>Size: ${R - L + 1}.`, logicClass: 'success'
      });

      const leftChar = S[L];
      window[leftChar]--;
      
      let removedFromHave = false;
      if (countT[leftChar] && window[leftChar] < countT[leftChar]) {
        have--;
        removedFromHave = true;
      }
      L++;
      
      timeline.push({
        L, R, have, need, window: { ...window }, res, resLen,
        activeLines: [13, 14, 15, 16], activeStep: 4,
        desc: `Shrink window from left. Remove '${leftChar}' from window map. ${removedFromHave ? `We lost the requirement for '${leftChar}'. Decrement 'have' to ${have}.` : 'Window remains valid!'}`,
        logic: `Shrinking... Removed <strong style="color:var(--pink)">'${leftChar}'</strong>.<br/>${removedFromHave ? `<strong style="color:var(--hard)">Lost requirement for '${leftChar}'.</strong> have = ${have}` : `Still valid! have = ${have}`}`, logicClass: removedFromHave ? 'warning' : 'info'
      });
    }
  }

  const finalStr = resLen !== Infinity ? S.substring(res[0], res[1] + 1) : '""';

  timeline.push({
    L, R: S.length, have, need, window: { ...window }, res, resLen,
    activeLines: [19], activeStep: 5,
    desc: `Iterated through the entire string. Minimum window substring is "${finalStr}".`,
    logic: `<strong style="color:var(--green)">Success!</strong> Minimum window is <strong>"${finalStr}"</strong>.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function MinimumWindowSubstring({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Minimum Window Substring" lcNum="76" difficulty="Hard" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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

  // Pre-calculate countT for visual reference
  const countT: Record<string, number> = {};
  for (const c of T) {
    countT[c] = (countT[c] || 0) + 1;
  }

  return (
    <VisualizerLayout>
      <VPHeader title="Minimum Window Substring" lcNum="76" difficulty="Hard" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<MousePointerSquareDashed size={20} />} title="Sliding Window + 'Have & Need'"
              lines={["Count frequencies of chars in `t`. We `need` this many unique characters to be satisfied.", "Expand window (R). If a character's frequency in the window matches its frequency in `t`, increment `have`.", "When `have == need`, the window is valid! Shrink it from the left (L) to find the minimum length."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {S.split('').map((char, i) => {
                    const isR = current.R === i;
                    const isL = current.L === i;
                    const isInWindow = i >= current.L && i <= current.R && current.R < S.length;
                    const isMinWindow = current.res[0] !== -1 && i >= current.res[0] && i <= current.res[1];
                    
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
                            background: isMinWindow ? 'rgba(78, 205, 196, 0.5)' : isInWindow ? 'rgba(78, 205, 196, 0.15)' : 'var(--surface)',
                            borderColor: isR ? 'var(--sky)' : isL ? 'var(--pink)' : isMinWindow ? 'var(--accent)' : isInWindow ? 'rgba(78, 205, 196, 0.8)' : 'var(--border)',
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Target `t` Frequencies</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(countT).map(([char, count]) => (
                    <div key={char} style={{ 
                      background: 'var(--surface2)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-strong)',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{char}</span>
                      <span style={{ color: 'var(--muted)' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Window Frequencies</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(current.window).map(([char, count]: [string, any]) => {
                    if (count === 0) return null;
                    const isTarget = countT[char] !== undefined;
                    const isSatisfied = isTarget && count >= countT[char];
                    
                    return (
                      <div key={char} style={{ 
                        background: isSatisfied ? 'var(--easy-dim)' : isTarget ? 'var(--hard-dim)' : 'var(--surface2)', 
                        padding: '4px 12px', borderRadius: '4px', 
                        border: `1px solid ${isSatisfied ? 'var(--easy)' : isTarget ? 'var(--hard)' : 'var(--border-strong)'}`,
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        <span style={{ fontWeight: 'bold' }}>{char}</span>
                        <span style={{ color: isTarget ? 'var(--text)' : 'var(--muted)' }}>{count}</span>
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
                  <div className="st-lbl">Have</div>
                  <div className="st-val" style={{ color: current.have === current.need ? 'var(--easy)' : 'var(--hard)' }}>{current.have}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Need</div>
                  <div className="st-val">{current.need}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Length</div>
                  <div className="st-val">{current.R < S.length ? current.R - current.L + 1 : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Min Result</div>
                  <div className="st-val" style={{ color: 'var(--accent)', fontSize: '1rem' }}>
                    {current.resLen === Infinity ? 'None' : S.substring(current.res[0], current.res[1] + 1)}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Sliding Window"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Minimum Window Substring"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public String minWindow(String s, String t) {",
                "    Map<Character, Integer> countT = new HashMap<>();",
                "    for (char c : t.toCharArray()) countT.put(c, countT.getOrDefault(c, 0) + 1);",
                "    int have = 0, need = countT.size();",
                "    int[] res = {-1, -1}; int resLen = Integer.MAX_VALUE;",
                "    Map<Character, Integer> window = new HashMap<>();",
                "    int l = 0;",
                "    for (int r = 0; r < s.length(); r++) {",
                "        char c = s.charAt(r);",
                "        window.put(c, window.getOrDefault(c, 0) + 1);",
                "        if (countT.containsKey(c) && window.get(c).equals(countT.get(c))) have++;",
                "        ",
                "        while (have == need) {",
                "            if ((r - l + 1) < resLen) {",
                "                res = new int[]{l, r}; resLen = r - l + 1;",
                "            }",
                "            char left = s.charAt(l);",
                "            window.put(left, window.get(left) - 1);",
                "            if (countT.containsKey(left) && window.get(left) < countT.get(left)) have--;",
                "            l++;",
                "        }",
                "    }",
                "    return resLen != Integer.MAX_VALUE ? s.substring(res[0], res[1] + 1) : \"\";",
                "}"
              ]}
              pythonCode={[
                "def minWindow(s, t):",
                "    countT, window = {}, {}",
                "    for c in t: countT[c] = countT.get(c, 0) + 1",
                "    have, need = 0, len(countT)",
                "    res, resLen = [-1, -1], float('inf')",
                "    l = 0",
                "    for r in range(len(s)):",
                "        c = s[r]",
                "        window[c] = window.get(c, 0) + 1",
                "        if c in countT and window[c] == countT[c]: have += 1",
                "        ",
                "        while have == need:",
                "            if (r - l + 1) < resLen:",
                "                res = [l, r]; resLen = r - l + 1",
                "            left = s[l]",
                "            window[left] -= 1",
                "            if left in countT and window[left] < countT[left]: have -= 1",
                "            l += 1",
                "            ",
                "    l, r = res",
                "    return s[l:r+1] if resLen != float('inf') else \"\""
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Create a frequency map for t. Set need to the number of unique characters in t." },
                { num: 2, txt: "Expand window by moving R. Add character to window map. If its frequency matches the target map, increment have." },
                { num: 3, txt: "When have == need, the window contains all characters! Update the minimum result window if this is the shortest valid window seen." },
                { num: 4, txt: "Try to shrink the window from the left to find a smaller valid window. If we remove a required character and its frequency drops below the target, decrement have." },
                { num: 5, txt: "Return the smallest valid substring found." }
              ]} 
            />
            <Complexity time="O(m + n)" space="O(m + n)" />
            <WhyItWorks paragraphs={[
              <>Instead of checking if two hash maps are identical at every step (which would take <code>O(26)</code> time), we maintain a <code>have</code> and <code>need</code> counter.</>,
              <><code>have</code> tracks how many <em>unique</em> characters from <code>t</code> have met their required frequency in our current window.</>,
              <>When <code>have == need</code>, we are guaranteed the window is valid in <code>O(1)</code> time, allowing us to rapidly expand and contract the window!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
