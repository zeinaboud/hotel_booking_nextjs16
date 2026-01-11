"use client";

import RoomTableSkeleton from "@/components/ui/Skeltons/RoomTableSketon";
import { useHotelDetails } from "@/hooks/useHotelDetails";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const RoomTable = ({ hotelId }: { hotelId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const type = searchParams.get("type") || "";

  const { data: hotel, isLoading } = useHotelDetails(hotelId, { checkIn, checkOut, type });
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <RoomTableSkeleton />;

  const rooms = hotel?.rooms || [];
  if (!rooms.length) return <p>No rooms found for this search.</p>;

  const handleBook = async (roomId: string) => {
    setLoadingRoomId(roomId);
    setError(null);

    try {
      // إنشاء مسودة الحجز عبر API
      const res = await axios.post("http://localhost:3001/api/bookings/create", {
        roomId,
        hotelId,
        checkIn,
        checkOut,
      });

      const { bookingRequestId } = res.data.data;

      // الانتقال إلى صفحة الدفع
      router.push(`/checkout?bookingRequestId=${bookingRequestId}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create booking request");
    } finally {
      setLoadingRoomId(null);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <table className="w-full mt-6 border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="p-3 border">{room.name}</td>
              <td className="p-3 border capitalize">{room.type || room.roomType}</td>
              <td className="p-3 border">${room.price}</td>
              <td className="p-3 border">{room.available ? "Available" : "Not Available"}</td>
              <td className="p-3 border text-center">
                <button
                  disabled={!room.available || loadingRoomId === room.id}
                  onClick={() => handleBook(room.id)}
                  className={`bg-primary text-white px-4 py-1 rounded ${
                    loadingRoomId === room.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingRoomId === room.id ? "Booking..." : "Book"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RoomTable;
