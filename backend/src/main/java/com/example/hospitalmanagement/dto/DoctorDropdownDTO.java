package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class DoctorDropdownDTO {
    private Long id;
    private String name;

    public DoctorDropdownDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
