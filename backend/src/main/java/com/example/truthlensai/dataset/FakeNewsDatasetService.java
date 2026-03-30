package com.example.truthlensai.dataset;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class FakeNewsDatasetService {

    private final List<String> fakeNews = new ArrayList<>();
    private final List<String> realNews = new ArrayList<>();

    @PostConstruct
    public void loadDataset() {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(getClass().getResourceAsStream("/dataset.csv")));

            String line;
            reader.readLine(); // skip header

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 2)
                    continue;

                String text = parts[0].trim().toLowerCase();
                String label = parts[1].trim();

                if (label.equalsIgnoreCase("FAKE")) {
                    fakeNews.add(text);
                } else if (label.equalsIgnoreCase("REAL")) {
                    realNews.add(text);
                }
            }

            reader.close();
            System.out.println("Dataset loaded ✅");
            System.out.println("Fake count: " + fakeNews.size());
            System.out.println("Real count: " + realNews.size());

        } catch (Exception e) {
            System.err.println("❌ Failed to load dataset: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<String> getFakeNews() {
        return fakeNews;
    }

    public List<String> getRealNews() {
        return realNews;
    }
}