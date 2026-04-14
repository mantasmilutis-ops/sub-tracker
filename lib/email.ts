import { Resend } from 'resend'

// ─── Transport ────────────────────────────────────────────────────────────────

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ error?: string }> {
  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  })
  return error ? { error: error.message } : {}
}

// ─── Template primitives ──────────────────────────────────────────────────────

function dashboardUrl(): string {
  return process.env.NEXTAUTH_URL ?? 'http://localhost:3004'
}

function fmtPrice(price: number): string {
  return `€${price.toFixed(2)}`
}

/**
 * Outer email wrapper — table-based layout for broad email client support.
 * Light slate background, centered white card, brand header, footer.
 */
function wrap(card: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

      <!-- Brand -->
      <tr>
        <td align="center" style="padding:0 0 20px;">
          <span style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6366f1;">SubTracker</span>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 40px 36px;">
          ${card}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding:24px 0 0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
            You are receiving this because you use SubTracker.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

function ctaButton(label: string, url: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
    <tr><td align="center">
      <a href="${url}"
         style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;
                text-decoration:none;padding:12px 32px;border-radius:8px;letter-spacing:0.01em;">
        ${label}
      </a>
    </td></tr>
  </table>`
}

function subRow(name: string, price: number, billingCycle: string, dateLabel?: string): string {
  const cycle = billingCycle === 'yearly' ? 'yr' : 'mo'
  return `
  <tr>
    <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;vertical-align:middle;">
      <span style="font-size:14px;color:#1e293b;font-weight:500;">${name}</span>
      ${dateLabel ? `<span style="font-size:12px;color:#94a3b8;margin-left:8px;">${dateLabel}</span>` : ''}
    </td>
    <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap;vertical-align:middle;">
      <span style="font-size:14px;color:#334155;font-weight:600;">${fmtPrice(price)}</span><span style="font-size:11px;color:#94a3b8;">/${cycle}</span>
    </td>
  </tr>`
}

function totalRow(label: string, amount: number): string {
  return `
  <tr>
    <td style="padding:16px 0 0;font-size:13px;color:#64748b;font-weight:500;">${label}</td>
    <td style="padding:16px 0 0;text-align:right;">
      <span style="font-size:16px;color:#0f172a;font-weight:700;">${fmtPrice(amount)}</span>
    </td>
  </tr>`
}

function statCard(label: string, value: string, color: string): string {
  return `
  <td width="33%" style="padding:0 5px;text-align:center;">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 8px;">
      <p style="margin:0 0 4px;font-size:24px;font-weight:700;color:${color};">${value}</p>
      <p style="margin:0;font-size:11px;color:#64748b;line-height:1.4;">${label}</p>
    </div>
  </td>`
}

// ─── Alert types ─────────────────────────────────────────────────────────────

export type AlertSub = {
  name: string
  price: number
  billingCycle: string
  nextBilling: Date
}

export async function sendTodayAlert(to: string, subs: AlertSub[]) {
  const total = subs.reduce((s, sub) => s + sub.price, 0)

  const subject = subs.length === 1
    ? `${subs[0].name} renews today`
    : `${subs.length} subscriptions renew today`

  const intro = subs.length === 1
    ? `<strong style="color:#1e293b;">${subs[0].name}</strong> is being charged today.`
    : `You have <strong style="color:#1e293b;">${subs.length} subscriptions</strong> renewing today.`

  const html = wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">Renewing today</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;text-align:center;">${intro}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${subs.map(s => subRow(s.name, s.price, s.billingCycle)).join('')}
      ${subs.length > 1 ? totalRow('Total charged today', total) : ''}
    </table>
    ${ctaButton('Open Dashboard', dashboardUrl())}
  `)

  return sendEmail(to, subject, html)
}

export async function sendTomorrowAlert(to: string, subs: AlertSub[]) {
  const total = subs.reduce((s, sub) => s + sub.price, 0)

  const subject = subs.length === 1
    ? `${subs[0].name} renews tomorrow`
    : `${subs.length} subscriptions renew tomorrow`

  const intro = subs.length === 1
    ? `<strong style="color:#1e293b;">${subs[0].name}</strong> will renew tomorrow.`
    : `You have <strong style="color:#1e293b;">${subs.length} subscriptions</strong> renewing tomorrow.`

  const html = wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">Renewing tomorrow</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;text-align:center;">${intro}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${subs.map(s => subRow(s.name, s.price, s.billingCycle)).join('')}
      ${subs.length > 1 ? totalRow('Total due tomorrow', total) : ''}
    </table>
    ${ctaButton('Open Dashboard', dashboardUrl())}
  `)

  return sendEmail(to, subject, html)
}

export async function sendWeeklySummaryEmail(
  to: string,
  data: {
    totalSubscriptions: number
    expiringThisWeek: number
    upcoming: number
    upcomingSubs: AlertSub[]
  },
) {
  const sorted = [...data.upcomingSubs].sort(
    (a, b) => a.nextBilling.getTime() - b.nextBilling.getTime(),
  )
  const weekTotal = sorted.reduce((s, sub) => s + sub.price, 0)

  // Group by readable date label
  const byDate = new Map<string, AlertSub[]>()
  for (const sub of sorted) {
    const label = sub.nextBilling.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    })
    if (!byDate.has(label)) byDate.set(label, [])
    byDate.get(label)!.push(sub)
  }

  const listSection = sorted.length > 0
    ? `
      <p style="margin:28px 0 4px;font-size:13px;font-weight:600;color:#0f172a;">Upcoming renewals</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${Array.from(byDate.entries()).map(([dateLabel, dateSubs]) => `
          <tr>
            <td colspan="2" style="padding:14px 0 2px;">
              <span style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.07em;text-transform:uppercase;">${dateLabel}</span>
            </td>
          </tr>
          ${dateSubs.map(s => subRow(s.name, s.price, s.billingCycle)).join('')}
        `).join('')}
        ${totalRow('Total this week', weekTotal)}
      </table>`
    : `<p style="margin:28px 0 0;text-align:center;font-size:14px;color:#94a3b8;">No renewals in the next 7 days.</p>`

  const html = wrap(`
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">Your Weekly Summary</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;text-align:center;">Here's what's happening with your subscriptions</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${statCard('Total subscriptions', String(data.totalSubscriptions), '#6366f1')}
        ${statCard('Expiring this week', String(data.expiringThisWeek), '#f59e0b')}
        ${statCard('Next 30 days', String(data.upcoming), '#10b981')}
      </tr>
    </table>

    ${listSection}

    ${ctaButton('Open Dashboard', dashboardUrl())}
  `)

  return sendEmail(to, 'Your weekly SubTracker summary', html)
}

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string) {
  const appUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

      <!-- Brand -->
      <tr>
        <td align="center" style="padding:0 0 20px;">
          <span style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6366f1;">SubTracker</span>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:48px 40px 40px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Icon -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <div style="display:inline-block;background:#eef2ff;width:56px;height:56px;border-radius:50%;text-align:center;line-height:56px;font-size:26px;">👋</div>
            </td></tr>
          </table>

          <!-- Title -->
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0f172a;text-align:center;line-height:1.3;">
            Welcome to SubTracker
          </h1>

          <!-- Body -->
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;text-align:center;line-height:1.7;">
            You're now ready to track your subscriptions<br>and avoid surprise charges.
          </p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center">
              <a href="${appUrl}"
                 style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;
                        text-decoration:none;padding:13px 36px;border-radius:8px;letter-spacing:0.01em;">
                Open SubTracker
              </a>
            </td></tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding:24px 0 0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
            You're receiving this because you created a SubTracker account.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>`

  return sendEmail(to, 'Welcome to SubTracker 👋', html)
}

// ─── Waitlist confirmation ────────────────────────────────────────────────────

export async function sendWaitlistConfirmation(to: string) {
  const appUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

      <!-- Brand -->
      <tr>
        <td align="center" style="padding:0 0 20px;">
          <span style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6366f1;">SubTracker</span>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:48px 40px 40px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Icon -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <div style="display:inline-block;background:#eef2ff;width:56px;height:56px;border-radius:50%;text-align:center;line-height:56px;font-size:26px;">🚀</div>
            </td></tr>
          </table>

          <!-- Title -->
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0f172a;text-align:center;line-height:1.3;">
            You're on the waitlist 🎉
          </h1>

          <!-- Body -->
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;text-align:center;line-height:1.7;">
            Thanks for joining the SubTracker Pro waitlist.<br>
            We'll let you know as soon as Pro is ready.
          </p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center">
              <a href="${appUrl}"
                 style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;
                        text-decoration:none;padding:13px 36px;border-radius:8px;letter-spacing:0.01em;">
                Visit SubTracker
              </a>
            </td></tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding:24px 0 0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
            No spam. Just one email when Pro launches.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>`

  return sendEmail(to, "You're on the SubTracker waitlist 🚀", html)
}

// ─── Verification ─────────────────────────────────────────────────────────────

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('[DEV] Resend not configured — use this link to verify:')
    console.log(verifyUrl)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return
  }

  await sendEmail(to, 'Verify your SubTracker account', wrap(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#6366f1;width:48px;height:48px;border-radius:12px;line-height:48px;font-size:22px;">✉️</div>
    </div>
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">Verify your email</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;text-align:center;">
      Click the button below to verify your email and activate your SubTracker account.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${verifyUrl}"
           style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;
                  text-decoration:none;padding:12px 32px;border-radius:8px;">
          Verify email
        </a>
      </td></tr>
    </table>
    <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;text-align:center;">
      This link expires in 24 hours. If you didn't create an account, ignore this email.
    </p>
    <p style="margin:0;font-size:11px;color:#cbd5e1;text-align:center;word-break:break-all;">
      ${verifyUrl}
    </p>
  `))
}
