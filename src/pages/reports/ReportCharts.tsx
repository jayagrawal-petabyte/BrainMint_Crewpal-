import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MonthlyReport {
  month: string;
  completed: number;
  pending: number;
}

interface ReportChartsProps {
  data: MonthlyReport[];
}

const ReportCharts = ({ data }: ReportChartsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-5">
        Monthly Project Progress
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="completed"
              fill="#355E3B"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="pending"
              fill="#D6A75E"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportCharts;