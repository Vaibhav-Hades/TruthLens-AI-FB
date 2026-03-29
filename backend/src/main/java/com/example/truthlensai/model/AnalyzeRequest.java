package com.example.truthlensai.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class AnalyzeRequest {

    // Accept both "text" and "content" from the request body
    @JsonAlias("content")
    private String text;

    private String type; // "text" or "youtube" — optional field

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}