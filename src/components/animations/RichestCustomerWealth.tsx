import React, { useState } from 'react';
import { CircleDollarSign, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const EXAMPLES: any[] = [
  { label: 'accounts = [[1,2,3],[3,2,1]]', input: 'accounts = [[1,2,3],[3,2,1]]', accounts: [[1,2,3],[3,2,1]], output: '6', explanation: <></> },
  { label: 'accounts = [[1,5],[7,3],[3,5]]', input: 'accounts = [[1,5],[7,3],[3,5]]', accounts: [[1,5],[7,3],[3,5]], output: '10', explanation: <></> },
  { label: 'accounts = [[2,8,7],[7,1,3],[1,9,5]]', input: 'accounts = [[2,8,7],[7,1,3],[1,9,5]]', accounts: [[2,8,7],[7,1,3],[1,9,5]], output: '17', explanation: <></> }
];

const EDGE_CASES = [
  "accounts = [[100, 100], [0, 0]]",
  "accounts = [[1,1,1,1],[1,1,1,1]]",
  "accounts = [[9999]]"
];

const CODE_JAVA = [
  `public int maximumWealth(int[][] accounts) {`,
  `    int maxWealth = 0;`,
  `    for (int i = 0; i < accounts.length; i++) {`,
  `        int customerWealth = 0;`,
  `        for (int j = 0; j < accounts[i].length; j++) {`,
  `            customerWealth += accounts[i][j];`,
  `        }`,
  `        maxWealth = Math.max(maxWealth, customerWealth);`,
  `    }`,
  `    return maxWealth;`,
  `}`
];

const CODE_PY = [
  `def maximumWealth(self, accounts):`,
  `    max_wealth = 0`,
  `    for customer in accounts:`,
  `        customer_wealth = sum(customer)`,
  `        max_wealth = max(max_wealth, customer_wealth)`,
  `    return max_wealth`
];

export function RichestCustomerWealth({ onBack }: { onBack?: () => void }) {
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [accounts, setAccounts] = useState(EXAMPLES[0].accounts);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('accounts = ')) clean = val.substring(11);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length === 0 || !Array.isArray(parsed[0])) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}accounts = ${JSON.stringify(parsed)}`;
      let maxWealth = 0;
      for (const row of parsed) {
        let sum = 0;
        for (const num of row) sum += num;
        maxWealth = Math.max(maxWealth, sum);
      }
      
      const newEx = {
        label: formattedLabel,
        input: formattedLabel,
        accounts: parsed,
        output: maxWealth.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setAccounts(parsed);
      reset();
    } catch (e) {
      alert("Invalid format! Please use: accounts = [[1,2],[3,4]]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('accounts = ')) clean = clean.substring(11);
    
    if (lang === 'java') {
      let javaArr = clean.replace(/\[/g, '{').replace(/\]/g, '}');
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[][] accounts = new int[][]{${javaArr}};\n        int res = maximumWealth(accounts);\n        System.out.println(res);\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    accounts = ${clean}\n    res = Solution().maximumWealth(accounts)\n    print(res)`);
    }
  };

  // Pre-compute steps
  const steps: any[] = [];
  
  steps.push({
    title: `Initialize`,
    desc: `maxWealth = 0\nWe need to find the customer (row) with the maximum total sum of their bank accounts (columns).`,
    codeJava: [2], codePy: [2], algoStep: 1,
    maxWealth: 0, currRow: -1, currCol: -1, currSum: 0,
    state: { c: '—', b: '—', w: 0, max: 0 },
    logic: `<strong style="color:var(--cyan)">Init:</strong> <code>maxWealth = 0</code>.`,
    logicClass: 'info'
  });

  let maxWealth = 0;
  for (let i = 0; i < accounts.length; i++) {
    let customerWealth = 0;
    
    steps.push({
      title: `Customer ${i}`,
      desc: `Calculating wealth for Customer ${i} (Row ${i})\ncustomerWealth = 0`,
      codeJava: [3, 4], codePy: [3], algoStep: 2,
      maxWealth, currRow: i, currCol: -1, currSum: 0,
      state: { c: i, b: '—', w: 0, max: maxWealth },
      logic: `Move to Customer <strong>${i}</strong>. Set <code>customerWealth = 0</code>.`,
      logicClass: ''
    });

    for (let j = 0; j < accounts[i].length; j++) {
      customerWealth += accounts[i][j];
      steps.push({
        title: `Customer ${i} - Bank ${j}`,
        desc: `Add bank account [${i}][${j}] = ${accounts[i][j]}\ncustomerWealth = ${customerWealth - accounts[i][j]} + ${accounts[i][j]} = ${customerWealth}`,
        codeJava: [5, 6], codePy: [4], algoStep: 2,
        maxWealth, currRow: i, currCol: j, currSum: customerWealth,
        state: { c: i, b: j, w: customerWealth, max: maxWealth },
        logic: `Add bank <strong>${j}</strong> (<code>${accounts[i][j]}</code>) to customer's wealth.<br/>Current wealth = <strong>${customerWealth}</strong>.`
      });
    }

    const newMax = Math.max(maxWealth, customerWealth);
    steps.push({
      title: `Update Max Wealth`,
      desc: `Customer ${i} total wealth = ${customerWealth}\nmaxWealth = max(${maxWealth}, ${customerWealth}) = ${newMax}`,
      codeJava: [8], codePy: [5], algoStep: 3,
      maxWealth: newMax, currRow: i, currCol: -1, currSum: customerWealth,
      state: { c: i, b: 'done', w: customerWealth, max: newMax },
      logic: `Customer ${i} total = <strong>${customerWealth}</strong>.<br/><code>maxWealth = max(${maxWealth}, ${customerWealth})</code> = <strong style="color:var(--orange)">${newMax}</strong>.`,
      logicClass: newMax > maxWealth ? 'info' : ''
    });
    maxWealth = newMax;
  }

  steps.push({
    title: `Done! Richest Customer Wealth = ${maxWealth}`,
    desc: `All customers evaluated.\nRichest wealth is ${maxWealth}`,
    codeJava: [10], codePy: [6], algoStep: 4,
    maxWealth, currRow: -1, currCol: -1, currSum: 0,
    state: { c: '✓', b: '✓', w: '✓', max: maxWealth },
    logic: `<strong style="color:var(--green)">Complete!</strong> The maximum wealth among all customers is <strong>${maxWealth}</strong>.`,
    logicClass: 'success',
    finalRes: `${maxWealth}`
  });

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(steps.length);
  const cs = steps[step];

  const problemProps = {
    statement: <>You are given an <code>m x n</code> integer grid <code>accounts</code> where <code>accounts[i][j]</code> is the amount of money the <code>i<sup>th</sup></code> customer has in the <code>j<sup>th</sup></code> bank. Return the wealth that the richest customer has.</>,
    constraints: <>m == accounts.length | n == accounts[i].length | 1 ≤ m, n ≤ 50 | 1 ≤ accounts[i][j] ≤ 100</>
  };

  return (
    <VisualizerLayout>
      <VPHeader 
        title="Richest Customer Wealth" 
        lcNum="1672" 
        difficulty="Easy" 
        tag="Array Basics" 
        onBack={onBack} 
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {tab === 'visualizer' ? (
        <>
          <ProblemStatement {...problemProps} examples={examples} />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { 
              setActiveEx(idx); 
              let pr = examples[idx].input;
              if (pr.startsWith('✨ ')) pr = pr.substring(3);
              if (pr.startsWith('accounts = ')) pr = pr.substring(11);
              const inputArr = examples[idx].accounts || JSON.parse(pr);
              setAccounts(inputArr); 
              reset(); 
            }} 
            onCustomInput={handleCustomInput}
            onGenerateEdgeCase={async () => {
              await new Promise(r => setTimeout(r, 1000));
              return EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
            }}
          />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                <ApproachBanner icon={<CircleDollarSign size={20} />} title="Approach" lines={['Row Summation', 'For each row (customer), sum all their bank accounts. Keep track of the maximum sum seen so far.']} />
                
                <div className="card">
                  <div className="card-title">Accounts Matrix</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {accounts.map((row: number[], rIdx: number) => {
                      const isCurrRow = cs.currRow === rIdx;
                      return (
                        <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '80px', fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isCurrRow && <span style={{ color: 'var(--cyan)' }}>▶</span>} Customer {rIdx}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', padding: '6px', background: isCurrRow ? 'rgba(78, 205, 196, 0.05)' : 'transparent', borderRadius: '8px', border: isCurrRow ? '1px solid var(--cyan)' : '1px solid transparent' }}>
                            {row.map((val: number, cIdx: number) => {
                              const isCurrCell = isCurrRow && cs.currCol === cIdx;
                              return (
                                <motion.div 
                                  layout
                                  key={cIdx}
                                  style={{
                                    width: 40, height: 40, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid', borderRadius: '6px',
                                    fontWeight: 'bold', fontSize: '1rem',
                                    background: isCurrCell ? 'var(--viz-sky-bg)' : 'var(--surface)',
                                    borderColor: isCurrCell ? 'var(--viz-sky-bd)' : 'var(--border)',
                                    color: isCurrCell ? 'var(--viz-sky-fg)' : 'var(--text)'
                                  }}
                                >
                                  {val}
                                </motion.div>
                              );
                            })}
                          </div>
                          {isCurrRow && (
                            <div style={{ marginLeft: 'auto', background: 'var(--viz-yellow-bg)', color: 'var(--medium)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                              Sum: {cs.currSum}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <StateGrid items={[
                  { label: 'Customer (Row)', value: cs.state.c },
                  { label: 'Bank (Col)', value: cs.state.b },
                  { label: 'currWealth', value: cs.state.w },
                  { label: 'maxWealth', value: cs.state.max, changed: cs.logicClass === 'info' }
                ]} />
                
                <StepLogic html={cs.logic} logicClass={cs.logicClass} />
                <ResultBanner show={!!cs.finalRes} title="Maximum Wealth" result={cs.finalRes}  icon={<CheckCircle2 size={24} color="#22c55e" />} />
                <StepCard title={cs.title} desc={cs.desc} step={step} maxSteps={steps.length} isDone={!!cs.finalRes} />
              </>
            }
            right={
              <>
                <CodePanel title="Richest Customer Wealth" javaCode={CODE_JAVA} pythonCode={CODE_PY} activeLinesJava={cs.codeJava} activeLinesPy={cs.codePy} />
                <AlgorithmList 
                  activeStep={cs.algoStep}
                  steps={[
                    { num: 1, txt: <>Initialize <code>maxWealth = 0</code></> },
                    { num: 2, txt: <>Iterate through each customer (row). Sum all bank balances (columns) to get <code>customerWealth</code></> },
                    { num: 3, txt: <>Update <code>maxWealth = max(maxWealth, customerWealth)</code></> },
                    { num: 4, txt: <>Return <code>maxWealth</code></> }
                  ]} 
                />
                <Complexity time="O(m × n)" space="O(1)" />
                <WhyItWorks paragraphs={[
                  'This is a simple matrix traversal problem.',
                  'We sum the values of each row independently and keep track of the largest sum found so far.'
                ]} />
              </>
            }
          />
        </>
      ) : (
        <PracticeWorkspace 
          problemStatement={problemProps.statement}
          examples={examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`class Main {\n    public static int maximumWealth(int[][] accounts) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        int[][] accounts = {{1, 2, 3}, {3, 2, 1}};\n        System.out.println("Output: " + maximumWealth(accounts));\n    }\n}`}
          defaultCodePython={`class Solution:\n    def maximumWealth(self, accounts):\n        # Write your solution here\n        pass\n\nif __name__ == "__main__":\n    accounts = [[1, 2, 3], [3, 2, 1]]\n    print(f"Output: {Solution().maximumWealth(accounts)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { 
                setActiveEx(idx); 
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('accounts = ')) pr = pr.substring(11);
                const inputArr = examples[idx].accounts || JSON.parse(pr);
                setAccounts(inputArr); 
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
