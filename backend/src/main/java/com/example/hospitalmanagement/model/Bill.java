package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
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

    private LocalDateTime billDate = LocalDateTime.now();

    private double totalBeforeTax;
    private double totalTax;
    private double totalDiscount;
    private double grandTotal;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillItem> items = new ArrayList<>();

    public Bill() {
        this.invoiceNumber = "INV-" + System.currentTimeMillis();
    }

    @PrePersist
    @PreUpdate
    public void calculateTotals() {
        double subtotal = 0.0, totalTaxVal = 0.0, totalDiscVal = 0.0;

        for (BillItem item : items) {
            double base = item.getUnitPrice() * item.getQuantity();
            double discount = base * (item.getDiscountPercent() / 100);
            double afterDisc = base - discount;
            double tax = afterDisc * (item.getTaxPercent() / 100);
            double itemTotal = afterDisc + tax;

            subtotal += base;
            totalTaxVal += tax;
            totalDiscVal += discount;
            item.setSubTotal(itemTotal);
            item.setBill(this);
        }

        this.totalBeforeTax = subtotal;
        this.totalDiscount = totalDiscVal;
        this.totalTax = totalTaxVal;
        this.grandTotal = subtotal - totalDiscVal + totalTaxVal;
    }

    public void addItem(BillItem item) {
        item.setBill(this);
        this.items.add(item);
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public LocalDateTime getBillDate() { return billDate; }
    public void setBillDate(LocalDateTime billDate) { this.billDate = billDate; }

    public double getTotalBeforeTax() { return totalBeforeTax; }
    public double getTotalTax() { return totalTax; }
    public double getTotalDiscount() { return totalDiscount; }
    public double getGrandTotal() { return grandTotal; }

    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) {
        this.items.clear();
        if (items != null) items.forEach(this::addItem);
    }
    public void setInvoiceNumber(String invoiceNumber) {
    this.invoiceNumber = invoiceNumber;
}

public void setGrandTotal(double grandTotal) {
    this.grandTotal = grandTotal;
}
}
