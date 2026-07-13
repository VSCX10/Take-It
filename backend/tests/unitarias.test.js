jest.mock('../models/Mesa', () => ({}));
jest.mock('../models/Reserva', () => ({}));
jest.mock('../models/Restaurante', () => ({}));

const MesaServicio = require('../services/MesaServicio');

const servicio = new MesaServicio();

describe('generarSlots', () => {

  test('genera bloques de 30 minutos entre apertura y cierre', () => {
    expect(servicio.generarSlots('14:00', '16:00'))
      .toEqual(['14:00', '14:30', '15:00', '15:30']);
  });

  test('incluye la hora de apertura pero no la de cierre', () => {
    const slots = servicio.generarSlots('18:00', '19:00');

    expect(slots[0]).toBe('18:00');
    expect(slots).not.toContain('19:00');
  });

  test('si la apertura es igual al cierre no hay bloques', () => {
    expect(servicio.generarSlots('14:00', '14:00')).toEqual([]);
  });

  test('acepta el formato con segundos que devuelve PostgreSQL', () => {
    expect(servicio.generarSlots('14:00:00', '15:00:00'))
      .toEqual(['14:00', '14:30']);
  });
});
