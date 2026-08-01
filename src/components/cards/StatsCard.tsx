import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
}

export const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <div className="relative bg-[#91A55C] rounded-2xl p-4 min-h-[120px] shadow-sm hover:shadow-lg transition-all duration-300">
      <button className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#0B3B2E] flex items-center justify-center border-4 border-[#F7F3D7]">
        <ArrowUpRight className="w-5 h-5 text-white" />
      </button>

      <p className="text-xs uppercase tracking-wide text-[#23311D] font-semibold">
        {title}
      </p>

      <h2 className="text-5xl font-bold mt-5 text-[#1A1A1A]">
        {value}
      </h2>
    </div>
  );
};