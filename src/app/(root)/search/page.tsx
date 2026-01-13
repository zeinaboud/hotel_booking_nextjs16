import ResultsSearch from "@/components/features/hotels/ResultsSearch";
import SidebarSearch from "@/components/features/hotels/search/SidebarSearch";
import SearchMain from "@/components/features/hotels/SearchMain";
import { searchParamsType } from "@/types/hotelsType";
export const dynamic = "force-dynamic";

const page = async ({ searchParams }: { searchParams: searchParamsType }) =>
{
  const params = await searchParams;
  const {
    name = "",
    minPrice = "0",
    maxPrice = "1000",
    ratingGte = "",
    checkIn = "",
    checkOut = "",
  } = params;

  const query = new URLSearchParams({
    name: name || "",
    minPrice: String(minPrice || "0"),
    maxPrice: String(maxPrice || "1000"),
    ratingGte: ratingGte || "",
    checkIn: checkIn || "",
    checkOut: checkOut || "",
  });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl)
  {
    throw new Error("BASE_URL is not defined");
  }
  const res = await fetch(
    `${baseUrl}/api/hotels/search?${query}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  return (
    <>
      <section >
        <div className="py-4 mb-4">
          <SearchMain
            hotels={data.data || []}
            initialName={name}
            initialCheckin={checkIn}
            initialCheckout={checkOut}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/*sidebar */}
          <div className="md:col-span-1">
            <SidebarSearch />
          </div>

          {/*results */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-3">
            <ResultsSearch hotels={data.data} />
          </div>
        </div>
      </section>
    </>
  )
}

export default page
