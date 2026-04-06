import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config({quiet:true});

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export const mailOptions = (username, email) => {
  return {
    from: `"Stock Scope" <bhargavpenta@gmail.com>`,
    to: email,
    subject: "🚀 Welcome to Stock Scope – Your Stock Journey Starts Now!",
    text: `Welcome to Stock Scope!

Access stock market insights without KYC.
Start exploring stocks, IPOs, and mutual funds instantly.

Happy Investing!
Team Stock Scope`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Stock Scope</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="background:#2563eb;padding:20px;text-align:center;color:white;">
                  
                  <div style="margin-bottom:10px;">
                    <svg viewBox="0 0 20 20" fill="none" width="50" height="50" style="background:#1d4ed8;padding:10px;border-radius:10px;">
                      <polyline points="2,14 7,8 11,11 18,4" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                      <circle cx="18" cy="4" r="2" fill="white" />
                    </svg>
                  </div>

                  <h1 style="margin:0;font-size:26px;">Welcome to Stock Scope</h1>
                  <p style="margin:5px 0 0 0;font-size:14px;opacity:0.9;">
                    Access Stock Markets – No KYC Required
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                       alt="Stock Market"
                       width="100%"
                       style="display:block;">
                </td>
              </tr>

              <tr>
                <td style="padding:30px;color:#333;">
                  <h2 style="margin-top:0;">Hello ${username || "Investor"} 👋</h2>
                  
                  <p style="line-height:1.6;font-size:15px;">
                    Thank you for joining <strong>Stock Scope</strong> — your gateway to real-time stock data, IPO updates, and mutual fund insights.
                  </p>

                  <p style="line-height:1.6;font-size:15px;">
                    🚀 Explore stocks instantly<br/>
                    📊 Track live market movements<br/>
                    ⭐ Build your personal watchlist<br/>
                    🔓 No KYC required — simple & accessible
                  </p>

                  <div style="text-align:center;margin:30px 0;">
                    <a href="stock-scope-frontend-nine.vercel.app"
                       style="background:#2563eb;color:white;text-decoration:none;padding:12px 25px;border-radius:6px;font-weight:bold;display:inline-block;">
                      Start Exploring Now
                    </a>
                  </div>

                  <p style="font-size:13px;color:#666;">
                    We're excited to be part of your investing journey.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#555;">
                  © ${new Date().getFullYear()} Stock Scope<br/>
                  Empowering Everyone with Stock Market Access
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
  };
};

export const sendDailyReportOptions = (username, email, data) => {
  const appLink = "https://stock-scope-frontend-nine.vercel.app/";

  // Generate rows dynamically
  const rows = data
    .map(
      (item) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;font-weight:500;">
          ${item.symbol}
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">
         ${item.price.toLocaleString()} Points
        </td>
      </tr>
    `
    )
    .join("");

  return {
    from: `"Stock Scope" <bhargavpenta@gmail.com>`,
    to: email,
    subject: "📊 Daily Market Report - Stock Scope",

    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Daily Stock Report</title>
    </head>

    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background:#111827;color:white;padding:25px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;">📊 Stock Scope</h1>
                  <p style="margin:5px 0 0;font-size:13px;color:#9ca3af;">
                    Daily Market Summary
                  </p>
                </td>
              </tr>

              <!-- HERO IMAGE -->
              <tr>
                <td>
                  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                       width="100%"
                       style="display:block;">
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding:30px;color:#111;">
                  <h2 style="margin-top:0;">Hello ${username || "Investor"} 👋</h2>

                  <p style="font-size:15px;line-height:1.6;color:#444;">
                    Here's your daily snapshot of the market. Stay informed and make smarter investment decisions.
                  </p>

                  <!-- STOCK TABLE -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:collapse;">
                    
                    <tr style="background:#f9fafb;">
                      <th align="left" style="padding:12px;font-size:13px;color:#6b7280;">Index</th>
                      <th align="right" style="padding:12px;font-size:13px;color:#6b7280;">Price</th>
                    </tr>

                    ${rows}

                  </table>

                  <!-- CTA -->
                  <div style="text-align:center;margin:30px 0;">
                    <a href="${appLink}"
                       style="background:#2563eb;color:white;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">
                      View Full Dashboard →
                    </a>
                  </div>

                  <p style="font-size:13px;color:#6b7280;">
                    Data reflects latest available market closing values.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;">
                  © ${new Date().getFullYear()} Stock Scope <br/>
                  Built for smarter investing 🚀
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
  };
};

export default sgMail;
