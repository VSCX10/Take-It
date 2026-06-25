const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

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

    const passwordValida = usuario.compararPassword(password);
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

module.exports = router;