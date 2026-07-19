import React, { useState } from 'react';
import { Binary, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.</p>
    <p>Please implement <code>encode</code> and <code>decode</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'strs = ["lint","code","love","you"]', 
    output: '["lint","code","love","you"]',
    explanation: <>One possible encode method is: "4#lint4#code4#love3#you"</>
  },
  { 
    label: 'Example 2', 
    input: 'strs = ["we", "say", ":", "yes"]', 
    output: '["we", "say", ":", "yes"]',
    explanation: <>One possible encode method is: "2#we3#say1#:3#yes"</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>0 &lt;= strs.length &lt;= 200</code></div>
    <div><code>0 &lt;= strs[i].length &lt;= 200</code></div>
    <div><code>strs[i]</code> contains any possible characters out of 256 valid ascii characters.</div>
  </>
);

const DEFAULT_JAVA = `public class Solution {\n    public String encode(List<String> strs) {\n        // Write your code here\n        return "";\n    }\n\n    public List<String> decode(String str) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def encode(self, strs: list[str]) -> str:\n        # Write your code here\n        pass\n\n    def decode(self, s: str) -> list[str]:\n        # Write your code here\n        pass`;

const STRS = ["lint", "c#de", "you"];

const generateTimeline = () => {
  const timeline: any[] = [];
  
  let encoded = "";
  timeline.push({
    phase: 'encode', currIdx: -1, encoded, decoded: [], decodePtr: -1, decodeJ: -1, currentLength: -1,
    activeLines: [2, 3], activeStep: 1,
    desc: "Phase 1: Encoding. Initialize an empty string.",
    logic: `<strong>Init Encode:</strong> encoded = ""`, logicClass: 'info'
  });

  for (let i = 0; i < STRS.length; i++) {
    const s = STRS[i];
    const len = s.length;
    encoded += `${len}#${s}`;
    
    timeline.push({
      phase: 'encode', currIdx: i, encoded, decoded: [], decodePtr: -1, decodeJ: -1, currentLength: -1,
      activeLines: [4, 5, 6], activeStep: 2,
      desc: `Encode string "${s}". Append its length (${len}), a delimiter '#', and the string itself.`,
      logic: `Appending: <strong style="color:var(--sky)">${len}#${s}</strong><br/>encoded = "${encoded}"`, logicClass: 'success'
    });
  }

  timeline.push({
    phase: 'encode', currIdx: STRS.length, encoded, decoded: [], decodePtr: -1, decodeJ: -1, currentLength: -1,
    activeLines: [8], activeStep: 3,
    desc: `Encoding complete! The network transmits the string: "${encoded}".`,
    logic: `<strong>Encoded String:</strong> "${encoded}"`, logicClass: 'info'
  });

  timeline.push({
    phase: 'decode', currIdx: -1, encoded, decoded: [], decodePtr: 0, decodeJ: -1, currentLength: -1,
    activeLines: [11, 12, 13], activeStep: 4,
    desc: "Phase 2: Decoding. Initialize an empty result list and a pointer `i` at index 0 of the encoded string.",
    logic: `<strong>Init Decode:</strong> i = 0`, logicClass: 'info'
  });

  const decoded: string[] = [];
  let i = 0;

  while (i < encoded.length) {
    let j = i;
    while (encoded[j] !== '#') {
      j++;
    }
    
    const lengthStr = encoded.substring(i, j);
    const length = parseInt(lengthStr, 10);
    
    timeline.push({
      phase: 'decode', currIdx: -1, encoded, decoded: [...decoded], decodePtr: i, decodeJ: j, currentLength: length,
      activeLines: [14, 15, 16], activeStep: 5,
      desc: `Scan forward to find the '#' delimiter at index ${j}. Parse the length integer: ${length}.`,
      logic: `Delimiter at <strong style="color:var(--pink)">index ${j}</strong>.<br/>Length = <strong style="color:var(--sky)">${length}</strong>.`, logicClass: 'warning'
    });

    const str = encoded.substring(j + 1, j + 1 + length);
    decoded.push(str);
    
    timeline.push({
      phase: 'decode', currIdx: -1, encoded, decoded: [...decoded], decodePtr: i, decodeJ: j, currentLength: length,
      activeLines: [17, 18, 19], activeStep: 6,
      desc: `Extract substring of length ${length} starting after the delimiter (index ${j + 1} to ${j + 1 + length}). Found: "${str}".`,
      logic: `Extracted: <strong style="color:var(--sky)">"${str}"</strong>.`, logicClass: 'success'
    });
    
    i = j + 1 + length;
    
    if (i < encoded.length) {
      timeline.push({
        phase: 'decode', currIdx: -1, encoded, decoded: [...decoded], decodePtr: i, decodeJ: -1, currentLength: -1,
        activeLines: [20], activeStep: 7,
        desc: `Move the pointer 'i' to the start of the next chunk (index ${i}).`,
        logic: `Updating pointer: i = ${i}`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    phase: 'decode', currIdx: -1, encoded, decoded: [...decoded], decodePtr: i, decodeJ: -1, currentLength: -1,
    activeLines: [22], activeStep: 8,
    desc: `Reached the end of the encoded string. Decoding complete!`,
    logic: `<strong style="color:var(--green)">Success!</strong> Decoded ${decoded.length} strings.`, logicClass: 'success'
  });

  return timeline;
};

const TIMELINE = generateTimeline();

export default function EncodeDecodeStrings({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Encode and Decode Strings" lcNum="271" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Encode and Decode Strings" lcNum="271" difficulty="Medium" tag="Strings" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Binary size={20} />} title="Length Prefix (Chunked Transfer)"
              lines={["We cannot just use a delimiter like ',' because the strings might contain ','.", "Instead, we prefix each string with its length, followed by a delimiter (e.g., '5#hello').", "During decoding, we read the integer until we hit '#', then grab exactly that many characters!"]}
            />
            
            {current.phase === 'encode' ? (
              <div className="card">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--cyan)' }}>■</span> Phase 1: Encode
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Input Array:</div>
                  <div className="array-container" style={{ gap: '8px', flexWrap: 'wrap' }}>
                    {STRS.map((str, i) => {
                      const isCurr = current.currIdx === i;
                      const isProcessed = i < current.currIdx;
                      return (
                        <motion.div 
                          key={`in-${i}`}
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: 'auto', padding: '0 16px', height: '40px',
                            background: isCurr ? 'var(--surface2)' : isProcessed ? 'rgba(78, 205, 196, 0.1)' : 'var(--surface)',
                            borderColor: isCurr ? 'var(--sky)' : isProcessed ? 'rgba(78, 205, 196, 0.5)' : 'var(--border)',
                            color: 'var(--text)', borderRadius: '8px'
                          }}
                        >
                          "{str}"
                        </motion.div>
                      );
                    })}
                  </div>

                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '16px' }}>Encoded String:</div>
                  <div style={{ 
                    background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)',
                    fontFamily: 'monospace', fontSize: '1.2rem', minHeight: '60px', display: 'flex', alignItems: 'center'
                  }}>
                    {current.encoded || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Empty</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--pink)' }}>■</span> Phase 2: Decode
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Transmitted Encoded String:</div>
                  
                  <div className="array-container" style={{ gap: '2px', flexWrap: 'wrap', fontFamily: 'monospace' }}>
                    {current.encoded.split('').map((char: string, idx: number) => {
                      const isI = current.decodePtr === idx;
                      const isJ = current.decodeJ === idx;
                      
                      const isReadingLength = current.decodeJ !== -1 && idx >= current.decodePtr && idx < current.decodeJ;
                      const isReadingString = current.decodeJ !== -1 && idx > current.decodeJ && idx <= current.decodeJ + current.currentLength;

                      let bg = 'var(--surface)';
                      let border = 'var(--border)';
                      if (isReadingLength) {
                        bg = 'rgba(78, 205, 196, 0.2)';
                        border = 'var(--sky)';
                      } else if (isJ) {
                        bg = 'rgba(255, 107, 107, 0.2)';
                        border = 'var(--pink)';
                      } else if (isReadingString) {
                        bg = 'rgba(34, 197, 94, 0.2)';
                        border = 'var(--easy)';
                      } else if (idx < current.decodePtr) {
                        bg = 'var(--surface2)';
                      }

                      return (
                        <div key={`char-${idx}`} className="array-block-wrapper" style={{ zIndex: 1 }}>
                          <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                            {isI && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>i</span>}
                            {isJ && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>j</span>}
                          </div>
                          
                          <motion.div 
                            className="array-block"
                            style={{
                              width: '28px', height: '36px',
                              background: bg, borderColor: border, color: 'var(--text)',
                              fontSize: '1.2rem'
                            }}
                          >
                            {char}
                          </motion.div>
                          <div className="array-index" style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '16px' }}>Decoded Output Array:</div>
                  <div className="array-container" style={{ gap: '8px', flexWrap: 'wrap', minHeight: '40px' }}>
                    <AnimatePresence>
                      {current.decoded.map((str: string, i: number) => (
                        <motion.div 
                          key={`out-${i}`}
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="array-block"
                          style={{
                            width: 'auto', padding: '0 16px', height: '40px',
                            background: 'var(--easy-dim)', borderColor: 'var(--easy)', color: 'var(--text)', borderRadius: '8px'
                          }}
                        >
                          "{str}"
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-title">Variables (Decode Phase)</div>
              <div className="state-grid">
                <div className="stbox">
                  <div className="st-lbl">i (Start chunk)</div>
                  <div className="st-val">{current.phase === 'decode' ? current.decodePtr : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">j (Delimiter)</div>
                  <div className="st-val">{current.phase === 'decode' && current.decodeJ !== -1 ? current.decodeJ : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Parsed Length</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>
                    {current.phase === 'decode' && current.currentLength !== -1 ? current.currentLength : '-'}
                  </div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Chunked Transfer"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Encode and Decode"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "// ENCODE",
                "public String encode(List<String> strs) {",
                "    StringBuilder sb = new StringBuilder();",
                "    for (String s : strs) {",
                "        sb.append(s.length()).append(\"#\").append(s);",
                "    }",
                "    return sb.toString();",
                "}",
                "",
                "// DECODE",
                "public List<String> decode(String s) {",
                "    List<String> res = new ArrayList<>();",
                "    int i = 0;",
                "    while (i < s.length()) {",
                "        int j = i;",
                "        while (s.charAt(j) != '#') j++;",
                "        ",
                "        int length = Integer.parseInt(s.substring(i, j));",
                "        res.add(s.substring(j + 1, j + 1 + length));",
                "        i = j + 1 + length;",
                "    }",
                "    return res;",
                "}"
              ]}
              pythonCode={[
                "# ENCODE",
                "def encode(self, strs: list[str]) -> str:",
                "    res = \"\"",
                "    for s in strs:",
                "        res += str(len(s)) + \"#\" + s",
                "        ",
                "    return res",
                "",
                "# DECODE",
                "def decode(self, s: str) -> list[str]:",
                "    res = []",
                "    i = 0",
                "    while i < len(s):",
                "        j = i",
                "        while s[j] != '#': j += 1",
                "        ",
                "        length = int(s[i:j])",
                "        res.append(s[j + 1 : j + 1 + length])",
                "        i = j + 1 + length",
                "        ",
                "    return res"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Encode: Initialize an empty string." },
                { num: 2, txt: "Encode: Append the length of the string, a '#' delimiter, and the string itself." },
                { num: 3, txt: "Encode: Send the encoded string over the network." },
                { num: 4, txt: "Decode: Initialize 'i' at the start of the encoded string." },
                { num: 5, txt: "Decode: Scan forward with 'j' until we hit '#'. Parse the characters between 'i' and 'j' as the length integer." },
                { num: 6, txt: "Decode: Extract exactly 'length' characters starting from 'j + 1' and add to results." },
                { num: 7, txt: "Decode: Move 'i' to the end of the extracted string to process the next chunk." },
                { num: 8, txt: "Decode: Finish when 'i' reaches the end of the string." }
              ]} 
            />
            <Complexity time="O(N)" space="O(N)" />
            <WhyItWorks paragraphs={[
              <>If we just joined strings with a special character like <code>#</code>, the decoder would break if the original string itself contained <code>#</code>.</>,
              <>By prefixing the <em>length</em>, the decoder knows exactly how many characters to consume. It doesn't matter if those characters include numbers, `#`, or spaces; it will just blindly read exactly <code>length</code> characters.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
