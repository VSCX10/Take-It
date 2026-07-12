// Prueba de caja blanca sobre MesaServicio.disponibilidad
// (complejidad ciclomatica 5, ver npm run metricas).
// Se simulan los modelos para no tocar la base de datos real.
jest.mock('../models/Mesa', () => ({ findAll: jest.fn() }));
jest.mock('../models/Reserva', () => ({ findAll: jest.fn() }));
jest.mock('../models/Restaurante', () => ({ findByPk: jest.fn() }));

const Mesa = require('../models/Mesa');
const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');
const MesaServicio = require('../services/MesaServicio');

const servicio = new MesaServicio();

// restaurante de prueba que atiende de 14:00 a 15:00 (2 bloques)
const REST = { id: 1, horaApertura: '14:00', horaCierre: '15:00' };

beforeEach(() => jest.clearAllMocks());

describe('disponibilidad de mesas', () => {

  test('si el restaurante no existe devuelve null', async () => {
    Restaurante.findByPk.mockResolvedValue(null);

    const resultado = await servicio.disponibilidad(99, '2026-07-10', 2);

    expect(resultado).toBeNull();
  });

  test('sin mesas para ese grupo, todos los bloques salen agotados', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 8);

    expect(resultado[0]).toEqual({ hora: '14:00', disponible: false, mesasLibres: 0 });
  });

  test('con mesas y sin reservas, todos los bloques quedan libres', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }]);
    Reserva.findAll.mockResolvedValue([]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado).toEqual([
      { hora: '14:00', disponible: true, mesasLibres: 2 },
      { hora: '14:30', disponible: true, mesasLibres: 2 },
    ]);
  });

  test('las reservas de una hora descuentan mesas solo en ese bloque', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }]);
    Reserva.findAll.mockResolvedValue([{ hora: '14:00:00', mesaId: 10 }]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado[0].mesasLibres).toBe(1);
    expect(resultado[1].mesasLibres).toBe(2);
  });

  test('cuando todas las mesas del bloque estan reservadas, sale como no disponible', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }]);
    Reserva.findAll.mockResolvedValue([{ hora: '14:30:00', mesaId: 10 }]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado[1]).toEqual({ hora: '14:30', disponible: false, mesasLibres: 0 });
  });
});
