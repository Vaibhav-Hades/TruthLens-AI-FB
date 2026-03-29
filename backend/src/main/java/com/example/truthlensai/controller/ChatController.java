package com.example.truthlensai.controller;

import com.example.truthlensai.model.AnalyzeRequest;
import com.example.truthlensai.model.AnalyzeResponse;
import com.example.truthlensai.service.AnalysisService;
import com.example.truthlensai.service.WebScraperService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final AnalysisService analysisService;
    private final WebScraperService webScraperService;

    public ChatController(AnalysisService analysisService, WebScraperService webScraperService) {
        this.analysisService = analysisService;
        this.webScraperService = webScraperService;
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody AnalyzeRequest request) {

        String originalInput = request.getContent();
        if (originalInput == null || originalInput.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("reply", "⚠️ Please enter some text or a URL.");
            error.put("video", "");
            return error;
        }

        String video = "";
        String reply;

        // YouTube
        if (originalInput.contains("youtube.com") || originalInput.contains("youtu.be")) {
            video = originalInput;
            reply = "🎥 YouTube video detected.\n\n(Transcript analysis coming next 🚀)";
        }

        // Instagram (no scraping possible)
        else if (originalInput.contains("instagram.com")) {
            reply = "📸 Instagram link detected.\n\n" +
                    "⚠️ Cannot extract content due to platform restrictions.\n\n" +
                    "👉 Please describe the claim in text.";
        }

        // Normal URL → scrape
        else if (isUrl(originalInput)) {
            String scrapedText = webScraperService.extractText(originalInput);
            AnalyzeResponse result = analysisService.analyze(scrapedText,
                    request.getType() != null ? request.getType() : "url");
            reply = "🧠 Analysis:\n\n" +
                    "Verdict: " + result.getPrediction() + "\n" +
                    "Confidence: " + result.getConfidence() + "%\n" +
                    result.getExplanation();
        }

        // Plain text
        else {
            AnalyzeResponse result = analysisService.analyze(originalInput,
                    request.getType() != null ? request.getType() : "text");
            reply = "🧠 Verdict: " + result.getPrediction() + "\n" +
                    "Confidence: " + result.getConfidence() + "%\n" +
                    result.getExplanation();
        }

        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        response.put("video", video);
        return response;
    }

    private boolean isUrl(String text) {
        return text.startsWith("http://") || text.startsWith("https://");
    }
}