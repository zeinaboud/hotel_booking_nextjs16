
const Guests = () => {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 ">
        <div className="relative bg-white text-black rounded-lg p-6 ">
          <div className="absolute outline-8  outline-outline-guest rounded-full right-0 -top-10">
            <img
                src="/family-backage.jfif"
                alt="person1"
                className="rounded-full w-24 h-24"
              />
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 font-semibold ">zeinab oud</h3>
            <p className="text-gray-600 text-base leading-tight">"i have used many booking platforms. but none compare to the personalized experiences and attention to details that QuickStay provider."</p>
          </div>
        </div>
        {/*second card*/}
        <div className="relative bg-white text-black rounded-lg p-6 ">
          <div className="absolute outline-8  outline-outline-guest rounded-full right-0 -top-10">
            <img
                src="/family-backage.jfif"
                alt="person1"
                className="rounded-full w-24 h-24"
              />
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 font-semibold ">zeinab oud</h3>
            <p className="text-gray-600 text-base leading-tight">"i have used many booking platforms. but none compare to the personalized experiences and attention to details that QuickStay provider."</p>
          </div>
        </div>
        {/*third card*/}
        <div className="relative bg-white text-black rounded-lg p-6 ">
          <div className="absolute outline-8  outline-outline-guest rounded-full right-0 -top-10">
            <img
                src="/family-backage.jfif"
                alt="person1"
                className="rounded-full w-24 h-24"
              />
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 font-semibold ">zeinab oud</h3>
            <p className="text-gray-600 text-base leading-tight">"i have used many booking platforms. but none compare to the personalized experiences and attention to details that QuickStay provider."</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Guests
