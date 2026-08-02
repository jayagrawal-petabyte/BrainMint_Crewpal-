import { Users } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface ProjectMembersSectionProps {
  members: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  onManage: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const ProjectMembersSection = ({ members, onManage }: ProjectMembersSectionProps) => {
  return (
    <section className="space-y-3" aria-labelledby="project-members-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Collaboration</p>
          <h2 id="project-members-heading" className="text-xl font-bold text-forest-900">
            Project Members
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Users className="w-4 h-4" />}
          onClick={onManage}
        >
          Manage Members
        </Button>
      </div>

      <Card className="border-cream-300">
        {members.length === 0 ? (
          <p className="text-sm text-forest-500">No members assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-2.5">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt=""
                    className="h-9 w-9 rounded-full border border-cream-300 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-olive-300 bg-olive-200 text-xs font-bold text-forest-800">
                    {getInitials(member.name)}
                  </div>
                )}
                <span className="text-sm font-medium text-forest-800">{member.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
};
