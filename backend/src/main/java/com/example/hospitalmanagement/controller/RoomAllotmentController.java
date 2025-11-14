package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.RoomAllotment;
import com.example.hospitalmanagement.repository.RoomAllotmentRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/rooms")
public class RoomAllotmentController {

    private final RoomAllotmentRepository roomRepo;

    public RoomAllotmentController(RoomAllotmentRepository roomRepo) {
        this.roomRepo = roomRepo;
    }

    // List all rooms
    @GetMapping
    public String listRooms(Model model) {
        model.addAttribute("rooms", roomRepo.findAll());
        return "rooms/list";
    }

    // Show form to add new room allotment
    @GetMapping("/new")
    public String showAddForm(Model model) {
        model.addAttribute("room", new RoomAllotment());
        return "rooms/form";
    }

    // Save new room allotment
    @PostMapping
    public String saveRoom(@ModelAttribute RoomAllotment room) {
        roomRepo.save(room);
        return "redirect:/rooms";
    }

    // Show form to edit room
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        RoomAllotment room = roomRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Room ID: " + id));
        model.addAttribute("room", room);
        return "rooms/form";
    }

    // Update room
    @PostMapping("/update/{id}")
    public String updateRoom(@PathVariable Long id, @ModelAttribute RoomAllotment room) {
        RoomAllotment existing = roomRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Room ID: " + id));

        existing.setRoomNumber(room.getRoomNumber());
        existing.setPatientName(room.getPatientName());
        existing.setRoomType(room.getRoomType());
        existing.setDoctorInCharge(room.getDoctorInCharge());
        existing.setAdmissionDate(room.getAdmissionDate());
        existing.setDischargeDate(room.getDischargeDate());
        existing.setStatus(room.getStatus());

        roomRepo.save(existing);
        return "redirect:/rooms";
    }

    // Delete room
    @GetMapping("/delete/{id}")
    public String deleteRoom(@PathVariable Long id) {
        roomRepo.deleteById(id);
        return "redirect:/rooms";
    }
}
