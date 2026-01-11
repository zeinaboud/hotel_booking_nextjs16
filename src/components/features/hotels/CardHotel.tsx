"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { BranchHotelSearch } from "@/types/hotelsType";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import Link from "next/link";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaRegStarHalfStroke } from "react-icons/fa6";
gsap.registerPlugin(ScrollTrigger)
interface cardHotelProp
{
  hotel:BranchHotelSearch
}

const CardHotel = ({ hotel }: cardHotelProp) =>
{
  const stars = Array.from({ length: 5 }, (_, i) => {
    const index = i + 1;
    if (hotel.rating >= index)
      return <AiFillStar key={i} size={15} className="text-yellow-400" />;

    if (hotel.rating >= index - 0.5)
      return <FaRegStarHalfStroke key={i} size={15} className="text-yellow-400" />;

    return <AiOutlineStar key={i} size={15} className="text-yellow-400" />;
  });

  const availableRoom = hotel.rooms.filter(r => r.available).length;
  const imageUrl = hotel.images?.[0]?.url ?? "/placeholder.jpg";
  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="card p-4 block overflow-hidden border rounded-lg shadow hover:shadow-lg transition space-y-3"
    >
      <div>
        <Image
          className="w-full  object-cover rounded-md"
          src={imageUrl}
          alt={hotel.hotelName}
          width={48}
          height={48}
        />
      </div>
      <div className="flex justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold">{hotel.hotelName}</h2>
          <p className="text-gray-600">
            {hotel.city} — {hotel.address}
          </p>
        </div>
        <div className="flex gap-0.5">
          {stars}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">Rooms</h3>

        {hotel.rooms.length === 0 && (
          <p className="text-sm text-gray-500">No available rooms.</p>
        )}

        {hotel.rooms.length > 0 && (
          <p>
            Available Room:{availableRoom}
          </p>
        )
        }
      </div>

    </Link>
  );
};
export const  StartupCardSkeleton= () =>
(
    <>
        {
            [0, 1,2, 3,].map((index: number) => (
                <li key={index}>
                    <Skeleton  className="h-8 w-full rounded-md"/>
                </li>
            ))
        }
    </>
)
export default CardHotel
