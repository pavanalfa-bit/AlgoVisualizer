package com.algovisualizer.backend.dto;

public class CodeExecutionRequest {
    private String language;
    private String code;
    private String problemId;

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getProblemId() { return problemId; }
    public void setProblemId(String problemId) { this.problemId = problemId; }
}
