package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class ContactDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String category;
    private String createdAt;
}
