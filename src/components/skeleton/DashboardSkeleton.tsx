import Skeleton from "./Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F7F3D7] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
          >
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <Skeleton className="h-6 w-44 mb-6" />

        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>

              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;