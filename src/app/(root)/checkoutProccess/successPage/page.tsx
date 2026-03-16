'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface RoomItem {
  roomName: string;
  roomType: string;
  roomPrice: number;
  quantity: number;
}

interface BookingSuccessData {
  branchName: string;
  totalPrice: number;
  checkIn: string;
  checkOut: string;
  items: RoomItem[];
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingRequestId = searchParams.get('bookingRequestId');

  const [data, setData] = useState<BookingSuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRequestId) {
      setError('Missing booking request ID');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/bookings/${bookingRequestId}`);
        const booking = res.data.data.bookingRequest;

        const items = booking.items.map((item: any) => ({
          roomName: item.room.name,
          roomType: item.room.type,
          roomPrice: item.room.price,
          quantity: item.quantity,
        }));

        setData({
          branchName: booking.branch.hotel.name,
          totalPrice: booking.totalPrice,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          items,
        });
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error || 'Failed to fetch booking data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingRequestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <FaCheckCircle className="text-green-500 w-20 h-20 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-center">
          Your stay at <span className="font-semibold">{data.branchName}</span> has been
          successfully booked.
        </p>
      </div>

      {/* 🛏 Booking Details */}
      <div className="search_section shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Check In:</strong> {new Date(data.checkIn).toLocaleDateString()}
          </p>
          <p>
            <strong>Check Out:</strong> {new Date(data.checkOut).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Price:</strong> ${data.totalPrice}
          </p>
          <p>
            <strong>Rooms Booked:</strong> {data.items.length}
          </p>
        </div>

        {/* Rooms  */}
        <div className="mt-4 space-y-3">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.roomName}</p>
                <p className="text-gray-500 text-sm">{item.roomType}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">${item.roomPrice}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full py-3 bg-gradient-to-r  from-yellow-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default SuccessPage;
