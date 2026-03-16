'use client';

import Image from 'next/image';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaRegStarHalfStroke } from 'react-icons/fa6';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface BranchHotel {
  id: string;
  hotelId: string;
  hotel: {
    name: string;
  };
  city: string;
  address: string;
  rating: number;
  images: {
    url: string;
    thumbnail: string;
  }[];
}

interface HotelCarouselProps {
  branches: BranchHotel[];
}

const HotelCarousel = ({ branches }: HotelCarouselProps) => {
  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, rating));

    return Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;

      if (safeRating >= value) return <AiFillStar key={i} size={14} className="text-yellow-400" />;

      if (safeRating >= value - 0.5)
        return <FaRegStarHalfStroke key={i} size={14} className="text-yellow-400" />;

      return <AiOutlineStar key={i} size={14} className="text-yellow-400" />;
    });
  };

  return (
    <div>
      <h2>THE BEST HOTELS</h2>

      <Swiper
        className="pb-20"
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        loop
        navigation
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {branches.map((branch) => (
          <SwiperSlide key={branch.id}>
            <Image
              src={branch.images?.[0]?.url ?? '/placeholder.jpg'}
              alt={branch.hotel.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{branch.hotel.name}</h3>

              <p className="text-sm text-gray-500 mb-2">
                {branch.city} — {branch.address}
              </p>

              <div className="flex items-center gap-1">{renderStars(branch.rating)}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Pagination تحت الصور */}
      <div className="custom-pagination flex justify-center mt-6"></div>
    </div>
  );
};

export default HotelCarousel;
