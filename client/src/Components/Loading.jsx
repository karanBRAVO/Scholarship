const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="p-8 bg-white shadow-md rounded-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-r-2 border-b-2"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
