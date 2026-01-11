

import { getHotelDetailsService } from "@/lib/services/getHotelDetailsService";
import { JSX } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { MdCoffee, MdFitnessCenter, MdLocalBar, MdLocalParking, MdPool, MdRestaurant, MdRoomService, MdSpa } from "react-icons/md";
import ImageHotel from "./ImageHotel";

interface HotelDetailsProps {
  id: string;
}
{/**icon map */ }
export const iconMap:Record<string, JSX.Element> = {
  "pool": <MdPool size={26} className="text-icons" />,
  "parking": <MdLocalParking size={26} className="text-icons"  />,
  "restaurant": <MdRestaurant size={26} className="text-icons" />,
  "spa": <MdSpa size={26} className="text-icons"  />,
  "gym": <MdFitnessCenter size={26} className="text-icons" />,
  "room service": <MdRoomService size={26} className="text-icons"  />,
  "bar": <MdLocalBar size={26} className="text-icons" />,
  "coffee maker":<MdCoffee size={26} className="text-icons" />
}
export default async function HotelDetails({ id }: HotelDetailsProps)
{
  const hotel = await getHotelDetailsService(id);
  {/**rating */ }
  const stars = Array.from({ length: 5 }, (_, i) => {
      const index = i + 1;
      if (hotel?.rating >= index)
        return <AiFillStar key={i} size={15} className="text-yellow-400" />;

      if (hotel?.rating >= index - 0.5)
        return <FaRegStarHalfStroke key={i} size={15} className="text-yellow-400" />;

      return <AiOutlineStar key={i} size={15} className="text-yellow-400" />;
  });
  return (
    <>
      <section className="border-b py-6 ">
        <div className="md:flex  gap-6">
          <div className="md:w-1/2">
            <ImageHotel images={ hotel?.images || []} />
          </div>
          <div className="md:w-1/2  mt-5 space-y-1.5">
            <div className="flex items-center gap-4">
              <span className=" flex gap-0.5">{stars}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">Hotel Name:</span>
              <p>{ hotel?.hotel.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">Hotel city:</span>
              <p>{hotel?.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">Hotel address:</span>
              <p>{hotel?.address}</p>
            </div>
            <div className="  gap-4">
              <span className="font-bold text-lg ">Hotel Description:</span>
              <p className="">{ hotel?.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
          {hotel?.amenities.map((amenity) =>
          (
            <div
              key={amenity.id}
              className="flex items-center justify-center gap-3 p-3 border border-primary  rounded-lg "
            >
              <div className="text-accent-gold">
                {iconMap[amenity.name] || <span>....</span>}
              </div>
              <div className="flex gap-0.5">
                <span>{amenity.name}</span>
                <span>{amenity.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
