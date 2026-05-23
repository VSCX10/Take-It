const express = require('express');
const cors = require('cors'); 
const app = express();
const puerto = 3000;

app.use(cors());
app.use(express.json());

const restaurantes = [
    { id: 1, nombre: 'Maido', categoria: 'Nikkei', rating: 4.9, img: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=500&q=80' },
    { id: 2, nombre: 'Tanta', categoria: 'Peruana', rating: 4.6, img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80' },
    { id: 3, nombre: 'Cala', categoria: 'Pescados y Mariscos', rating: 4.8, img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&q=80' },
    { id: 4, nombre: 'Amoramar', categoria: 'Contemporánea', rating: 4.9, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&q=80' }
];

const menus = {
    1: [
        {
            id: 1,
            nombre: 'Sushi Acevichado',
            descripcion: 'Roll nikkei con salsa acevichada.',
            precio: 42.90,
            imagen: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80'
        },
        {
            id: 2,
            nombre: 'Lomo Saltado Nikkei',
            descripcion: 'Fusión peruano japonesa.',
            precio: 48.50,
            imagen: 'https://images.unsplash.com/photo-1604908177522-402f0a2f3d90?w=500&q=80'
        }
    ],

    4: [
        {
            id: 1,
            nombre: 'Ceviche Clásico',
            descripcion: 'Pescado fresco con limón y ají.',
            precio: 38.90,
            imagen: 'https://images.unsplash.com/photo-1604908176997-4317b7f2c7c2?w=500&q=80'
        },
        {
            id: 2,
            nombre: 'Arroz con Mariscos',
            descripcion: 'Arroz cremoso con mix de mariscos.',
            precio: 45.50,
            imagen: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500&q=80'
        },
        {
            id: 3,
            nombre: 'Pulpo a la Parrilla',
            descripcion: 'Pulpo grillado con papas crocantes.',
            precio: 52.00,
            imagen: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&q=80'
        },
        {
            id: 4,
            nombre: 'Tiradito Amarillo',
            descripcion: 'Pescado fresco en crema de ají amarillo.',
            precio: 41.90,
            imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80'
        }
    ]
};

app.get('/api/restaurantes', (req, res) => {
    res.json(restaurantes);
});

app.get('/api/restaurantes/:id/menu', (req, res) => {
    const id = parseInt(req.params.id);
    const menu = menus[id];
    if (!menu) {
        return res.status(404).json({
            mensaje: 'Menú no encontrado'
        });
    }
    res.json(menu);
});

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Backend funcionando al 100% en Ubuntu!' });
});


app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});