import React, { useState } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'nums = [1,2,3,1]', 
    output: 'true',
    explanation: <>The element 1 appears at indices 0 and 3.</>
  },
  { 
    label: 'Example 2', 
    input: 'nums = [1,2,3,4]', 
    output: 'false',
    explanation: <>All elements are distinct.</>
  },
  { 
    label: 'Example 3', 
    input: 'nums = [1,1,1,3,3,4,3,2,4,2]', 
    output: 'true',
    explanation: <>There are multiple duplicates.</>
  }
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= nums.length &lt;= 10⁵</code></div>
    <div><code>-10⁹ &lt;= nums[i] &lt;= 10⁹</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Write your code here\n        pass`;

const NUMS = [1, 2, 3, 1];

const generateTimeline = () => {
  const timeline: any[] = [];
  const set = new Set<number>();
  
  timeline.push({
    curr: -1, set: [], found: false,
    activeLines: [2], activeStep: 1,
    desc: "Initialize an empty Hash Set to keep track of elements we've seen.",
    logic: `<strong>Init:</strong> Set is empty.`, logicClass: 'info'
  });

  let found = false;
  for (let i = 0; i < NUMS.length; i++) {
    const num = NUMS[i];
    
    timeline.push({
      curr: i, set: Array.from(set), found: false,
      activeLines: [3, 4], activeStep: 2,
      desc: `Check if ${num} is already in the Hash Set.`,
      logic: `Scanning <strong style="color:var(--sky)">${num}</strong>...<br/>Is it in the Set?`, logicClass: 'info'
    });

    if (set.has(num)) {
      found = true;
      timeline.push({
        curr: i, set: Array.from(set), found: true,
        activeLines: [5], activeStep: 3,
        desc: `${num} is already in the Set! We found a duplicate. Return true.`,
        logic: `<strong style="color:var(--pink)">Yes! Duplicate found.</strong><br/>Return true.`, logicClass: 'success'
      });
      break;
    } else {
      set.add(num);
      timeline.push({
        curr: i, set: Array.from(set), found: false,
        activeLines: [7], activeStep: 4,
        desc: `${num} is not in the Set. Add it to the Set and continue.`,
        logic: `No. Add <strong style="color:var(--sky)">${num}</strong> to the Set.`, logicClass: 'info'
      });
    }
  }

  if (!found) {
    timeline.push({
      curr: NUMS.length, set: Array.from(set), found: false,
      activeLines: [9], activeStep: 5,
      desc: `Finished scanning the array. No duplicates were found. Return false.`,
      logic: `<strong style="color:var(--easy)">Finished!</strong> No duplicates found.`, logicClass: 'success'
    });
  }

  return timeline;
};

const TIMELINE = generateTimeline();

export default function ContainsDuplicate({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle } = useAnimationController(TIMELINE.length);
  const current = TIMELINE[step];
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Contains Duplicate" lcNum="217" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
      <VPHeader title="Contains Duplicate" lcNum="217" difficulty="Easy" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={EXAMPLES} constraints={CONSTRAINTS} />
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar step={step} maxSteps={TIMELINE.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<Database size={20} />} title="Hash Set (O(1) Lookups)"
              lines={["Initialize an empty Hash Set.", "Iterate through the array. For each number, check if it exists in the Hash Set.", "If it does, return true immediately. If it doesn't, add it and continue."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Array Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', flexWrap: 'wrap' }}>
                  {NUMS.map((num, i) => {
                    const isCurr = current.curr === i;
                    const isProcessed = i < current.curr;
                    const isDuplicate = current.found && isCurr;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isCurr && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: isDuplicate ? 'var(--pink)' : 'var(--sky)' }}>↓</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isDuplicate ? 'rgba(255, 107, 107, 0.2)' : isCurr ? 'var(--surface2)' : isProcessed ? 'rgba(78, 205, 196, 0.1)' : 'var(--surface)',
                            borderColor: isDuplicate ? 'var(--pink)' : isCurr ? 'var(--sky)' : isProcessed ? 'rgba(78, 205, 196, 0.5)' : 'var(--border)',
                            color: 'var(--text)'
                          }}
                        >
                          {num}
                        </motion.div>
                        <div className="array-index" style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>{i}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={16} color="var(--accent)" /> Hash Set
              </div>
              <div style={{ 
                display: 'flex', gap: '8px', flexWrap: 'wrap', 
                minHeight: '60px', background: 'var(--surface)', 
                padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' 
              }}>
                {current.set.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>Set is empty</div>
                ) : (
                  <AnimatePresence>
                    {current.set.map((num: number) => {
                      const isNewlyAdded = current.curr >= 0 && NUMS[current.curr] === num && !current.found && current.activeStep === 4;
                      return (
                        <motion.div
                          key={num}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          style={{ 
                            width: '40px', height: '40px', 
                            background: isNewlyAdded ? 'var(--accent)' : 'var(--surface2)', 
                            color: isNewlyAdded ? 'white' : 'var(--text)', 
                            border: `1px solid ${isNewlyAdded ? 'var(--accent)' : 'var(--border-strong)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            borderRadius: '8px', fontWeight: 'bold' 
                          }}
                        >
                          {num}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === TIMELINE.length - 1 ? "Done!" : "Scanning"} desc={current.desc} step={step} maxSteps={TIMELINE.length} isDone={step === TIMELINE.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Contains Duplicate"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public boolean containsDuplicate(int[] nums) {",
                "    Set<Integer> set = new HashSet<>();",
                "    for (int i = 0; i < nums.length; i++) {",
                "        if (set.contains(nums[i])) {",
                "            return true;",
                "        }",
                "        set.add(nums[i]);",
                "    }",
                "    return false;",
                "}"
              ]}
              pythonCode={[
                "def containsDuplicate(nums):",
                "    seen = set()",
                "    for num in nums:",
                "        if num in seen:",
                "            return True",
                "        ",
                "        seen.add(num)",
                "    ",
                "    return False"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize an empty Hash Set." },
                { num: 2, txt: "Iterate through each number in the array." },
                { num: 3, txt: "If the number is already in the Hash Set, we've found a duplicate! Return true." },
                { num: 4, txt: "If it's not in the Set, add it so we can track it for future lookups." },
                { num: 5, txt: "If the loop finishes without returning, all elements are distinct. Return false." }
              ]} 
            />
            <Complexity time="O(n)" space="O(n)" />
            <WhyItWorks paragraphs={[
              <>A <strong>Hash Set</strong> provides O(1) average time complexity for both insertions and lookups.</>,
              <>By storing each element as we visit it, we can instantly check if we've seen it before without having to rescan the array (which would take O(n²)).</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
