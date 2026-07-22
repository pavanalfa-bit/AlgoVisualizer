import React, { useState } from 'react';
import { CircleDollarSign, CheckCircle2 } from 'lucide-react';

import { motion } from 'framer-motion';
import {
  VisualizerLayout, VPHeader, ProblemStatement, ExamplePicker, VPBody,
  ControlBar, ApproachBanner, StateGrid, StepLogic, ResultBanner, StepCard,
  CodePanel, AlgorithmList, Complexity, WhyItWorks, useAnimationController,
  PracticeWorkspace
} from './VisualizerLayout';

const INITIAL_EXAMPLES = [
  { label: '[ [ 1, 2, 3 ], [ 3, 2, 1 ] ]', grid: [[1,2,3],[3,2,1]], output: '6' },
  { label: '[ [ 1, 5 ], [ 7, 3 ], [ 3, 5 ] ]', grid: [[1,5],[7,3],[3,5]], output: '10' },
  { label: '[ [ 2, 8, 7 ], [ 7, 1, 3 ] ]', grid: [[2,8,7],[7,1,3]], output: '17' },
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
  const [examples, setExamples] = useState(INITIAL_EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [grid, setGrid] = useState(examples[0].grid);
  const [tab, setTab] = useState<'visualizer' | 'practice'>('visualizer');

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
  for (let i = 0; i < grid.length; i++) {
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

    for (let j = 0; j < grid[i].length; j++) {
      customerWealth += grid[i][j];
      steps.push({
        title: `Customer ${i} - Bank ${j}`,
        desc: `Add bank account [${i}][${j}] = ${grid[i][j]}\ncustomerWealth = ${customerWealth - grid[i][j]} + ${grid[i][j]} = ${customerWealth}`,
        codeJava: [5, 6], codePy: [4], algoStep: 2,
        maxWealth, currRow: i, currCol: j, currSum: customerWealth,
        state: { c: i, b: j, w: customerWealth, max: maxWealth },
        logic: `Add bank <strong>${j}</strong> (<code>${grid[i][j]}</code>) to customer's wealth.<br/>Current wealth = <strong>${customerWealth}</strong>.`
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
    examples: [
      { label: 'Example 1', input: 'accounts = [[1,2,3],[3,2,1]]', output: '6', explanation: 'Both customers have wealth = 6.' },
      { label: 'Example 2', input: 'accounts = [[1,5],[7,3],[3,5]]', output: '10', explanation: 'Customer 1 has 6, Customer 2 has 10, Customer 3 has 8.' }
    ],
    constraints: <>m == accounts.length | n == accounts[i].length | 1 ≤ m, n ≤ 50 | 1 ≤ accounts[i][j] ≤ 100</>
  };

  const handleCustomInput = (val: string) => {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
        let maxOutput = 0;
        parsed.forEach((row: number[]) => {
          let sum = row.reduce((a, b) => a + b, 0);
          maxOutput = Math.max(maxOutput, sum);
        });

        const formattedLabel = '[ ' + parsed.map((row: any[]) => '[ ' + row.join(', ') + ' ]').join(', ') + ' ]';
        const newEx = { label: formattedLabel, grid: parsed, output: maxOutput.toString() };
        const newExamples = [...examples, newEx];
        setExamples(newExamples);
        setActiveEx(newExamples.length - 1);
        setGrid(parsed);
        reset();
      } else {
        alert("Invalid format. Please enter a 2D array like [[1,2],[3,4]]");
      }
    } catch (e) {
      alert("Invalid JSON format. Please enter a 2D array like [[1,2],[3,4]]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    if (lang === 'java') {
      const javaArray = exampleStr.replace(/\[/g, '{').replace(/\]/g, '}');
      return code.replace(/int\[\]\[\] accounts = .*?;/, `int[][] accounts = ${javaArray};`);
    } else {
      return code.replace(/accounts = \[.*\]/, `accounts = ${exampleStr}`);
    }
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
          <ProblemStatement {...problemProps} />
          <ExamplePicker 
            examples={examples} 
            activeEx={activeEx} 
            onSelect={idx => { setActiveEx(idx); setGrid(examples[idx].grid); reset(); }} 
            onCustomInput={handleCustomInput}
          />

          <VPBody 
            left={
              <>
                <ControlBar step={step} maxSteps={steps.length} isPlaying={isPlaying} speed={speed} onStepChange={handleStepChange} onPlayToggle={handlePlayToggle} onSpeedChange={setSpeed} />
                <ApproachBanner icon={<CircleDollarSign size={20} />} title="Approach" lines={['Row Summation', 'For each row (customer), sum all their bank accounts. Keep track of the maximum sum seen so far.']} />
                
                <div className="card">
                  <div className="card-title">Accounts Matrix</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {grid.map((row: number[], rIdx: number) => {
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
                                    background: isCurrCell ? '#0e3d55' : 'var(--surface)',
                                    borderColor: isCurrCell ? 'var(--cyan)' : 'var(--border)',
                                    color: isCurrCell ? 'var(--cyan)' : 'var(--text)'
                                  }}
                                >
                                  {val}
                                </motion.div>
                              );
                            })}
                          </div>
                          {isCurrRow && (
                            <div style={{ marginLeft: 'auto', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--medium)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
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
          examples={problemProps.examples}
          constraints={problemProps.constraints}
          defaultCodeJava={`class Main {
    public static int maximumWealth(int[][] accounts) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        int[][] accounts = {{1,2,3},{3,2,1}};
        System.out.println("Max wealth: " + maximumWealth(accounts));
    }
}`}
          defaultCodePython={`def maximumWealth(accounts):
    # Write your solution here
    pass

if __name__ == "__main__":
    accounts = [[1,2,3],[3,2,1]]
    print(f"Max wealth: {maximumWealth(accounts)}")`}
          examplePicker={
            <ExamplePicker 
              examples={examples} 
              activeEx={activeEx} 
              onSelect={idx => { setActiveEx(idx); setGrid(examples[idx].grid); reset(); }} 
              onCustomInput={handleCustomInput}
            />
          }
          activeExampleStr={examples[activeEx].label}
          codeInjector={injectCode}
        />
      )}
    </VisualizerLayout>
  );
}
