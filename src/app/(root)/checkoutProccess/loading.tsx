'use client';

import { FaSpinner } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl text-amber-400" />
      <p className="mt-4 text-gray-700">Loading Checkout...</p>
    </div>
  );
}
