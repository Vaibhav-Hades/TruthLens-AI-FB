package com.example.truthlensai.controller;

import com.example.truthlensai.model.AnalyzeRequest;
import com.example.truthlensai.model.AnalyzeResponse;
import com.example.truthlensai.service.AnalysisService;
import com.example.truthlensai.model.AnalysisResult;
import com.example.truthlensai.repository.AnalysisResultRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyze")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS })
public class AnalyzeController {

    private final AnalysisService analysisService;
    private final AnalysisResultRepository analysisResultRepository;

    public AnalyzeController(AnalysisService analysisService, AnalysisResultRepository analysisResultRepository) {
        this.analysisService = analysisService;
        this.analysisResultRepository = analysisResultRepository;
    }

    @PostMapping
    public AnalyzeResponse analyze(@RequestBody AnalyzeRequest request) {
        AnalyzeResponse response = analysisService.analyze(request.getText(), request.getType() != null ? request.getType() : "text");
        
        // DELETE these lines 27-36
AnalysisResult result = new AnalysisResult(...);
analysisResultRepository.save(result);
        
        return response;
    }
}
