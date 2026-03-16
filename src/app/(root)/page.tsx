import SearchMain from '@/components/features/hotels/SearchMain';
import BurjScene from '@/components/features/landing/3d/BurjScene';
import HotelCarousel from '@/components/features/landing/HotelCarousel';
import Guests from '../../components/features/landing/Guests';
import Offers from '../../components/features/landing/Offers';
import { prisma } from '../../lib/prisma';
export default async function Home() {
  const ratingData = await prisma.branchHotel.findMany({
    where: {
      rating: { gt: 1 },
    },
    orderBy: {
      rating: 'desc',
    },
    include: {
      hotel: {
        select: {
          name: true,
        },
      },
      images: true,
    },
  });

  return (
    <>
      <section className="">
        <div className=" flex flex-col md:flex-row  items-center gap-8 md:gap-0 ">
          <div className="md:w-1/2 flex flex-col justify-center px-0">
            <h1 className="md:text-4xl text-3xl py-3 font-bold ">
              {' '}
              <span>
                Discover Your Perfect <br /> Gateway Destination
              </span>
            </h1>
            <p className="mb-4 text-base dark:text-gray-300 text-gray-800">
              {' '}
              unparalleled luxury and comfort hotel at the worlds <br /> most exclusive hotels.start
              you journey now
            </p>
            <SearchMain />
          </div>
          <div className="w-full md:w-1/2 md:h-[80vh] h-[70vh] flex justify-center items-center">
            <BurjScene />
          </div>
        </div>
      </section>
      <section className="">
        <div>
          <HotelCarousel branches={ratingData} />
        </div>
      </section>
      <section className="my-12 ">
        <Offers />
      </section>
      <div className="my-12 py-20 px-0 mx-0 guests-background shadow-lg">
        <div>
          <Guests />
        </div>
      </div>
    </>
  );
}
