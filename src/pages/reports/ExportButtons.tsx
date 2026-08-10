import { Download } from "lucide-react";
import { exportReportPDF } from "../../utils/exportPDF";

interface ExportButtonsProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const ExportButtons = ({
  onExportPDF,
  onExportExcel,
}: ExportButtonsProps) => {
  const handlePDFExport = async () => {
    try {
      if (onExportPDF) {
        onExportPDF();
      } else {
        await exportReportPDF();
      }
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Unable to export the report as PDF.");
    }
  };

  const handleExcelExport = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      alert("Excel export will be integrated.");
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handlePDFExport}
        className="flex items-center gap-2 rounded-xl bg-[#355E3B] px-4 py-2 text-white hover:bg-[#2d4f31] transition-colors"
      >
        <Download size={18} />
        Export PDF
      </button>

      <button
        type="button"
        onClick={handleExcelExport}
        className="flex items-center gap-2 rounded-xl bg-[#D6A75E] px-4 py-2 text-white hover:bg-[#c3944f] transition-colors"
      >
        <Download size={18} />
        Export Excel
      </button>
    </div>
  );
};

export default ExportButtons;