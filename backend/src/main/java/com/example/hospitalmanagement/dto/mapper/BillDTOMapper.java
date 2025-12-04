package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.BillDTO;
import com.example.hospitalmanagement.dto.BillItemDTO;
import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;

import java.util.stream.Collectors;

public class BillDTOMapper {

    public static BillDTO toDTO(Bill bill) {
        if (bill == null) return null;

        BillDTO dto = new BillDTO();

        dto.setId(bill.getId());
        dto.setInvoiceNumber(bill.getInvoiceNumber());

        // PATIENT
        if (bill.getPatient() != null) {
            dto.setPatientId(bill.getPatient().getId());
            dto.setPatientName(bill.getPatient().getName());
        }

        // DOCTOR
        if (bill.getDoctor() != null) {
            dto.setDoctorId(bill.getDoctor().getId());
            dto.setDoctorName(bill.getDoctor().getName());
        }

        dto.setBillDate(bill.getBillDate() != null ? bill.getBillDate().toString() : null);

        dto.setTotalBeforeTax(bill.getTotalBeforeTax());
        dto.setTotalDiscount(bill.getTotalDiscount());
        dto.setTotalTax(bill.getTotalTax());
        dto.setGrandTotal(bill.getGrandTotal());

        // ITEMS
        dto.setItems(
            bill.getItems().stream().map(item -> {
                BillItemDTO it = new BillItemDTO();
                it.setId(item.getId());
                it.setDescription(item.getDescription());
                it.setQuantity(item.getQuantity());
                it.setUnitPrice(item.getUnitPrice());
                it.setTaxPercent(item.getTaxPercent());
                it.setDiscountPercent(item.getDiscountPercent());
                it.setSubTotal(item.getSubTotal());
                return it;
            }).collect(Collectors.toList())
        );

        return dto;
    }
}
