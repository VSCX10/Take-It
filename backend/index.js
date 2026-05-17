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


app.get('/api/restaurantes', (req, res) => {
    res.json(restaurantes);
});


app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Backend funcionando al 100% en Ubuntu!' });
});


app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});