package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double taxPercent;

    @Column(nullable = false)
    private double discountPercent;

    @Column(nullable = false)
    private double subTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    // --- Constructors ---
    public BillItem() {}

    public BillItem(String description, double unitPrice, int quantity,
                    double taxPercent, double discountPercent, Bill bill) {
        this.description = description;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.taxPercent = taxPercent;
        this.discountPercent = discountPercent;
        this.bill = bill;
        this.subTotal = calculateItemTotal();
    }

    // --- Utility Method ---
    public double calculateItemTotal() {
        double base = unitPrice * quantity;
        double discount = base * (discountPercent / 100);
        double afterDiscount = base - discount;
        double tax = afterDiscount * (taxPercent / 100);
        return afterDiscount + tax;
    }

    // --- Getters and Setters ---
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

    // --- Lifecycle hook ---
    @PrePersist
    @PreUpdate
    public void updateSubTotal() {
        this.subTotal = calculateItemTotal();
    }
}
