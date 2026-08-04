import { ScheduleItem } from "../../types/dashboard";

interface Props {
  items: ScheduleItem[];
}

export const ScheduleCard = ({ items }: Props) => {
  return (
    <div className="bg-[#D89C95] rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-5">
        Today's Schedule
      </h2>

      <div className="bg-[#F8F4E5] rounded-xl p-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 items-start"
          >
            <input
              type="checkbox"
              checked={item.completed}
              readOnly
              className="mt-1"
            />

            <div>
              <p className="text-xs text-gray-500">
                {item.time}
              </p>

              <p className="text-sm">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};