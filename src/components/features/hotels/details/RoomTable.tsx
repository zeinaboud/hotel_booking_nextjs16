'use client';

import RoomTableSkeleton from '@/components/ui/Skeltons/RoomTableSketon';
import { useHotelDetails } from '@/hooks/useHotelDetails';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface RoomTypeItem {
  type: string;
  price: number;
  availableQuantity: number;
  rooms: any[];
}

const RoomTable = ({ hotelId }: { hotelId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const typeFilter = searchParams.get('type') || '';
  const { data: session, status } = useSession();

  const { data: hotel, isLoading } = useHotelDetails(hotelId, {
    checkIn,
    checkOut,
    type: typeFilter,
  });

  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<Record<string, number>>({});

  if (isLoading) return <RoomTableSkeleton />;
  if (!hotel || !hotel.rooms.length) return <p>No rooms found for this search.</p>;

  const handleQuantityChange = (type: string, qty: number) => {
    setSelectedQuantity((prev) => ({ ...prev, [type]: qty }));
  };

  const handleBook = async (roomTypeItem: RoomTypeItem) => {
    const qty = selectedQuantity[roomTypeItem.type];
    if (!qty || qty <= 0) {
      alert('Please select number of rooms');
      return;
    }

    if (status === 'loading') return;
    if (!session?.user?.id) {
      alert('You must sign in!');
      router.push('/signup');
      return;
    }

    setLoadingType(roomTypeItem.type);
    setError(null);

    try {
      const res = await axios.post(`/api/bookings/create`, {
        hotelId,
        roomType: roomTypeItem.type,
        quantity: qty,
        checkIn,
        checkOut,
      });
      console.log(roomTypeItem.type);

      const { bookingRequestIds } = res.data.data;
      router.push(`/checkoutProccess?bookingRequestId=${bookingRequestIds[0]}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create booking request');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className=" text-left text-sm">
            <th className="border p-2">Room Type</th>
            <th className="border p-2">Price per Night</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Select Quantity</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {hotel.rooms.map((roomTypeItem) => (
            <tr key={roomTypeItem.type}>
              <td className="p-3 border font-medium capitalize">{roomTypeItem.type}</td>
              <td className="p-3 border">${roomTypeItem.price}</td>
              <td className="p-3 border">{roomTypeItem.availableQuantity}</td>
              <td className="p-3 border">
                <select
                  value={selectedQuantity[roomTypeItem.type] || 0}
                  onChange={(e) => handleQuantityChange(roomTypeItem.type, Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  <option value={0}>0</option>
                  {Array.from({ length: roomTypeItem.availableQuantity }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ),
                  )}
                </select>
              </td>
              <td className="p-3 border text-center">
                <button
                  disabled={
                    loadingType === roomTypeItem.type || roomTypeItem.availableQuantity === 0
                  }
                  onClick={() => handleBook(roomTypeItem)}
                  className={`bg-primary text-white px-4 py-1 rounded ${
                    loadingType === roomTypeItem.type ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loadingType === roomTypeItem.type ? 'Reserving...' : 'Reserve'}
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
