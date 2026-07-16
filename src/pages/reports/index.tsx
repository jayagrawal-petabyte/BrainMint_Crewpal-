import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Download, FileText } from 'lucide-react';

export const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Page Title + Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-900">Report</h1>
        <div className="flex flex-col gap-2 items-end">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} size="sm">
            Download Report
          </Button>
          <Button variant="outline" leftIcon={<FileText className="w-4 h-4" />} size="sm">
            Seek Review
          </Button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="olive" className="p-5">
          <CardTitle className="text-forest-900 text-xs">Cycle Time</CardTitle>
          <CardContent>
            <p className="text-4xl font-bold text-forest-900 mt-2">4</p>
          </CardContent>
        </Card>

        <Card variant="teal" className="p-5">
          <CardTitle className="text-cream-100 text-xs">SAY / DO RATIO</CardTitle>
          <CardContent>
            <p className="text-4xl font-bold text-white mt-2">85%</p>
          </CardContent>
        </Card>

        <Card variant="rose" className="p-5">
          <CardTitle className="text-forest-900 text-xs">DAILY COMMITS</CardTitle>
          <CardContent>
            <p className="text-4xl font-bold text-forest-900 mt-2">8</p>
          </CardContent>
        </Card>

        <Card variant="forest" className="p-5">
          <CardTitle className="text-cream-200 text-xs">DAILY GOAL FREQUENCY</CardTitle>
          <CardContent>
            <p className="text-4xl font-bold text-white mt-2">7.8%</p>
          </CardContent>
        </Card>
      </div>

      {/* Target Donut Chart Placeholder */}
      <Card variant="default" className="p-6 border-rose-200">
        <h3 className="font-bold text-forest-900 mb-2">Target</h3>
        <div className="flex gap-4 text-sm mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-olive-500 rounded-full"></span> Achieved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-cream-300 rounded-full"></span> Remaining
          </span>
        </div>
        
        {/* Simple donut visualization */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#ede4b8"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1a3a2a"
                strokeWidth="3.5"
                strokeDasharray="67, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-forest-900">67%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
