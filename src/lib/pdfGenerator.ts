import jsPDF from "jspdf";

interface PDFOptions {
  title: string;
  subtitle?: string;
  birthDate: string;
  name?: string;
  sections: PDFSection[];
}

interface PDFSection {
  title: string;
  content: string | string[];
  highlight?: boolean;
}

// Warm brown/cream color palette matching site design
const COLORS = {
  // Primary brown: hsl(20, 45%, 32%)
  brown: [118, 73, 45] as [number, number, number],
  // Brown dark: hsl(18, 50%, 22%)
  brownDark: [84, 48, 28] as [number, number, number],
  // Brown light: hsl(25, 35%, 45%)
  brownLight: [155, 110, 75] as [number, number, number],
  // Gold/accent: hsl(30, 50%, 45%)
  gold: [172, 128, 57] as [number, number, number],
  // Gold light: hsl(35, 55%, 60%)
  goldLight: [203, 171, 98] as [number, number, number],
  // Cream background: hsl(35, 30%, 95%)
  cream: [247, 243, 237] as [number, number, number],
  // Cream dark: hsl(35, 25%, 88%)
  creamDark: [232, 224, 212] as [number, number, number],
  // Text foreground: hsl(20, 40%, 20%)
  text: [71, 49, 31] as [number, number, number],
  // Muted text: hsl(20, 20%, 45%)
  textMuted: [138, 110, 92] as [number, number, number],
};

// Cache for the font base64 data
let cachedFontBase64: string | null = null;

async function loadCyrillicFont(pdf: jsPDF): Promise<boolean> {
  try {
    if (!cachedFontBase64) {
      // Load font from local assets
      const fontModule = await import("@/assets/fonts/PTSans-Regular.ttf");
      const fontUrl = fontModule.default;
      
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`Font fetch failed: ${response.status}`);
      }
      
      const fontData = await response.arrayBuffer();
      
      // Convert to Base64
      const uint8Array = new Uint8Array(fontData);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      cachedFontBase64 = btoa(binary);
    }
    
    // Add font to jsPDF
    pdf.addFileToVFS("PTSans.ttf", cachedFontBase64);
    pdf.addFont("PTSans.ttf", "PTSans", "normal");
    pdf.setFont("PTSans", "normal");
    return true;
  } catch (error) {
    console.error("Failed to load Cyrillic font:", error);
    return false;
  }
}

function drawWavyLine(pdf: jsPDF, startX: number, startY: number, width: number, amplitude: number, frequency: number, color: [number, number, number] = COLORS.brown) {
  const segments = 100;
  const segmentWidth = width / segments;
  
  pdf.setDrawColor(...color);
  pdf.setLineWidth(0.5);
  
  let prevX = startX;
  let prevY = startY;
  
  for (let i = 1; i <= segments; i++) {
    const x = startX + i * segmentWidth;
    const y = startY + Math.sin((i / segments) * Math.PI * frequency) * amplitude;
    pdf.line(prevX, prevY, x, y);
    prevX = x;
    prevY = y;
  }
}

function drawTitlePage(pdf: jsPDF, options: PDFOptions) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Background
  pdf.setFillColor(...COLORS.cream);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Simple top decorative line
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, 0, pageWidth, 3, "F");
  
  // Simple bottom decorative line
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, pageHeight - 3, pageWidth, 3, "F");
  
  // Title - centered in upper third
  pdf.setFontSize(32);
  pdf.setTextColor(...COLORS.brownDark);
  const titleLines = pdf.splitTextToSize(options.title, pageWidth - 40);
  let titleY = pageHeight / 3;
  for (const line of titleLines) {
    pdf.text(line, pageWidth / 2, titleY, { align: "center" });
    titleY += 12;
  }
  
  // Subtitle
  if (options.subtitle) {
    pdf.setFontSize(16);
    pdf.setTextColor(...COLORS.textMuted);
    pdf.text(options.subtitle, pageWidth / 2, titleY + 10, { align: "center" });
    titleY += 20;
  }
  
  // Name - centered
  if (options.name) {
    pdf.setFontSize(20);
    pdf.setTextColor(...COLORS.text);
    pdf.text(options.name, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });
  }
  
  // Birth date
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text(`Дата рождения: ${options.birthDate}`, pageWidth / 2, pageHeight / 2 + 45, { align: "center" });
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.brown);
  pdf.text("lifecod.app", pageWidth / 2, pageHeight - 15, { align: "center" });
}

function drawContentPage(pdf: jsPDF, sections: PDFSection[], startIndex: number): number {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = 30;
  let sectionIndex = startIndex;
  
  // Background
  pdf.setFillColor(...COLORS.cream);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Brown top border (primary color)
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, 0, pageWidth, 5, "F");
  
  while (sectionIndex < sections.length && y < pageHeight - 40) {
    const section = sections[sectionIndex];
    
    // Section title
    if (section.highlight) {
      pdf.setFillColor(...COLORS.brown);
      pdf.roundedRect(margin - 5, y - 5, contentWidth + 10, 12, 3, 3, "F");
      pdf.setTextColor(...COLORS.cream);
    } else {
      pdf.setTextColor(...COLORS.brownDark);
    }
    
    pdf.setFontSize(14);
    const titleLines = pdf.splitTextToSize(section.title, contentWidth);
    for (const titleLine of titleLines) {
      pdf.text(titleLine, margin, y + 4);
      y += 7;
    }
    y += 8;
    
    // Section content
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(11);
    
    const contentLines = Array.isArray(section.content) 
      ? section.content 
      : [section.content];
    
    for (const line of contentLines) {
      if (y > pageHeight - 40) {
        return sectionIndex; // Need new page
      }
      
      if (!line || line.trim() === "") {
        y += 4;
        continue;
      }
      
      const wrappedLines = pdf.splitTextToSize(line, contentWidth);
      for (const wrappedLine of wrappedLines) {
        if (y > pageHeight - 40) {
          return sectionIndex;
        }
        pdf.text(wrappedLine, margin, y);
        y += 6;
      }
      y += 2;
    }
    
    // Decorative separator between sections
    if (sectionIndex < sections.length - 1) {
      y += 5;
      pdf.setDrawColor(...COLORS.goldLight);
      pdf.setLineWidth(0.3);
      pdf.line(margin + 20, y, pageWidth - margin - 20, y);
      y += 8;
    } else {
      y += 10;
    }
    
    sectionIndex++;
  }
  
  // Brown bottom border
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, pageHeight - 5, pageWidth, 5, "F");
  
  return sectionIndex;
}

export async function generatePDF(options: PDFOptions): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Load Cyrillic font
  await loadCyrillicFont(pdf);
  
  // Title page
  drawTitlePage(pdf, options);
  
  // Content pages
  if (options.sections.length > 0) {
    let currentSection = 0;
    
    while (currentSection < options.sections.length) {
      pdf.addPage();
      currentSection = drawContentPage(pdf, options.sections, currentSection);
    }
  }
  
  // Generate filename with safe characters
  const safeName = (options.name || "report").replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "report";
  const safeTitle = options.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "analysis";
  const fileName = `${safeName}_${safeTitle}.pdf`;
  
  pdf.save(fileName);
}

// Helper to format birth date
export function formatBirthDateForPDF(day: number, month: number, year: number): string {
  const dayStr = day.toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");
  return `${dayStr}.${monthStr}.${year}`;
}
