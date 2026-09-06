import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Quiz from "../components/Quiz";
import Showcase from "../components/Showcase";
import Founder from "../components/Founder";
import Craft from "../components/Craft";
import Reviews from "../components/Reviews";
import DemoBlock from "../components/DemoBlock";
import { BRAND, SITE_URL } from "../lib/site";

const ldJson = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND.name,
  url: SITE_URL,
  description:
    "Демонстрационный маркетплейс фито-ниши: каталог с фильтрами, корзина, оформление заказа. Эталон разработки сайтов для ниши товаров здоровья.",
  publisher: {
    "@type": "Organization",
    name: "Shamanchi",
    url: SITE_URL,
  },
  inLanguage: "ru",
};

export default function Page() {
  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </>
  );
}