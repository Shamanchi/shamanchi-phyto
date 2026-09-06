import Nav from "../components/Nav";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Quiz from "../components/Quiz";
import Showcase from "../components/Showcase";
import Founder from "../components/Founder";
import Craft from "../components/Craft";
import Reviews from "../components/Reviews";
import DemoBlock from "../components/DemoBlock";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import PollenCanvas from "../components/PollenCanvas";
import { ShopProvider } from "../components/ShopContext";
import { SITE_URL } from "../lib/site";

const ldJson = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Спутник Фито",
  url: SITE_URL,
  description:
    "Демонстрационный лендинг-магазин фитосборов врача-фитотерапевта — эталон разработки сайтов для ниши товаров здоровья.",
  publisher: {
    "@type": "Organization",
    name: "Shamanchi",
    url: SITE_URL,
  },
  inLanguage: "ru",
};

export default function Page() {
  return (
    <ShopProvider>
      <PollenCanvas />
      <Nav />
      <main id="main">
        <Hero />
        <TrustBar />
        <Quiz />
        <Showcase />
        <Founder />
        <Craft />
        <Reviews />
        <DemoBlock />
      </main>
      <Footer />
      <CartDrawer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </ShopProvider>
  );
}