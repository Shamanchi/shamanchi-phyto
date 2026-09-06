"use client";

import { useSearchParams } from "next/navigation";
import OrderSuccessView from "./OrderSuccessView";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  return <OrderSuccessView id={id} />;
}