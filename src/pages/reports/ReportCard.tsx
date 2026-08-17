interface ReportCardProps {
  title: string;
  value: number;
  color?: string;
}

const ReportCard = ({
  title,
  value,
  color = "#91A55C",
}: ReportCardProps) => {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm font-medium text-gray-700 mb-2">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-[#1B1B1B]">
        {value}
      </h2>
    </div>
  );
};

export default ReportCard;