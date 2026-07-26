const Forbidden = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#F3F4E8]">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-red-600">403</h1>

        <h2 className="text-3xl font-semibold mt-4">
          Access Denied
        </h2>

        <p className="mt-3 text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Forbidden;