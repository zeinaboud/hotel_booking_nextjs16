
const Offers = () => {
  return (
    <>
      <h2 className="mb-0">Exclusive Offers</h2>
      <p className="text-gray-500 mb-4">Discover our latest exclusive offers and deals on luxury hotel bookings.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative bg-[url('/offers-sea.jfif')] bg-cover bg-center bg-blend-overlay p-4 rounded-lg shadow-md  md:h-64 h-48 overflow-hidden oferEffect">
          <div className="relative flex items-first ">
            <span className="px-2 py-0.5 bg-white rounded-full text-black">30%</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div  className="relative z-10 flex items-end bottom-4 h-full text-white">
            <p >Enjoy 30% off on all suites this summer.</p>
           </div>
        </div>
         <div className="relative bg-[url('/family-backage.jfif')] bg-cover bg-center bg-blend-overlay p-4 rounded-lg shadow-md  md:h-64 h-48  overflow-hidden oferEffect">
          <div className="relative flex items-first ">
            <span className="px-2 py-0.5 bg-white rounded-full text-black">20%</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div  className="relative z-10 flex items-end bottom-4 justify-center h-full text-white">
            <p>Book a family package and get a free breakfast for each child.</p>
          </div>
        </div>
        <div className="relative bg-[url('/luxary-deal.jfif')] bg-cover bg-center bg-blend-overlay p-4 rounded-lg shadow-md  md:h-64 h-48 overflow-hidden oferEffect">
          <div className="relative flex items-first ">
            <span className="px-2 py-0.5 bg-white rounded-full text-black">10%</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div  className="relative z-10 flex items-end bottom-4 justify-center h-full text-white">
             <p>Get a complimentary spa treatment with your luxury suite booking.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Offers
