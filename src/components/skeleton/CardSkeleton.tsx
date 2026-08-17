import Skeleton from "./Skeleton";

interface CardSkeletonProps {
  count?: number;
}

const CardSkeleton = ({ count = 4 }: CardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
        >
          <Skeleton className="h-4 w-24 mb-4" />

          <Skeleton className="h-9 w-16 mb-4" />

          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;