import React, { useState } from 'react';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StateGrid, StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>Given an array of strings <code>strs</code>, group <strong>the anagrams</strong> together. You can return the answer in <strong>any order</strong>.</p>
  </>
);

const EXAMPLES = [
  { label: 'strs = ["eat","tea","tan","ate","nat","bat"]', input: 'strs = ["eat","tea","tan","ate","nat","bat"]', strs: ["eat","tea","tan","ate","nat","bat"], output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: <>Strings that are anagrams of each other share the same characters in the same quantities, and are grouped together.</> },
  { label: 'strs = [""]', input: 'strs = [""]', strs: [""], output: '[[""]]', explanation: <>An array with a single empty string is grouped with itself.</> },
  { label: 'strs = ["a"]', input: 'strs = ["a"]', strs: ["a"], output: '[["a"]]', explanation: <>A single character string is grouped with itself.</> }
];

const EDGE_CASES = [
  'strs = ["a","a","a"]',
  'strs = ["","",""]',
  'strs = ["ab","ba","abc","cba"]'
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= strs.length &lt;= 10⁴</code></div>
    <div><code>0 &lt;= strs[i].length &lt;= 100</code></div>
    <div><code>strs[i]</code> consists of lowercase English letters.</div>
  </>
);

const DEFAULT_JAVA = `import java.util.*;\n\nclass Main {\n    public static List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Write your code here\n        pass`;

const STRS = ["eat", "tea", "tan", "ate", "nat", "bat"];

export default function GroupAnagrams({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [strs, setStrs] = useState(EXAMPLES[0].strs);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('✨ ')) clean = val.substring(3);
      
      const parsedStrs = JSON.parse(clean.replace('strs = ', '').trim());
      
      if (!Array.isArray(parsedStrs)) {
        throw new Error();
      }

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}strs = ${JSON.stringify(parsedStrs)}`;
      
      const map: Record<string, string[]> = {};
      for (const s of parsedStrs) {
        const sorted = s.split('').sort().join('');
        if (!map[sorted]) map[sorted] = [];
        map[sorted].push(s);
      }
      const output = JSON.stringify(Object.values(map));

      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        strs: parsedStrs,
        output: output,
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setStrs(parsedStrs);
      reset();
    } catch (e) {
      alert('Invalid format! Please use: strs = ["eat","tea"]');
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    const parsedStrs = clean.replace('strs = ', '').trim();
    
    if (lang === 'java') {
      const javaStrs = parsedStrs.replace(/\[/g, '{').replace(/\]/g, '}');
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        String[] strs = new String[] ${javaStrs};\n        List<List<String>> res = groupAnagrams(strs);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    strs = ${parsedStrs}\n    res = Solution().groupAnagrams(strs)\n    print(res)`);
    }
  };

  const steps: any[] = [];
  const map: Record<string, string[]> = {};
  
  steps.push({
    curr: -1, sortedCurr: "", map: JSON.parse(JSON.stringify(map)),
    activeLines: [2], activeStep: 1,
    desc: "Initialize a Hash Map where keys will be strings and values will be lists of strings.",
    logic: `<strong>Init:</strong> Hash Map is empty.`, logicClass: 'info'
  });

  for (let i = 0; i < strs.length; i++) {
    const s = strs[i];
    
    steps.push({
      curr: i, sortedCurr: "", map: JSON.parse(JSON.stringify(map)),
      activeLines: [3, 4], activeStep: 2,
      desc: `Processing string: "${s}".`,
      logic: `Current string: <strong style="color:var(--sky)">"${s}"</strong>`, logicClass: 'info'
    });

    const sorted = s.split('').sort().join('');
    
    steps.push({
      curr: i, sortedCurr: sorted, map: JSON.parse(JSON.stringify(map)),
      activeLines: [5, 6], activeStep: 3,
      desc: `Sort the string alphabetically to use as a canonical key: "${s}" -> "${sorted}".`,
      logic: `Sorted key: <strong style="color:var(--accent)">"${sorted}"</strong>`, logicClass: 'warning'
    });

    if (!map[sorted]) {
      map[sorted] = [];
    }
    map[sorted].push(s);

    steps.push({
      curr: i, sortedCurr: sorted, map: JSON.parse(JSON.stringify(map)),
      activeLines: [7, 8, 9], activeStep: 4,
      desc: `Add "${s}" to the list corresponding to the key "${sorted}" in the Hash Map.`,
      logic: `Mapped <strong style="color:var(--sky)">"${s}"</strong> to key <strong style="color:var(--accent)">"${sorted}"</strong>.`, logicClass: 'success'
    });
  }

  steps.push({
    curr: strs.length, sortedCurr: "", map: JSON.parse(JSON.stringify(map)),
    activeLines: [11], activeStep: 5,
    desc: "Finished iterating. Extract the grouped lists from the Hash Map.",
    logic: `<strong style="color:var(--green)">Success!</strong> Returning map values.`, logicClass: 'success',
    finalRes: JSON.stringify(Object.values(map))
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const current = steps[step];
  
  return (
    <VisualizerLayout>
      <VPHeader title="Group Anagrams" lcNum="49" difficulty="Medium" tag="Hashing" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'visualizer' ? (
        <>
          <div style={{ marginBottom: '24px' }}>
            <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parsedStrs = examples[idx].strs || JSON.parse(clean.replace('strs = ', '').trim());
                setStrs(parsedStrs); 
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
            <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
            
            <ApproachBanner icon={<LayoutGrid size={20} />} title="Hash Map with Sorted Keys"
              lines={["Anagrams share the exact same characters. If we sort them, they will result in the identical string!", "We can use this sorted string as a 'Key' in a Hash Map.", "The 'Value' will be a list of all original strings that generated that key."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> String Array Traversal
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '12px', flexWrap: 'wrap' }}>
                  {strs.map((str: string, i: number) => {
                    const isCurr = current.curr === i;
                    const isProcessed = i < current.curr;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1 }}>
                        <div style={{ height: '20px', textAlign: 'center', position: 'relative' }}>
                          {isCurr && <span className="pointer pointer-down" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>↓</span>}
                        </div>
                        
                        <motion.div 
                          className={`array-block ${isCurr ? 'highlight' : ''}`}
                          style={{
                            width: 'auto', padding: '0 16px',
                            height: '40px',
                            background: isCurr ? 'var(--surface2)' : isProcessed ? 'var(--viz-sky-bg)' : 'var(--surface)',
                            borderColor: isCurr ? 'var(--sky)' : isProcessed ? 'var(--viz-sky-bd)' : 'var(--border)',
                            color: 'var(--text)',
                            borderRadius: '20px'
                          }}
                        >
                          {str}
                        </motion.div>
                        
                        <div style={{ height: '20px', textAlign: 'center', marginTop: '4px', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                          {isCurr && current.sortedCurr !== "" && current.sortedCurr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: '12px' }}>Hash Map (Key ➔ [List])</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px', background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {Object.keys(current.map).length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '24px' }}>Map is empty</div>
                ) : (
                  <AnimatePresence>
                    {Object.entries(current.map).map(([key, list]: [string, any]) => (
                      <motion.div
                        key={key}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ 
                          background: 'var(--surface2)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-strong)',
                          display: 'flex', alignItems: 'center', gap: '16px'
                        }}
                      >
                        <div style={{ 
                          background: 'var(--viz-red-bg)', padding: '4px 12px', borderRadius: '4px', 
                          border: '1px solid var(--pink)', fontWeight: 'bold', color: 'var(--pink)'
                        }}>
                          {key}
                        </div>
                        <div style={{ color: 'var(--muted)' }}>➔</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {list.map((str: string, idx: number) => {
                            const isNewlyAdded = current.curr >= 0 && strs[current.curr] === str && current.activeStep === 4 && idx === list.length - 1;
                            return (
                              <motion.div 
                                key={`${key}-${idx}`}
                                initial={isNewlyAdded ? { scale: 0 } : { scale: 1 }}
                                animate={{ scale: 1 }}
                                style={{ 
                                  background: isNewlyAdded ? 'var(--sky)' : 'var(--surface)', 
                                  color: isNewlyAdded ? '#000' : 'var(--text)', 
                                  padding: '4px 12px', borderRadius: '16px', border: `1px solid ${isNewlyAdded ? 'var(--sky)' : 'var(--border)'}`,
                                  fontWeight: isNewlyAdded ? 'bold' : 'normal'
                                }}
                              >
                                {str}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === steps.length - 1 ? "Done!" : "Grouping Strings"} desc={current.desc} step={step} maxSteps={steps.length} isDone={step === steps.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Group Anagrams"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public List<List<String>> groupAnagrams(String[] strs) {",
                "    Map<String, List<String>> map = new HashMap<>();",
                "    for (String s : strs) {",
                "        char[] chars = s.toCharArray();",
                "        Arrays.sort(chars);",
                "        String sorted = new String(chars);",
                "        if (!map.containsKey(sorted)) {",
                "            map.put(sorted, new ArrayList<>());",
                "        }",
                "        map.get(sorted).add(s);",
                "    }",
                "    return new ArrayList<>(map.values());",
                "}"
              ]}
              pythonCode={[
                "def groupAnagrams(strs):",
                "    anagram_map = defaultdict(list)",
                "    for s in strs:",
                "        ",
                "        sorted_s = ''.join(sorted(s))",
                "        ",
                "        ",
                "        ",
                "        anagram_map[sorted_s].append(s)",
                "        ",
                "    return list(anagram_map.values())"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Create a Hash Map mapping a String to a List of Strings." },
                { num: 2, txt: "Iterate through the input array of strings." },
                { num: 3, txt: "Sort the characters in the string. All anagrams will result in the same sorted string." },
                { num: 4, txt: "Use the sorted string as a key, and append the original string to the corresponding list in the map." },
                { num: 5, txt: "Finally, extract and return all the lists from the map." }
              ]} 
            />
            <Complexity time="O(n * k log k)" space="O(n * k)" />
            <WhyItWorks paragraphs={[
              <>Sorting each string takes <code>O(k log k)</code> where <code>k</code> is the length of the longest string. Since we do this for all <code>n</code> strings, the time complexity is <code>O(n * k log k)</code>.</>,
              <>Another approach is to count character frequencies and use that array (e.g. <code>[1, 0, 0, 2...]</code>) as the key. That would take <code>O(n * k)</code> time, which can be faster for very long strings!</>
            ]} />
          </div>
        }
      />
      </>
      ) : (
        <PracticeWorkspace 
          problemStatement={PROBLEM_STATEMENT}
          examples={examples}
          constraints={CONSTRAINTS}
          defaultCodeJava={`import java.util.*;\n\nclass Main {\n    public static List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        String[] strs = {"eat", "tea", "tan", "ate", "nat", "bat"};\n        System.out.println("Output: " + groupAnagrams(strs));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\n    print(f"Output: {Solution().groupAnagrams(strs)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                const pr = examples[idx].input;
                let clean = pr;
                if (pr.startsWith('✨ ')) clean = pr.substring(3);
                const parsedStrs = examples[idx].strs || JSON.parse(clean.replace('strs = ', '').trim());
                setStrs(parsedStrs); 
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
      )}
    </VisualizerLayout>
  );
}
