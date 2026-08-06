import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
}

const ExportButtons = ({
  onExportPDF,
  onExportExcel,
}: ExportButtonsProps) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 rounded-xl bg-[#355E3B] px-4 py-2 text-white hover:bg-[#2d4f31]"
      >
        <Download size={18} />
        Export PDF
      </button>

      <button
        onClick={onExportExcel}
        className="flex items-center gap-2 rounded-xl bg-[#D6A75E] px-4 py-2 text-white hover:bg-[#c3944f]"
      >
        <Download size={18} />
        Export Excel
      </button>
    </div>
  );
};

export default ExportButtons;