"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function FooterCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    setEmail("");
  };

  return (
    <section className="relative w-full py-12 sm:py-14 lg:py-16">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/footer-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-10">

        <div className="flex flex-col sm:flex-row justify-between items-center
                        gap-8 sm:gap-6 text-center sm:text-left">

          {/* LEFT TEXT */}
          <h2 className="text-[28px] sm:text-[34px] lg:text-[42px] font-semibold text-white leading-tight">
            Let's <span className="text-[#C6A75E]">Connect</span> there
          </h2>

          {/* NEWSLETTER */}
          <div className="sm:text-right w-full sm:w-auto">

            <h3 className="text-[#C6A75E] text-[15px] sm:text-[17px] lg:text-[18px] mb-3">
              Get the Latest Updates
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-full overflow-hidden
                         w-full sm:w-[280px] lg:w-[320px] mx-auto sm:mx-0 sm:ml-auto"
            >
              <input
                type="email"
                placeholder="Your Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-black outline-none text-[14px] min-w-0"
              />

              <button
                type="submit"
                className="bg-[#C6A75E] px-4 py-2.5 flex-shrink-0 hover:bg-[#b8963f] transition duration-200"
              >
                <Send size={16} />
              </button>
            </form>

          </div>

        </div>

        {/* Gold Divider */}
        <div className="relative mt-10 sm:mt-12 h-[1px] w-full">
          <div className="absolute inset-0
                          bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent
                          opacity-70" />
          <div className="absolute inset-0 blur-[2px]
                          bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent
                          opacity-40" />
        </div>

      </div>
    </section>
  );
}