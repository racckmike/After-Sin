import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resetPasswordEmailHtml } from "@/lib/email/resetPasswordEmail";

/**
 * Neon Auth has no dashboard email-template editor yet — the documented
 * way to fully brand a transactional email is to subscribe to its event
 * webhook (Neon Console → Auth → Configuration → Webhooks) and send the
 * email yourself. Once subscribed to an event, Neon's managed Better Auth
 * skips its own default email for that event and calls this instead, so
 * this handler is the ONLY thing sending that email — if it throws or a
 * later step fails, no email goes out at all.
 *
 * Only send.magic_link is subscribed (not send.otp): this project's
 * config has magic-link sign-in disabled and email verification uses OTP,
 * so forget-password is the only real-world source of this event today —
 * subscribing only to it keeps everything else (verification emails)
 * exactly as Neon's shared default, per "don't touch unrelated parts."
 *
 * https://neon.com/docs/auth/guides/customize-emails
 */

interface NeonMagicLinkEvent {
  event_type: "send.magic_link";
  user: { email: string; name?: string | null };
  event_data: {
    link_type: string;
    link_url: string;
    expires_at?: string;
  };
}

async function verifyNeonWebhook(rawBody: string, headers: Headers): Promise<unknown> {
  const signature = headers.get("x-neon-signature");
  const kid = headers.get("x-neon-signature-kid");
  const timestamp = headers.get("x-neon-timestamp");

  if (!signature || !kid || !timestamp) {
    throw new Error("Missing required Neon webhook headers");
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is not configured");

  const jwksRes = await fetch(`${baseUrl}/.well-known/jwks.json`);
  const jwks = (await jwksRes.json()) as { keys: (crypto.JsonWebKey & { kid: string })[] };
  const jwk = jwks.keys.find((k) => k.kid === kid);
  if (!jwk) throw new Error(`Key ${kid} not found in JWKS`);

  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });

  const [headerB64, emptyPayload, signatureB64] = signature.split(".");
  if (emptyPayload !== "") throw new Error("Expected detached JWS format");

  const payloadB64 = Buffer.from(rawBody, "utf8").toString("base64url");
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, "utf8").toString("base64url");
  const signingInput = `${headerB64}.${signaturePayloadB64}`;

  const isValid = crypto.verify(
    null,
    Buffer.from(signingInput),
    publicKey,
    Buffer.from(signatureB64, "base64url")
  );
  if (!isValid) throw new Error("Invalid webhook signature");

  const ageMs = Date.now() - parseInt(timestamp, 10);
  if (!Number.isFinite(ageMs) || Math.abs(ageMs) > 5 * 60 * 1000) {
    throw new Error("Webhook timestamp too old");
  }

  return JSON.parse(rawBody);
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  let payload: unknown;
  try {
    payload = await verifyNeonWebhook(rawBody, request.headers);
  } catch (error) {
    console.error("[neon-auth-webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = payload as { event_type?: string };

  if (event.event_type !== "send.magic_link") {
    // Not subscribed to anything else, but fail safe rather than 500 if
    // Neon ever sends something unexpected here.
    return NextResponse.json({ success: true, skipped: true });
  }

  const { user, event_data } = payload as NeonMagicLinkEvent;

  if (event_data.link_type !== "forget-password") {
    // Only password reset is branded today; anything else with this event
    // type is unexpected given magic-link sign-in is disabled in this
    // project, but don't silently drop the email if it ever happens.
    console.warn(`[neon-auth-webhook] unhandled link_type: ${event_data.link_type}`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[neon-auth-webhook] RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email delivery not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_ADDRESS ?? "AFTER SIN <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: user.email,
    subject: "Reset your AFTER SIN password",
    html: resetPasswordEmailHtml(event_data.link_url),
  });

  if (error) {
    console.error("[neon-auth-webhook] Resend send failed", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
