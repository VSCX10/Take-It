const nodemailer = require('nodemailer');

// Envia el correo con el enlace para restablecer la contraseña.
// Si no hay credenciales configuradas (EMAIL_USER / EMAIL_PASS),
// imprime el enlace en consola para poder probar en desarrollo.
async function enviarRecuperacion(destinatario, enlace) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Enlace de recuperacion (modo desarrollo):', enlace);
        return;
    }

    const transporte = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporte.sendMail({
        from: `"Take&It" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: 'Confirma el cambio de tu contraseña — Take&It',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1714;">Take<span style="color: #c2440e;">&</span>It</h2>
            <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
            <p>Si fuiste tú, confirma el cambio con el botón. El enlace vence en <b>15 minutos</b> y solo puede usarse una vez.</p>
            <a href="${enlace}"
               style="display: inline-block; margin: 16px 0; padding: 12px 28px; background: #c2440e; color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold;">
              Sí, cambiar mi contraseña
            </a>
            <p style="color: #9a958e; font-size: 13px;">Si no fuiste tú, ignora este correo y tu contraseña seguirá igual.</p>
          </div>
        `,
    });
}

module.exports = { enviarRecuperacion };
