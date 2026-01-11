
export default function Loading() {
  return (
    <>
     <section className="border-b py-6 animate-pulse">
      <div className="md:flex gap-6">
        {/* صور الفندق */}
        <div className="md:w-1/2 h-64 bg-gray-200 rounded-lg"></div>

        {/* تفاصيل الفندق */}
        <div className="md:w-1/2 mt-5 space-y-3">
          {/* Rating */}
          <div className="h-4 w-32 bg-gray-200 rounded"></div>

          {/* اسم الفندق */}
          <div className="flex items-center gap-4">
            <span className="h-4 w-24 bg-gray-200 rounded"></span>
            <span className="h-4 w-48 bg-gray-200 rounded"></span>
          </div>
          {/* المدينة */}
          <div className="flex items-center gap-4">
            <span className="h-4 w-24 bg-gray-200 rounded"></span>
            <span className="h-4 w-32 bg-gray-200 rounded"></span>
          </div>

          {/* العنوان */}
          <div className="flex items-center gap-4">
            <span className="h-4 w-24 bg-gray-200 rounded"></span>
            <span className="h-4 w-40 bg-gray-200 rounded"></span>
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <span className="h-4 w-36 bg-gray-200 rounded"></span>
            <span className="h-16 w-full bg-gray-200 rounded"></span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </section>

    </>
  );
}
