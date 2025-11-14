package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.service.DeathReportService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/death-reports")
public class DeathReportController {

    private final DeathReportService deathReportService;

    public DeathReportController(DeathReportService deathReportService) {
        this.deathReportService = deathReportService;
    }

    @GetMapping
    public String listReports(Model model) {
        model.addAttribute("reports", deathReportService.getAllReports());
        return "death-reports/list";
    }

    @GetMapping("/add")
    public String addReportForm(Model model) {
        model.addAttribute("report", new DeathReport());
        return "death-reports/add";
    }

    @PostMapping("/add")
    public String saveReport(@ModelAttribute DeathReport report) {
        deathReportService.saveReport(report);
        return "redirect:/death-reports";
    }

    @GetMapping("/{id}")
    public String viewReport(@PathVariable Long id, Model model) {
        DeathReport report = deathReportService.getReportById(id).orElse(null);
        model.addAttribute("report", report);
        return "death-reports/view";
    }

    @GetMapping("/delete/{id}")
    public String deleteReport(@PathVariable Long id) {
        deathReportService.deleteReport(id);
        return "redirect:/death-reports";
    }
}
