import React, { useState } from 'react';
import { AlignLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Write a function to find the longest common prefix string amongst an array of strings.</p>
    <p>If there is no common prefix, return an empty string <code>""</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'strs = ["flower","flow","flight"]', 
    output: '"fl"',
    explanation: <>The characters "f" and "l" are shared at the start of all three strings.</>
  },
  { 
    label: 'Example 2', 
    input: 'strs = ["dog","racecar","car"]', 
    output: '""',
    explanation: <>There is no common prefix among the input strings.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= strs.length &lt;= 200</code></div>
    <div><code>0 &lt;= strs[i].length &lt;= 200</code></div>
    <div><code>strs[i]</code> consists of only lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static String longestCommonPrefix(String[] strs) {\n        // Write your code here\n        return "";\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        # Write your code here\n        pass`;

const STRS = ["flower", "flow", "flight"];

const generateTimeline = () => {
  const timeline: any[] = [];
  
  if (STRS.length === 0) {
    return [{ col: -1, row: -1, prefix: "", activeLines: [], activeStep: 1, desc: "Empty array, return empty string.", logic: "Empty array", logicClass: 'error' }];
  }

  let prefix = "";
  timeline.push({
    col: -1, row: -1, prefix, isValidCol: true, isDone: false,
    activeLines: [2, 3], activeStep: 1,
    desc: "Start with an empty prefix string.",
    logic: `<strong>Init:</strong> prefix = ""`, logicClass: 'info'
  });

  const firstStr = STRS[0];
  let isDone = false;

  for (let i = 0; i < firstStr.length; i++) {
    if (isDone) break;
    
    const char = firstStr[i];
    let isValidCol = true;

    for (let j = 0; j < STRS.length; j++) {
      timeline.push({
        col: i, row: j, prefix, isValidCol: true, isDone: false,
        activeLines: [4, 5, 6, 7], activeStep: 2,
        desc: `Check if character at index ${i} in string ${j} ("${STRS[j]}") matches '${char}'.`,
        logic: `Checking: strs[${j}][${i}] == <strong style="color:var(--sky)">'${char}'</strong>?`, logicClass: 'info'
      });

      if (i === STRS[j].length || STRS[j][i] !== char) {
        isValidCol = false;
        timeline.push({
          col: i, row: j, prefix, isValidCol: false, isDone: true,
          activeLines: [8, 9], activeStep: 3,
          desc: `Mismatch found at string ${j} ("${STRS[j]}"). The common prefix ends here.`,
          logic: `<strong style="color:var(--pink)">Mismatch!</strong><br/>Prefix ends at "${prefix}".`, logicClass: 'error'
        });
        isDone = true;
        break;
      }
    }

    if (isValidCol) {
      prefix += char;
      timeline.push({
        col: i, row: STRS.length - 1, prefix, isValidCol: true, isDone: false,
        activeLines: [11, 12], activeStep: 4,
        desc: `Column ${i} matches across all strings! Add '${char}' to the prefix.`,
        logic: `All strings share <strong style="color:var(--sky)">'${char}'</strong>.<br/>prefix = "${prefix}"`, logicClass: 'success'
      });
    }
  }

  if (!isDone) {
    timeline.push({
      col: firstStr.length, row: -1, prefix, isValidCol: true, isDone: true,
      activeLines: [14], activeStep: 5,
      desc: `Reached the end of the first string. The longest common prefix is "${prefix}".`,
      logic: `<strong style="color:var(--green)">Done!</strong> Return "${prefix}".`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function LongestCommonPrefix({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Longest Common Prefix" lcNum="14" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Longest Common Prefix" lcNum="14" difficulty="Easy" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<AlignLeft size={20} />} title="Vertical Scanning"
              lines={["Imagine the strings stacked vertically.", "Scan column by column (index by index) from left to right.", "If all characters in a column match, append it to the prefix. If one doesn't match or a string ends, stop!"]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Vertical Scan
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', margin: '0 auto', maxWidth: 'fit-content' }}>
                  {STRS.map((str, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ width: '20px', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right', paddingRight: '8px' }}>
                        {rowIdx}
                      </div>
                      {str.split('').map((char, colIdx) => {
                        const isScanCol = current.col === colIdx && !current.isDone;
                        const isScanRow = current.row === rowIdx && isScanCol;
                        const isPastCol = current.col > colIdx || (current.col === colIdx && current.isDone && current.isValidCol);
                        const isMismatch = current.col === colIdx && current.row === rowIdx && !current.isValidCol && current.isDone;

                        return (
                          <motion.div 
                            key={`${rowIdx}-${colIdx}`}
                            className={`array-block ${isScanRow || isPastCol ? 'highlight' : ''}`}
                            style={{
                              width: '36px', height: '36px',
                              background: isMismatch ? 'rgba(255, 107, 107, 0.2)' : isScanRow ? 'var(--surface2)' : isPastCol ? 'rgba(78, 205, 196, 0.15)' : 'var(--surface)',
                              borderColor: isMismatch ? 'var(--pink)' : isScanRow ? 'var(--sky)' : isPastCol ? 'var(--sky)' : 'var(--border)',
                              color: isMismatch ? 'var(--pink)' : 'var(--text)',
                              fontWeight: isScanRow || isPastCol ? 'bold' : 'normal'
                            }}
                          >
                            {char}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Sweep Line Pointer */}
                  <div style={{ display: 'flex', gap: '4px', marginLeft: '28px', marginTop: '4px' }}>
                    {STRS[0].split('').map((_, colIdx) => (
                      <div key={`ptr-${colIdx}`} style={{ width: '36px', textAlign: 'center' }}>
                        {current.col === colIdx && !current.isDone && (
                          <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>↑</span>
                        )}
                        {current.col === colIdx && current.isDone && !current.isValidCol && (
                          <span className="pointer pointer-up" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>↑</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Result</div>
              <div className="state-grid">
                <div className="stbox" style={{ gridColumn: 'span 2' }}>
                  <div className="st-lbl">Common Prefix</div>
                  <div className="st-val" style={{ color: 'var(--easy)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    "{current.prefix}"
                  </div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Status</div>
                  <div className="st-val" style={{ color: current.isDone ? 'var(--easy)' : 'var(--muted)' }}>
                    {current.isDone ? 'Finished' : 'Scanning'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Vertical Scanning"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Longest Common Prefix"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public String longestCommonPrefix(String[] strs) {",
                "    if (strs == null || strs.length == 0) return \"\";",
                "    String prefix = \"\";",
                "    for (int i = 0; i < strs[0].length(); i++) {",
                "        char c = strs[0].charAt(i);",
                "        for (int j = 1; j < strs.length; j++) {",
                "            if (i == strs[j].length() || strs[j].charAt(i) != c) {",
                "                return prefix;",
                "            }",
                "        }",
                "        prefix += c;",
                "    }",
                "    return prefix;",
                "}"
              ]}
              pythonCode={[
                "def longestCommonPrefix(strs: list[str]) -> str:",
                "    if not strs: return \"\"",
                "    prefix = \"\"",
                "    for i in range(len(strs[0])):",
                "        c = strs[0][i]",
                "        for j in range(1, len(strs)):",
                "            if i == len(strs[j]) or strs[j][i] != c:",
                "                return prefix",
                "                ",
                "                ",
                "        prefix += c",
                "        ",
                "    return prefix"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize an empty prefix string." },
                { num: 2, txt: "Iterate through the characters of the first string (column by column)." },
                { num: 3, txt: "For each column, check if all other strings have the same character at that index. If a string is too short or the character mismatches, stop!" },
                { num: 4, txt: "If all strings match, append the character to the common prefix." },
                { num: 5, txt: "Return the prefix when finished." }
              ]} 
            />
            <Complexity time="O(S)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <><code>S</code> is the sum of all characters in all strings. We only do work as long as characters match.</>,
              <>By scanning vertically, we immediately halt at the first mismatch. We don't waste time looking at the ends of very long strings if their first letter is already different!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
