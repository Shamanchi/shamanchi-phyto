import CheckoutView from "../../components/checkout/CheckoutView";

export const metadata = {
  title: "Оформление заказа",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main id="main">
      <CheckoutView />
    </main>
  );
}