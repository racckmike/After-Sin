import { Resend } from "resend";
import type { Order, OrderItemRow } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

const SITE_URL = "https://www.aftersin.shop";
const LOGO_URL = `${SITE_URL}/brand/wordmark-black.png`;

const COLORS = {
  bone: "#f1efe8",
  offBlack: "#080808",
  charcoal: "#5a5a56",
  hairline: "#dedad0",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function itemRowsHtml(items: OrderItemRow[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0; border-bottom:1px solid ${COLORS.hairline}; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${COLORS.offBlack};">
          ${escapeHtml(item.productName)}
          <div style="margin-top:2px; font-size:12px; color:${COLORS.charcoal};">${escapeHtml(item.variantColor)} / ${escapeHtml(item.variantSize)} &times; ${item.quantity}</div>
        </td>
        <td align="right" style="padding:14px 0; border-bottom:1px solid ${COLORS.hairline}; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${COLORS.offBlack}; white-space:nowrap;">
          ${formatCentavosMXN(item.unitPriceCentavos * item.quantity)}
        </td>
      </tr>`
    )
    .join("");
}

function summaryRow(label: string, value: string, bold = false): string {
  return `
    <tr>
      <td style="padding:4px 0; font-family:Arial, Helvetica, sans-serif; font-size:${bold ? "15px" : "13px"}; color:${bold ? COLORS.offBlack : COLORS.charcoal}; font-weight:${bold ? "700" : "400"};">${label}</td>
      <td align="right" style="padding:4px 0; font-family:Arial, Helvetica, sans-serif; font-size:${bold ? "15px" : "13px"}; color:${bold ? COLORS.offBlack : COLORS.charcoal}; font-weight:${bold ? "700" : "400"};">${value}</td>
    </tr>`;
}

export function orderConfirmationEmailHtml(order: Order, items: OrderItemRow[]): string {
  const addr = order.shippingAddress;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Order Confirmed — AFTER SIN</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.bone}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your consequence has been set in motion. Order #${escapeHtml(order.orderNumber)}.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bone};">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background-color:${COLORS.bone};">
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <img src="${LOGO_URL}" width="160" alt="AFTER SIN" style="display:block; width:160px; max-width:160px; height:auto; border:0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:28px; line-height:1.3; font-weight:400; color:${COLORS.offBlack}; letter-spacing:0.02em;">
                Order Confirmed
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; color:${COLORS.charcoal};">
                Your consequence has been set in motion.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; color:${COLORS.charcoal};">
                Order #${escapeHtml(order.orderNumber)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid ${COLORS.hairline}; padding-top:8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemRowsHtml(items)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:16px; padding-bottom:36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${summaryRow("Subtotal", formatCentavosMXN(order.subtotalCentavos))}
                ${summaryRow("Shipping", formatCentavosMXN(order.shippingCentavos))}
                ${order.discountCentavos > 0 ? summaryRow("Discount", `&minus;${formatCentavosMXN(order.discountCentavos)}`) : ""}
                ${summaryRow("Total", formatCentavosMXN(order.totalCentavos), true)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid ${COLORS.hairline}; padding-top:28px; padding-bottom:36px;">
              <p style="margin:0 0 6px; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:${COLORS.charcoal};">
                Shipping To
              </p>
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:${COLORS.offBlack};">
                ${escapeHtml(addr.fullName ?? "")}<br />
                ${escapeHtml(addr.line1 ?? "")}${addr.line2 ? `, ${escapeHtml(addr.line2)}` : ""}<br />
                ${escapeHtml(addr.city ?? "")}, ${escapeHtml(addr.state ?? "")} ${escapeHtml(addr.postalCode ?? "")}<br />
                ${escapeHtml(addr.country ?? "")}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:${COLORS.charcoal};">
                We&rsquo;ll let you know when your order is on its way.
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid ${COLORS.hairline}; padding-top:28px;" align="center">
              <p style="margin:0 0 8px; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${COLORS.charcoal};">
                Every action leaves a consequence.
              </p>
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:${COLORS.charcoal};">
                &copy; AFTER SIN
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: Order, items: OrderItemRow[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_ADDRESS ?? "AFTER SIN <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: order.email,
    subject: `Order Confirmed — #${order.orderNumber}`,
    html: orderConfirmationEmailHtml(order, items),
  });
  if (error) throw new Error(`Resend send failed: ${error.message ?? "unknown error"}`);
}
