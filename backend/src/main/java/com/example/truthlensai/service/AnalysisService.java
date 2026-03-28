package com.example.truthlensai.service;

import com.example.truthlensai.dataset.FakeNewsDatasetService;
import com.example.truthlensai.model.AnalyzeResponse;
import com.example.truthlensai.utils.TextUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalysisService {

    private final FakeNewsDatasetService datasetService;

    public AnalysisService(FakeNewsDatasetService datasetService) {
        this.datasetService = datasetService;
    }

    public AnalyzeResponse analyze(String text) {
        System.out.println("INPUT TEXT: " + text);

        List<String> tokens = TextUtils.tokenize(text);
        System.out.println("TOKENS: " + tokens);

        double fakeScore = 0;
        double realScore = 0;
        String matchedFake = "";
        String matchedReal = "";

        for (String fake : datasetService.getFakeNews()) {
            List<String> fakeTokens = TextUtils.tokenize(fake);
            double score = TextUtils.similarityScore(tokens, fakeTokens);
            if (score > fakeScore) {
                fakeScore = score;
                matchedFake = fake;
            }
        }

        for (String real : datasetService.getRealNews()) {
            List<String> realTokens = TextUtils.tokenize(real);
            double score = TextUtils.similarityScore(tokens, realTokens);
            if (score > realScore) {
                realScore = score;
                matchedReal = real;
            }
        }

        String prediction;
        String explanation;
        String matchedText;
        int confidence;

        if (fakeScore > realScore && fakeScore > 0.3) {
            prediction = "FAKE";
            confidence = (int) (fakeScore * 100);
            explanation = "⚠️ Matches known misinformation patterns.";
            matchedText = matchedFake;
        } else if (realScore > fakeScore && realScore > 0.3) {
            prediction = "REAL";
            confidence = (int) (realScore * 100);
            explanation = "✅ Matches verified information.";
            matchedText = matchedReal;
        } else {
            prediction = "INCONCLUSIVE";
            confidence = (int) (Math.max(fakeScore, realScore) * 100);
            explanation = "🤔 Not enough evidence to determine.";
            matchedText = "";
        }

        return new AnalyzeResponse(prediction, confidence, explanation, matchedText);
    }
}