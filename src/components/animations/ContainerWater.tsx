import React, { useState } from 'react';
import { Waves, CheckCircle2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, ResultBanner, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>iᵗʰ</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
    <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
    <p>Return the <strong>maximum amount of water</strong> a container can store.</p>
    <p><strong>Notice</strong> that you may not slant the container.</p>
  </>
);

const INITIAL_EXAMPLES = [
  { 
    label: 'height = [ 1, 8, 6, 2, 5, 4, 8, 3, 7 ]', 
    height: [1,8,6,2,5,4,8,3,7],
    input: 'height = [1,8,6,2,5,4,8,3,7]', 
    output: '49',
    explanation: <>The max area of water the container can contain is 49 (from index 1 to index 8: height 7 * width 7).</>
  },
  { 
    label: 'height = [ 1, 1 ]', 
    height: [1,1],
    input: 'height = [1,1]', 
    output: '1'
  }
];

const EDGE_CASES = [
  "height = [1, 100, 2, 2, 2, 100, 1]",
  "height = [1, 2, 3, 4, 5, 25, 24, 3, 4]",
  "height = [1, 1]",
  "height = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]"
];

const CONSTRAINTS = (
  <>
    <div><code>n == height.length</code></div>
    <div><code>2 &lt;= n &lt;= 10⁵</code></div>
    <div><code>0 &lt;= height[i] &lt;= 10⁴</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        int[] height = new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7};\n        System.out.println("Result: " + maxArea(height));\n    }\n}`;
const DEFAULT_PYTHON = `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        # Write your code here\n        pass\n\nif __name__ == "__main__":\n    height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n    print(f"Result: {Solution().maxArea(height)}")`;

const generateTimeline = (heights: number[]) => {
  const timeline: any[] = [];
  let l = 0;
  let r = heights.length - 1;
  let maxA = 0;

  timeline.push({
    l, r, maxA, 
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize pointers at both ends of the array to maximize the initial width.",
    logic: `<strong>Init:</strong> Set \`l\` = 0, \`r\` = ${r}. Max Area = 0.`, logicClass: 'info'
  });

  while (l < r) {
    const w = r - l;
    const h = Math.min(heights[l], heights[r]);
    const area = w * h;
    let newMax = false;
    
    if (area > maxA) {
      maxA = area;
      newMax = true;
    }

    timeline.push({
      l, r, maxA,
      activeLines: [5, 6], activeStep: 2,
      desc: `Calculate area: min(${heights[l]}, ${heights[r]}) * ${w} = ${h} * ${w} = ${area}. ${newMax ? 'Update max area.' : `Max area remains ${maxA}.`}`,
      logic: `Width = ${w}, Min Height = min(<strong style="color:var(--pink)">${heights[l]}</strong>, <strong style="color:var(--sky)">${heights[r]}</strong>) = ${h}.<br/>Area = ${h} * ${w} = <strong>${area}</strong>.${newMax ? '<br/><strong style="color:var(--green)">New Max!</strong>' : ''}`, 
      logicClass: newMax ? 'success' : 'info'
    });

    if (heights[l] < heights[r]) {
      timeline.push({
        l, r, maxA,
        activeLines: [7, 8], activeStep: 3,
        desc: `Since height[l] < height[r] (${heights[l]} < ${heights[r]}), move the left pointer inwards.`,
        logic: `height[l] < height[r] (<strong style="color:var(--pink)">${heights[l]}</strong> < <strong style="color:var(--sky)">${heights[r]}</strong>).<br/>Move \`l\` right to try finding a taller line.`, logicClass: 'info'
      });
      l++;
    } else {
      timeline.push({
        l, r, maxA,
        activeLines: [9, 10], activeStep: 3,
        desc: `Since height[l] >= height[r] (${heights[l]} >= ${heights[r]}), move the right pointer inwards.`,
        logic: `height[l] >= height[r] (<strong style="color:var(--pink)">${heights[l]}</strong> >= <strong style="color:var(--sky)">${heights[r]}</strong>).<br/>Move \`r\` left to try finding a taller line.`, logicClass: 'info'
      });
      r--;
    }
  }

  timeline.push({
    l, r, maxA,
    activeLines: [13], activeStep: 4,
    desc: `Pointers continue to move inward until they meet... Max area found is ${maxA}.`,
    logic: `Fast-forwarding to end...<br/>\`l\` >= \`r\`. <strong style="color:var(--green)">Done!</strong>`, logicClass: 'success'
  });

  return timeline;
};

export default function ContainerWater({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [examples, setExamples] = useState(INITIAL_EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [heights, setHeights] = useState(INITIAL_EXAMPLES[0].height);
  const [timeline, setTimeline] = useState(() => generateTimeline(INITIAL_EXAMPLES[0].height));
  
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('height = ')) clean = val.substring(9);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length < 2) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}height = [ ${parsed.join(', ')} ]`;
      
      let maxA = 0;
      let l = 0; let r = parsed.length - 1;
      while(l < r) {
        maxA = Math.max(maxA, Math.min(parsed[l], parsed[r]) * (r - l));
        if (parsed[l] < parsed[r]) l++; else r--;
      }

      const newEx = {
        label: formattedLabel,
        height: parsed,
        input: formattedLabel,
        output: maxA.toString()
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setHeights(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: [1, 8, 6, 2]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    const match = exampleStr.match(/height = (\[.*?\])/);
    if (!match) return code;
    const arrStr = match[1];

    if (lang === 'java') {
      const javaArray = arrStr.replace(/\[/g, '{').replace(/\]/g, '}');
      return code.replace(/int\[\] height = .*?;/, `int[] height = new int[]${javaArray};`);
    } else {
      return code.replace(/height = \[.*\]/, `height = ${arrStr}`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Container With Most Water" lcNum="11" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                setHeights(examples[idx].height); 
                setTimeline(generateTimeline(examples[idx].height));
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
      <VPHeader title="Container With Most Water" lcNum="11" difficulty="Medium" tag="Two Pointers" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            setHeights(examples[idx].height); 
            setTimeline(generateTimeline(examples[idx].height));
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
            
            <ApproachBanner icon={<Waves size={20} />} title="Two Pointers (Outside In)"
              lines={["Place pointers at both ends to maximize initial width.", "At each step, calculate the area. Then, move the pointer pointing to the shorter line inward, as moving the taller line can't possibly increase the area."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Heights Histogram
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>Heights array</div>
                <div style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Max Area: {current.maxA}
                </div>
              </div>

              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ height: '220px', alignItems: 'flex-end', gap: '8px', position: 'relative', margin: '0 auto', justifyContent: 'center' }}>
                  {/* Draw water */}
                  {current.l < current.r && (
                    <motion.div 
                      layout
                      style={{
                        position: 'absolute',
                        bottom: '24px', // offset by idx row height
                        left: `calc(50% - ${(heights.length * 58) / 2}px + ${current.l * 58 + 29}px)`,
                        width: `calc(${current.r - current.l} * 58px)`,
                        height: `${Math.min(heights[current.l], heights[current.r]) * 20}px`,
                        background: 'rgba(78, 205, 196, 0.3)',
                        borderTop: '2px solid rgba(78, 205, 196, 0.8)',
                        zIndex: 0,
                        transition: 'all 0.4s'
                      }}
                    />
                  )}
                  
                  {heights.map((h, idx) => {
                    const isL = current.l === idx;
                    const isR = current.r === idx;
                    const isActive = isL || isR;
                    
                    return (
                      <div key={idx} className="array-block-wrapper" style={{ zIndex: 1, paddingBottom: '24px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-24px', width: '100%', textAlign: 'center' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem' }}>L</span>}
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem' }}>R</span>}
                        </div>
                        <motion.div 
                          className={`array-block ${isActive ? 'highlight' : ''}`}
                          style={{
                            height: `${h * 20}px`,
                            width: '50px',
                            background: isActive ? 'var(--surface2)' : 'var(--surface)',
                            borderColor: isL ? 'var(--pink)' : isR ? 'var(--sky)' : 'var(--border)',
                            position: 'relative'
                          }}
                        >
                          <span style={{ position: 'absolute', top: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text)' }}>{h}</span>
                        </motion.div>
                        <div className="array-index" style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>{idx}</div>
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
                  <div className="st-lbl">Width (R-L)</div>
                  <div className="st-val">{Math.max(0, current.r - current.l)}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Min Height</div>
                  <div className="st-val">{current.l < current.r ? Math.min(heights[current.l], heights[current.r]) : '-'}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />

            <StepCard title={step === timeline.length - 1 ? "Done!" : "Calculating Area"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Container With Most Water"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int maxArea(int[] height) {",
                "    int l = 0;",
                "    int r = height.length - 1;",
                "    int max = 0;",
                "    while (l < r) {",
                "        int minHeight = Math.min(height[l], height[r]);",
                "        max = Math.max(max, minHeight * (r - l));",
                "        if (height[l] < height[r]) {",
                "            l++;",
                "        } else {",
                "            r--;",
                "        }",
                "    }",
                "    return max;",
                "}"
              ]}
              pythonCode={[
                "def maxArea(height):",
                "    l, r = 0, len(height) - 1",
                "    max_area = 0",
                "    while l < r:",
                "        min_h = min(height[l], height[r])",
                "        max_area = max(max_area, min_h * (r - l))",
                "        if height[l] < height[r]:",
                "            l += 1",
                "        else:",
                "            r -= 1",
                "    return max_area"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Place pointers l at the start and r at the end." },
                { num: 2, txt: "Calculate the area formed between them: min(height[l], height[r]) * (r - l)." },
                { num: 3, txt: "Move the pointer that points to the shorter line inward." },
                { num: 4, txt: "Repeat until l and r meet." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>The area of a container is determined by the <strong>shorter</strong> of the two lines and the <strong>distance</strong> between them.</>,
              <>By starting at the absolute ends, we maximize the distance. To find a potentially larger area, we must compensate for the decrease in distance by finding a <strong>taller</strong> line.</>,
              <>Therefore, we safely discard the shorter line at each step, proving we never miss the optimal container!</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
