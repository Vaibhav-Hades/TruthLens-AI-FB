package com.example.truthlensai.service;

import org.springframework.stereotype.Service;

@Service
public class YouTubeService {

    public String extractVideoId(String url) {
        try {
            if (url.contains("youtu.be")) {
                return url.split("youtu.be/")[1].split("\\?")[0];
            } else if (url.contains("youtube.com")) {
                return url.split("v=")[1].split("&")[0];
            }
        } catch (Exception e) {
            System.err.println("❌ Could not extract video ID: " + e.getMessage());
        }
        return "";
    }

    public String getTranscript(String videoId) {
        // Mock transcript — replace with real API later
        return "This video talks about health claims, vaccines, and viral spread. " +
               "Some statements may not be scientifically verified.";
    }
}