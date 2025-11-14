import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { name, email, message, recaptchaToken } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // ---- VALIDAR RECAPTCHA ----
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaJson = await recaptchaRes.json();

    if (!recaptchaJson.success) {
      return res.status(400).json({ error: "Falha no reCAPTCHA" });
    }

    // ----- ENVIO DO EMAIL -----
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Site Top Engenharia" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `Contato pelo site — ${name}`,
      html: `
        <h3>Novo contato recebido</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro send-email:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
