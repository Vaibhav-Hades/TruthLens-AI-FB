package com.example.truthlensai.model;

public class AnalyzeResponse {

    private String prediction;
    private int confidence;
    private String explanation;
    private String matched_text;

    public AnalyzeResponse(String prediction, int confidence, String explanation, String matched_text) {
        this.prediction = prediction;
        this.confidence = confidence;
        this.explanation = explanation;
        this.matched_text = matched_text;
    }

    public String getPrediction() { return prediction; }
    public int getConfidence() { return confidence; }
    public String getExplanation() { return explanation; }
    public String getMatched_text() { return matched_text; }
}