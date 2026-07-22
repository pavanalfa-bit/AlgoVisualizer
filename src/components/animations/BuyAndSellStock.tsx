import React, { useState } from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VisualizerLayout, VPHeader, VPBody, ControlBar, ApproachBanner, 
  StepLogic, StepCard, CodePanel, 
  AlgorithmList, Complexity, WhyItWorks, useAnimationController, PracticeWorkspace, ProblemStatement, ExamplePicker
} from './VisualizerLayout';

const PROBLEM_STATEMENT = (
  <>
    <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>iᵗʰ</code> day.</p>
    <p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
    <p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>
  </>
);

const EXAMPLES = [
  { 
    label: 'Example 1', 
    input: 'prices = [7,1,5,3,6,4]', 
    output: '5',
    explanation: <>Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.<br/>Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.</>
  },
  { 
    label: 'Example 2', 
    input: 'prices = [7,6,4,3,1]', 
    output: '0',
    explanation: <>In this case, no transactions are done and the max profit = 0.</>
  }
];

const EDGE_CASES = [
  "prices = [1, 2, 3, 4, 5, 6, 7]",
  "prices = [7, 6, 5, 4, 3, 2, 1]",
  "prices = [1, 1, 1, 1, 1]",
  "prices = [3, 2, 6, 5, 0, 3]"
];

const CONSTRAINTS = (
  <>
    <div><code>1 &lt;= prices.length &lt;= 10⁵</code></div>
    <div><code>0 &lt;= prices[i] &lt;= 10⁴</code></div>
  </>
);

const DEFAULT_JAVA = `class Main {\n    public static int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n

    public static void main(String[] args) {
        // Add test cases here
    }
}`;
const DEFAULT_PYTHON = `class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Write your code here\n        pass`;

const INITIAL_PRICES = [7, 1, 5, 3, 6, 4];

const generateTimeline = (pricesArr: number[]) => {
  const timeline: any[] = [];
  let L = 0; // Buy pointer
  let R = 1; // Sell pointer
  let maxP = 0;
  
  timeline.push({
    L, R, maxP, profit: 0,
    activeLines: [2, 3], activeStep: 1,
    desc: "Initialize the 'Buy' pointer at day 0, the 'Sell' pointer at day 1, and max profit to 0.",
    logic: `<strong>Init:</strong> Buy at day 0 (price ${pricesArr[0]}). Sell at day 1 (price ${pricesArr[1] || '-'}).`, logicClass: 'info'
  });

  while (R < pricesArr.length) {
    if (pricesArr[L] < pricesArr[R]) {
      const profit = pricesArr[R] - pricesArr[L];
      const oldMax = maxP;
      maxP = Math.max(maxP, profit);
      
      timeline.push({
        L, R, maxP, profit,
        activeLines: [5, 6, 7], activeStep: 2,
        desc: `prices[Sell] (${pricesArr[R]}) > prices[Buy] (${pricesArr[L]}). Profitable! Calculate profit and update max.`,
        logic: `Sell price (${pricesArr[R]}) > Buy price (${pricesArr[L]}).<br/>Profit = ${pricesArr[R]} - ${pricesArr[L]} = <strong>${profit}</strong>.<br/>${maxP > oldMax ? '<strong style="color:var(--green)">New max profit found!</strong>' : ''}`, logicClass: maxP > oldMax ? 'success' : 'info'
      });
    } else {
      timeline.push({
        L, R, maxP, profit: pricesArr[R] - pricesArr[L],
        activeLines: [8, 9], activeStep: 3,
        desc: `prices[Sell] (${pricesArr[R]}) <= prices[Buy] (${pricesArr[L]}). Found a lower price, so we move our Buy pointer to Sell.`,
        logic: `Sell price (${pricesArr[R]}) <= Buy price (${pricesArr[L]}).<br/><span style="color:var(--pink)">Found a cheaper day to buy!</span><br/>Move Buy to day ${R}.`, logicClass: 'info'
      });
      L = R;
    }
    
    R++;
    if (R < pricesArr.length) {
      timeline.push({
        L, R, maxP, profit: pricesArr[R] - pricesArr[L],
        activeLines: [11], activeStep: 4,
        desc: `Advance the Sell pointer to the next day.`,
        logic: `Increment Sell to day ${R}.`, logicClass: 'info'
      });
    }
  }

  timeline.push({
    L, R: pricesArr.length, maxP, profit: 0,
    activeLines: [13], activeStep: 5,
    desc: `Iterated through the entire array. The maximum profit is ${maxP}.`,
    logic: `<strong style="color:var(--green)">Success!</strong> Maximum profit is <strong>${maxP}</strong>.`, logicClass: 'success'
  });

  return timeline;
};

export default function BuyAndSellStock({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [examples, setExamples] = useState<any[]>(EXAMPLES);
  const [activeEx, setActiveEx] = useState(0);
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [timeline, setTimeline] = useState(() => generateTimeline(INITIAL_PRICES));

  const { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset } = useAnimationController(timeline.length);
  const current = timeline[step];

  const handleCustomInput = (val: string, isEdgeCase?: boolean) => {
    try {
      let clean = val;
      if (val.startsWith('prices = ')) clean = val.substring(9);
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed) || parsed.length < 2) throw new Error();

      const formattedLabel = `${isEdgeCase ? '✨ ' : ''}prices = [ ${parsed.join(', ')} ]`;
      
      let maxP = 0;
      let l = 0; let r = 1;
      while(r < parsed.length) {
        if(parsed[l] < parsed[r]) maxP = Math.max(maxP, parsed[r] - parsed[l]);
        else l = r;
        r++;
      }

      const newEx = {
        label: formattedLabel,
        prices: parsed,
        input: formattedLabel,
        output: maxP.toString(),
        explanation: <></>
      };

      const newExamples = [...examples, newEx];
      setExamples(newExamples);
      setActiveEx(newExamples.length - 1);
      setPrices(parsed);
      setTimeline(generateTimeline(parsed));
      reset();
    } catch (e) {
      alert("Invalid format! Please use: [7, 1, 5, 3, 6, 4]");
    }
  };

  const injectCode = (code: string, lang: string, exampleStr: string) => {
    let clean = exampleStr;
    if (exampleStr.startsWith('✨ ')) clean = exampleStr.substring(3);
    if (clean.startsWith('prices = ')) clean = clean.substring(9);
    
    if (lang === 'java') {
      return code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/, 
        `public static void main(String[] args) {\n        int[] prices = new int[]{${clean.replace(/[\[\]]/g, '')}};\n        System.out.println(maxProfit(prices));\n    }`);
    } else {
      return code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/, 
        `if __name__ == "__main__":\n    prices = ${clean}\n    print(Solution().maxProfit(prices))`);
    }
  };
  
  if (activeTab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader title="Best Time to Buy and Sell Stock" lcNum="121" difficulty="Easy" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
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
                let pr = examples[idx].input;
                if (pr.startsWith('✨ ')) pr = pr.substring(3);
                if (pr.startsWith('prices = ')) pr = pr.substring(9);
                const pArr = examples[idx].prices || JSON.parse(pr);
                setPrices(pArr); 
                setTimeline(generateTimeline(pArr));
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
      <VPHeader title="Best Time to Buy and Sell Stock" lcNum="121" difficulty="Easy" tag="Sliding Window" onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement statement={PROBLEM_STATEMENT} examples={examples} constraints={CONSTRAINTS} />
        <ExamplePicker 
          examples={examples} 
          activeEx={activeEx} 
          onSelect={idx => { 
            setActiveEx(idx); 
            let pr = examples[idx].input;
            if (pr.startsWith('✨ ')) pr = pr.substring(3);
            if (pr.startsWith('prices = ')) pr = pr.substring(9);
            const pArr = examples[idx].prices || JSON.parse(pr);
            setPrices(pArr); 
            setTimeline(generateTimeline(pArr));
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
            
            <ApproachBanner icon={<TrendingUp size={20} />} title="Sliding Window (Dynamic Left)"
              lines={["Use a 'Buy' pointer (Left) and 'Sell' pointer (Right).", "If the sell price drops below the buy price, we found a better day to buy! Move the Buy pointer all the way to the Sell pointer."]}
            />
            
            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Stock Price Chart
              </div>
              
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}>
                <div className="array-container" style={{ margin: '0 auto', gap: '8px', alignItems: 'flex-end', height: '180px' }}>
                  {prices.map((price, i) => {
                    const isL = current.L === i;
                    const isR = current.R === i && current.R < prices.length;
                    const isInWindow = current.R < prices.length && i >= current.L && i <= current.R;
                    
                    return (
                      <div key={i} className="array-block-wrapper" style={{ zIndex: 1, gap: '4px' }}>
                        <div style={{ height: '20px', textAlign: 'center' }}>
                          {isL && <span className="pointer pointer-left" style={{ fontSize: '0.7rem', color: 'var(--pink)' }}>B</span>}
                          {isR && <span className="pointer pointer-right" style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>S</span>}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '120px' }}>
                           <motion.div 
                            className={`array-block ${isInWindow ? 'highlight' : ''}`}
                            style={{
                              width: '40px',
                              height: `${price * 15}px`,
                              background: isInWindow ? 'var(--surface2)' : 'var(--surface)',
                              borderColor: isL ? 'var(--pink)' : isR ? 'var(--sky)' : 'var(--border)',
                              borderRadius: '4px 4px 0 0',
                              borderBottom: 'none'
                            }}
                          />
                        </div>
                        
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text)' }}>${price}</div>
                        <div className="array-index" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Day {i}</div>
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
                  <div className="st-lbl">Buy (L)</div>
                  <div className="st-val" style={{ color: 'var(--pink)' }}>Day {current.L} (${prices[current.L]})</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Sell (R)</div>
                  <div className="st-val" style={{ color: 'var(--sky)' }}>{current.R < prices.length ? `Day ${current.R} ($${prices[current.R]})` : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Current Profit</div>
                  <div className="st-val" style={{ color: current.profit < 0 ? 'var(--hard)' : 'var(--easy)' }}>{current.R < prices.length ? current.profit : '-'}</div>
                </div>
                <div className="stbox">
                  <div className="st-lbl">Max Profit</div>
                  <div className="st-val" style={{ color: 'var(--accent)' }}>{current.maxP}</div>
                </div>
              </div>
            </div>

            <StepLogic html={current.logic} logicClass={current.logicClass} />
            <StepCard title={step === timeline.length - 1 ? "Done!" : "Scanning Prices"} desc={current.desc} step={step} maxSteps={timeline.length} isDone={step === timeline.length - 1} />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title="Best Time to Buy and Sell Stock"
              activeLinesJava={current.activeLines}
              activeLinesPy={current.activeLines}
              javaCode={[
                "public int maxProfit(int[] prices) {",
                "    int l = 0, r = 1;",
                "    int maxP = 0;",
                "    while (r < prices.length) {",
                "        if (prices[l] < prices[r]) {",
                "            int profit = prices[r] - prices[l];",
                "            maxP = Math.max(maxP, profit);",
                "        } else {",
                "            l = r;",
                "        }",
                "        r++;",
                "    }",
                "    return maxP;",
                "}"
              ]}
              pythonCode={[
                "def maxProfit(prices):",
                "    l, r = 0, 1",
                "    maxP = 0",
                "    while r < len(prices):",
                "        if prices[l] < prices[r]:",
                "            profit = prices[r] - prices[l]",
                "            maxP = max(maxP, profit)",
                "        else:",
                "            l = r",
                "        ",
                "        r += 1",
                "    ",
                "    return maxP"
              ]}
            />
            <AlgorithmList 
              activeStep={current.activeStep}
              steps={[
                { num: 1, txt: "Initialize Buy pointer (l) to day 0, Sell pointer (r) to day 1, and max_profit to 0." },
                { num: 2, txt: "If the sell price is higher than the buy price, calculate profit and update max_profit." },
                { num: 3, txt: "If the sell price is LOWER than the buy price, we found a cheaper day to buy! Move the Buy pointer to the Sell pointer." },
                { num: 4, txt: "Always advance the Sell pointer to evaluate the next day." },
                { num: 5, txt: "Return max_profit after iterating through all days." }
              ]} 
            />
            <Complexity time="O(n)" space="O(1)" />
            <WhyItWorks paragraphs={[
              <>We want the largest possible positive difference between a future day and a past day.</>,
              <>By moving our Buy pointer (<code>l</code>) whenever we see a price <strong>lower</strong> than our current Buy price, we ensure that we are always basing our future profits on the lowest price we've seen so far!</>,
              <>This greedy approach allows us to find the global maximum profit in a single pass without needing nested loops (O(n²)).</>
            ]} />
          </div>
        }
      />
    </VisualizerLayout>
  );
}
