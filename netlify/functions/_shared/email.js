// Uses Resend REST API directly via fetch (Node 18+ built-in)
// Avoids ESM/CJS compatibility issues with the resend npm package

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'IET CSBS Portal <noreply@ietdavv.edu.in>';
const PORTAL_URL =
  process.env.PORTAL_URL ||
  'https://iet-csbs.netlify.app/management-portal/login';

function getRoleLabel(role) {
  switch (role) {
    case 'admin':  return 'Administrator';
    case 'editor': return 'Editor';
    case 'viewer': return 'Viewer';
    default:       return role;
  }
}

function getRoleBadgeColor(role) {
  switch (role) {
    case 'admin':  return '#ef4444';
    case 'editor': return '#f59e0b';
    case 'viewer': return '#3b82f6';
    default:       return '#6b7280';
  }
}

function buildWelcomeEmailHtml({ full_name, email, password, role, portal_url }) {
  const roleLabel = getRoleLabel(role);
  const roleBadgeColor = getRoleBadgeColor(role);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to IET CSBS Management Portal</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:40px 48px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:16px;margin:0 auto 16px;display:table-cell;text-align:center;vertical-align:middle;font-size:28px;">&#127891;</div>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">IET CSBS Department</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Management Portal Access</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;font-weight:700;">Welcome, ${full_name}!</h2>
              <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;">
                Your account has been successfully created for the
                <strong style="color:#1e3a5f;">IET CSBS Management Portal</strong>.
                You can now log in using the credentials provided below.
              </p>

              <!-- Role Badge -->
              <div style="margin-bottom:28px;">
                <span style="display:inline-block;background:${roleBadgeColor};color:#ffffff;font-size:12px;font-weight:600;padding:4px 14px;border-radius:20px;letter-spacing:0.8px;text-transform:uppercase;">
                  ${roleLabel}
                </span>
              </div>

              <!-- Credentials Card -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="margin:0 0 16px;color:#334155;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your Login Credentials</p>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                      <span style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:4px;">Email Address</span>
                      <span style="color:#0f172a;font-size:15px;font-weight:500;">${email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;">
                      <span style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:6px;">Temporary Password</span>
                      <code style="display:inline-block;background:#1e293b;color:#f8fafc;font-size:15px;font-weight:600;letter-spacing:3px;padding:10px 18px;border-radius:8px;font-family:'Courier New',Courier,monospace;">${password}</code>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Security Notice -->
              <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin-bottom:32px;">
                <p style="margin:0;color:#78350f;font-size:13px;line-height:1.6;">
                  <strong>Security Notice:</strong> Please change your password immediately after your first login.
                  Never share your credentials with anyone.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${portal_url}"
                   style="display:inline-block;background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                  Login to Portal &rarr;
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />

              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;text-align:center;">
                If you did not expect this email or believe it was sent in error,<br/>
                please contact your administrator immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 48px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
                &copy; ${year} IET DAVV &mdash; Computer Science &amp; Business Studies Department<br />
                This is an automated message. Please do not reply to this email.
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

/**
 * Send a welcome email to a newly created portal user.
 * Returns { success: boolean, error?: string }.
 * Never throws — failures are logged and returned gracefully.
 */
async function sendWelcomeEmail({ full_name, email, password, role }) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_your_api_key_here') {
      return { success: false, error: 'RESEND_API_KEY is not configured' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Welcome to IET CSBS Management Portal — Your Credentials',
        html: buildWelcomeEmailHtml({ full_name, email, password, role, portal_url: PORTAL_URL }),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Email] Resend API error:', result);
      return { success: false, error: result.message || JSON.stringify(result) };
    }

    console.log(`[Email] Welcome email sent to ${email}, id: ${result.id}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] Service error:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { sendWelcomeEmail };
