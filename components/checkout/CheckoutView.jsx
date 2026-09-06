"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "../ShopContext";
import { formatPrice, SHOP, TG_URL } from "../../lib/site";
import { deliveryCost, deliveryOption } from "../../lib/shop";

function OptionCard({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        active ? "border-leaf bg-sageSoft/40 shadow-card" : "border-line bg-cream hover:border-leaf/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { lines, count, subtotal, discount, total, promo, placeOrder } = useShop();

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [deliveryKey, setDeliveryKey] = useState("cdek");
  const [address, setAddress] = useState("");
  const [paymentKey, setPaymentKey] = useState("card");
  const [error, setError] = useState("");

  if (lines.length === 0) {
    return (
      <div className="pt-16 sm:pt-[72px]">
        <div className="wrap py-16 text-center sm:py-24">
          <h1 className="font-display text-4xl font-semibold">Оформлять пока нечего</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-ink/60">
            В корзине нет товаров. Загляните в каталог и добавьте курс — флоу оформления дойдёт
            до шага «демо-заказ принят».
          </p>
          <Link
            href="/catalog/"
            className="mt-8 inline-flex rounded-full bg-honey px-7 py-3.5 text-lg font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
          >
            Открыть каталог
          </Link>
        </div>
      </div>
    );
  }

  const delivery = deliveryOption(deliveryKey);
  const grandTotal = total + (delivery ? delivery.cost : 0);
  const contactOk = contact.name.trim().length >= 2 && contact.phone.trim().length >= 6;
  const addressOk = !delivery.needAddress || address.trim().length >= 3;

  const next = () => {
    setError("");
    if (step === 1 && !contactOk) {
      setError("Укажите имя и телефон — так менеджер сможет подтвердить демо-заказ.");
      return;
    }
    if (step === 2 && !addressOk) {
      setError("Для этого способа доставки нужен адрес или город.");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const submit = () => {
    const order = placeOrder({
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim(),
      address: address.trim(),
      deliveryKey,
      deliveryCost: delivery ? delivery.cost : 0,
      paymentKey,
    });
    if (order) {
      router.push(`/order-success?id=${encodeURIComponent(order.id)}`);
    }
  };

  const set = (key) => (e) => setContact((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="wrap py-8 sm:py-10">
        <nav aria-label="Хлебные крошки" className="font-mono text-[11px] uppercase tracking-wider text-khaki">
          <Link href="/" className="transition hover:text-leaf">Главная</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/cart/" className="transition hover:text-leaf">Корзина</Link>
          <span aria-hidden="true"> / Оформление</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">Оформление заказа</h1>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-khaki">
              демо-флоу: до шага «демо-заказ принят» · оплата не проводится
            </p>
          </div>
        </div>

        {/* Шаги */}
        <ol className="mt-6 flex flex-wrap gap-2" aria-label="Шаги оформления">
          {["Контакты", "Доставка", "Оплата"].map((label, i) => {
            const n = i + 1;
            return (
              <li key={label}>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-bold ${
                    step === n
                      ? "border-leaf bg-leaf text-paper"
                      : step > n
                        ? "border-sage/60 bg-sageSoft/50 text-leafDark"
                        : "border-line bg-cream text-ink/55"
                  }`}
                >
                  <span aria-hidden="true">{n}</span> {label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {step === 1 && (
              <section aria-label="Контактные данные" className="rounded-3xl border border-line bg-cream p-6">
                <h2 className="font-display text-2xl font-semibold">Контактные данные</h2>
                <p className="mt-1 text-[13.5px] text-ink/60">
                  Нужны, чтобы подтвердить демо-заказ и отправить ссылку на оплату после запуска.
                </p>
                <div className="mt-5 grid gap-4">
                  <div>
                    <label htmlFor="co-name" className="text-[14px] font-extrabold">Имя</label>
                    <input id="co-name" type="text" value={contact.name} onChange={set("name")} placeholder="Как к вам обращаться" className="field mt-2" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="co-phone" className="text-[14px] font-extrabold">Телефон</label>
                    <input id="co-phone" type="tel" value={contact.phone} onChange={set("phone")} placeholder="+7 900 000-00-00" className="field mt-2" autoComplete="tel" />
                  </div>
                  <div>
                    <label htmlFor="co-email" className="text-[14px] font-extrabold">Почта <span className="font-normal text-ink/45">(необязательно)</span></label>
                    <input id="co-email" type="email" value={contact.email} onChange={set("email")} placeholder="для чека и статуса" className="field mt-2" autoComplete="email" />
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-label="Способ доставки" className="rounded-3xl border border-line bg-cream p-6">
                <h2 className="font-display text-2xl font-semibold">Доставка</h2>
                <p className="mt-1 text-[13.5px] text-ink/60">{SHOP.demoDeliveryNote}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {SHOP.delivery.map((d) => (
                    <OptionCard key={d.key} active={deliveryKey === d.key} onClick={() => setDeliveryKey(d.key)}>
                      <span className="block text-[15px] font-extrabold">{d.label}</span>
                      <span className="mt-1 block text-[13px] text-ink/60">{d.note}</span>
                      <span className="mt-2 block text-[17px] font-extrabold text-honeyDark">{formatPrice(d.cost)}</span>
                    </OptionCard>
                  ))}
                </div>
                {delivery.needAddress && (
                  <div className="mt-5">
                    <label htmlFor="co-address" className="text-[14px] font-extrabold">
                      Город и адрес доставки
                    </label>
                    <input
                      id="co-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Город, улица, дом, квартира"
                      className="field mt-2"
                      autoComplete="street-address"
                    />
                  </div>
                )}
                <p className="mt-4 rounded-xl bg-paper/80 p-3 font-mono text-[11px] leading-relaxed text-ink/55">
                  Интеграция СДЭК/Почты подключается на этапе боевого запуска — в демо выбирается
                  способ и считается стоимость.
                </p>
              </section>
            )}

            {step === 3 && (
              <section aria-label="Оплата" className="rounded-3xl border border-line bg-cream p-6">
                <h2 className="font-display text-2xl font-semibold">Оплата</h2>
                <p className="mt-1 text-[13.5px] text-ink/60">
                  Интерфейс готов под платёжный шлюз (ЮKassa / Prodamus). До подключения оплата
                  не проводится — менеджер пришлёт ссылку после подтверждения заказа.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SHOP.payment.map((p) => (
                    <OptionCard key={p.key} active={paymentKey === p.key} onClick={() => setPaymentKey(p.key)}>
                      <span className="block text-[15px] font-extrabold">{p.label}</span>
                      <span className="mt-1 block text-[12.5px] text-ink/60">{p.note}</span>
                    </OptionCard>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-honey/40 bg-honey/10 p-4">
                  <p className="text-[14px] font-extrabold text-honeyDark">Демо-заказ</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/70">
                    Нажатие кнопки оформит заказ с номером и сохранит его в «Моих заказах»
                    (localStorage). Никаких реальных платежей и отправок.
                  </p>
                </div>
              </section>
            )}

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-honey/40 bg-honey/10 px-4 py-3 text-[14px] font-bold text-honeyDark">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="rounded-full border border-line bg-cream px-6 py-3 text-[15px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
                >
                  ← Назад
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-leaf px-8 py-3.5 text-[16px] font-bold text-paper transition hover:bg-leafDark"
                >
                  Далее
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  className="rounded-full bg-honey px-8 py-3.5 text-[16px] font-extrabold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
                >
                  Оформить демо-заказ
                </button>
              )}
            </div>
          </div>

          {/* Сводка */}
          <aside className="h-fit rounded-3xl border border-line bg-cream p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-semibold">Ваш заказ</h2>
            <ul className="mt-4 space-y-3">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center justify-between gap-3 text-[14px]">
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{product.name}</span>
                    <span className="text-[12px] text-khaki">× {qty}</span>
                  </span>
                  <span className="shrink-0 font-extrabold">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[14.5px]">
              <div className="flex justify-between">
                <dt className="text-ink/60">Товары ({count})</dt>
                <dd className="font-bold">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf">
                  <dt>Промокод {promo ? promo.code : ""}</dt>
                  <dd className="font-bold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">{delivery ? delivery.label : "Доставка"}</dt>
                <dd className="font-bold">{formatPrice(delivery ? delivery.cost : 0)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt className="font-extrabold">Итого</dt>
                <dd className="text-xl font-extrabold text-ink">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>
            <a
              href={`${TG_URL}?text=${encodeURIComponent("Здравствуйте! Вопрос по демо-заказу на сайте-маркетплейсе фито-ниши.")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-[14px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
            >
              Задать вопрос в телеграм
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}