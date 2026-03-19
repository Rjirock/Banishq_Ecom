import Image from "next/image";
import First_section from "../components/home_compo/first_section"
import Second_section from "../components/home_compo/second_section"
import Third_section from "../components/home_compo/third_section"
import Fourth_section from "../components/home_compo/fourth_section"
import FeaturedProducts from "../components/home_compo/featured_products";
import StatsSection from "@/components/home_compo/statssection";
import ProductGalleryTabs from "@/components/home_compo/product_gallerytabs";

export default function Home() {
  return (
   <>
   <First_section />
   <Second_section />
   <Third_section />
   <Fourth_section />
   <FeaturedProducts />
   <StatsSection />
   <ProductGalleryTabs />
   </>
  );
}
