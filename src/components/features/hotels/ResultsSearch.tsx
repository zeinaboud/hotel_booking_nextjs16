import { BranchHotelSearch } from '../../../types/hotelsType';
import CardHotel from "./CardHotel";

interface propSearch
{
  hotels:BranchHotelSearch[]
}
const ResultsSearch = ({ hotels }:propSearch) =>
{

  return (
    <>
      <div>
        {hotels?.length ? (
            hotels.map((h) => <CardHotel key={h.id} hotel={h} />)
          ) : (
            <p>No hotels found</p>
        )}
      </div>
    </>
  )
}

export default ResultsSearch
