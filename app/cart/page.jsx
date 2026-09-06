import CartView from "../../components/cart/CartView";

export const metadata = {
  title: "Корзина",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main id="main">
      <CartView />
    </main>
  );
}