import { BranchHotelSearch } from '../../../types/hotelsType';
import CardHotel from './CardHotel';

interface propSearch {
  hotels: BranchHotelSearch[];
}
const ResultsSearch = ({ hotels }: propSearch) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels?.length ? (
          hotels.map((h) => <CardHotel key={h.id} hotel={h} />)
        ) : (
          <p>No hotels found</p>
        )}
      </div>
    </>
  );
};

export default ResultsSearch;
