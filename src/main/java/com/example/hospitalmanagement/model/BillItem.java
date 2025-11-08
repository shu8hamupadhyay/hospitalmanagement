package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private double unitPrice;
    private int quantity;
    private double taxPercent;
    private double discountPercent;
    private double subTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @PrePersist
    @PreUpdate
    public void computeSubTotal() {
        double base = unitPrice * quantity;
        double discount = base * (discountPercent / 100);
        double afterDiscount = base - discount;
        double tax = afterDiscount * (taxPercent / 100);
        this.subTotal = afterDiscount + tax;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getTaxPercent() { return taxPercent; }
    public void setTaxPercent(double taxPercent) { this.taxPercent = taxPercent; }

    public double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(double discountPercent) { this.discountPercent = discountPercent; }

    public double getSubTotal() { return subTotal; }
    public void setSubTotal(double subTotal) { this.subTotal = subTotal; }

    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }
}
