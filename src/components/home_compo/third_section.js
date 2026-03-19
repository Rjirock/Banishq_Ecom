export default function BrandStatement() {
  return (
    <section className="w-full bg-[#EDEBE8] py-16 sm:py-20 lg:py-24 relative">

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20
                      flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-10">

        {/* LEFT SIDE IMAGES */}
        <div className="relative w-full max-w-[420px] sm:max-w-[500px] lg:w-[600px]
                        h-[280px] sm:h-[340px] lg:h-[420px] flex-shrink-0 mx-auto lg:mx-0">

          {/* BACK IMAGE */}
          <div className="absolute left-0 top-0
                          w-[68%] sm:w-[70%] lg:w-[420px]
                          h-[88%] sm:h-[90%] lg:h-[380px]
                          bg-white p-2 sm:p-3 shadow-lg">
            <img
              src="/store1.jpg"
              alt="Store 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* FRONT IMAGE (OVERLAP) */}
          <div className="absolute left-[32%] sm:left-[34%] lg:left-[220px]
                          top-[10%] sm:top-[10%] lg:top-[80px]
                          w-[68%] sm:w-[70%] lg:w-[420px]
                          h-[88%] sm:h-[90%] lg:h-[380px]
                          bg-white p-2 sm:p-3 shadow-xl z-10">
            <img
              src="/store2.jpg"
              alt="Store 2"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="w-full lg:max-w-[520px] text-center lg:text-left">

          <h2 className="text-[30px] sm:text-[38px] lg:text-[47px]
                         leading-[1.2] font-serif text-black mb-4 sm:mb-5 lg:mb-6">
            Brand Statement Section
          </h2>

          <p className="text-[15px] sm:text-[16px] lg:text-[18px]
                        text-black/60 leading-relaxed font-medium">
            We bring together trendsetting fashion and timeless jewellery to
            create looks that reflect your personality. From everyday essentials
            to statement pieces, every product is crafted with quality,
            elegance, and love.
          </p>

        </div>
      </div>

      {/* BOTTOM DIVIDER LINE */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                      w-[90%] h-[1px] bg-black/30" />

    </section>
  );
}