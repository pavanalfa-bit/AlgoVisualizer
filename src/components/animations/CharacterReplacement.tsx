import React, { useState } from 'react';
import { Type, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most <code>k</code> times.</p>
    <p>Return <em>the length of the longest substring containing the same letter you can get after performing the above operations</em>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 's = "ABAB", k = 2', 
    output: '4',
    explanation: <>Replace the two 'A's with two 'B's or vice versa.</>
  },
  { 
    label: 'Example 2', 
    input: 's = "AABABBA", k = 1', 
    output: '4',
    explanation: <>Replace the one 'A' in the middle with 'B' and form "AABBBBA".<br/>The substring "BBBB" has the longest repeating letters, which is 4.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= s.length &lt;= 10⁵</code></div>
    <div><code>s</code> consists of only uppercase English letters.</div>
    <div><code>0 &lt;= k &lt;= s.length</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int characterReplacement(String s, int k) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def characterReplacement(self, s: str, k: int) -> int:\n        # Write your code here\n        pass`;

const S = "AABABBA";
const K = 1;

const generateTimeline = () => {
  const timeline: any[] = [];
  let L = 0;
  let maxL = 0;
  let maxF = 0;
  const counts: Record<string, number> = {};
  
  timeline.push({
    L: 0, R: 0, maxL: 0, maxF: 0, counts: { ...counts },
    activeLines: [2, 3, 4], activeStep: 1,
    desc: "Initialize Left and Right pointers. Create an empty frequency map.",
    logic: `<strong>Init:</strong> L = 0, R = 0, maxFrequency = 0.`, logicClass: 'info'
  });

  for (let R = 0; R < S.length; R++) {
    const charR = S[R];
    counts[charR] = (counts[charR] || 0) + 1;
    maxF = Math.max(maxF, counts[charR]);
    
    timeline.push({
      L, R, maxL, maxF, counts: { ...counts },
      activeLines: [6, 7], activeStep: 2,
      desc: `Add '${charR}' to frequency map. Update maxFrequency in current window to ${maxF}.`,
      logic: `Count[${charR}] = ${counts[charR]}.<br/>maxFrequency = ${maxF}.`, logicClass: 'info'
    });

    const windowLen = R - L + 1;
    let isValid = (windowLen - maxF) <= K;
    
    timeline.push({
      L, R, maxL, maxF, counts: { ...counts },
      activeLines: [9], activeStep: 3,
      desc: `Check if window is valid: windowLength (${windowLen}) - maxFrequency (${maxF}) = ${windowLen - maxF}. Is this <= k (${K})?`,
      logic: `Chars to replace = ${windowLen} - ${maxF} = ${windowLen - maxF}.<br/>${isValid ? '<strong style="color:var(--green)">Valid!</strong>' : '<strong style="color:var(--pink)">Invalid! Exceeds k.</strong>'}`, logicClass: isValid ? 'success' : ''
    });

    if (!isValid) {
      const charL = S[L];
      counts[charL]--;
      L++;
      timeline.push({
        L, R, maxL, maxF, counts: { ...counts },
        activeLines: [10, 11], activeStep: 4,
        desc: `Window is invalid! Shrink from the left by removing '${charL}' from frequency map and advancing L.`,
        logic: `Remove <strong style="color:var(--pink)">'${charL}'</strong>.<br/>Increment L to ${L}.`, logicClass: 'info'
      });
    }

    const oldMax = maxL;
    maxL = Math.max(maxL, R - L + 1);
    
    timeline.push({
      L, R, maxL, maxF, counts: { ...counts },
      activeLines: [13], activeStep: 5,
      desc: `Update maximum window length.`,
      logic: `Window size = ${R - L + 1}.<br/>${maxL > oldMax ? '<strong style="color:var(--green)">New max length!</strong>' : ''}`, 
      logicClass: maxL > oldMax ? 'success' : ''
    });
  }

  timeline.push({
    L, R: S.length, maxL, maxF, counts: { ...counts },
    activeLines: [15], activeStep: 6,
    desc: `Iterated through the entire string. The maximum length is ${maxL}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum length is <strong>${maxL}</strong>.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function CharacterReplacement({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Longest Repeating Character Replacement" lcNum="424" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Longest Repeating Character Replacement" lcNum="424" difficulty="Medium" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Type size={20} />} title="Sliding Window + Frequency Map"
              lines={["Maintain a frequency map of characters in the current window.", "The number of characters we need to replace is (Window Length - Max Frequency).", "If this exceeds k, the window is invalid, so we shrink it from the left."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Traversal (k = {K})
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '4px', flexWrap: 'wrap' }}>
                  {S.split('').map((char, i) => {
                    const isR = current.R === i;
                    const isL = current.L === i;
                    const isInWindow = i >= current.L && i <= current.R && current.R < S.length;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>L</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isInWindow ? 'highlight' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isInWindow ? 'rgba(78, 205, 196, 0.2)' : 'var(--surface)',
                            borderColor: isR ? 'var(--sky)' : isL ? 'var(--pink)' : isInWindow ? 'rgba(78, 205, 196, 0.8)' : 'var(--border)',
                            color: 'var(--text)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {char}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px' }}>
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>R</span>}
                        </div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Window Frequency Map</div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', minHeight: '52px', background: 'var(--surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {Object.keys(current.counts || {}).length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Map is empty</div>
                ) : (
                  <AnimatePresence>
                    {Object.entries(current.counts).map(([char, count]: [string, any]) => {
                      if (count === 0) return null;
                      const isMax = count === current.maxF && count > 0;
                      return (
                        <motion.div
                          key={char}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            background: isMax ? 'var(--accent)' : 'var(--surface2)', 
                            color: isMax ? 'white' : 'var(--text)',
                            borderRadius: '8px', padding: '4px 12px',
                            border: `1px solid ${isMax ? 'var(--accent)' : 'var(--border-strong)'}`
                          }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{char}</span>
                          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{count}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variables</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">Window Size</div>
                  <div className="st-val">{current.R < S.length ? current.R - current.L + 1 : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Max Freq (maxF)</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.maxF}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">To Replace</div>
                  <div className="st-val">{current.R < S.length ? (current.R - current.L + 1) - current.maxF : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Max Length</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.maxL}</div>
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
              title="Character Replacement"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int characterReplacement(String s, int k) {",
                "    int[] counts = new int[26];",
                "    int l = 0, maxL = 0, maxF = 0;",
                "    for (int r = 0; r < s.length(); r++) {",
                "        counts[s.charAt(r) - 'A']++;",
                "        maxF = Math.max(maxF, counts[s.charAt(r) - 'A']);",
                "        ",
                "        if ((r - l + 1) - maxF > k) {",
                "            counts[s.charAt(l) - 'A']--;",
                "            l++;",
                "        }",
                "        maxL = Math.max(maxL, r - l + 1);",
                "    }",
                "    return maxL;",
                "}"
              ]}
              pythonCode={[
                "def characterReplacement(s, k):",
                "    counts = {}",
                "    l = 0, max_l = 0, max_f = 0",
                "    for r in range(len(s)):",
                "        counts[s[r]] = counts.get(s[r], 0) + 1",
                "        max_f = max(max_f, counts[s[r]])",
                "        ",
                "        if (r - l + 1) - max_f > k:",
                "            counts[s[l]] -= 1",
                "            l += 1",
                "        ",
                "        max_l = max(max_l, r - l + 1)",
                "    ",
                "    return max_l"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize L pointer, max length, and a frequency map." },
                { num: 2, txt: "Add the new character at R to the frequency map and update the highest frequency seen (max_f)." },
                { num: 3, txt: "Check if the window is valid. A window is valid if the total elements minus the most frequent element is <= k." },
                { num: 4, txt: "If invalid, shrink the window from the left by decrementing the frequency of the character at L and advancing L." },
                { num: 5, txt: "Update the maximum window length." },
                { num: 6, txt: "Return the maximum length." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>To maximize repeating characters, we want to keep the most frequent character in our window and replace the rest.</>,
              <>The number of characters we need to replace is simply the total window size minus the frequency of the most frequent character.</>,
              <>Notice that we don't need to strictly decrement <code>maxF</code> when we shrink the window. Since we only care about finding a <strong>longer</strong> window, the window size only grows when we find a new historical <code>maxF</code>. This is a subtle but powerful optimization!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
