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

    // La nueva contraseña viaja ya hasheada dentro del token y el cambio
    // recien se aplica cuando el usuario confirma desde su correo.
    // Se firma con la contraseña actual: al aplicarse queda invalidado (un solo uso).
    const hash = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      { id: usuario.id, hash },
      process.env.JWT_SECRET + usuario.password,
      { expiresIn: '3m' }
    );

    const origen = req.headers.origin || 'http://localhost:5173';
    await enviarRecuperacion(email, `${origen}/restablecer?token=${token}`);

    return ResponseFactory.exito(res, null, 'Te enviamos un correo para confirmar el cambio de contraseña');

  } catch (error) {
    return ResponseFactory.error(res, 'Error al enviar el correo de recuperación');
  }
});

router.post('/restablecer', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return ResponseFactory.error(res, 'El enlace no es válido', 400);

    const datos = jwt.decode(token);
    const usuario = datos && await servicio.buscarPorId(datos.id);
    if (!usuario)
      return ResponseFactory.error(res, 'El enlace no es válido', 400);

    try {
      jwt.verify(token, process.env.JWT_SECRET + usuario.password);
    } catch {
      return ResponseFactory.error(res, 'El enlace expiró o ya fue usado. Solicita uno nuevo.', 400);
    }

    await servicio.confirmarPassword(usuario.id, datos.hash);

    return ResponseFactory.exito(res, null, 'Contraseña actualizada. Ya puedes iniciar sesión.');

  } catch (error) {
    return ResponseFactory.error(res, 'Error al confirmar el cambio de contraseña');
  }
});

module.exports = router;