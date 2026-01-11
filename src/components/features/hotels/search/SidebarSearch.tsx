
import PriceFilter from "./filters/PriceFilter";
import Ratingfilter from "./filters/Ratingfilter";

const SidebarSearch = () => {
  return (
    <>
      <div className="border rounded shadow-xl">
        <Ratingfilter />
      <PriceFilter/>
      </div>
    </>
  )
}

export default SidebarSearch
