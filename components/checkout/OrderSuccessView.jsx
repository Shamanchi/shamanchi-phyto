"use client";

import Link from "next/link";
import { useShop } from "../ShopContext";
import { formatPrice, SHOP, TG_HANDLE, TG_URL } from "../../lib/site";
import { deliveryOption } from "../../lib/shop";

export default function OrderSuccessView({ id }) {
  const { orders, ready } = useShop();
  const order = orders.find((o) => o.id === id) || (ready ? orders[0] : null);

  if (!ready) {
    return (
      <div className="pt-16 sm:pt-[72px]">
        <div className="wrap py-20 text-center">
          <p className="font-display text-2xl">Ищем ваш демо-заказ…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-16 sm:pt-[72px]">
        <div className="wrap py-20 text-center">
          <h1 className="font-display text-4xl font-semibold">Заказ не найден</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-ink/60">
            В этом браузере нет сохранённого демо-заказа. Оформите новый — флоу дойдёт до шага
            «демо-заказ принят» за минуту.
          </p>
          <Link
            href="/catalog/"
            className="mt-8 inline-flex rounded-full bg-honey px-7 py-3.5 text-lg font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
          >
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  const delivery = deliveryOption(order.deliveryKey);
  const date = new Date(order.createdAt).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="wrap py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-line bg-cream p-6 text-center shadow-lift sm:p-10">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-leaf text-paper">
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M4 12.5 9.5 18 20 6.5" />
              </svg>
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">
              Демо-заказ принят
            </h1>
            <p className="mt-3 text-[16px] text-ink/70">
              Номер заказа: <span className="font-extrabold text-honeyDark">{order.id}</span>
            </p>
            <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink/60">
              В демо-режиме оплата не проводится и ничего не отправляется. В боевой версии
              менеджер подтвердит заказ и пришлёт ссылку на оплату (ЮKassa / Prodamus).
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={`${TG_URL}?text=${encodeURIComponent(`Здравствуйте! Вопрос по демо-заказу ${order.id} с сайта-маркетплейса фито-ниши.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 text-[15px] font-extrabold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
              >
                Задать вопрос в телеграм {TG_HANDLE}
              </a>
              <Link
                href="/account/"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3 text-[15px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
              >
                Мои заказы
              </Link>
              <Link
                href="/catalog/"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3 text-[15px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
              >
                В каталог
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-line bg-cream p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold">Состав заказа</h2>
              <p className="font-mono text-[11px] uppercase tracking-wider text-khaki">{date}</p>
            </div>
            <ul className="mt-5 space-y-3">
              {order.lines.map((line) => (
                <li key={line.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[15px] last:border-0 last:pb-0">
                  <span>
                    <Link href={`/product/${line.id}/`} className="font-bold transition hover:text-leaf">
                      {line.name}
                    </Link>
                    <span className="ml-2 text-[12.5px] text-khaki">× {line.qty}</span>
                  </span>
                  <span className="font-extrabold">{formatPrice(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[14.5px]">
              {order.discount > 0 && (
                <div className="flex justify-between text-leaf">
                  <dt>Промокод {order.promoCode || ""}</dt>
                  <dd>−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">{delivery ? delivery.label : "Доставка"}</dt>
                <dd className="font-bold">{formatPrice(order.deliveryCost)}</dd>
              </div>
              <div className="flex justify-between text-[17px]">
                <dt className="font-extrabold">Итого</dt>
                <dd className="font-extrabold text-honeyDark">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-5 rounded-xl bg-paper/80 p-3.5 font-mono text-[11px] leading-relaxed text-ink/55">
              Заказ сохранён локально в браузере ({SHOP.demoDeliveryNote}) · {SHOP.promoHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}