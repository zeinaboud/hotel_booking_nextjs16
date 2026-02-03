"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BookingRequestData
{
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  roomName: string;
  roomType: string;
  roomPrice: number;
  hotelName: string;
}

const CheckoutPage = () =>
{
  const searchParams = useSearchParams();
  const bookingRequestId = searchParams.get("bookingRequestId");

  const [data, setData] = useState<BookingRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);

  useEffect(() =>
  {
    if (!bookingRequestId)
    {
      setUiError("Missing booking request ID");
      setLoading(false);
      return;
    }

    const fetchBookingRequest = async () =>
    {
      try
      {
        const res = await axios.get(`http://localhost:3001/api/bookings/${bookingRequestId}`);
        if (!res.data?.data?.bookingRequest)
        {
          throw new Error("Booking request not found");
        }

        // هنا نستخدم بيانات المسودة فقط
        setData(res.data.data.bookingRequest);
      } catch (err: any)
      {
        console.error(err);
        setUiError(err?.response?.data?.error || err?.message || "Failed to fetch booking request");
      } finally
      {
        setLoading(false);
      }
    };

    fetchBookingRequest();
  }, [bookingRequestId]);

  const handlePay = async () =>
  {
    if (!data || !bookingRequestId) return;

    try
    {
      const res = await axios.post("http://localhost:3001/api/checkout/create-session", {
        bookingRequestId,
      });

      const url = res.data?.url;
      if (!url) throw new Error("No session URL returned");

      window.location.href = url;
    } catch (err: any)
    {
      console.error(err);
      setUiError(err?.response?.data?.error || err?.message || "Failed to start payment.");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (uiError) return <p className="p-6 text-red-500">{uiError}</p>;
  if (!data) return null;

  const nights = Math.ceil(
    (new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="p-4 space-y-3 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold">
          <strong>Hotel name:</strong> {data.hotelName}
        </h2>

        <div>
          <p className="font-medium"><strong>Room Name:</strong> {data.roomName}</p>
          <p className="text-gray-600"><strong>Type:</strong> {data.roomType}</p>
          <p className="text-gray-600"><strong>Price per night:</strong> ${data.roomPrice}</p>
        </div>

        <div className="space-y-1">
          <p><strong>Check-in:</strong> {data.checkIn}</p>
          <p><strong>Check-out:</strong> {data.checkOut}</p>
          <p><strong>Nights:</strong> {nights}</p>
          <p><strong>Total Price:</strong> ${data.totalPrice}</p>
        </div>
      </div>

      <button
        onClick={handlePay}
        className="w-full p-3 text-white bg-blue-600 rounded-md"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutPage;
