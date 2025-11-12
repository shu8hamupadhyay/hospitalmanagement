package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> { }
