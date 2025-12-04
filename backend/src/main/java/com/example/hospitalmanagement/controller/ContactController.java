package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Contact;
import com.example.hospitalmanagement.service.ContactService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public String listContacts(Model model) {
        model.addAttribute("contacts", contactService.findAll());
        return "contacts/contact-list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("contact", new Contact());
        return "contacts/add-contact";
    }

    @PostMapping("/add")
    public String saveContact(@ModelAttribute Contact contact) {
        contactService.save(contact);
        return "redirect:/contacts";
    }

    @GetMapping("/edit/{id}")
    public String editContact(@PathVariable Long id, Model model) {
        model.addAttribute("contact", contactService.findById(id));
        return "contacts/edit-contact";
    }

    @PostMapping("/update/{id}")
    public String updateContact(@PathVariable Long id, @ModelAttribute Contact contact) {
        contact.setId(id);
        contactService.save(contact);
        return "redirect:/contacts";
    }

    @GetMapping("/delete/{id}")
    public String deleteContact(@PathVariable Long id) {
        contactService.delete(id);
        return "redirect:/contacts";
    }

    @GetMapping("/view/{id}")
    public String viewContact(@PathVariable Long id, Model model) {
        model.addAttribute("contact", contactService.findById(id));
        return "contacts/view-contact";
    }
}
