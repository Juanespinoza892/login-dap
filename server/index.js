const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const verificationCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/send-code', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const code = generateCode();
  verificationCodes.set(email, {
    code,
    expires: Date.now() + 10 * 60 * 1000
  });

  const apiKey = process.env.MAILERSEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key de MailerSend no configurada' });
  }

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: {
          email: 'noreply@trial-z86org80zvy4ew13.mlsender.net',
          name: 'Control de Acceso'
        },
        to: [{
          email: email,
          name: 'Usuario'
        }],
        subject: 'Tu código de verificación',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">🏠</span>
              </div>
            </div>
            <h2 style="text-align: center; color: #1e1b4b; margin-bottom: 8px;">Código de Verificación</h2>
            <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">Usá este código para iniciar sesión en Control de Acceso</p>
            <div style="background: #f5f3ff; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${code}</span>
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 14px;">Este código expira en 10 minutos</p>
          </div>
        `,
        text: `Tu código de verificación es: ${code}. Expira en 10 minutos.`
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('MailerSend error:', response.status, errorData);
      return res.status(500).json({ error: 'Error al enviar el email' });
    }

    res.json({ success: true, message: 'Código enviado' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Error al enviar el email' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const stored = verificationCodes.get(email);

  if (!stored) {
    return res.status(400).json({ error: 'No se encontró un código para este email' });
  }

  if (Date.now() > stored.expires) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: 'El código expiró, pedí uno nuevo' });
  }

  if (stored.code !== code) {
    return res.status(400).json({ error: 'Código incorrecto' });
  }

  verificationCodes.delete(email);
  res.json({ success: true, message: 'Verificación exitosa' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
