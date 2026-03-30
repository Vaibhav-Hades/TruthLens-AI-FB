package com.example.truthlensai.utils;

import java.util.Arrays;
import java.util.List;

public class TextUtils {

    public static List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) {
            return List.of();
        }

        text = text.toLowerCase().replaceAll("[^a-z ]", "").trim();

        if (text.isEmpty()) {
            return List.of();
        }

        return Arrays.asList(text.split("\\s+"));
    }

    public static double similarityScore(List<String> input, List<String> dataset) {
        if (input == null || input.isEmpty()) return 0;

        int match = 0;
        for (String word : input) {
            if (dataset.contains(word)) {
                match++;
            }
        }

        return (double) match / input.size();
    }
}