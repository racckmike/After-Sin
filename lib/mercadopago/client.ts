import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

/**
 * Server-only. The access token is never sent to the browser — Checkout
 * Pro works by creating a preference here and redirecting the customer to
 * the URL Mercado Pago returns (init_point/sandbox_init_point), so no
 * client-side SDK or public key is needed for this flow.
 */
function config() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
  return new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
}

export function preferenceClient() {
  return new Preference(config());
}

export function paymentClient() {
  return new Payment(config());
}

export function isTestCredentials() {
  return (process.env.MERCADOPAGO_ACCESS_TOKEN ?? "").startsWith("TEST-");
}
