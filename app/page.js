import CategoryBar from "@/components/layout/CategoryBar";
import ConsumerElectronicsSection from "@/components/layout/ConsumerElectronicsSection";
import DealSection from "@/components/layout/DealSection";
import ExtraServices from "@/components/layout/ExtraServices";
import Footer from "@/components/layout/Footer";
import HomeOutdoorSection from "@/components/layout/HomeOutdoorSection";
import InquirySection from "@/components/layout/InquirySection";
import MainSection from "@/components/layout/MainSection";
import Navbar from "@/components/layout/Navbar";
import Newsletter from "@/components/layout/NewsLetter";
import RecommendedItems from "@/components/layout/RecommendedItems";
import SearchByRegion from "@/components/layout/SearchByRegion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <CategoryBar />

      <main className="flex flex-col items-center gap-6 py-6">
        <MainSection />
        <DealSection />
        <ConsumerElectronicsSection />
        <HomeOutdoorSection />
        <InquirySection />
        <RecommendedItems />
        <ExtraServices />
        <Newsletter />
      </main>
      <SearchByRegion />

      <Footer />
    </div>
  );
}