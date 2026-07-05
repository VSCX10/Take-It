/**
 * PRUEBA DE CAJA NEGRA — POST /api/auth/register
 *
 * Funcionalidad con mas de 4 campos de entrada:
 *   nombre, apellido, email, telefono (opcional), password, confirmar (6 campos).
 *
 * Se prueba solo entrada -> salida (clases de equivalencia y valores limite),
 * sin conocer la implementacion interna. La base de datos se simula.
 */
jest.mock('../models/Usuario', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const Usuario = require('../models/Usuario');

process.env.JWT_SECRET = 'secreto-de-prueba';

const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

// Entrada valida de referencia (se altera campo por campo en cada caso)
const VALIDO = {
  nombre: 'Victor',
  apellido: 'Sevillano',
  email: 'victor@test.com',
  telefono: '+51 987654321',
  password: 'Clave123',
  confirmar: 'Clave123',
};

beforeEach(() => {
  jest.clearAllMocks();
  Usuario.findOne.mockResolvedValue(null); // por defecto el correo esta libre
  Usuario.create.mockResolvedValue({ id: 1, ...VALIDO });
});

describe('Caja Negra: registro de usuario', () => {

  test('CN1 - clase valida: todos los campos correctos -> 201 con token y usuario', async () => {
    const res = await request(app).post('/api/auth/register').send(VALIDO);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.usuario.email).toBe(VALIDO.email);
  });

  test('CN2 - telefono es opcional: sin telefono tambien registra -> 201', async () => {
    const { telefono, ...sinTelefono } = VALIDO;
    const res = await request(app).post('/api/auth/register').send(sinTelefono);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });

  test('CN3 - clase invalida: falta un campo obligatorio (nombre) -> 400', async () => {
    const { nombre, ...sinNombre } = VALIDO;
    const res = await request(app).post('/api/auth/register').send(sinNombre);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test('CN4 - clase invalida: las contrasenas no coinciden -> 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALIDO, confirmar: 'OtraClave99' });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/no coinciden/i);
  });

  test('CN5 - valor limite: contrasena de 5 caracteres (menor al minimo de 6) -> 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALIDO, password: 'Ab123', confirmar: 'Ab123' });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/6 caracteres/i);
  });

  test('CN6 - valor limite: contrasena de exactamente 6 caracteres -> 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALIDO, password: 'Abc123', confirmar: 'Abc123' });

    expect(res.status).toBe(201);
  });

  test('CN7 - clase invalida: el correo ya esta registrado -> 400', async () => {
    Usuario.findOne.mockResolvedValue({ id: 7, email: VALIDO.email }); // ya existe

    const res = await request(app).post('/api/auth/register').send(VALIDO);

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/ya está registrado/i);
  });

  test('CN8 - cuerpo vacio: ningun campo enviado -> 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});
