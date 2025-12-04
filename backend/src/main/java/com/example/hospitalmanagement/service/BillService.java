package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.repository.BillRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

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

    // ==========================================================
    // CRUD
    // ==========================================================
    public List<Bill> findAll() {
        return billRepository.findAllWithDetails();
    }

    public Optional<Bill> findById(Long id) {
        return billRepository.findById(id);
    }

    public Bill save(Bill bill) {
        if (bill.getItems() != null) {
            bill.getItems().forEach(i -> i.setBill(bill));
        }
        bill.calculateTotals();
        return billRepository.save(bill);
    }

    public void deleteById(Long id) {
        billRepository.deleteById(id);
    }

    // ==========================================================
    // ⭐ TOTAL REVENUE
    // ==========================================================
    public double getTotalRevenue() {
        return billRepository.findAll()
                .stream()
                .mapToDouble(Bill::getGrandTotal)
                .sum();
    }

    // ==========================================================
    // EXCEL EXPORT
    // ==========================================================
    public ByteArrayInputStream exportBillsToExcel(List<Bill> bills) throws IOException {

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Detailed Bills");

            String[] columns = {
                    "Invoice", "Patient", "Doctor", "Date",
                    "Description", "Qty", "Unit Price", "Tax %", "Discount %", "Subtotal",
                    "Total Before Tax", "Total Discount", "Total Tax", "Grand Total"
            };

            Row header = sheet.createRow(0);

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font excelFont = workbook.createFont();
            excelFont.setBold(true);
            excelFont.setColor(IndexedColors.WHITE.getIndex());

            headerStyle.setFont(excelFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            for (Bill bill : bills) {

                String inv = bill.getInvoiceNumber();
                String pname = bill.getPatient() != null ? bill.getPatient().getName() : "";
                String dname = bill.getDoctor() != null ? bill.getDoctor().getName() : "";
                String date = bill.getBillDate() != null ? bill.getBillDate().format(fmt) : "";

                if (bill.getItems().isEmpty()) {

                    Row r = sheet.createRow(rowIdx++);
                    r.createCell(0).setCellValue(inv);
                    r.createCell(1).setCellValue(pname);
                    r.createCell(2).setCellValue(dname);
                    r.createCell(3).setCellValue(date);
                    r.createCell(4).setCellValue("No Items");

                    r.createCell(10).setCellValue(bill.getTotalBeforeTax());
                    r.createCell(11).setCellValue(bill.getTotalDiscount());
                    r.createCell(12).setCellValue(bill.getTotalTax());
                    r.createCell(13).setCellValue(bill.getGrandTotal());

                } else {

                    for (BillItem item : bill.getItems()) {
                        Row r = sheet.createRow(rowIdx++);

                        r.createCell(0).setCellValue(inv);
                        r.createCell(1).setCellValue(pname);
                        r.createCell(2).setCellValue(dname);
                        r.createCell(3).setCellValue(date);

                        r.createCell(4).setCellValue(item.getDescription());
                        r.createCell(5).setCellValue(item.getQuantity());
                        r.createCell(6).setCellValue(item.getUnitPrice());
                        r.createCell(7).setCellValue(item.getTaxPercent());
                        r.createCell(8).setCellValue(item.getDiscountPercent());
                        r.createCell(9).setCellValue(item.getSubTotal());

                        r.createCell(10).setCellValue(bill.getTotalBeforeTax());
                        r.createCell(11).setCellValue(bill.getTotalDiscount());
                        r.createCell(12).setCellValue(bill.getTotalTax());
                        r.createCell(13).setCellValue(bill.getGrandTotal());
                    }
                }
            }

            for (int i = 0; i < columns.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // ==========================================================
    // EXCEL IMPORT
    // ==========================================================
    public void importBillsFromExcel(InputStream in) throws IOException {

        Workbook workbook = new XSSFWorkbook(in);

        try {
            Sheet sheet = workbook.getSheetAt(0);
            Map<String, Bill> map = new LinkedHashMap<>();
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                String inv = getString(row.getCell(0));
                String pname = getString(row.getCell(1));
                String dname = getString(row.getCell(2));
                String date = getString(row.getCell(3));

                String desc = getString(row.getCell(4));
                int qty = (int) getNumeric(row.getCell(5));
                double price = getNumeric(row.getCell(6));
                double tax = getNumeric(row.getCell(7));
                double disc = getNumeric(row.getCell(8));
                double subtotal = getNumeric(row.getCell(9));

                Bill bill = map.computeIfAbsent(inv, x -> {
                    Bill b = new Bill();
                    b.setInvoiceNumber(inv);
                    b.setBillDate(parseDate(date, fmt));
                    patientRepository.findByName(pname).ifPresent(b::setPatient);
                    doctorRepository.findByName(dname).ifPresent(b::setDoctor);
                    return b;
                });

                BillItem item = new BillItem();
                item.setDescription(desc);
                item.setQuantity(qty);
                item.setUnitPrice(price);
                item.setTaxPercent(tax);
                item.setDiscountPercent(disc);
                item.setSubTotal(subtotal);
                item.setBill(bill);

                bill.getItems().add(item);
            }

            for (Bill bill : map.values()) {
                bill.calculateTotals();
                billRepository.save(bill);
            }

        } finally {
            workbook.close();
        }
    }

    // ==========================================================
    // PDF GENERATION
    // ==========================================================
    public ByteArrayInputStream exportBillToPDF(Bill bill) throws DocumentException {

        Document doc = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, out);

        doc.open();

        com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 18, com.itextpdf.text.Font.BOLD);
        com.itextpdf.text.Font bold = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12, com.itextpdf.text.Font.BOLD);
        com.itextpdf.text.Font normal = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12);

        Paragraph title = new Paragraph("Hospital Bill", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        doc.add(title);
        doc.add(Chunk.NEWLINE);

        // Summary table
        PdfPTable summary = new PdfPTable(2);
        summary.setWidthPercentage(100);
        summary.getDefaultCell().setBorder(Rectangle.NO_BORDER);

        summary.addCell(new Phrase("Invoice: " + bill.getInvoiceNumber(), normal));
        summary.addCell(new Phrase("Date: " +
                bill.getBillDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), normal));

        summary.addCell(new Phrase("Patient: " +
                (bill.getPatient() != null ? bill.getPatient().getName() : "N/A"), normal));

        summary.addCell(new Phrase("Doctor: " +
                (bill.getDoctor() != null ? bill.getDoctor().getName() : "N/A"), normal));

        doc.add(summary);
        doc.add(Chunk.NEWLINE);

        // Items
        PdfPTable table = new PdfPTable(new float[]{3, 1, 1, 1, 1, 1});
        table.setWidthPercentage(100);
        table.setHeaderRows(1);

        String[] cols = {"Description", "Qty", "Price", "Tax %", "Discount %", "Subtotal"};

        for (String c : cols) {
            PdfPCell cell = new PdfPCell(new Phrase(c, bold));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        for (BillItem it : bill.getItems()) {
            table.addCell(it.getDescription());
            table.addCell(String.valueOf(it.getQuantity()));
            table.addCell(String.format("%.2f", it.getUnitPrice()));
            table.addCell(String.format("%.2f", it.getTaxPercent()));
            table.addCell(String.format("%.2f", it.getDiscountPercent()));
            table.addCell(String.format("%.2f", it.getSubTotal()));
        }

        doc.add(table);
        doc.add(Chunk.NEWLINE);

        // Totals
        PdfPTable totals = new PdfPTable(2);
        totals.setWidthPercentage(50);
        totals.setHorizontalAlignment(Element.ALIGN_RIGHT);

        totals.addCell(new Phrase("Total Before Tax:", bold));
        totals.addCell(new Phrase("₹" + bill.getTotalBeforeTax(), normal));

        totals.addCell(new Phrase("Total Discount:", bold));
        totals.addCell(new Phrase("₹" + bill.getTotalDiscount(), normal));

        totals.addCell(new Phrase("Total Tax:", bold));
        totals.addCell(new Phrase("₹" + bill.getTotalTax(), normal));

        totals.addCell(new Phrase("Grand Total:", bold));
        totals.addCell(new Phrase("₹" + bill.getGrandTotal(), normal));

        doc.add(totals);
        doc.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    // ==========================================================
    // Helpers
    // ==========================================================
    private String getString(Cell c) {
        if (c == null) return "";
        return c.getCellType() == CellType.STRING ?
                c.getStringCellValue() :
                String.valueOf(getNumeric(c));
    }

    private double getNumeric(Cell c) {
        if (c == null) return 0;
        if (c.getCellType() == CellType.NUMERIC) return c.getNumericCellValue();
        try { return Double.parseDouble(c.getStringCellValue()); }
        catch (Exception e) { return 0; }
    }

    private LocalDateTime parseDate(String v, DateTimeFormatter fmt) {
        try { return LocalDateTime.parse(v, fmt); }
        catch (Exception e) { return LocalDateTime.now(); }
    }
}
