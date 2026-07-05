/**
 * PRUEBAS UNITARIAS
 *
 * 1) MesaServicio.generarSlots(horaApertura, horaCierre)
 *    Metodo puro que genera los bloques de 30 minutos. 6 casos de prueba.
 *
 * 2) Middleware verificarToken (seguridad JWT). 4 casos de prueba.
 */
jest.mock('../models/Mesa', () => ({}));
jest.mock('../models/Reserva', () => ({}));
jest.mock('../models/Restaurante', () => ({}));

const jwt = require('jsonwebtoken');
const MesaServicio = require('../services/MesaServicio');
const verificarToken = require('../middleware/verificarToken');

const servicio = new MesaServicio();
process.env.JWT_SECRET = 'secreto-de-prueba';

describe('Unitarias: generarSlots', () => {

  test('U1 - horario tipico 14:00 a 16:00 -> 4 bloques de 30 min', () => {
    expect(servicio.generarSlots('14:00', '16:00'))
      .toEqual(['14:00', '14:30', '15:00', '15:30']);
  });

  test('U2 - incluye la hora de apertura y excluye la de cierre', () => {
    const slots = servicio.generarSlots('18:00', '19:00');
    expect(slots[0]).toBe('18:00');
    expect(slots).not.toContain('19:00');
  });

  test('U3 - apertura igual al cierre -> sin bloques', () => {
    expect(servicio.generarSlots('14:00', '14:00')).toEqual([]);
  });

  test('U4 - cierre anterior a la apertura (dato invalido) -> sin bloques', () => {
    expect(servicio.generarSlots('20:00', '14:00')).toEqual([]);
  });

  test('U5 - apertura a media hora -> mantiene el paso de 30 min', () => {
    expect(servicio.generarSlots('18:30', '20:00'))
      .toEqual(['18:30', '19:00', '19:30']);
  });

  test('U6 - acepta formato TIME de PostgreSQL (con segundos)', () => {
    expect(servicio.generarSlots('14:00:00', '15:00:00'))
      .toEqual(['14:00', '14:30']);
  });
});

describe('Unitarias: middleware verificarToken', () => {

  // req/res/next simulados para probar el middleware de forma aislada
  const armarRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('T1 - sin header Authorization -> 401 y no continua', () => {
    const res = armarRes();
    const next = jest.fn();

    verificarToken({ headers: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('T2 - header sin el formato Bearer -> 401', () => {
    const res = armarRes();
    const next = jest.fn();

    verificarToken({ headers: { authorization: 'abc123' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('T3 - token invalido o adulterado -> 401', () => {
    const res = armarRes();
    const next = jest.fn();

    verificarToken({ headers: { authorization: 'Bearer token-falso' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('T4 - token valido -> continua y deja el usuario en req.usuario', () => {
    const token = jwt.sign({ id: 5, email: 'v@test.com' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = armarRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.usuario.id).toBe(5);
    expect(res.status).not.toHaveBeenCalled();
  });
});
