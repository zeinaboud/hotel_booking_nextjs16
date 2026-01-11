
import HotelDetails from "@/components/features/hotels/details/HotelDetails";
import SearchRoom from "@/components/features/hotels/details/SearchRoom";
interface PageProps {
  params: {
    id: string
  };
  searchParams: {
    checkIn: string
    checkOut: string
    type?: string
  }
}
export default async function HotelDetailsPage({ params, searchParams }: PageProps)
{
  const resolve = await params;
  const hotelId = resolve.id;
  return (
    <section>
      <HotelDetails id={hotelId} />
      <SearchRoom hotelId={hotelId} />

    </section>
  )
}
