import ExcelJS from 'exceljs';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const workbook = new ExcelJS.Workbook();
const measurementDir = 'measurement_plan';

// Add a cover sheet first
const coverSheet = workbook.addWorksheet('Overview');
coverSheet.pageSetup = { paperSize: 9, orientation: 'landscape' };

const title = coverSheet.addRow(['TNK Designs — Measurement Plan Guide']);
title.font = { bold: true, size: 16, color: { argb: 'FF00CFFF' } };
title.alignment = { horizontal: 'left', vertical: 'middle' };

coverSheet.addRow([]);
coverSheet.addRow(['This workbook contains the complete measurement plan for all pages and interactions on the TNK Designs website.']);
coverSheet.addRow([]);

const sections = [
  { name: 'Intro', desc: 'Overview of the measurement strategy and GA4 implementation approach' },
  { name: 'Parameters', desc: 'All custom parameters pushed to dataLayer across events' },
  { name: 'page_view', desc: '16 pages tracked: 6 main pages + 10 blog articles' },
  { name: 'select_content', desc: 'All navigational interactions: nav links, CTAs, blog cards, filters' },
  { name: 'generate_lead', desc: 'Contact form submission tracking with field collection rules' },
  { name: 'orbit_interaction', desc: 'Home page orbit animation and skill hover interactions' },
  { name: 'search', desc: 'Blog search functionality with result counting and filtering' },
  { name: 'post_engagement', desc: 'Blog post likes, unlikes, and comments for all 10 articles' }
];

coverSheet.addRow(['Sheet Guide:']);
coverSheet.addRow([]);

sections.forEach(section => {
  const row = coverSheet.addRow([section.name, section.desc]);
  row.getCell(1).font = { bold: true, color: { argb: 'FF00CFFF' } };
  row.getCell(1).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
  row.getCell(2).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
});

coverSheet.columns = [
  { width: 20 },
  { width: 60 }
];

// Read all CSV files and add them as sheets
const csvFiles = [
  'tab1_intro.csv',
  'tab2_parameters.csv',
  'tab3_page_view.csv',
  'tab4_select_content.csv',
  'tab5_generate_lead.csv',
  'tab6_orbit_interaction.csv',
  'tab7_search.csv',
  'tab8_post_engagement.csv'
];

const sheetNames = [
  'Intro',
  'Parameters',
  'page_view',
  'select_content',
  'generate_lead',
  'orbit_interaction',
  'search',
  'post_engagement'
];

csvFiles.forEach((file, idx) => {
  const filePath = join(measurementDir, file);
  const content = readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');

  const worksheet = workbook.addWorksheet(sheetNames[idx]);

  // Parse CSV
  lines.forEach((line, lineIdx) => {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);

    const row = worksheet.addRow(cells);

    // Style header row
    if (lineIdx === 0) {
      row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e2d4a' } };
      row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // Alternate row colors
    if (lineIdx > 0) {
      if (lineIdx % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
      }
    }
  });

  // Auto-size columns
  worksheet.columns.forEach(col => {
    let maxLen = 0;
    col.eachCell(cell => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 2, 50);
  });

  // Freeze header row
  worksheet.views = [
    { state: 'frozen', ySplit: 1 }
  ];
});

await workbook.xlsx.writeFile('measurement_plan/measurement_plan.xlsx');
console.log('✅ Excel file created: measurement_plan/measurement_plan.xlsx');
