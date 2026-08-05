import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { getGreeting } from '../../utils/format';

interface GreetingCardProps {
  userName: string;
}

export const GreetingCard = memo(({ userName }: GreetingCardProps) => {
  const firstName = userName.split(' ')[0] || userName;
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[#1e3624] rounded-2xl p-5 text-[#f5f0e1] shadow-md card-animate">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] text-[#d4d9b8] font-semibold uppercase tracking-widest">
            {today}
          </p>
          <h2 className="text-xl font-extrabold mt-1 leading-tight">
            {getGreeting()}, {firstName}
          </h2>
          <p className="text-[11px] text-[#d4d9b8] mt-1.5">
            Here&apos;s what&apos;s happening with your work today.
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#d4a0a0] text-[#0b170e] flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
});

GreetingCard.displayName = 'GreetingCard';
