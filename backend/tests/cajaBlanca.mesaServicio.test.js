/**
 * PRUEBA DE CAJA BLANCA — MesaServicio.disponibilidad()
 *
 * Modulo elegido porque su complejidad ciclomatica es mayor a 4
 * (ver npm run metricas). Decisiones que generan caminos:
 *   D1: restaurante existe / no existe
 *   D2: hay mesas aptas / no hay (ternario que evita la consulta de reservas)
 *   D3: bucle de reservas (0..n vueltas)
 *   D4: hora ya contada u hora nueva (|| en el acumulador)
 *   D5: quedan mesas libres / no quedan (ternario disponible)
 *   D6: Math.max evita negativos cuando hay mas reservas que mesas
 *
 * Se prueban todos los caminos con los modelos simulados (mocks),
 * sin tocar la base de datos real.
 */
jest.mock('../models/Mesa', () => ({ findAll: jest.fn() }));
jest.mock('../models/Reserva', () => ({ findAll: jest.fn() }));
jest.mock('../models/Restaurante', () => ({ findByPk: jest.fn() }));

const Mesa = require('../models/Mesa');
const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');
const MesaServicio = require('../services/MesaServicio');

const servicio = new MesaServicio();

// Restaurante de prueba: atiende de 14:00 a 15:00 (2 bloques de 30 min)
const REST = { id: 1, horaApertura: '14:00', horaCierre: '15:00' };

beforeEach(() => jest.clearAllMocks());

describe('Caja Blanca: MesaServicio.disponibilidad', () => {

  test('Camino 1 (D1 falso): el restaurante no existe -> devuelve null', async () => {
    Restaurante.findByPk.mockResolvedValue(null);

    const resultado = await servicio.disponibilidad(99, '2026-07-10', 2);

    expect(resultado).toBeNull();
    expect(Mesa.findAll).not.toHaveBeenCalled(); // no sigue ejecutando
  });

  test('Camino 2 (D2 falso): sin mesas aptas -> todos los bloques agotados y no consulta reservas', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([]); // nadie acomoda al grupo

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 8);

    expect(resultado).toEqual([
      { hora: '14:00', disponible: false, mesasLibres: 0 },
      { hora: '14:30', disponible: false, mesasLibres: 0 },
    ]);
    expect(Reserva.findAll).not.toHaveBeenCalled(); // rama corta del ternario
  });

  test('Camino 3 (D3 cero vueltas): hay mesas y ninguna reserva -> todo libre', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }]);
    Reserva.findAll.mockResolvedValue([]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado).toEqual([
      { hora: '14:00', disponible: true, mesasLibres: 2 },
      { hora: '14:30', disponible: true, mesasLibres: 2 },
    ]);
  });

  test('Camino 4 (D4 ambas ramas): dos reservas a la misma hora se acumulan', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }, { id: 12 }]);
    Reserva.findAll.mockResolvedValue([
      { hora: '14:00:00', mesaId: 10 }, // primera vez que aparece 14:00 (rama ||)
      { hora: '14:00:00', mesaId: 11 }, // hora repetida: suma sobre lo contado
    ]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado[0]).toEqual({ hora: '14:00', disponible: true, mesasLibres: 1 });
    expect(resultado[1]).toEqual({ hora: '14:30', disponible: true, mesasLibres: 3 });
  });

  test('Camino 5 (D5 falso): bloque completamente lleno -> disponible false', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }]);
    Reserva.findAll.mockResolvedValue([{ hora: '14:30:00', mesaId: 10 }]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado[1]).toEqual({ hora: '14:30', disponible: false, mesasLibres: 0 });
  });

  test('Camino 6 (D6): mas reservas que mesas no produce libres negativos', async () => {
    Restaurante.findByPk.mockResolvedValue(REST);
    Mesa.findAll.mockResolvedValue([{ id: 10 }]);
    Reserva.findAll.mockResolvedValue([
      { hora: '14:00:00', mesaId: 10 },
      { hora: '14:00:00', mesaId: 10 }, // dato inconsistente a proposito
    ]);

    const resultado = await servicio.disponibilidad(1, '2026-07-10', 2);

    expect(resultado[0].mesasLibres).toBe(0); // Math.max lo limita a 0
    expect(resultado[0].disponible).toBe(false);
  });
});

describe('Caja Blanca: MesaServicio.asignarMesa (best fit)', () => {

  test('asigna la mesa libre mas pequena que acomode al grupo', async () => {
    Mesa.findAll.mockResolvedValue([
      { id: 1, capacidad: 2 },
      { id: 2, capacidad: 4 },
      { id: 3, capacidad: 6 },
    ]);
    Reserva.findAll.mockResolvedValue([{ mesaId: 1 }]); // la de 2 esta ocupada

    const mesa = await servicio.asignarMesa(1, '2026-07-10', '20:00', 2);

    expect(mesa.id).toBe(2); // best fit: la de 4, no la de 6
  });

  test('devuelve null si no hay mesas con capacidad suficiente', async () => {
    Mesa.findAll.mockResolvedValue([]);

    const mesa = await servicio.asignarMesa(1, '2026-07-10', '20:00', 10);

    expect(mesa).toBeNull();
    expect(Reserva.findAll).not.toHaveBeenCalled();
  });

  test('devuelve null si todas las mesas aptas estan reservadas a esa hora', async () => {
    Mesa.findAll.mockResolvedValue([{ id: 1, capacidad: 2 }, { id: 2, capacidad: 4 }]);
    Reserva.findAll.mockResolvedValue([{ mesaId: 1 }, { mesaId: 2 }]);

    const mesa = await servicio.asignarMesa(1, '2026-07-10', '20:00', 2);

    expect(mesa).toBeNull();
  });
});
