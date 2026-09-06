import CatalogView from "../../components/catalog/CatalogView";

export const metadata = {
  title: "Каталог — сайт для фито-магазина",
  description:
    "Демо-каталог сайта для фито-магазина и бренда БАД: фильтры по назначению, формату и цене, поиск, подборки «Хиты» и «Новинки».",
};

export default function CatalogPage() {
  return (
    <main id="main">
      <CatalogView />
    </main>
  );
}