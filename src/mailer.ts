import nodemailer from "nodemailer";

// Создаем transporter только если есть все необходимые переменные
export const createTransporter = () => {
  const {
    SMTP_HOST, SMTP_PORT, SMTP_SECURE,
    SMTP_USER, SMTP_PASS
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP credentials are missing. Please set SMTP_USER and SMTP_PASS environment variables.");
  }

  // Таймауты и отладка можно настраивать через env переменные
  const connectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT ?? 120000); // ms
  const greetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT ?? 60000); // ms
  const socketTimeout = Number(process.env.SMTP_SOCKET_TIMEOUT ?? 120000); // ms

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: String(SMTP_SECURE ?? "true") === "true",
    connectionTimeout,
    greetingTimeout,
    socketTimeout,
    logger: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
    // При необходимости можно добавить tls: { rejectUnauthorized: false }
    // если почтовый сервер использует самоподписанные сертификаты (не рекомендовано в проде).
  });
};

// Lazy initialization - создаем transporter только когда нужно
let transporter: nodemailer.Transporter | null = null;

export const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Пример шаблона современного HTML письма
export const baseTemplate = (title: string, content: string) => `
<!doctype html>
<html>
<head>
<meta charSet="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<style>
  body{margin:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#111}
  .container{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
  .header{background:#111;color:#fff;padding:20px 24px;font-size:18px;font-weight:700}
  .content{padding:24px;font-size:14px;line-height:1.55}
  .btn{display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none}
  .muted{color:#6b7280;font-size:12px;margin-top:16px}
</style>
</head>
<body>
  <div style="padding:24px">
    <div class="container">
      <div class="header">${title}</div>
      <div class="content">
        ${content}
        <p class="muted">Если вы не запрашивали это письмо — просто игнорируйте его.</p>
      </div>
    </div>
    <p class="muted" style="text-align:center">© ${new Date().getFullYear()} Boris</p>
  </div>
</body>
</html>
`;

export async function sendEmail(
  { to, subject, html, text }:
    { to: string; subject: string; html: string; text?: string }
) {
  const { MAIL_FROM, SMTP_USER } = process.env;
  const mailerTransporter = getTransporter();
  try {
    return await mailerTransporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to,
      subject,
      html,
      text
    });
  } catch (err: any) {
    // Улучшаем читаемость ошибок, чтобы фронтенд и логи ясно видели ETIMEDOUT
    console.error('Send email error:', err);
    if (err && (err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION')) {
      const e = new Error('SMTP connection timeout or network error');
      // @ts-ignore attach code for potential upstream handlers
      e['code'] = err.code;
      throw e;
    }
    throw err;
  }
}
