package com.example.truthlensai.model;

import java.util.List;

public class AnalyzeResponse {

    private String prediction;
    private int confidence;
    private String explanation;
    private String matched_text;
    private List<AnalysisResult> similarClaims;

    public AnalyzeResponse(String prediction, int confidence, String explanation, String matched_text,
            List<AnalysisResult> similarClaims) {
        this.prediction = prediction;
        this.confidence = confidence;
        this.explanation = explanation;
        this.matched_text = matched_text;
        this.similarClaims = similarClaims;
    }

    public String getPrediction() {
        return prediction;
    }

    public int getConfidence() {
        return confidence;
    }

    public String getExplanation() {
        return explanation;
    }

    public String getMatched_text() {
        return matched_text;
    }

    public List<AnalysisResult> getSimilarClaims() {
        return similarClaims;
    }
}