import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import CarouselMain from "@/components/Home/CarouselMain";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import CategorySection from "@/components/Home/CategorySection";
import AboutSection from "@/components/Home/AboutSection";
import CallToAction from "@/components/Home/CallToAction";
import PartnerLogos from "@/components/Home/PartnerLogos";

export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="relative">
      {/* Hero Carousel */ }
      <CarouselMain lang={ lang } />

      {/* Featured Categories */ }
      <CategorySection lang={ lang } />

      {/* About Section */ }
      <AboutSection lang={ lang } />

      {/* Partner Companies */ }
      <PartnerLogos lang={ lang } />

      {/* Featured Products */ }
      {/* <FeaturedProducts lang={ lang } /> */}

      {/* Call to Action */ }
      <CallToAction lang={ lang } />
    </div>
  );
}