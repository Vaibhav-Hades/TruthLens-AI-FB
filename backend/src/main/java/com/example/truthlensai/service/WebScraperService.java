package com.example.truthlensai.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class WebScraperService {

    public String extractText(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();

            String text = doc.body().text();

            if (text.length() > 1000) {
                text = text.substring(0, 1000);
            }

            return text;

        } catch (Exception e) {
            System.err.println("❌ Scraping failed: " + e.getMessage());
            return "Could not extract content from link.";
        }
    }
}