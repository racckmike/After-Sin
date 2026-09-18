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

/**
 * Email-safe HTML only: table layout, inline styles, no flexbox/grid, no
 * external stylesheet. `resetUrl` must be the real link Neon Auth generated
 * (event_data.link_url from the send.magic_link webhook) — never a token
 * or URL minted by this app.
 */
export function resetPasswordEmailHtml(resetUrl: string): string {
  const safeUrl = escapeHtml(resetUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Reset your AFTER SIN password</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.bone}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    We received a request to reset the password for your AFTER SIN account.
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
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:28px; line-height:1.3; font-weight:400; color:${COLORS.offBlack}; letter-spacing:0.02em;">
                Reset Your Password
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:${COLORS.charcoal}; max-width:400px;">
                We received a request to reset the password for your AFTER SIN account.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:${COLORS.offBlack};">
                    <a href="${safeUrl}" target="_blank" style="display:inline-block; padding:16px 40px; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:600; letter-spacing:0.12em; color:${COLORS.bone}; text-decoration:none; text-transform:uppercase;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:${COLORS.charcoal}; max-width:380px;">
                This link will expire for security reasons.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:${COLORS.charcoal}; max-width:380px;">
                If you didn&rsquo;t request a password reset, you can safely ignore this email.
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
