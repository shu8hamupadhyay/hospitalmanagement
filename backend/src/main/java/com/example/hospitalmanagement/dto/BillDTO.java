package com.example.hospitalmanagement.dto;

import lombok.Data;
import java.util.List;

@Data
public class BillDTO {

    private Long id;

    private String invoiceNumber;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;

    private String billDate;

    private double totalBeforeTax;
    private double totalTax;
    private double totalDiscount;
    private double grandTotal;

    private List<BillItemDTO> items;
}
