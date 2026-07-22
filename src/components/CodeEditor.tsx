import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';
import './CodeEditor.css';

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  isLoading: boolean;
}

export function CodeEditor({ initialCode, onRun, isLoading }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="code-editor-container glassmorphism">
      <div className="code-editor-header">
        <span className="code-editor-title">Solution.java</span>
        <div className="code-editor-actions">
          <button 
            className="code-editor-btn reset-btn" 
            onClick={() => setCode(initialCode)}
            disabled={isLoading}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button 
            className="code-editor-btn run-btn" 
            onClick={() => onRun(code)}
            disabled={isLoading}
          >
            <Play size={14} /> {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      <div className="code-editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            roundedSelection: false,
          }}
        />
      </div>
    </div>
  );
}
