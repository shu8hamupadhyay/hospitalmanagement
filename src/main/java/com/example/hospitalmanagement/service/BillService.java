package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.repository.BillRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Stream;

@Service
@Transactional
public class BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public BillService(BillRepository billRepository,
                       PatientRepository patientRepository,
                       DoctorRepository doctorRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // ------------------------------------------------------------------------
    // 🔹 BASIC CRUD OPERATIONS
    // ------------------------------------------------------------------------
    public List<Bill> findAll() {
        return billRepository.findAll();
    }

    public Optional<Bill> findById(Long id) {
        return billRepository.findById(id);
    }

    public Bill save(Bill bill) {
        if (bill.getItems() != null) {
            for (BillItem item : bill.getItems()) {
                item.setBill(bill);
            }
        }
        bill.calculateTotals();
        return billRepository.save(bill);
    }

    public void deleteById(Long id) {
        billRepository.deleteById(id);
    }

    // ------------------------------------------------------------------------
    // 📤 EXPORT ALL BILLS TO EXCEL (DETAILED WITH ITEMS)
    // ------------------------------------------------------------------------
    public ByteArrayInputStream exportBillsToExcel(List<Bill> bills) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Detailed Bills");

            String[] columns = {
                    "Invoice No", "Patient", "Doctor", "Date",
                    "Description", "Qty", "Unit Price (₹)", "Tax %", "Discount %", "Subtotal (₹)",
                    "Total Before Tax (₹)", "Total Discount (₹)", "Total Tax (₹)", "Grand Total (₹)"
            };

            // Header row + style
            Row header = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            for (Bill bill : bills) {
                String invoice = bill.getInvoiceNumber();
                String patient = bill.getPatient() != null ? bill.getPatient().getName() : "N/A";
                String doctor = bill.getDoctor() != null ? bill.getDoctor().getName() : "N/A";
                String date = bill.getBillDate() != null ? bill.getBillDate().format(formatter) : "N/A";

                if (bill.getItems() != null && !bill.getItems().isEmpty()) {
                    for (BillItem item : bill.getItems()) {
                        Row row = sheet.createRow(rowIdx++);
                        int c = 0;
                        row.createCell(c++).setCellValue(invoice != null ? invoice : "");
                        row.createCell(c++).setCellValue(patient);
                        row.createCell(c++).setCellValue(doctor);
                        row.createCell(c++).setCellValue(date);
                        row.createCell(c++).setCellValue(item.getDescription() != null ? item.getDescription() : "");
                        row.createCell(c++).setCellValue(item.getQuantity());
                        row.createCell(c++).setCellValue(item.getUnitPrice());
                        row.createCell(c++).setCellValue(item.getTaxPercent());
                        row.createCell(c++).setCellValue(item.getDiscountPercent());
                        row.createCell(c++).setCellValue(item.getSubTotal());
                        row.createCell(c++).setCellValue(bill.getTotalBeforeTax());
                        row.createCell(c++).setCellValue(bill.getTotalDiscount());
                        row.createCell(c++).setCellValue(bill.getTotalTax());
                        row.createCell(c++).setCellValue(bill.getGrandTotal());
                    }
                } else {
                    Row row = sheet.createRow(rowIdx++);
                    int c = 0;
                    row.createCell(c++).setCellValue(invoice != null ? invoice : "");
                    row.createCell(c++).setCellValue(patient);
                    row.createCell(c++).setCellValue(doctor);
                    row.createCell(c++).setCellValue(date);
                    row.createCell(c++).setCellValue("No Items");
                    for (int i = 0; i < 5; i++) row.createCell(c++).setCellValue("");
                    row.createCell(c++).setCellValue(bill.getTotalBeforeTax());
                    row.createCell(c++).setCellValue(bill.getTotalDiscount());
                    row.createCell(c++).setCellValue(bill.getTotalTax());
                    row.createCell(c++).setCellValue(bill.getGrandTotal());
                }

                // Blank line separator (optional)
                rowIdx++;
            }

            for (int i = 0; i < columns.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // ------------------------------------------------------------------------
    // 📥 IMPORT BILLS FROM EXCEL (MERGED BY INVOICE)
    // ------------------------------------------------------------------------
    public void importBillsFromExcel(InputStream inputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook(inputStream);
        try {
            Sheet sheet = workbook.getSheetAt(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            // Group bills by Invoice No preserving order
            Map<String, Bill> billMap = new LinkedHashMap<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // skip header

                String invoice = getStringValue(row.getCell(0)).trim();
                if (invoice.isEmpty()) {
                    // fallback invoice id if blank
                    invoice = "INV-" + System.currentTimeMillis() + "-" + row.getRowNum();
                }

                String patientName = getStringValue(row.getCell(1)).trim();
                String doctorName = getStringValue(row.getCell(2)).trim();
                String dateString = getStringValue(row.getCell(3)).trim();

                String description = getStringValue(row.getCell(4));
                int qty = (int) getNumericValue(row.getCell(5));
                double unitPrice = getNumericValue(row.getCell(6));
                double taxPercent = getNumericValue(row.getCell(7));
                double discountPercent = getNumericValue(row.getCell(8));
                double subtotal = getNumericValue(row.getCell(9));

                // Find or create Bill object for this invoice
                Bill bill = billMap.get(invoice);
                if (bill == null) {
                    bill = new Bill();
                    bill.setInvoiceNumber(invoice);
                    bill.setBillDate(parseDate(dateString, formatter));

                    // Initialize items collection if null
                    if (bill.getItems() == null) {
                        bill.setItems(new ArrayList<>());
                    }

                    // Attach patient & doctor if found (do not auto-create by default)
                    patientRepository.findByName(patientName).ifPresent(bill::setPatient);
                    doctorRepository.findByName(doctorName).ifPresent(bill::setDoctor);

                    billMap.put(invoice, bill);
                }

                // Create and attach BillItem (if description blank, still create)
                BillItem item = new BillItem();
                item.setDescription(description != null ? description : "");
                item.setQuantity(qty);
                item.setUnitPrice(unitPrice);
                item.setTaxPercent(taxPercent);
                item.setDiscountPercent(discountPercent);
                item.setSubTotal(subtotal);
                item.setBill(bill);

                if (bill.getItems() == null) bill.setItems(new ArrayList<>());
                bill.getItems().add(item);
            }

            // Persist bills (recalculate totals)
            for (Bill bill : billMap.values()) {
                // ensure items' bill reference is set
                if (bill.getItems() != null) {
                    for (BillItem it : bill.getItems()) {
                        it.setBill(bill);
                    }
                } else {
                    bill.setItems(new ArrayList<>());
                }

                bill.calculateTotals();
                billRepository.save(bill);
            }
        } finally {
            workbook.close();
        }
    }

    // ------------------------------------------------------------------------
    // 🧾 EXPORT SINGLE BILL TO PDF (with items)
    // ------------------------------------------------------------------------
    public ByteArrayInputStream exportBillToPDF(Bill bill) throws DocumentException {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // ---------- Fonts (explicitly using iText Font class fully qualified) ----------
        com.itextpdf.text.Font titleFont =
                new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 18,
                        com.itextpdf.text.Font.BOLD, BaseColor.BLACK);
        com.itextpdf.text.Font labelFont =
                new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12,
                        com.itextpdf.text.Font.BOLD, BaseColor.BLACK);
        com.itextpdf.text.Font textFont =
                new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12,
                        com.itextpdf.text.Font.NORMAL, BaseColor.DARK_GRAY);

        // ---------- Header ----------
        Paragraph header = new Paragraph("Hospital Management System", titleFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        Paragraph sub = new Paragraph("Bill Details", labelFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        document.add(sub);
        document.add(Chunk.NEWLINE);

        // ---------- Bill Summary ----------
        PdfPTable summary = new PdfPTable(2);
        summary.setWidthPercentage(100);
        summary.getDefaultCell().setBorder(Rectangle.NO_BORDER);

        String patientName = bill.getPatient() != null ? bill.getPatient().getName() : "N/A";
        String doctorName = bill.getDoctor() != null ? bill.getDoctor().getName() : "N/A";
        String date = bill.getBillDate() != null
                ? bill.getBillDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";

        summary.addCell(new Phrase("Invoice No: " + (bill.getInvoiceNumber() != null ? bill.getInvoiceNumber() : ""), textFont));
        summary.addCell(new Phrase("Date: " + date, textFont));
        summary.addCell(new Phrase("Patient: " + patientName, textFont));
        summary.addCell(new Phrase("Doctor: " + doctorName, textFont));

        document.add(summary);
        document.add(Chunk.NEWLINE);

        // ---------- Bill Items ----------
        Paragraph itemsTitle = new Paragraph("Bill Items", labelFont);
        document.add(itemsTitle);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(new float[]{3, 1, 1, 1, 1, 1});
        table.setWidthPercentage(100);
        table.setHeaderRows(1);

        Stream.of("Description", "Qty", "Unit Price (₹)", "Tax %", "Discount %", "Subtotal (₹)")
                .forEach(headerTitle -> {
                    PdfPCell headerCell = new PdfPCell(new Phrase(headerTitle,
                            new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA,
                                    11, com.itextpdf.text.Font.BOLD, BaseColor.WHITE)));
                    headerCell.setBackgroundColor(new BaseColor(0, 0, 128));
                    headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    headerCell.setPadding(6);
                    table.addCell(headerCell);
                });

        if (bill.getItems() != null && !bill.getItems().isEmpty()) {
            for (BillItem item : bill.getItems()) {
                table.addCell(new Phrase(item.getDescription() != null ? item.getDescription() : "", textFont));
                table.addCell(new Phrase(String.valueOf(item.getQuantity()), textFont));
                table.addCell(new Phrase(String.format("%.2f", item.getUnitPrice()), textFont));
                table.addCell(new Phrase(String.format("%.2f", item.getTaxPercent()), textFont));
                table.addCell(new Phrase(String.format("%.2f", item.getDiscountPercent()), textFont));
                table.addCell(new Phrase(String.format("%.2f", item.getSubTotal()), textFont));
            }
        } else {
            PdfPCell noData = new PdfPCell(new Phrase("No items available", textFont));
            noData.setColspan(6);
            noData.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(noData);
        }

        document.add(table);
        document.add(Chunk.NEWLINE);

        // ---------- Totals ----------
        PdfPTable totalsTable = new PdfPTable(2);
        totalsTable.setWidthPercentage(60);
        totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalsTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

        totalsTable.addCell(new Phrase("Total Before Tax:", labelFont));
        totalsTable.addCell(new Phrase("₹" + String.format("%.2f", bill.getTotalBeforeTax()), textFont));
        totalsTable.addCell(new Phrase("Total Discount:", labelFont));
        totalsTable.addCell(new Phrase("₹" + String.format("%.2f", bill.getTotalDiscount()), textFont));
        totalsTable.addCell(new Phrase("Total Tax:", labelFont));
        totalsTable.addCell(new Phrase("₹" + String.format("%.2f", bill.getTotalTax()), textFont));
        totalsTable.addCell(new Phrase("Grand Total:", labelFont));
        totalsTable.addCell(new Phrase("₹" + String.format("%.2f", bill.getGrandTotal()), textFont));

        document.add(totalsTable);
        document.add(Chunk.NEWLINE);

        Paragraph footer = new Paragraph("Generated on: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), textFont);
        footer.setAlignment(Element.ALIGN_RIGHT);
        document.add(footer);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    // ------------------------------------------------------------------------
    // ⚙️ HELPER METHODS
    // ------------------------------------------------------------------------
    private String getStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                // If date, let caller parse; otherwise return as long if integral
                double d = cell.getNumericCellValue();
                if (d == (long) d) yield String.valueOf((long) d);
                yield String.valueOf(d);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private double getNumericValue(Cell cell) {
        if (cell == null) return 0.0;
        return switch (cell.getCellType()) {
            case NUMERIC -> cell.getNumericCellValue();
            case STRING -> {
                try {
                    yield Double.parseDouble(cell.getStringCellValue().trim());
                } catch (Exception e) {
                    yield 0.0;
                }
            }
            case BOOLEAN -> cell.getBooleanCellValue() ? 1.0 : 0.0;
            default -> 0.0;
        };
    }

    private LocalDateTime parseDate(String dateString, DateTimeFormatter formatter) {
        try {
            if (dateString == null || dateString.isBlank()) return LocalDateTime.now();
            // Attempt standard parse first
            return LocalDateTime.parse(dateString, formatter);
        } catch (Exception ex) {
            // Best-effort: return now if parsing fails
            return LocalDateTime.now();
        }
    }
}
