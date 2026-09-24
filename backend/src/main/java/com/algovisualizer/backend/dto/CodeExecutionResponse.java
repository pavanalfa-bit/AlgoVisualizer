package com.algovisualizer.backend.dto;

import java.util.List;
import java.util.Map;

public class CodeExecutionResponse {
    private boolean success;
    private String compilationError;
    private String runtimeError;
    private List<Map<String, Object>> trace; // The JSON animation states parsed from stdout

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getCompilationError() { return compilationError; }
    public void setCompilationError(String compilationError) { this.compilationError = compilationError; }

    public String getRuntimeError() { return runtimeError; }
    public void setRuntimeError(String runtimeError) { this.runtimeError = runtimeError; }

    public List<Map<String, Object>> getTrace() { return trace; }
    public void setTrace(List<Map<String, Object>> trace) { this.trace = trace; }
}
