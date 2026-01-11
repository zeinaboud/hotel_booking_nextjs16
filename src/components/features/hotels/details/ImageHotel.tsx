"use client";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules"; // ✅
import { Swiper, SwiperSlide } from "swiper/react";

export interface ImageGallery {
  id: string;
  url: string;
  thumbnail: string;
}

interface Props {
  images: ImageGallery[];
}

export default function ImageHotel({ images }: Props) {
  if (!images || images.length === 0) return null;

  const [selected, setSelected] = useState(images[0]?.url || "");

  if (!selected) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* الصورة الرئيسية */}
      <div className="w-full h-[350px] relative rounded-lg overflow-hidden mb-4">
        <Image
          src={selected}
          alt="hotel image"
          fill
          className="object-cover"
        />
      </div>

      {/* thumbnails */}
      {images.length >= 2 ? (
        <Swiper
          modules={[Navigation]}
          spaceBetween={3}
          slidesPerView={Math.min(images.length, 5)}
          navigation
          className="h-28"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className="cursor-pointer">
              <div
                className={`relative w-full h-28 rounded-lg overflow-hidden border ${
                  img.url === selected ? "border-blue-400" : "border-gray-200"
                }`}
                onClick={() => setSelected(img.url)}
              >
                <Image
                  src={img.thumbnail || img.url}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative w-24 h-24 rounded-lg overflow-hidden border ${
                img.url === selected ? "border-blue-400" : "border-gray-200"
              }`}
              onClick={() => setSelected(img.url)}
            >
              <Image
                src={img.thumbnail || img.url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
