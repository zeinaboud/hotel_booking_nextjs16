'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoomItem {
  roomId: string;
  roomName: string;
  roomType: string;
  roomPrice: number;
  quantity: number;
}
interface hotel {
  name: string;
}
interface BookingRequestData {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nights: number;
  items: RoomItem[];
  branch: hotel;
}

const Checkout = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''; // fallback لتجنب crash

  const searchParams = useSearchParams();
  const bookingRequestId = searchParams.get('bookingRequestId');

  const [data, setData] = useState<BookingRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRequestId) {
      setUiError('Missing booking request ID');
      console.log(res.data);
      setLoading(false);
      return;
    }

    const fetchBookingRequest = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/bookings/${bookingRequestId}`);
        const booking = res.data?.data?.bookingRequest;
        if (!booking) throw new Error('Booking request not found');
        console.log(booking);
        const items = booking.items.map((item: any) => ({
          roomId: item.roomId,
          roomName: item.room.name,
          roomType: item.room.type,
          roomPrice: item.room.price,
          quantity: item.quantity,
        }));
        setData({ ...booking, items });
      } catch (err: any) {
        console.error(err);
        setUiError(err?.response?.data?.error || err?.message || 'Failed to fetch booking request');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingRequest();
  }, [bookingRequestId, baseUrl]);

  const handlePay = async () => {
    if (!data || !bookingRequestId) return;

    try {
      const res = await axios.post(`${baseUrl}/api/checkout/create-session`, {
        bookingRequestId,
      });

      const url = res.data?.url;
      if (!url) throw new Error('No session URL returned');

      // redirect فقط في client event handler
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error(err);
      setUiError(err?.response?.data?.error || err?.message || 'Failed to start payment.');
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (uiError) return <p className="p-6 text-red-500">{uiError}</p>;
  if (!data) return null;

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="p-4 space-y-3 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold">
          <strong>Hotel name:</strong> {data.branch?.name}
        </h2>

        <div>
          {data.items.map((item) => (
            <div key={item.roomId}>
              <p className="font-medium">
                <strong>Room Name:</strong> {item.roomName}
              </p>
              <p className="text-gray-600">
                <strong>Type:</strong> {item.roomType}
              </p>
              <p className="text-gray-600">
                <strong>Price per night:</strong> ${item.roomPrice}
              </p>
              <p className="text-gray-600">
                <strong>Quantity:</strong> {item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handlePay} className="w-full p-3 text-white bg-blue-600 rounded-md">
        Proceed to Payment
      </button>
    </div>
  );
};

// دالة لحساب عدد الليالي
function calculateNights(checkIn: string, checkOut: string) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default Checkout;
