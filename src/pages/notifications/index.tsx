import { Button } from '../../components/common/Button';
import { PenLine, MessageCircle } from 'lucide-react';

export const Chats = () => {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Page Title */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold text-forest-900">Chats</h1>
        <Button variant="primary" leftIcon={<PenLine className="w-4 h-4" />} size="sm">
          COMPOSE
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <MessageCircle className="w-24 h-24 text-cream-300 mb-4" strokeWidth={1} />
        <p className="text-forest-500 text-lg">Let's start chatting!</p>
      </div>
    </div>
  );
};
