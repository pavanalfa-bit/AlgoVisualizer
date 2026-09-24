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
  hasDebug,
  onTabChange
}: {
  title: string;
  lcNum: string;
  difficulty: string;
  tag: string;
  onBack?: () => void;
  activeTab?: 'visualizer' | 'practice' | 'debug';
  hasDebug?: boolean;
  onTabChange?: (tab: any) => void;
}) {
  return (
    <header className="vp-header">
      <div className="vp-title-row">
        <a className="vp-back" href="#" onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }}>← Back</a>
        <span className="vp-title">{title}</span>
        {lcNum && <span className="lc-badge">LC #{lcNum}</span>}
        <span className={`diff-badge ${difficulty.toLowerCase()}`} style={{ marginTop: 0 }}>{difficulty}</span>
        <span className="tag-badge">{tag}</span>
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
          {hasDebug && (
            <button 
              className="btn"
              style={activeTab === 'debug' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : {}}
              onClick={() => onTabChange && onTabChange('debug')}
            >
              🐛 Fix the Bug
            </button>
          )}
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
    <div style={{ margin: '16px auto 0', maxWidth: '1440px', padding: '0 28px', width: '100%', boxSizing: 'border-box' }}>
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
  onSelect,
  onCustomInput,
  onGenerateEdgeCase
}: {
  examples: { label: string; output: string }[];
  activeEx: number;
  onSelect: (idx: number) => void;
  onCustomInput?: (val: string, isEdgeCase?: boolean) => void;
  onGenerateEdgeCase?: () => Promise<string>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customVal, setCustomVal] = useState('');
  const [isLoadingEdgeCase, setIsLoadingEdgeCase] = useState(false);

  const handleCustomSubmit = () => {
    if (customVal.trim() && onCustomInput) {
      onCustomInput(customVal);
      setIsEditing(false);
      setCustomVal('');
    }
  };

  return (
    <div style={{ margin: '10px auto 0', maxWidth: '1440px', padding: '0 28px', width: '100%', boxSizing: 'border-box' }}>
      <div className="ex-card card" style={{ margin: 0 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>Try Examples</div>
      <div className="ex-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        {examples.map((ex, i) => (
          <button key={i} className={`ex-btn ${activeEx === i ? 'active' : ''}`} onClick={() => onSelect(i)}>
            <span className="ex-input">{ex.label}</span><span className="ex-arrow">→</span><span className="ex-output">{ex.output}</span>
          </button>
        ))}
        
        {onGenerateEdgeCase && onCustomInput && (
          <button 
            className="ex-btn edge-btn" 
            onClick={async () => {
              if (isLoadingEdgeCase) return;
              setIsLoadingEdgeCase(true);
              try {
                const suggestion = await onGenerateEdgeCase();
                if (onCustomInput) {
                  onCustomInput(suggestion, true);
                }
              } catch(e) {
                console.error(e);
              } finally {
                setIsLoadingEdgeCase(false);
              }
            }} 
            style={{ borderStyle: 'solid', background: 'var(--surface2)', color: 'var(--accent)', borderColor: 'var(--accent)' }}
          >
            {isLoadingEdgeCase ? <span className="spinner">✨ Loading...</span> : <span>✨ Edge Case</span>}
          </button>
        )}
        
        {onCustomInput && (
          isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--surface2)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <input 
                autoFocus
                type="text" 
                placeholder="e.g. [[1,2],[3,4]]" 
                value={customVal}
                onChange={e => setCustomVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
                style={{ background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontFamily: 'monospace', width: '150px', fontSize: '0.9rem' }}
              />
              <button onClick={handleCustomSubmit} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Go</button>
              <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', color: 'var(--muted)', border: 'none', cursor: 'pointer', padding: '4px' }}>✕</button>
            </div>
          ) : (
            <button className="ex-btn" onClick={() => setIsEditing(true)} style={{ border: '1px dashed var(--muted)', background: 'var(--surface2)', color: 'var(--text)' }}>
              + Custom
            </button>
          )
        )}
      </div>
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
  disabled?: boolean;
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
  activeLinesPy,
  highlightColor,
  highlightBorderColor
}: {
  title: string;
  javaCode: string[];
  pythonCode: string[];
  activeLinesJava: number[];
  activeLinesPy: number[];
  highlightColor?: string;
  highlightBorderColor?: string;
}) {
  const [activeTab, setActiveTab] = useState<'java' | 'python'>('java');
  const [copied, setCopied] = useState(false);
  const activeCode = activeTab === 'java' ? javaCode : pythonCode;
  const activeLines = activeTab === 'java' ? activeLinesJava : activeLinesPy;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-panel">
      <div className="cp-header">
        <span className="cp-title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            className="cp-copy-btn" 
            onClick={handleCopy}
            style={copied ? { background: 'var(--easy)', color: 'var(--surface)', borderColor: 'var(--easy)' } : {}}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
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
            <div
              key={idx}
              className={`cp-line ${isActive ? 'on' : ''}`}
              style={isActive && highlightColor ? {
                background: highlightColor,
                borderLeft: `3px solid ${highlightBorderColor || '#ef4444'}`
              } : {}}
            >
              <span className="cp-ln">{idx + 1}</span>
              <span className="cp-code" dangerouslySetInnerHTML={{ __html: line }}></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DebugEditor({
  defaultJava,
  defaultPython,
  buggyLines
}: {
  defaultJava: string;
  defaultPython?: string;
  buggyLines?: number[];
}) {
  const [language, setLanguage] = useState<'java' | 'python'>('java');
  const [code, setCode] = useState(defaultJava);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pass' | 'fail'>('idle');
  const editorRef = React.useRef<any>(null);
  const decorationsRef = React.useRef<any>(null);

  const applyDecorations = React.useCallback((editor: any) => {
    if (!buggyLines || buggyLines.length === 0) return;
    if (decorationsRef.current) decorationsRef.current.clear();
    decorationsRef.current = editor.createDecorationsCollection(
      buggyLines.map(line => ({
        range: { startLineNumber: line, endLineNumber: line, startColumn: 1, endColumn: 1000 },
        options: {
          isWholeLine: true,
          className: 'buggy-line-highlight',
          glyphMarginClassName: 'buggy-line-glyph',
          overviewRuler: { color: '#ef4444', position: 1 }
        }
      }))
    );
  }, [buggyLines]);

  React.useEffect(() => {
    const newCode = language === 'java' ? defaultJava : (defaultPython || '');
    setCode(newCode);
  }, [language, defaultJava, defaultPython]);

  React.useEffect(() => {
    if (editorRef.current) applyDecorations(editorRef.current);
  }, [language, applyDecorations]);

  const handleRun = async () => {
    setIsRunning(true);
    setStatus('idle');
    setOutput('Running on Wandbox...');
    try {
      const compiler = language === 'java' ? 'openjdk-jdk-22+36' : 'cpython-3.14.0';
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler, code, save: false })
      });
      const data = await res.json();
      const out = [data.compiler_message, data.program_message, data.program_error].filter(Boolean).join('\n');
      const passed = !data.program_error && !data.compiler_message && !!data.program_message;
      setOutput(out || 'No output.');
      setStatus(passed ? 'pass' : 'fail');
    } catch (e: any) {
      setOutput('Network Error: ' + e.message);
      setStatus('fail');
    }
    setIsRunning(false);
  };

  const statusColor = status === 'pass' ? '#22c55e' : status === 'fail' ? '#ef4444' : 'var(--muted)';
  const statusLabel = status === 'pass' ? '✅ Tests Passed!' : status === 'fail' ? '❌ Still failing — keep trying!' : '';

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: status === 'pass' ? '2px solid #22c55e' : status === 'fail' ? '2px solid #ef4444' : undefined }}>
      {/* Header */}
      <div style={{ padding: '10px 16px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>✏️ Your Fix</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as 'java' | 'python')}
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.8rem' }}
          >
            <option value="java">Java</option>
            {defaultPython && <option value="python">Python</option>}
          </select>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          style={{ padding: '5px 14px', borderRadius: '6px', border: '2px solid #ef4444', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: isRunning ? 'not-allowed' : 'pointer', opacity: isRunning ? 0.7 : 1, boxShadow: '0 3px 0 #b91c1c' }}
        >
          {isRunning ? '⏳ Running...' : '🐛 Run Tests'}
        </button>
      </div>

      {/* Monaco editor */}
      <div style={{ height: '260px', background: '#1e1e1e' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={val => setCode(val || '')}
          onMount={editor => { editorRef.current = editor; applyDecorations(editor); }}
          options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: { top: 12 }, glyphMargin: true }}
        />
      </div>

      {/* Output */}
      {(output || status !== 'idle') && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', background: 'var(--surface2)' }}>
          {statusLabel && <div style={{ fontWeight: 700, color: statusColor, marginBottom: '6px', fontSize: '0.9rem' }}>{statusLabel}</div>}
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text)', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>{output}</pre>
        </div>
      )}
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
    setIsPlaying(p => !p);
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

export interface DebugTestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface DebugHint {
  level: 'vague' | 'specific' | 'near-answer';
  text: string;
}

export function PracticeWorkspace({
  problemStatement,
  examples,
  constraints,
  defaultCodeJava,
  defaultCodePython,
  examplePicker,
  activeExampleStr,
  codeInjector,
  editorOnly,
  runButtonColor,
  runButtonText,
  buggyLines,
  debugTestCases,
  debugHints
}: {
  problemStatement: React.ReactNode;
  examples: { label: string; input: React.ReactNode; output: React.ReactNode; explanation?: React.ReactNode }[];
  constraints: React.ReactNode;
  defaultCodeJava: string;
  defaultCodePython?: string;
  examplePicker?: React.ReactNode;
  activeExampleStr?: string;
  codeInjector?: (code: string, lang: string, exampleStr: string) => string;
  editorOnly?: boolean;
  runButtonColor?: string;
  runButtonText?: string;
  buggyLines?: number[];
  debugTestCases?: DebugTestCase[];
  debugHints?: DebugHint[];
}) {
  const [language, setLanguage] = useState<'java' | 'python'>('java');
  const [code, setCode] = useState(defaultCodeJava);
  const [output, setOutput] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const editorRef = React.useRef<any>(null);
  const decorationsRef = React.useRef<any>(null);

  const applyBuggyDecorations = React.useCallback((editor: any) => {
    if (!buggyLines || buggyLines.length === 0) return;
    if (decorationsRef.current) decorationsRef.current.clear();
    decorationsRef.current = editor.createDecorationsCollection(
      buggyLines.map(line => ({
        range: { startLineNumber: line, endLineNumber: line, startColumn: 1, endColumn: 1000 },
        options: {
          isWholeLine: true,
          className: 'buggy-line-highlight',
          glyphMarginClassName: 'buggy-line-glyph',
          overviewRuler: { color: '#ef4444', position: 1 },
          minimap: { color: '#ef4444', position: 1 }
        }
      }))
    );
  }, [buggyLines]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    applyBuggyDecorations(editor);
  };

  // Re-apply decorations when language switches
  React.useEffect(() => {
    if (editorRef.current) applyBuggyDecorations(editorRef.current);
  }, [language, applyBuggyDecorations]);
  const [isRunning, setIsRunning] = useState(false);

  // When default code props change (e.g. switching problems), update code
  React.useEffect(() => {
    let newCode = language === 'java' ? defaultCodeJava : (defaultCodePython || '');
    if (activeExampleStr && codeInjector) {
      newCode = codeInjector(newCode, language, activeExampleStr);
    }
    setCode(newCode);
  }, [defaultCodeJava, defaultCodePython, language]); // language added here so it correctly switches and injects

  // When active example changes, inject it into the CURRENT code without losing user logic
  React.useEffect(() => {
    if (activeExampleStr && codeInjector) {
      setCode(prev => codeInjector(prev, language, activeExampleStr));
    }
  }, [activeExampleStr, codeInjector]);

  // When language changes, update code
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'java' | 'python';
    setLanguage(lang);
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
    <div style={{ display: 'flex', height: editorOnly ? '100%' : 'calc(100vh - 60px)', width: '100%', overflow: 'hidden' }}>
      {!editorOnly && (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px', borderRight: '1px solid var(--border)' }}>
          <ProblemStatement statement={problemStatement} examples={examples} constraints={constraints} />
          {examplePicker && (
            <div style={{ marginTop: '16px' }}>{examplePicker}</div>
          )}

          {/* ── Debug: Test Cases Panel ── */}
          {debugTestCases && debugTestCases.length > 0 && (
            <div style={{ padding: '0 28px', marginTop: '20px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🧪</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Test Cases</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 600 }}>Buggy Output Shown</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {debugTestCases.map((tc, i) => (
                    <div key={i} style={{ borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                      {tc.description && (
                        <div style={{ padding: '6px 12px', background: 'var(--surface2)', fontSize: '0.75rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                          {tc.description}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                        <div style={{ padding: '10px 14px', borderRight: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Input</div>
                          <code style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{tc.input}</code>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.06)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Expected</div>
                          <code style={{ fontSize: '0.85rem', color: '#16a34a', fontFamily: 'JetBrains Mono, monospace' }}>{tc.expected}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Debug: Progressive Hints ── */}
          {debugHints && debugHints.length > 0 && (
            <div style={{ padding: '0 28px', marginTop: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: hintsRevealed > 0 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>💡</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Hints</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{hintsRevealed}/{debugHints.length} revealed</span>
                  </div>
                  {hintsRevealed < debugHints.length ? (
                    <button
                      onClick={() => setHintsRevealed(h => h + 1)}
                      style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Show Hint {hintsRevealed + 1}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>All hints shown</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {debugHints.slice(0, hintsRevealed).map((hint, i) => {
                    const levelColor = hint.level === 'vague' ? '#f59e0b' : hint.level === 'specific' ? '#ef4444' : '#8b5cf6';
                    const levelLabel = hint.level === 'vague' ? '🟡 Vague' : hint.level === 'specific' ? '🔴 Specific' : '🟣 Near Answer';
                    return (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: '8px', border: `1px solid ${levelColor}40`, background: `${levelColor}0d`, animation: 'fadeSlideIn 0.3s ease' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: levelColor, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{levelLabel} — Hint {i + 1}</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 }}>{hint.text}</div>
                      </div>
                    );
                  })}
                  {hintsRevealed === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', padding: '8px 0' }}>Click "Show Hint 1" to get your first clue 🔍</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            style={{
              padding: '5px 14px',
              height: 'auto',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'var(--accent)',
              border: `2px solid var(--accent)`,
              borderRadius: '6px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.65 : 1,
              boxShadow: `0 3px 0 rgba(0,0,0,0.3)`,
              transition: 'opacity 0.15s',
              letterSpacing: '0.3px'
            }}
          >
            {isRunning ? '⏳ Running...' : (runButtonText || '▶ Run Code')}
          </button>
        </div>
        {buggyLines && buggyLines.length > 0 && (
          <div style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#ef4444', fontWeight: 600 }}>
            <span>⚠️</span>
            <span>{buggyLines.length} bug{buggyLines.length > 1 ? 's' : ''} detected — red lines are suspicious. Fix the logic and run tests.</span>
          </div>
        )}
        <div style={{ flex: 1, background: '#1e1e1e', minHeight: '300px' }}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 16 },
              glyphMargin: true
            }}
          />
        </div>
        
        {/* Terminal Output */}
        <div style={{ height: '30%', borderTop: '1px solid var(--border)', background: 'var(--surface2)', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Terminal Output</span>
            {isRunning && <span className="spinner" style={{ fontSize: '12px' }}>⚙️</span>}
          </div>
          <pre style={{ margin: 0, flex: 1, overflowY: 'auto', background: '#111', padding: '12px', borderRadius: '4px', color: '#e5e5e5', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid var(--border)' }}>
            {output || <span style={{ color: 'var(--muted)' }}>Click 'Run Code' to execute your program...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
