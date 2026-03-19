import { Facebook, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function MainFooter() {
  return (
    <section className="relative py-12 sm:py-14 lg:py-16">

      {/* Background */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-10 lg:gap-12 text-white">

          {/* ===== COLUMN 1 — Logo + Social ===== */}
          <div>
            <img
              src="/logo.png"
              alt="BANISHQ"
              className="w-[150px] sm:w-[160px] lg:w-[180px] mb-5 lg:mb-6"
            />

            <h3 className="text-[22px] sm:text-[24px] lg:text-[26px] font-semibold text-[#C6A75E] mb-4">
              About Us
            </h3>

            <div className="flex gap-4">
              <a className="border border-white rounded-full p-2 hover:bg-[#C6A75E] transition cursor-pointer">
                <Facebook size={18} />
              </a>
              <a className="border border-white rounded-full p-2 hover:bg-[#C6A75E] transition cursor-pointer">
                <Instagram size={18} />
              </a>
              <a className="border border-white rounded-full p-2 hover:bg-[#C6A75E] transition cursor-pointer">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* ===== COLUMN 2 — Description ===== */}
          <div className="flex items-start">
            <p className="text-white/70 text-[14px] leading-relaxed">
              We specialize in elegant wedding planning, stunning floral decor,
              premium banquet styling, and curated indoor plants. From intimate
              celebrations to grand events, we bring your vision to life with
              creativity and perfection.
            </p>
          </div>

          {/* ===== COLUMN 3 — Navigation ===== */}
          <div>
            <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-semibold text-[#C6A75E] mb-4">
              Navigation
            </h3>

            <ul className="space-y-3 text-white/80 text-[14px]">
              {[
                { href: "/",             label: "Home"         },
                { href: "/about",        label: "About Us"     },
                { href: "/services",     label: "Our Services" },
                { href: "/gallery",      label: "Gallery"      },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/contact",      label: "Contact Us"   },
                { href: "/faq",          label: "FAQs"         },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-[#C6A75E] transition duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COLUMN 4 — Contact ===== */}
          <div>
            <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-semibold text-[#C6A75E] mb-4">
              Contact
            </h3>

            <ul className="space-y-3 text-white/80 text-[14px]">
              <li>
                <a href="tel:+910000000000" className="hover:text-[#C6A75E] transition duration-200">
                  +91 0000 000 000
                </a>
              </li>
              <li>
                <a href="mailto:yourbrand@gmail.com" className="hover:text-[#C6A75E] transition duration-200">
                  yourbrand@gmail.com
                </a>
              </li>
              <li className="leading-relaxed">
                Your Studio Address,<br />
                City, State
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom divider + copyright */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/15 text-center text-white/40 text-[12px] tracking-wide">
          © {new Date().getFullYear()} BANISHQ. All rights reserved.
        </div>

      </div>
    </section>
  );
}