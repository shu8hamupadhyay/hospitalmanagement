package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.BirthReport;
import com.example.hospitalmanagement.service.BirthReportService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/birth-reports")
public class BirthReportController {

    private final BirthReportService birthReportService;

    public BirthReportController(BirthReportService birthReportService) {
        this.birthReportService = birthReportService;
    }

    // Default route → list all reports
    @GetMapping
    public String listReports(Model model) {
        model.addAttribute("birthReports", birthReportService.getAllBirthReports());
        return "birthreport/birth-report-list";
    }

    // Show Add Form
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("birthReport", new BirthReport());
        model.addAttribute("formTitle", "Add Birth Report");
        model.addAttribute("formAction", "/birth-reports/add");
        return "birthreport/add-birth-report";
    }

    // Handle Add Form Submit
    @PostMapping("/add")
    public String addReport(@ModelAttribute BirthReport birthReport) {
        birthReportService.saveBirthReport(birthReport);
        return "redirect:/birth-reports";
    }

    // View Specific Report
    @GetMapping("/view/{id}")
    public String viewReport(@PathVariable Long id, Model model) {
        BirthReport report = birthReportService.getBirthReportById(id);
        if (report == null) {
            return "redirect:/birth-reports";
        }
        model.addAttribute("report", report);
        return "birthreport/view-birth-report";
    }
}
