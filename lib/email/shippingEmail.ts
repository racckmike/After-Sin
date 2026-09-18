import { Resend } from "resend";
import type { Order } from "@/lib/orders/db";

const SITE_URL = "https://www.aftersin.shop";
const LOGO_URL = `${SITE_URL}/brand/wordmark-black.png`;

const COLORS = {
  bone: "#f1efe8",
  offBlack: "#080808",
  charcoal: "#5a5a56",
  hairline: "#dedad0",
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function shippingEmailHtml(order: Order, trackingUrl: string | null): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Your AFTER SIN order is on the way</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.bone}; -webkit-font-smoothing:antialiased;">
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
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:26px; line-height:1.3; font-weight:400; color:${COLORS.offBlack};">
                Your Order Is On The Way
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; color:${COLORS.charcoal};">
                Order #${escapeHtml(order.orderNumber)}
              </p>
              <p style="margin:8px 0 0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${COLORS.offBlack};">
                ${order.trackingCarrier ? escapeHtml(order.trackingCarrier) : "Carrier"} &mdash; ${order.trackingNumber ? escapeHtml(order.trackingNumber) : ""}
              </p>
            </td>
          </tr>
          ${
            trackingUrl
              ? `<tr>
            <td align="center" style="padding-bottom:36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:${COLORS.offBlack};">
                    <a href="${escapeHtml(trackingUrl)}" target="_blank" style="display:inline-block; padding:16px 40px; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:600; letter-spacing:0.12em; color:${COLORS.bone}; text-decoration:none; text-transform:uppercase;">
                      Track Order
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }
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

export async function sendShippingEmail(order: Order, trackingUrl: string | null) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_ADDRESS ?? "AFTER SIN <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: order.email,
    subject: `Your AFTER SIN order is on the way — #${order.orderNumber}`,
    html: shippingEmailHtml(order, trackingUrl),
  });
  if (error) throw new Error(`Resend send failed: ${error.message ?? "unknown error"}`);
}
