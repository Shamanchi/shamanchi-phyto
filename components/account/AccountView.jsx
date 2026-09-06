"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "../ShopContext";
import { formatPrice } from "../../lib/site";
import { deliveryOption } from "../../lib/shop";

export default function AccountView() {
  const router = useRouter();
  const { orders, reorder } = useShop();

  const repeat = (id) => {
    const ok = reorder(id);
    if (ok) router.push("/cart/");
  };

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="wrap py-8 sm:py-12">
        <nav aria-label="Хлебные крошки" className="font-mono text-[11px] uppercase tracking-wider text-khaki">
          <Link href="/" className="transition hover:text-leaf">Главная</Link>
          <span aria-hidden="true"> / Мои заказы</span>
        </nav>

        <div className="mt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">личный кабинет · демо</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            Мои <span className="text-leaf">заказы</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/60">
            История демо-заказов хранится в localStorage этого браузера — как настоящий личный
            кабинет, но без бэкенда. Повтор заказа добавляет те же товары в корзину.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-line bg-cream p-10 text-center">
            <p className="font-display text-2xl font-semibold">Пока нет ни одного заказа</p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink/60">
              Оформите демо-заказ из каталога — и он появится здесь с номером, составом и кнопкой
              «повторить».
            </p>
            <Link
              href="/catalog/"
              className="mt-6 inline-flex rounded-full bg-honey px-7 py-3.5 text-[16px] font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
            >
              Открыть каталог
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-5">
            {orders.map((order) => {
              const delivery = deliveryOption(order.deliveryKey);
              const date = new Date(order.createdAt).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={order.id} className="rounded-3xl border border-line bg-cream p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-khaki">{date}</p>
                      <h2 className="mt-1 font-display text-2xl font-semibold">{order.id}</h2>
                    </div>
                    <span className="rounded-full border border-honey/40 bg-honey/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-honeyDark">
                      {order.status}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 border-t border-line pt-4">
                    {order.lines.map((line) => (
                      <li key={line.id} className="flex items-center justify-between gap-3 text-[14.5px]">
                        <span className="min-w-0">
                          <Link href={`/product/${line.id}/`} className="font-bold transition hover:text-leaf">
                            {line.name}
                          </Link>
                          <span className="ml-2 text-[12.5px] text-khaki">× {line.qty}</span>
                        </span>
                        <span className="shrink-0 font-extrabold">{formatPrice(line.price * line.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-[14px] text-ink/60">
                      {delivery ? delivery.label : "Доставка"} ·{" "}
                      <span className="font-extrabold text-ink">{formatPrice(order.total)}</span>
                      {order.discount > 0 && (
                        <span className="ml-2 text-[12px] font-bold text-leaf">
                          (скидка {formatPrice(order.discount)})
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/order-success?id=${encodeURIComponent(order.id)}`}
                        className="rounded-full border border-line bg-paper px-5 py-2 text-[13.5px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
                      >
                        Подробнее
                      </Link>
                      <button
                        type="button"
                        onClick={() => repeat(order.id)}
                        className="rounded-full bg-honey px-5 py-2 text-[13.5px] font-bold text-ink transition hover:bg-[#BB7B1E]"
                      >
                        Повторить заказ
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}