import { Poppins, Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import Header from "../components/navbar/header/page"
import Footer from "@/components/navbar/footer/page";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartToast from "../components/Carttoast/page";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "Banishq — Luxury Jewellery & More",
  description: "Curated jewellery, cosmetics and home botanicals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`} style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflowX: "hidden",   /* prevents any accidental horizontal scroll */
        background: "#F4EFE6",
      }}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartToast />
            <main style={{ width: "100%", minHeight: "100vh" }} className="pt-[144px] max-sm:pt-[132px]">
            {children}
            </main>
          </CartProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
