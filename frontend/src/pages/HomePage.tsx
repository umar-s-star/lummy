import {
  HeroSection,
  PromoCodesSection,
  PromosSection,
  BestSellersSection,
  NewItemsSection,
  CategoriesSection,
  AboutSection,
  AdvantagesSection,
  FAQSection,
} from '../components/sections/HomeSections';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <PromoCodesSection />
      <PromosSection />
      <BestSellersSection />
      <NewItemsSection />
      <AboutSection />
      <AdvantagesSection />
      <FAQSection />
    </>
  );
}
