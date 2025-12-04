package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.ContactDTO;
import com.example.hospitalmanagement.dto.mapper.ContactDTOMapper;
import com.example.hospitalmanagement.model.Contact;
import com.example.hospitalmanagement.service.ContactService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactRestController {

    private final ContactService contactService;

    public ContactRestController(ContactService contactService) {
        this.contactService = contactService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<ContactDTO> getAllContacts() {
        return contactService.findAll()
                .stream()
                .map(ContactDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public ContactDTO getContactById(@PathVariable Long id) {
        Contact c = contactService.findById(id);
        if (c == null) {
            throw new RuntimeException("Contact not found");
        }
        return ContactDTOMapper.toDTO(c);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public ContactDTO createContact(@RequestBody ContactDTO dto) {
        Contact c = new Contact();
        c.setName(dto.getName());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setCompany(dto.getCompany());
        c.setCategory(dto.getCategory());
        c.setCreatedAt(LocalDateTime.now());

        Contact saved = contactService.save(c);
        return ContactDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public ContactDTO updateContact(@PathVariable Long id, @RequestBody ContactDTO dto) {
        Contact c = contactService.findById(id);
        if (c == null) {
            throw new RuntimeException("Contact not found");
        }

        c.setName(dto.getName());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setCompany(dto.getCompany());
        c.setCategory(dto.getCategory());

        Contact updated = contactService.save(c);
        return ContactDTOMapper.toDTO(updated);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Long id) {
        contactService.delete(id);
    }
}
