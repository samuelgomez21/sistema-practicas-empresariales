package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder.Reporte;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Component
public class ExcelExportAdapter implements ExportadorReporte {

    @Override
    public byte[] exportar(Reporte reporte) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            String safeSheetName = org.apache.poi.ss.util.WorkbookUtil.createSafeSheetName(reporte.getTitulo());
            if (safeSheetName.length() > 31) {
                safeSheetName = safeSheetName.substring(0, 31);
            }
            Sheet sheet = workbook.createSheet(safeSheetName);

            // Estilos
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Font totalFont = workbook.createFont();
            totalFont.setBold(true);
            CellStyle totalStyle = workbook.createCellStyle();
            totalStyle.setFont(totalFont);
            totalStyle.setBorderTop(BorderStyle.DOUBLE);

            int rowIdx = 0;

            // Título
            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(reporte.getTitulo());
            titleCell.setCellStyle(titleStyle);
            rowIdx++; // espacio en blanco

            // Filtros aplicados
            if (reporte.getFiltros() != null && !reporte.getFiltros().isEmpty()) {
                Row filterLabelRow = sheet.createRow(rowIdx++);
                Cell c = filterLabelRow.createCell(0);
                c.setCellValue("Filtros Aplicados:");
                Font f = workbook.createFont();
                f.setBold(true);
                f.setItalic(true);
                CellStyle cs = workbook.createCellStyle();
                cs.setFont(f);
                c.setCellStyle(cs);

                for (Map.Entry<String, String> entry : reporte.getFiltros().entrySet()) {
                    Row filterRow = sheet.createRow(rowIdx++);
                    filterRow.createCell(0).setCellValue(entry.getKey() + ":");
                    filterRow.createCell(1).setCellValue(entry.getValue());
                }
                rowIdx++; // espacio en blanco
            }

            // Cabeceras de tabla
            Row headerRow = sheet.createRow(rowIdx++);
            List<String> headers = reporte.getHeaders();
            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
                cell.setCellStyle(headerStyle);
            }

            // Datos
            for (List<Object> fila : reporte.getFilas()) {
                Row row = sheet.createRow(rowIdx++);
                for (int i = 0; i < fila.size(); i++) {
                    Cell cell = row.createCell(i);
                    Object val = fila.get(i);
                    if (val instanceof Number) {
                        cell.setCellValue(((Number) val).doubleValue());
                    } else if (val instanceof Boolean) {
                        cell.setCellValue((Boolean) val);
                    } else if (val != null) {
                        cell.setCellValue(val.toString());
                    } else {
                        cell.setCellValue("");
                    }
                }
            }

            // Totales
            if (reporte.getTotales() != null && !reporte.getTotales().isEmpty()) {
                Row totalRow = sheet.createRow(rowIdx++);
                List<Object> totales = reporte.getTotales();
                for (int i = 0; i < totales.size(); i++) {
                    Cell cell = totalRow.createCell(i);
                    Object val = totales.get(i);
                    if (val instanceof Number) {
                        cell.setCellValue(((Number) val).doubleValue());
                    } else if (val != null) {
                        cell.setCellValue(val.toString());
                    } else {
                        cell.setCellValue("");
                    }
                    cell.setCellStyle(totalStyle);
                }
            }

            // Ajustar columnas
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Error al exportar reporte a Excel: " + e.getMessage(), e);
        }
    }
}
