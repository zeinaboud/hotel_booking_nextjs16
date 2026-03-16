import ResultsSearch from '@/components/features/hotels/ResultsSearch';
import SidebarSearch from '@/components/features/hotels/search/SidebarSearch';
import SearchMain from '@/components/features/hotels/SearchMain';
import { searchParamsType } from '@/types/hotelsType';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 9; // عدد الفنادق في كل صفحة
const page = async ({ searchParams }: { searchParams: searchParamsType }) => {
  const params = await searchParams;
  const {
    name = '',
    minPrice = '0',
    maxPrice = '1000',
    ratingGte = '',
    checkIn = '',
    checkOut = '',
    page: pageStr = '1',
  } = params;

  const currentPage = Number(pageStr) || 1;
  const query = new URLSearchParams({
    name: name || '',
    minPrice: String(minPrice || '0'),
    maxPrice: String(maxPrice || '1000'),
    ratingGte: ratingGte || '',
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    page: String(currentPage),
    limit: String(PAGE_SIZE),
  });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error('BASE_URL is not defined');
  }
  const res = await fetch(`${baseUrl}/api/hotels/search?${query}`, { cache: 'no-store' });

  const data = await res.json();
  const totalHotels = data.total || data.data?.length || 0; // backend يرجع total count
  const totalPages = Math.ceil(totalHotels / PAGE_SIZE);
  return (
    <>
      <section>
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
          <div className="md:col-span-3 ">
            <ResultsSearch hotels={data.data} />
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href={`?${query.toString().replace(`page=${currentPage}`, `page=${pageNum}`)}`}
              className={`px-3 py-1 rounded border ${
                pageNum === currentPage ? 'bg-yellow-500 text-white' : 'bg-white text-black'
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
