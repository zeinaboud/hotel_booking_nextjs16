
"use client";

export default function RoomTableSkelton() {
  return (
    <section className="border-b py-6 animate-pulse space-y-6">
      <div className="w-full mt-6 border rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 bg-gray-100 text-gray-400 font-semibold text-left p-3">
          <div>Name</div>
          <div>Type</div>
          <div>Price</div>
          <div>Available</div>
          <div></div>
        </div>

        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 p-3 items-center animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
