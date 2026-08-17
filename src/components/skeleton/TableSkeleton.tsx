import Skeleton from "./Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({
  rows = 5,
  columns = 3,
}: TableSkeletonProps) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-100 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="flex-1">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-4 p-4 border-b last:border-b-0"
          >
            {Array.from({ length: columns }).map(
              (_, columnIndex) => (
                <div key={columnIndex} className="flex-1">
                  <Skeleton
                    className={`h-4 ${
                      columnIndex === 0
                        ? "w-32"
                        : "w-20"
                    }`}
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;