'use client';

import { Input } from '@/components/ui/input';
import { SearchRoomForm, searchRoomSchema } from '@/lib/validation/searchRoom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoSearch } from 'react-icons/io5';
import RoomTable from './RoomTable';
const SearchRoom = ({ hotelId }: { hotelId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const types = ['SINGLE', 'DOUBLE', 'SUITE'];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchRoomForm>({
    resolver: zodResolver(searchRoomSchema),
    defaultValues: {
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      type: (searchParams.get('type') as 'SINGLE' | 'DOUBLE' | 'SUITE') || undefined,
    },
  });

  const onSubmit: SubmitHandler<SearchRoomForm> = async (data) => {
    const queryParams = new URLSearchParams();
    queryParams.set('checkIn', data.checkIn);
    queryParams.set('checkOut', data.checkOut);
    if (data.type) queryParams.set('type', data.type);
    startTransition(() => {
      router.push(`?${queryParams.toString()}`);
    });
  };
  return (
    <div className="search_section mt-10 p-6 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 ">
            <label className="font-bold ">Check in</label>
            <Input type="date" {...register('checkIn')} />
            {errors.checkIn && (
              <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="font-bold ">Check out</label>
            <Input type="date" {...register('checkOut')} />
            {errors.checkOut && (
              <p className="text-red-500 text-sm mt-1">{errors.checkOut.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="font-bold ">Room type</label>
            <div className="flex items-end gap-3">
              {types.map((type) => (
                <div key={type} className="flex gap-1">
                  <Input type="radio" value={type} {...register('type')} />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative flex items-center justify-center gap-2
                   px-6 py-2 rounded-md
                   bg-gradient-to-r from-yellow-500 to-amber-600
                   text-white font-medium
                   disabled:opacity-70 disabled:cursor-not-allowed
                   transition-all duration-200"
            >
              {isPending ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>searching..</span>
                </>
              ) : (
                <>
                  <IoSearch size={20} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <RoomTable hotelId={hotelId} />
    </div>
  );
};

export default SearchRoom;
