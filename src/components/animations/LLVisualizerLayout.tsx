import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  VPHeader, VisualizerLayout, VPBody, CodePanel, ExamplePicker, ProblemStatement, 
  AlgorithmList, Complexity, WhyItWorks, ControlBar, StepCard, PracticeWorkspace
} from './VisualizerLayout';
import type { DebugTestCase, DebugHint } from './VisualizerLayout';

export interface PredictionPrompt {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  correctValue: string;
  explanation: string;
}

interface LLVisualizerLayoutProps {
  title: string;
  problemStatement: string;
  difficulty: string;
  category: string;
  javaCode: string[];
  pythonCode: string[];
  activeLinesJava: number[];
  activeLinesPy: number[];
  explanation: string;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
  customInput: React.ReactNode;
  examples: {
    shortLabel: string;
    shortOutput: string;
    inputBlock: React.ReactNode;
    outputBlock: React.ReactNode;
    explanation?: React.ReactNode;
    value: any;
  }[];
  edgeCases?: any[];
  onExampleSelect: (val: any) => void;
  currentExample: any;
  children: React.ReactNode; // The Canvas
  timeComplexity?: string;
  spaceComplexity?: string;
  algorithmSteps?: { num: number; txt: string }[];
  whyItWorks?: React.ReactNode[];
  setCurrentStep?: (step: number) => void;
  onBack?: () => void;
  predictionPrompt?: PredictionPrompt;
  buggyJavaCode?: string[];
  buggyPythonCode?: string[];
  buggySteps?: any[];
  buggyLines?: number[];
  debugTestCases?: DebugTestCase[];
  debugHints?: DebugHint[];
}

export function LLVisualizerLayout(props: LLVisualizerLayoutProps) {
  const {
    title, difficulty, category, javaCode, pythonCode, activeLinesJava, activeLinesPy,
    explanation, isPlaying, speed, onPlay, onPause, onReset, onStepForward,
    onStepBackward, onSpeedChange, currentStep, totalSteps, customInput,
    examples, edgeCases, onExampleSelect, currentExample, children,
    timeComplexity, spaceComplexity, algorithmSteps, whyItWorks, setCurrentStep, onBack,
    predictionPrompt, buggyJavaCode, buggyPythonCode, buggySteps, buggyLines,
    debugTestCases, debugHints
  } = props;

  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'debug' ? 'debug' : 'visualizer';
  
  const [tab, setTab] = useState<'visualizer' | 'practice' | 'debug'>(initialMode);
  const [answeredPrompts, setAnsweredPrompts] = useState<Set<string>>(new Set());
  const [showPredictionError, setShowPredictionError] = useState<string | null>(null);

  // Force pause if there's an unanswered prompt (only in visualizer mode, debug doesn't have prompts)
  React.useEffect(() => {
    if (tab === 'visualizer' && predictionPrompt && !answeredPrompts.has(predictionPrompt.id) && isPlaying) {
      onPause();
    }
  }, [predictionPrompt, answeredPrompts, isPlaying, onPause]);

  // Reset answered prompts if the example changes
  React.useEffect(() => {
    setAnsweredPrompts(new Set());
    setShowPredictionError(null);
  }, [currentExample]);

  // Find the index of the currently active example based on matching values
  const activeExIndex = examples.findIndex(ex => {
    if (Array.isArray(currentExample) && Array.isArray(ex.value)) {
      return JSON.stringify(currentExample) === JSON.stringify(ex.value);
    }
    return currentExample === ex.value;
  });

  if (tab === 'practice') {
    return (
      <VisualizerLayout>
        <VPHeader hasDebug={true} title={title} 
          lcNum="" 
          difficulty={difficulty} 
          tag={category} 
          onBack={onBack || (() => {})} 
          activeTab={tab} 
          onTabChange={setTab} 
          />
        <PracticeWorkspace 
          problemStatement={<p>{props.problemStatement}</p>}
          examples={examples.map(ex => ({ label: ex.shortLabel, input: <code>{JSON.stringify(ex.value)}</code>, output: <code>...</code> }))}
          constraints={<div>Constraints for {title} will go here.</div>}
          defaultCodeJava={javaCode.join('\n')}
          defaultCodePython={pythonCode.join('\n')}
        />
      </VisualizerLayout>
    );
  }

  if (tab === 'debug') {
    return (
      <VisualizerLayout>
        <VPHeader hasDebug={true} title={title}
          lcNum=""
          difficulty={difficulty}
          tag={category}
          onBack={onBack || (() => {})}
          activeTab={tab}
          onTabChange={setTab}
          />
        <PracticeWorkspace
          problemStatement={<p>{props.problemStatement}</p>}
          examples={examples.map(ex => ({
            label: ex.shortLabel,
            input: <code>{JSON.stringify(ex.value)}</code>,
            output: <code>...</code>
          }))}
          constraints={<div />}
          defaultCodeJava={buggyJavaCode ? buggyJavaCode.join('\n') : javaCode.join('\n')}
          defaultCodePython={buggyPythonCode ? buggyPythonCode.join('\n') : pythonCode.join('\n')}
          runButtonText="🐛 Run Tests"
          buggyLines={buggyLines}
          debugTestCases={debugTestCases}
          debugHints={debugHints}
        />
      </VisualizerLayout>
    );
  }


  return (
    <VisualizerLayout>
      <VPHeader hasDebug={true} title={title}
        lcNum=""
        difficulty={difficulty}
        tag={category}
        onBack={onBack || (() => {})} 
        activeTab={tab} 
        onTabChange={setTab}
        />
      <div style={{ marginBottom: '24px' }}>
        <ProblemStatement 
          statement={<p>{props.problemStatement}</p>} 
          examples={examples.map((ex, i) => ({
            label: `Example ${i + 1}`,
            input: ex.inputBlock,
            output: ex.outputBlock,
            explanation: ex.explanation
          }))} 
          constraints={<div />} 
        />
        <div style={{ margin: '10px auto 0px', maxWidth: '1440px', padding: '0px 28px', width: '100%', boxSizing: 'border-box' }}>
          <div className="ex-card card" style={{ margin: '0px' }}>
            <div className="card-title" style={{ marginBottom: '8px' }}>Try Examples</div>
            <div className="ex-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
              {examples.map((ex, i) => (
                <button
                  key={i}
                  className={`ex-btn ${activeExIndex === i ? 'active' : ''}`}
                  onClick={() => onExampleSelect(ex.value)}
                >
                  <span className="ex-input">{ex.shortLabel}</span>
                  <span className="ex-arrow">→</span>
                  <span className="ex-output">{ex.shortOutput}</span>
                </button>
              ))}
              {edgeCases && edgeCases.length > 0 && (
                <button 
                  className="ex-btn edge-btn" 
                  style={{ borderStyle: 'solid', background: 'var(--surface2)', color: 'var(--accent)', borderColor: 'var(--accent)' }} 
                  onClick={() => {
                    const randomCase = edgeCases[Math.floor(Math.random() * edgeCases.length)];
                    onExampleSelect(randomCase);
                  }}
                >
                  <span>✨ Edge Case</span>
                </button>
              )}
              {customInput}
            </div>
          </div>
        </div>
      </div>

      <VPBody 
        left={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ControlBar 
              step={currentStep} 
              maxSteps={totalSteps} 
              isPlaying={isPlaying} 
              speed={speed} 
              onStepChange={setCurrentStep ? setCurrentStep : () => {}} 
              onPlayToggle={isPlaying ? onPause : onPlay} 
              onSpeedChange={onSpeedChange} 
              disabled={!!(predictionPrompt && !answeredPrompts.has(predictionPrompt.id))}
            />
            
            {predictionPrompt && !answeredPrompts.has(predictionPrompt.id) && (
              <div className="card" style={{ border: '2px solid var(--accent)', background: 'var(--surface2)', animation: 'pulse 2s infinite' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✨ Predict Before Run</span>
                </div>
                <div style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text)' }}>
                  {predictionPrompt.question}
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {predictionPrompt.options.map((opt, i) => (
                    <button 
                      key={i} 
                      className="ex-btn" 
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      onClick={() => {
                        if (opt.value === predictionPrompt.correctValue) {
                          setAnsweredPrompts(prev => new Set(prev).add(predictionPrompt.id));
                          setShowPredictionError(null);
                          onPlay(); // auto resume!
                        } else {
                          setShowPredictionError(predictionPrompt.explanation);
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {showPredictionError && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <strong>Mistake:</strong> {showPredictionError}
                  </div>
                )}
              </div>
            )}

            <div className="card">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--cyan)' }}>■</span> Pointer Tracking
              </div>
              <div className="animation-canvas" style={{ padding: 0, margin: 0, border: 'none', background: 'transparent', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
                  {children}
                </div>
              </div>
            </div>

            <StepCard 
              title={currentStep === totalSteps - 1 ? "Done!" : "Executing"} 
              desc={explanation} 
              step={currentStep} 
              maxSteps={totalSteps} 
              isDone={currentStep === totalSteps - 1} 
            />
          </div>
        }
        right={
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodePanel 
              title={title}
              activeLinesJava={activeLinesJava}
              activeLinesPy={activeLinesPy}
              javaCode={javaCode}
              pythonCode={pythonCode}
            />
            {algorithmSteps && <AlgorithmList activeStep={-1} steps={algorithmSteps} />}
            {timeComplexity && spaceComplexity && <Complexity time={timeComplexity} space={spaceComplexity} />}
            {whyItWorks && <WhyItWorks paragraphs={whyItWorks} />}
          </div>
        }
      />
    </VisualizerLayout>
  );
}
