const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// ============================================
// REGISTRO
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password, confirmar } = req.body;

    
    if (!nombre || !apellido || !email || !password || !confirmar) {
        return res.status(400).json({ 
        ok: false, 
        mensaje: 'Todos los campos son obligatorios' 
        });
    }

    if (password !== confirmar) {
        return res.status(400).json({ 
        ok: false, 
        mensaje: 'Las contraseñas no coinciden' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
        ok: false, 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Este correo ya está registrado' 
      });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      telefono: telefono || '',
      password
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, email: nuevoUsuario.email },
      process.env.JWT_SECRET || 'tu_secreto_aqui',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al registrar usuario',
      error: error.message 
    });
  }
});

// ============================================
// LOGIN
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Email y contraseña son obligatorios' 
      });
    }

    
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Correo o contraseña incorrectos' 
      });
    }

    
    const passwordValida = await usuario.compararPassword(password);

    if (!passwordValida) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Correo o contraseña incorrectos' 
      });
    }

    
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'tu_secreto_aqui',
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      mensaje: 'Sesión iniciada exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al iniciar sesión',
      error: error.message 
    });
  }
});

module.exports = router;