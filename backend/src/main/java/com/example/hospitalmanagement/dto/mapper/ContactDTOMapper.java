package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.ContactDTO;
import com.example.hospitalmanagement.model.Contact;

public class ContactDTOMapper {

    // Convert Entity → DTO
    public static ContactDTO toDTO(Contact c) {
        if (c == null) return null;

        ContactDTO dto = new ContactDTO();

        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setCompany(c.getCompany());
        dto.setCategory(c.getCategory());
        dto.setCreatedAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);

        return dto;
    }

    // Convert DTO → Entity
    public static Contact toEntity(ContactDTO dto) {
        if (dto == null) return null;

        Contact c = new Contact();

        c.setId(dto.getId());
        c.setName(dto.getName());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setCompany(dto.getCompany());
        c.setCategory(dto.getCategory());

        if (dto.getCreatedAt() != null && !dto.getCreatedAt().isEmpty()) {
            c.setCreatedAt(java.time.LocalDateTime.parse(dto.getCreatedAt()));
        }

        return c;
    }
}
