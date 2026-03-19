export default function FooterBottom() {
  return (
    <div className="bg-[#C6A75E] text-black text-center
                    py-3 sm:py-4 px-4
                    text-[12px] sm:text-[13px] lg:text-[14px]">
      <p>
        Copyright © {new Date().getFullYear()} [Your Brand Name]. All Rights Reserved.
      </p>
      <p className="mt-1 flex flex-wrap justify-center gap-x-2">
        <span className="hover:underline cursor-pointer">User Terms & Conditions</span>
        <span className="hidden sm:inline text-black/40">|</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
}