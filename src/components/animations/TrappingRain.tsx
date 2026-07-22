import React, { useState } from 'react';
import { CloudRain, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', 
    output: '6',
    explanation: <>6 units of rain water are being trapped.</>
  },
  { 
    label: 'Example 2', 
    input: 'height = [4,2,0,3,2,5]', 
    output: '9'
  }
];

const EDGE_CASES = [
  "height = [4,2,0,3,2,5]",
  "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
  "height = [5,4,3,2,1]",
  "height = [1,2,3,4,5]"
];

const CONSTRAINTS = (
  <>
    <div><code>n == height.length</code></div>
    <div><code>1 &lt;= n &lt;= 2 * 10⁴</code></div>
    <div><code>0 &lt;= height[i] &lt;= 10⁵</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def trap(self, height: list[int]) -> int:\n        # Write your code here\n        pass`;

const HEIGHTS = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

// Dynamically generate the timeline to avoid manual hardcoding of 30+ steps
const generateTimeline = (arr: number[]) => {
  const steps: any[] = [];
  const HEIGHTS = [...arr];
  if (HEIGHTS.length === 0) return steps;
  let l = 0, r = HEIGHTS.length - 1;
  let lm = 0, rm = 0, w = 0;
  let waterMap = new Array(HEIGHTS.length).fill(0);
  
  steps.push({
    l, r, lm, rm, w, map: [...waterMap],
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize pointers at ends, and max heights to 0.",
    logic: '<strong>Init:</strong> `l` = 0, `r` = ' + (HEIGHTS.length - 1) + '.<br/>`lm` = 0, `rm` = 0. Total Water = 0.', logicClass: 'info'
  });
  
  while (l < r) {
    if (HEIGHTS[l] < HEIGHTS[r]) {
      if (HEIGHTS[l] >= lm) {
        lm = HEIGHTS[l];
        steps.push({
          l, r, lm, rm, w, map: [...waterMap],
          activeLines: [5, 6], activeStep: 2,
          desc: `height[l] (${HEIGHTS[l]}) < height[r] (${HEIGHTS[r]}). Update leftMax to ${lm}.`,
          logic: `height[l] < height[r].<br/>Update \`lm\` (Left Max) to <strong>${lm}</strong>.`, logicClass: 'info'
        });
      } else {
        w += lm - HEIGHTS[l];
        waterMap[l] = lm - HEIGHTS[l];
        steps.push({
          l, r, lm, rm, w, map: [...waterMap],
          activeLines: [7], activeStep: 3,
          desc: `height[l] (${HEIGHTS[l]}) < leftMax (${lm}). Add ${lm - HEIGHTS[l]} water at l.`,
          logic: `height[l] < height[r].<br/><strong style="color:var(--sky)">Trap Water!</strong> Added ${lm - HEIGHTS[l]} units at index \`l\`.`, logicClass: 'success'
        });
      }
      l++;
      steps.push({
        l, r, lm, rm, w, map: [...waterMap],
        activeLines: [8], activeStep: 4,
        desc: "Move left pointer.",
        logic: "Increment `l`.", logicClass: 'info'
      });
    } else {
      if (HEIGHTS[r] >= rm) {
        rm = HEIGHTS[r];
        steps.push({
          l, r, lm, rm, w, map: [...waterMap],
          activeLines: [10, 11], activeStep: 2,
          desc: `height[r] (${HEIGHTS[r]}) <= height[l] (${HEIGHTS[l]}). Update rightMax to ${rm}.`,
          logic: `height[r] <= height[l].<br/>Update \`rm\` (Right Max) to <strong>${rm}</strong>.`, logicClass: 'info'
        });
      } else {
        w += rm - HEIGHTS[r];
        waterMap[r] = rm - HEIGHTS[r];
        steps.push({
          l, r, lm, rm, w, map: [...waterMap],
          activeLines: [12], activeStep: 3,
          desc: `height[r] (${HEIGHTS[r]}) < rightMax (${rm}). Add ${rm - HEIGHTS[r]} water at r.`,
          logic: `height[r] <= height[l].<br/><strong style="color:var(--sky)">Trap Water!</strong> Added ${rm - HEIGHTS[r]} units at index \`r\`.`, logicClass: 'success'
        });
      }
      r--;
      steps.push({
        l, r, lm, rm, w, map: [...waterMap],
        activeLines: [13], activeStep: 4,
        desc: "Move right pointer.",
        logic: "Decrement `r`.", logicClass: 'info'
      });
    }
  }
  
  steps.push({
    l, r, lm, rm, w, map: [...waterMap],
    activeLines: [16], activeStep: 5,
    desc: `Pointers met. Total trapped water is ${w}.`,
    logic: `\`l\` >= \`r\`. Array fully processed.<br/><strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });
  
  return steps;
};

export default function TrappingRain({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [HEIGHTS, setHeights] = useState([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  const [timeline, setTimeline] = useState(() => generateTimeline([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step] || timeline[timeline.length - 1];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('height = ')) clean = val.substring(9);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}height = [${parsed.join(',')}]`;
      
      let l = 0, r = parsed.length - 1;
      let lm = 0, rm = 0, w = 0;
      while (l < r) {
        if (parsed[l] < parsed[r]) {
          if (parsed[l] >= lm) lm = parsed[l];
          else w += lm - parsed[l];
          l++;
        } else {
          if (parsed[r] >= rm) rm = parsed[r];
          else w += rm - parsed[r];
          r--;
        }
      }

      const newEx = {
        label: formattedLabel,
        nums: parsed,
        input: formattedLabel,
        output: w.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setHeights(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: height = [0,1,0,2,1,0,1,3,2,1,2,1]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('height = ')) clean = clean.substring(9);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] height = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        int res = trap(height);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    height = ${clean}\n    res = Solution().trap(height)\n    print(res)`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Trapping Rain Water" lcNum="42" difficulty="Hard" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                const ex = examples[idx];
                const inputArr = ex.nums || JSON.parse(ex.input.replace('height = ', ''));
                setHeights(inputArr);
                setTimeline(generateTimeline(inputArr));
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
      <VPHeader title="Trapping Rain Water" lcNum="42" difficulty="Hard" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            const ex = examples[idx];
            const inputArr = ex.nums || JSON.parse(ex.input.replace('height = ', ''));
            setHeights(inputArr);
            setTimeline(generateTimeline(inputArr));
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
            
            <ApproachBanner icon={<CloudRain size={20} />} title="Two Pointers"
              lines={["Instead of finding max heights on both sides for every bar, maintain max heights from the left and right.", "Move the pointer that points to the lower max height inward, trapping water on that side securely."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Elevation Map
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--pink)' }}>Left Max: {current.lm}</span>
                  <span style={{ color: 'var(--sky)' }}>Right Max: {current.rm}</span>
                </div>
                <div style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Total Water: {current.w}
                </div>
              </div>

              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ height: '180px', alignItems: 'flex-end', gap: '4px', position: 'relative', margin: '0 auto', justifyContent: 'center' }}>
                  {HEIGHTS.map((h, idx) => {
                    const isL = current.l === idx;
                    const isR = current.r === idx;
                    const isActive = isL || isR;
                    const waterHeight = current.map[idx] || 0;
                    
                    return (
                      <div key={idx} className="array-block-wrapper" style={{ zIndex: 1, gap: '4px' }}>
                        <div style={{ height: '20px' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem' }}>L</span>}
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem' }}>R</span>}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '130px' }}>
                           {/* Water Block */}
                           {waterHeight > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: `${waterHeight * 40}px` }}
                              style={{
                                width: '36px',
                                background: 'rgba(78, 205, 196, 0.6)',
                                borderTop: '2px solid rgba(78, 205, 196, 0.9)',
                              }}
                            />
                          )}
                          {/* Elevation Block */}
                          {h > 0 && (
                            <motion.div 
                              className={`array-block ${isActive ? 'highlight' : ''}`}
                              style={{
                                height: `${h * 40}px`,
                                width: '36px',
                                background: isActive ? 'var(--surface2)' : 'var(--surface)',
                                borderColor: isL ? 'var(--pink)' : isR ? 'var(--sky)' : 'var(--border)',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                          {h === 0 && (
                            <div style={{ height: '1px', width: '36px', background: 'var(--border)' }}></div>
                          )}
                        </div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{idx}</div>
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
                  <div className="st-lbl">L (left idx)</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>{current.l}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">R (right idx)</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.r}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Left Max</div>
                  <div className="st-val">{current.lm}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Right Max</div>
                  <div className="st-val">{current.rm}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Trapping Water"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Trapping Rain Water"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int trap(int[] height) {",
                "    int l = 0, r = height.length - 1;",
                "    int lm = 0, rm = 0, water = 0;",
                "    while (l < r) {",
                "        if (height[l] < height[r]) {",
                "            if (height[l] >= lm) lm = height[l];",
                "            else water += lm - height[l];",
                "            l++;",
                "        } else {",
                "            if (height[r] >= rm) rm = height[r];",
                "            else water += rm - height[r];",
                "            r--;",
                "        }",
                "    }",
                "    return water;",
                "}"
              ]}
              pythonCode={[
                "def trap(height):",
                "    l, r = 0, len(height) - 1",
                "    lm, rm, water = 0, 0, 0",
                "    while l < r:",
                "        if height[l] < height[r]:",
                "            if height[l] >= lm: lm = height[l]",
                "            else: water += lm - height[l]",
                "            l += 1",
                "        else:",
                "            if height[r] >= rm: rm = height[r]",
                "            else: water += rm - height[r]",
                "            r -= 1",
                "    return water"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Place l and r at ends. Keep track of max height seen from left (lm) and right (rm)." },
                { num: 2, txt: "Move the pointer that has the smaller height. If it's larger than the max seen on its side, update the max." },
                { num: 3, txt: "Otherwise, water is trapped! Add (max_on_its_side - current_height) to total water." },
                { num: 4, txt: "Repeat until l and r meet." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>The amount of water a single column can trap is determined by <code>min(max_left, max_right) - height</code>.</>,
              <>By using two pointers from the outside in, we can guarantee that if <code>height[l] &lt; height[r]</code>, the bottleneck for the water at <code>l</code> is strictly its <strong>left side</strong> (<code>lm</code>). The right side will always be taller because <code>height[r]</code> is already taller than <code>height[l]</code>!</>,
              <>This allows us to process the array in a single pass without needing to pre-compute arrays for <code>max_left</code> and <code>max_right</code> at every index.</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
