package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"appointments", "doctor"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({"patients", "appointments"})
    private Doctor doctor;

    private LocalDateTime billDate = LocalDateTime.now();

    private double totalBeforeTax;
    private double totalTax;
    private double totalDiscount;
    private double grandTotal;

    @OneToMany(
            mappedBy = "bill",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnoreProperties({"bill"})   // VERY IMPORTANT
    private List<BillItem> items = new ArrayList<>();


    public Bill() {}


    // -------------------------------------------------------------
    // Calculate totals before save/update
    // -------------------------------------------------------------
    @PrePersist
    @PreUpdate
    public void calculateTotals() {
        double subtotal = 0;
        double discountTotal = 0;
        double taxTotal = 0;

        for (BillItem item : items) {

            item.setBill(this); // REQUIRED

            double base = item.getUnitPrice() * item.getQuantity();
            double discount = base * (item.getDiscountPercent() / 100);
            double afterDiscount = base - discount;
            double tax = afterDiscount * (item.getTaxPercent() / 100);

            double total = afterDiscount + tax;

            subtotal += base;
            discountTotal += discount;
            taxTotal += tax;

            item.setSubTotal(total);
        }

        this.totalBeforeTax = subtotal;
        this.totalDiscount = discountTotal;
        this.totalTax = taxTotal;
        this.grandTotal = subtotal - discountTotal + taxTotal;
    }


    // -------------------------------------------------------------
    // Add item utility
    // -------------------------------------------------------------
    public void addItem(BillItem item) {
        item.setBill(this);
        this.items.add(item);
    }


    // -------------------------------------------------------------
    // Getters + Setters
    // -------------------------------------------------------------
    public Long getId() { return id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

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

    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }

    public List<BillItem> getItems() { return items; }

    public void setItems(List<BillItem> items) {
        this.items.clear();
        if (items != null) {
            items.forEach(this::addItem);  // ensures bill is set properly
        }
    }
}
