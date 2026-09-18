"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Rendered only on the checkout success page once an order is confirmed PAID server-side. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
