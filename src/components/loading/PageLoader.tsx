const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3D7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#355E3B] border-t-transparent rounded-full animate-spin" />

        <p className="text-sm font-medium text-[#355E3B]">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;