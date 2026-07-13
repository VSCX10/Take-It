const Mesa = require('../models/Mesa');
const Restaurante = require('../models/Restaurante');

const PLANTILLA = [
    { capacidad: 2, cantidad: 4 },
    { capacidad: 4, cantidad: 3 },
    { capacidad: 6, cantidad: 2 },
];

async function seedMesas() {
    const restaurantes = await Restaurante.findAll();

    for (const restaurante of restaurantes) {
        const existentes = await Mesa.count({ where: { restauranteId: restaurante.id } });
        if (existentes > 0) continue;

        const mesas = [];
        let n = 1;
        for (const tipo of PLANTILLA) {
            for (let i = 0; i < tipo.cantidad; i++) {
                mesas.push({
                    restauranteId: restaurante.id,
                    capacidad: tipo.capacidad,
                    codigo: `M${n++}`
                });
            }
        }
        await Mesa.bulkCreate(mesas);
        console.log(`${mesas.length} mesas creadas para ${restaurante.nombre}`);
    }
}

module.exports = seedMesas;
