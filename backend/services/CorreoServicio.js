const nodemailer = require('nodemailer');

// Envia el codigo de verificacion para confirmar el cambio de contraseña.
// Sin enlaces: los correos con solo un codigo casi nunca caen en spam.
// Si no hay credenciales (EMAIL_USER / EMAIL_PASS), imprime el codigo
// en consola para poder probar en desarrollo.
async function enviarRecuperacion(destinatario, codigo) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Codigo de recuperacion (modo desarrollo):', codigo);
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
        subject: `${codigo} es tu código de verificación — Take&It`,
        text: `Tu código para confirmar el cambio de contraseña es: ${codigo}\n\nEscríbelo en la página de recuperación. Vence en 3 minutos.\n\nSi no fuiste tú, ignora este correo y tu contraseña seguirá igual.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1714;">Take<span style="color: #c2440e;">&</span>It</h2>
            <p>Tu código para confirmar el cambio de contraseña es:</p>
            <p style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #c2440e; margin: 16px 0;">${codigo}</p>
            <p>Escríbelo en la página de recuperación. Vence en <b>3 minutos</b>.</p>
            <p style="color: #9a958e; font-size: 13px;">Si no fuiste tú, ignora este correo y tu contraseña seguirá igual.</p>
          </div>
        `,
    });
}

module.exports = { enviarRecuperacion };
