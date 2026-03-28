package com.example.truthlensai.controller;

import com.example.truthlensai.model.AnalyzeRequest;
import com.example.truthlensai.model.AnalyzeResponse;
import com.example.truthlensai.service.AnalysisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analyze")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET,
        RequestMethod.OPTIONS })
public class AnalyzeController {

    private final AnalysisService analysisService;

    public AnalyzeController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public AnalyzeResponse analyze(@RequestBody AnalyzeRequest request) {
        return analysisService.analyze(request.getText());
    }
}