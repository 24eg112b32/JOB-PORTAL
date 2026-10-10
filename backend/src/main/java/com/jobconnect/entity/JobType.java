package com.jobconnect.entity;

public enum JobType {
    FULL_TIME("Full Time"),
    PART_TIME("Part Time"),
    INTERNSHIP("Internship"),
    REMOTE("Remote"),
    CONTRACT("Contract");

    private final String label;

    JobType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
