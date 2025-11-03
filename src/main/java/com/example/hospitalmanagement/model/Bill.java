package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDateTime billDate;
    private double totalBeforeTax;
    private double totalTax;
    private double totalDiscount;
    private double grandTotal;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillItem> items = new ArrayList<>();

    public Bill() {
        this.billDate = LocalDateTime.now();
        this.invoiceNumber = "INV-" + System.currentTimeMillis();
    }

    @PrePersist
    @PreUpdate
    public void calculateTotals() {
        double subtotal = 0.0;
        double totalTaxValue = 0.0;
        double totalDiscountValue = 0.0;

        for (BillItem item : items) {
            double itemBase = item.getUnitPrice() * item.getQuantity();
            double discountValue = itemBase * (item.getDiscountPercent() / 100);
            double afterDiscount = itemBase - discountValue;
            double taxValue = afterDiscount * (item.getTaxPercent() / 100);
            double itemTotal = afterDiscount + taxValue;

            subtotal += itemBase;
            totalDiscountValue += discountValue;
            totalTaxValue += taxValue;
            item.setSubTotal(itemTotal);
        }

        this.totalBeforeTax = subtotal;
        this.totalDiscount = totalDiscountValue;
        this.totalTax = totalTaxValue;
        this.grandTotal = subtotal - totalDiscountValue + totalTaxValue;
    }

    // --- Utility ---
    public void addItem(BillItem item) {
        item.setBill(this);
        this.items.add(item);
    }

    // --- Getters/Setters ---
    public Long getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public LocalDateTime getBillDate() { return billDate; }
    public double getTotalBeforeTax() { return totalBeforeTax; }
    public double getTotalTax() { return totalTax; }
    public double getTotalDiscount() { return totalDiscount; }
    public double getGrandTotal() { return grandTotal; }
    public List<BillItem> getItems() { return items; }

    public void setItems(List<BillItem> items) {
        this.items.clear();
        if (items != null) items.forEach(this::addItem);
    }
}
