import AccountView from "../../components/account/AccountView";

export const metadata = {
  title: "Мои заказы",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <main id="main">
      <AccountView />
    </main>
  );
}