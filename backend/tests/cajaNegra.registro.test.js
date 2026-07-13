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

const DATOS = {
  nombre: 'Victor',
  apellido: 'Sevillano',
  email: 'victor@test.com',
  telefono: '987654321',
  password: 'Clave123',
  confirmar: 'Clave123',
};

beforeEach(() => {
  jest.clearAllMocks();
  Usuario.findOne.mockResolvedValue(null);
  Usuario.create.mockResolvedValue({ id: 1, ...DATOS });
});

describe('registro de usuario', () => {

  test('con todos los campos correctos registra y devuelve token', async () => {
    const res = await request(app).post('/api/auth/register').send(DATOS);

    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
  });

  test('si falta un campo obligatorio responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...DATOS, nombre: '' });

    expect(res.status).toBe(400);
  });

  test('si las contrasenas no coinciden responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...DATOS, confirmar: 'otra' });

    expect(res.status).toBe(400);
  });

  test('si la contrasena tiene menos de 6 caracteres responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...DATOS, password: 'abc12', confirmar: 'abc12' });

    expect(res.status).toBe(400);
  });

  test('si el correo ya esta registrado responde 400', async () => {
    Usuario.findOne.mockResolvedValue({ id: 7 });

    const res = await request(app).post('/api/auth/register').send(DATOS);

    expect(res.status).toBe(400);
  });
});
