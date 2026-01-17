package com.harufit.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String nickname;
    private Double height;
    private Double weight;
    private Integer age;
    private String gender;
}
