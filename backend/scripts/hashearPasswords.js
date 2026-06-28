const sequelize = require('../database');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

(async () => {
  try {
    const usuarios = await Usuario.findAll();
    let migradas = 0;

    for (const u of usuarios) {
      if (!u.password.startsWith('$2')) {
        const hash = await bcrypt.hash(u.password, 10);
        await Usuario.update({ password: hash }, { where: { id: u.id }, hooks: false });
        migradas++;
      }
    }

    console.log(`Contrasenas migradas a hash: ${migradas} (de ${usuarios.length} usuarios)`);
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sequelize.close();
  }
})();
