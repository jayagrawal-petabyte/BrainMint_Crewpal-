import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Plus, Search, User } from 'lucide-react';

const teamMembers = [
  { name: 'Shanti Biswas', role: 'Frontend Intern', duration: '6 months' },
  { name: 'Arush Ashrut', role: 'Backend lead', duration: '3 months' },
  { name: 'Nirmal Mehta', role: 'UI/UX Intern', duration: '1 project' },
  { name: 'P Jaishwari', role: 'HR Lead', duration: '3 months' },
  { name: 'Sagar T A', role: 'Cybersecurity Intern', duration: '2 months' },
];

const departments = ['Frontend', 'Backend', 'UI/UX', 'Cybersecurity', 'HR'];

export const Teams = () => {
  return (
    <div className="space-y-6">
      {/* Page Title + Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-900">Teams</h1>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} size="sm">
          Member
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search"
        leftIcon={<Search className="w-4 h-4" />}
      />

      {/* Department Filter */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {departments.map((dept) => (
          <button
            key={dept}
            className="px-4 py-1.5 text-sm border border-forest-300 rounded-full text-forest-700 hover:bg-olive-100 transition-colors whitespace-nowrap"
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Team Table */}
      <Card noPadding className="overflow-hidden border-olive-200">
        {/* Table Header */}
        <div className="bg-olive-300 px-5 py-3 flex items-center justify-between">
          <span className="font-semibold text-sm text-forest-900 uppercase">NAME</span>
          <span className="font-semibold text-sm text-forest-900 uppercase">Duration</span>
        </div>

        {/* Team Rows */}
        {teamMembers.map((member, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4 border-b border-olive-100 last:border-b-0 bg-olive-50 hover:bg-olive-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm text-forest-900">{member.name}</p>
                <p className="text-xs text-forest-400">{member.role}</p>
              </div>
            </div>
            <span className="text-sm text-forest-700">{member.duration}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
