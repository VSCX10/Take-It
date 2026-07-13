const { Op } = require('sequelize');
const Mesa = require('../models/Mesa');
const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');

const DURACION_SLOT = 30;

class MesaServicio {
    generarSlots(horaApertura, horaCierre) {
        const aMinutos = (hora) => {
            const [h, m] = hora.split(':').map(Number);
            return h * 60 + m;
        };
        const slots = [];
        let minutos = aMinutos(horaApertura);
        const fin = aMinutos(horaCierre);
        while (minutos < fin) {
            const h = String(Math.floor(minutos / 60)).padStart(2, '0');
            const m = String(minutos % 60).padStart(2, '0');
            slots.push(`${h}:${m}`);
            minutos += DURACION_SLOT;
        }
        return slots;
    }

    async disponibilidad(restauranteId, fecha, personas) {
        const restaurante = await Restaurante.findByPk(restauranteId);
        if (!restaurante) return null;

        const mesasAptas = await Mesa.findAll({
            where: { restauranteId, capacidad: { [Op.gte]: personas } }
        });
        const totalAptas = mesasAptas.length;
        const idsAptas = mesasAptas.map((m) => m.id);

        const reservas = idsAptas.length
            ? await Reserva.findAll({
                where: {
                    restauranteId,
                    fecha,
                    estado: { [Op.ne]: 'cancelada' },
                    mesaId: { [Op.in]: idsAptas }
                }
            })
            : [];

        const ocupadasPorHora = {};
        for (const r of reservas) {
            const hora = r.hora.slice(0, 5);
            ocupadasPorHora[hora] = (ocupadasPorHora[hora] || 0) + 1;
        }

        const slots = this.generarSlots(restaurante.horaApertura, restaurante.horaCierre);
        return slots.map((hora) => {
            const ocupadas = ocupadasPorHora[hora] || 0;
            const libres = Math.max(totalAptas - ocupadas, 0);
            return { hora, disponible: libres > 0, mesasLibres: libres };
        });
    }

    async asignarMesa(restauranteId, fecha, hora, personas) {
        const mesasAptas = await Mesa.findAll({
            where: { restauranteId, capacidad: { [Op.gte]: personas } },
            order: [['capacidad', 'ASC']]
        });
        if (mesasAptas.length === 0) return null;

        const ocupadas = await Reserva.findAll({
            where: {
                restauranteId,
                fecha,
                hora,
                estado: { [Op.ne]: 'cancelada' },
                mesaId: { [Op.in]: mesasAptas.map((m) => m.id) }
            }
        });
        const idsOcupadas = new Set(ocupadas.map((r) => r.mesaId));
        return mesasAptas.find((m) => !idsOcupadas.has(m.id)) || null;
    }
}

module.exports = MesaServicio;
