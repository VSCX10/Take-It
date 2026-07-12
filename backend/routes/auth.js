const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');
const { enviarRecuperacion } = require('../services/CorreoServicio');

const servicio = ServicioFactory.crear('usuario');

router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password, confirmar } = req.body;

    if (!nombre || !apellido || !email || !password || !confirmar)
      return ResponseFactory.error(res, 'Todos los campos son obligatorios', 400);

    if (password !== confirmar)
      return ResponseFactory.error(res, 'Las contraseñas no coinciden', 400);

    if (password.length < 6)
      return ResponseFactory.error(res, 'La contraseña debe tener al menos 6 caracteres', 400);

    const usuarioExistente = await servicio.buscarPorEmail(email);
    if (usuarioExistente)
      return ResponseFactory.error(res, 'Este correo ya está registrado', 400);

    const nuevoUsuario = await servicio.crear({ nombre, apellido, email, telefono: telefono || '', password });

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return ResponseFactory.exito(res, {
      token,
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, apellido: nuevoUsuario.apellido, email: nuevoUsuario.email, telefono: nuevoUsuario.telefono || '' }
    }, 'Usuario registrado exitosamente', 201);

  } catch (error) {
    return ResponseFactory.error(res, 'Error al registrar usuario');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return ResponseFactory.error(res, 'Email y contraseña son obligatorios', 400);

    const usuario = await servicio.buscarPorEmail(email);
    if (!usuario)
      return ResponseFactory.error(res, 'Correo o contraseña incorrectos', 401);

    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida)
      return ResponseFactory.error(res, 'Correo o contraseña incorrectos', 401);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return ResponseFactory.exito(res, {
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, telefono: usuario.telefono || '' }
    }, 'Sesión iniciada exitosamente');

  } catch (error) {
    return ResponseFactory.error(res, 'Error al iniciar sesión');
  }
});

router.post('/recuperar', async (req, res) => {
  try {
    const { email, password, confirmar } = req.body;

    if (!email || !password || !confirmar)
      return ResponseFactory.error(res, 'Todos los campos son obligatorios', 400);

    if (password !== confirmar)
      return ResponseFactory.error(res, 'Las contraseñas no coinciden', 400);

    if (password.length < 6)
      return ResponseFactory.error(res, 'La contraseña debe tener al menos 6 caracteres', 400);

    const usuario = await servicio.buscarPorEmail(email);
    if (!usuario)
      return ResponseFactory.error(res, 'No existe una cuenta con ese correo', 404);

    // El cambio queda pendiente: se aplica recien cuando el usuario
    // escribe el codigo de 6 digitos que le llega al correo
    const hash = await bcrypt.hash(password, 10);
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expira = new Date(Date.now() + 3 * 60 * 1000);

    await servicio.guardarRecuperacion(usuario.id, codigo, hash, expira);
    await enviarRecuperacion(email, codigo);

    return ResponseFactory.exito(res, null, 'Te enviamos un código a tu correo para confirmar el cambio');

  } catch (error) {
    return ResponseFactory.error(res, 'Error al enviar el correo de recuperación');
  }
});

router.post('/restablecer', async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo)
      return ResponseFactory.error(res, 'Falta el código de verificación', 400);

    const usuario = await servicio.buscarPorEmail(email);
    if (!usuario || !usuario.codigoRecuperacion)
      return ResponseFactory.error(res, 'No hay un cambio de contraseña pendiente', 400);

    if (new Date() > usuario.recuperacionExpira)
      return ResponseFactory.error(res, 'El código expiró. Solicita uno nuevo.', 400);

    if (usuario.codigoRecuperacion !== String(codigo).trim())
      return ResponseFactory.error(res, 'Código incorrecto', 400);

    await servicio.aplicarRecuperacion(usuario);

    return ResponseFactory.exito(res, null, 'Contraseña actualizada. Ya puedes iniciar sesión.');

  } catch (error) {
    return ResponseFactory.error(res, 'Error al confirmar el cambio de contraseña');
  }
});

module.exports = router;