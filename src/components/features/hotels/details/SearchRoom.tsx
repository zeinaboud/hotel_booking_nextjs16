"use client"
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import RoomTable from "./RoomTable";
interface searchRoom
{
  checkIn: string
  checkOut: string
  type:string
}

const SearchRoom = ({hotelId}:{hotelId:string}) =>
{

  const {
    register,
    handleSubmit,
  } = useForm<searchRoom>();

  const types = ["SINGLE", "DOUBLE", "SUITE"];
  const [loading, isLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSubmit: SubmitHandler<searchRoom> = async (data) =>
  {
    isLoading(true);
    const queryParams = new URLSearchParams();
    if (data.checkIn) queryParams.set("checkIn", data.checkIn);
    if (data.checkOut) queryParams.set("checkOut", data.checkOut);
    if (data.type) queryParams.set("type", data.type); // قيمة الراديو هنا

    router.push(`?${queryParams.toString()}`);
  }

  return (
    <>
      <div className="search_section mt-10">
        <form  onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="check-in-out-input">
              <label htmlFor="checkInRoom">check in</label>
              <Input
                type="date"
                {...register("checkIn")}
              />
            </div>
            <div className="check-in-out-input">
              <label htmlFor="checkOutRoom">check out</label>
              <Input
                type="date"
                {...register("checkOut")}
              />
            </div>
            <div className="check-in-out-input">
              <label htmlFor="room type">Room type</label>
              <div className="flex items-center gap-3">
                {types.map((type) => (
                  <div
                    key={type}
                    className="flex gap-1"
                  >
                    <Input
                      type="radio"
                      value={type}
                      {...register("type")}
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button className="btn-gradient-gold flex items-center rounded mt-6">
                  {loading ? "Searching..." : <IoSearch size={20} />}
              </button>
            </div>
          </div>
        </form>
        <RoomTable
          hotelId={hotelId}
        />
      </div>
    </>
  )
}

export default SearchRoom
