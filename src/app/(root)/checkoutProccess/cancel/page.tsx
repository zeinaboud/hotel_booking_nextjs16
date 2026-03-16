'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const CancelPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelName = searchParams.get('hotelName') || 'the hotel';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 space-y-6">
      <AiOutlineCloseCircle className="text-red-600 w-24 h-24 animate-bounce" />
      <h1 className="text-3xl font-bold text-red-700">Booking Cancelled</h1>
      <p className="text-lg text-red-600 text-center">
        Your booking at <strong>{hotelName}</strong> was cancelled or the payment did not complete.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Go Home
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border border-red-600 text-red-600 rounded-md hover:bg-red-100 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
