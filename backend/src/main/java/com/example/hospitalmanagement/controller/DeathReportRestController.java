package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.service.DeathReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/death-reports")
@CrossOrigin(origins = "*")
public class DeathReportRestController {

    private final DeathReportService service;

    public DeathReportRestController(DeathReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<DeathReport> getAll() {
        return service.getAllReports();
    }

    @GetMapping("/{id}")
    public Optional<DeathReport> getById(@PathVariable Long id) {
        return service.getReportById(id);
    }

    @PostMapping
    public DeathReport create(@RequestBody DeathReport report) {
        return service.saveReport(report);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteReport(id);
    }
}
