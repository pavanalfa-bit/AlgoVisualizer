import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

// -----------------------------------------------------------------------------
// Visualizer Layout System
// A suite of reusable UI components that standardizes the layout across all algorithms
// -----------------------------------------------------------------------------

export function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {children}
    </div>
  );
}

export function VPHeader({
  title,
  lcNum,
  difficulty,
  tag,
  onBack,
  activeTab = 'visualizer',
  onTabChange
}: {
  title: string;
  lcNum: string;
  difficulty: string;
  tag: string;
  onBack?: () => void;
  activeTab?: 'visualizer' | 'practice';
  onTabChange?: (tab: 'visualizer' | 'practice') => void;
}) {
  return (
    <header className="vp-header">
      <div>
        <a className="vp-back" href="#" onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }}>← Back to DSA Animator</a>
        <div className="vp-title-row">
          <span className="vp-title">{title}</span>
          {lcNum && <span className="lc-badge">LC #{lcNum}</span>}
          <span className={`diff-badge ${difficulty.toLowerCase()}`} style={{ marginTop: 0 }}>{difficulty}</span>
          <span className="tag-badge">{tag}</span>
        </div>
      </div>
      {onTabChange && (
        <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
          <button 
            className="btn"
            style={activeTab === 'visualizer' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : {}}
            onClick={() => onTabChange('visualizer')}
          >
            Visualizer
          </button>
          <button 
            className="btn"
            style={activeTab === 'practice' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : {}}
            onClick={() => onTabChange('practice')}
          >
            Practice
          </button>
        </div>
      )}
    </header>
  );
}

export function ProblemStatement({
  statement,
  examples,
  constraints
}: {
  statement: React.ReactNode;
  examples: { label: string; input: React.ReactNode; output: React.ReactNode; explanation?: React.ReactNode }[];
  constraints: React.ReactNode;
}) {
  return (
    <div style={{ margin: '14px 28px 0', maxWidth: '1380px', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="card">
        <div className="card-title">Problem</div>
        <div className="q-stmt">{statement}</div>
        {examples.map((ex, i) => (
          <div key={i} className="q-example">
            <div className="q-ex-label">Example {i + 1}</div>
            <div className="q-io"><span className="q-label">Input:</span> <code>{ex.input}</code></div>
            <div className="q-io"><span className="q-label">Output:</span> <code>{ex.output}</code></div>
            {ex.explanation && <div className="q-io"><span className="q-label">Explanation:</span> <span className="q-note">{ex.explanation}</span></div>}
          </div>
        ))}
        <div className="q-constraints"><strong style={{ color: 'var(--text)' }}>Constraints:</strong> {constraints}</div>
      </div>
    </div>
  );
}

export function ExamplePicker({
  examples,
  activeEx,
  onSelect
}: {
  examples: { label: string; output: string }[];
  activeEx: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="ex-card card" style={{ margin: '10px 28px 0', maxWidth: '1380px', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="card-title" style={{ marginBottom: 8 }}>Try Examples</div>
      <div className="ex-row">
        {examples.map((ex, i) => (
          <button key={i} className={`ex-btn ${activeEx === i ? 'active' : ''}`} onClick={() => onSelect(i)}>
            <span className="ex-input">{ex.label}</span><span className="ex-arrow">→</span><span className="ex-output">{ex.output}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function VPBody({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="vp-body">
      <div className="vp-left">{left}</div>
      <div className="vp-right">{right}</div>
    </div>
  );
}

export function ControlBar({
  step,
  maxSteps,
  isPlaying,
  speed,
  onStepChange,
  onPlayToggle,
  onSpeedChange
}: {
  step: number;
  maxSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepChange: (newStep: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
}) {
  return (
    <div className="card ctrl-card" id="ctrl-container">
      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 8, lineHeight: 1.4 }}>
        ▸ <strong>Prev</strong> / <strong>Next</strong> = step-by-step. <strong>Play</strong> = auto-advance. Slider = speed.
      </div>
      <div className="ctrl-row">
        <button className="btn" disabled={step === 0} onClick={() => onStepChange(step - 1)}>◀ Prev</button>
        <button className="btn play" onClick={onPlayToggle}>{isPlaying ? 'Pause' : '▶ Play'}</button>
        <button className="btn" disabled={step === maxSteps - 1} onClick={() => onStepChange(step + 1)}>Next ▶</button>
        <button className="btn reset" onClick={() => onStepChange(0)}>↺ Reset</button>
        <div className="speed-grp">
          <span className="speed-lbl">Speed</span>
          <input type="range" min="0" max="4" value={speed} onChange={e => onSpeedChange(parseInt(e.target.value))} style={{ cursor: 'pointer' }} />
          <span className="speed-lbl">Slow</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <div className="prog-bar" style={{ flex: 1 }}>
          <div className="prog-fill" style={{ width: `${maxSteps > 1 ? (step / (maxSteps - 1)) * 100 : 0}%` }}></div>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{step + 1} / {maxSteps}</span>
      </div>
    </div>
  );
}

export function ApproachBanner({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="approach-banner">
      <div className="appr-icon">{icon}</div>
      <div>
        <div className="appr-label">{title}</div>
        {lines.map((line, i) => (
          <div key={i} className={`appr-line${i + 1}`}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export function StateGrid({ items }: { items: { label: string; value: React.ReactNode; changed?: boolean }[] }) {
  return (
    <div className="card">
      <div className="card-title">State variables</div>
      <div className="state-grid">
        {items.map((item, i) => (
          <div key={i} className={`stbox ${item.changed ? 'changed' : ''}`}>
            <div className="st-lbl">{item.label}</div>
            <div className="st-val">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepLogic({ html, logicClass = '' }: { html: string; logicClass?: string }) {
  return (
    <div className="card">
      <div className="card-title">Step Logic</div>
      <div className={`logic-box ${logicClass}`} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}

export function ResultBanner({ show, title, result, icon }: { show: boolean; title: string; result: string; icon?: React.ReactNode }) {
  return (
    <div className={`result-banner ${show ? 'show' : ''}`}>
      <span className="res-icon">{icon || '✨'}</span>
      <div>
        <div className="res-h3">{title}</div>
        <div className="res-p">{result}</div>
      </div>
    </div>
  );
}

export function StepCard({ title, desc, step, maxSteps, isDone }: { title: string; desc: string; step: number; maxSteps: number; isDone?: boolean }) {
  return (
    <div className="card step-card">
      <div className="step-hdr">
        <div className={`step-title ${isDone ? 'done' : ''}`}>{title}</div>
        <div className="step-ctr">{step + 1} / {maxSteps}</div>
      </div>
      <div className="prog-bar"><div className="prog-fill" style={{ width: `${maxSteps > 1 ? (step / (maxSteps - 1)) * 100 : 0}%` }}></div></div>
      <div className="step-desc">{desc}</div>
    </div>
  );
}

export function CodePanel({
  title,
  javaCode,
  pythonCode,
  activeLinesJava,
  activeLinesPy
}: {
  title: string;
  javaCode: string[];
  pythonCode: string[];
  activeLinesJava: number[];
  activeLinesPy: number[];
}) {
  const [activeTab, setActiveTab] = useState<'java' | 'python'>('java');
  const activeCode = activeTab === 'java' ? javaCode : pythonCode;
  const activeLines = activeTab === 'java' ? activeLinesJava : activeLinesPy;

  return (
    <div className="code-panel">
      <div className="cp-header">
        <span className="cp-title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="cp-copy-btn" onClick={() => navigator.clipboard.writeText(activeCode.join('\n'))}>Copy</button>
          <div className="cp-lang-tabs">
            <button className={`cp-lang-btn ${activeTab === 'java' ? 'active' : ''}`} onClick={() => setActiveTab('java')}>Java</button>
            <button className={`cp-lang-btn ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>Python</button>
          </div>
        </div>
      </div>
      <div className="cp-body">
        {activeCode.map((line, idx) => {
          const isActive = activeLines.includes(idx + 1);
          return (
            <div key={idx} className={`cp-line ${isActive ? 'on' : ''}`}>
              <span className="cp-ln">{idx + 1}</span>
              <span className="cp-code" dangerouslySetInnerHTML={{ __html: line }}></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AlgorithmList({ steps, activeStep }: { steps: { num: number; txt: React.ReactNode }[]; activeStep: number }) {
  return (
    <div className="card">
      <div className="card-title">Algorithm</div>
      <div className="algo-list">
        {steps.map((s, i) => (
          <div key={i} className={`al ${activeStep === s.num ? 'on' : ''}`}>
            <div className="al-num">{s.num}</div>
            <div className="al-txt">{s.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Complexity({ time, space }: { time: string; space: string }) {
  return (
    <div className="cplx-row">
      <div className="cplx"><div className="cplx-l">Time</div><div className="cplx-v time-c">{time}</div></div>
      <div className="cplx"><div className="cplx-l">Space</div><div className="cplx-v space-c">{space}</div></div>
    </div>
  );
}

export function WhyItWorks({ paragraphs }: { paragraphs: React.ReactNode[] }) {
  return (
    <div className="card">
      <div className="card-title">Why It Works</div>
      {paragraphs.map((p, i) => (
        <p key={i} className="why-p" style={{ marginTop: i > 0 ? 10 : 0 }}>{p}</p>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Hook for managing animation playback state
// -----------------------------------------------------------------------------

export function useAnimationController(stepsLength: number, defaultSpeed: number = 2) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);

  React.useEffect(() => {
    let timer: any;
    if (isPlaying && step < stepsLength - 1) {
      const speeds = [1500, 1000, 700, 400, 200];
      timer = setTimeout(() => setStep(s => s + 1), speeds[speed]);
    } else if (step >= stepsLength - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, stepsLength, speed]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (step >= stepsLength - 1) setStep(0);
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return { step, isPlaying, speed, setSpeed, handleStepChange, handlePlayToggle, reset };
}

// -----------------------------------------------------------------------------
// Practice Workspace Component
// -----------------------------------------------------------------------------

export function PracticeWorkspace({
  problemStatement,
  examples,
  constraints,
  defaultCodeJava,
  defaultCodePython
}: {
  problemStatement: React.ReactNode;
  examples: { label: string; input: React.ReactNode; output: React.ReactNode; explanation?: React.ReactNode }[];
  constraints: React.ReactNode;
  defaultCodeJava: string;
  defaultCodePython?: string;
}) {
  const [language, setLanguage] = useState<'java' | 'python'>('java');
  const [code, setCode] = useState(defaultCodeJava);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // When default code props change (e.g. switching problems), update code
  React.useEffect(() => {
    setCode(language === 'java' ? defaultCodeJava : (defaultCodePython || ''));
  }, [defaultCodeJava, defaultCodePython]);

  // When language changes, update code
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'java' | 'python';
    setLanguage(lang);
    setCode(lang === 'java' ? defaultCodeJava : (defaultCodePython || ''));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running on Wandbox API...');
    try {
      const compiler = language === 'java' ? 'openjdk-jdk-22+36' : 'cpython-3.14.0';
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: compiler,
          code: code,
          save: false
        })
      });
      const data = await res.json();
      
      let out = '';
      if (data.compiler_message) {
        out += data.compiler_message + '\\n';
      }
      if (data.program_message) {
        out += data.program_message;
      }
      if (data.program_error) {
        out += '\\n' + data.program_error;
      }
      
      if (!out && data.status === '0') {
        out = 'Success (No output)';
      }
      
      setOutput(out || 'Error running code.');
    } catch (e: any) {
      setOutput('Network Error (CORS or offline): ' + e.message);
    }
    setIsRunning(false);
  };
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', width: '100%', overflow: 'hidden' }}>
      {/* Left Pane */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px', borderRight: '1px solid var(--border)' }}>
        <ProblemStatement statement={problemStatement} examples={examples} constraints={constraints} />
      </div>
      {/* Right Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Code Editor</span>
            <select value={language} onChange={handleLangChange} style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.85rem', outline: 'none' }}>
              <option value="java">Java</option>
              {defaultCodePython && <option value="python">Python</option>}
            </select>
          </div>
          <button className="btn play" onClick={handleRunCode} disabled={isRunning} style={{ padding: '4px 12px', height: 'auto', fontSize: '0.85rem' }}>
            {isRunning ? 'Running...' : '▶ Run Code'}
          </button>
        </div>
        <div style={{ flex: 1, background: '#1e1e1e', minHeight: '300px' }}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 }
            }}
          />
        </div>
        
        {/* Terminal Output */}
        <div style={{ height: '200px', borderTop: '2px solid var(--border)', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '6px 16px', background: 'var(--surface)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Terminal Output
          </div>
          <div style={{ padding: '12px 16px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap', overflowY: 'auto', flex: 1 }}>
            {output || <span style={{ color: 'var(--muted)' }}>Click 'Run Code' to execute your program...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
