package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.service.DepartmentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // ===========================================
    // 📄 List all (Thymeleaf page)
    // ===========================================
    @GetMapping
    public String listDepartments(Model model) {
        model.addAttribute("departments", departmentService.getAllDepartments());
        return "departments/department-list";
    }

    // ===========================================
    // ➕ Add form
    // ===========================================
    @GetMapping("/add")
    public String addDepartmentForm(Model model) {
        model.addAttribute("department", new Department());
        return "departments/add-department";
    }

    // ===========================================
    // 💾 Save
    // ===========================================
    @PostMapping("/save")
    public String saveDepartment(@ModelAttribute("department") Department department) {
        departmentService.saveDepartment(department);
        return "redirect:/departments";
    }

    // ===========================================
    // ✏ Edit form
    // ===========================================
    @GetMapping("/edit/{id}")
    public String editDepartmentForm(@PathVariable Long id, Model model) {
        Department dept = departmentService.getDepartmentById(id);
        model.addAttribute("department", dept);
        return "departments/add-department";
    }

    // ===========================================
    // 🗑 Delete
    // ===========================================
    @GetMapping("/delete/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return "redirect:/departments";
    }
}
