import { notFound } from "next/navigation";
import ProductView from "../../../components/product/ProductView";
import products from "../../../data/products.json";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} — каталог фито-магазина`,
    description: `${product.tagline}. Демо-карточка товара для сайта фито-магазина и бренда БАД: состав, способ применения, цена и похожие товары.`,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <main id="main">
      <ProductView product={product} />
    </main>
  );
}