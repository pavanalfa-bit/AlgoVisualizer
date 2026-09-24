package com.algovisualizer.backend.service;

import com.algovisualizer.backend.dto.CodeExecutionRequest;
import com.algovisualizer.backend.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CodeExecutionService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        CodeExecutionResponse response = new CodeExecutionResponse();
        
        if (!"java".equalsIgnoreCase(request.getLanguage())) {
            response.setSuccess(false);
            response.setCompilationError("Only Java is supported currently.");
            return response;
        }

        Path tempDir = null;
        try {
            // 1. Create a temporary directory for this execution
            tempDir = Files.createTempDirectory("algovisualizer_");
            Path sourceFile = tempDir.resolve("Solution.java");

            // Ensure the class name is Solution for execution
            String code = request.getCode();
            Files.writeString(sourceFile, code);

            // 2. Compile the code
            ProcessBuilder compilePb = new ProcessBuilder("javac", "Solution.java");
            compilePb.directory(tempDir.toFile());
            Process compileProcess = compilePb.start();
            boolean compiled = compileProcess.waitFor(5, TimeUnit.SECONDS);

            if (!compiled || compileProcess.exitValue() != 0) {
                response.setSuccess(false);
                response.setCompilationError(readStream(compileProcess.getErrorStream()));
                return response;
            }

            // 3. Execute the code
            ProcessBuilder runPb = new ProcessBuilder("java", "Solution");
            runPb.directory(tempDir.toFile());
            Process runProcess = runPb.start();
            
            boolean finished = runProcess.waitFor(5, TimeUnit.SECONDS);
            
            if (!finished) {
                runProcess.destroyForcibly();
                response.setSuccess(false);
                response.setRuntimeError("Execution timed out (Limit: 5 seconds). Infinite loop detected.");
                return response;
            }

            if (runProcess.exitValue() != 0) {
                response.setSuccess(false);
                response.setRuntimeError(readStream(runProcess.getErrorStream()));
                return response;
            }

            // 4. Parse Standard Output into Trace
            String output = readStream(runProcess.getInputStream());
            List<Map<String, Object>> trace = parseTrace(output);
            
            response.setSuccess(true);
            response.setTrace(trace);
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setRuntimeError("Internal Server Error: " + e.getMessage());
            return response;
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseTrace(String stdout) {
        List<Map<String, Object>> trace = new ArrayList<>();
        String[] lines = stdout.split("\n");
        for (String line : lines) {
            if (line.trim().startsWith("{") && line.trim().endsWith("}")) {
                try {
                    Map<String, Object> state = objectMapper.readValue(line, Map.class);
                    trace.add(state);
                } catch (JsonProcessingException ignored) {
                    // Ignore lines that are not valid JSON
                }
            }
        }
        return trace;
    }

    private void deleteDirectory(File dir) {
        File[] allContents = dir.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        dir.delete();
    }
}
