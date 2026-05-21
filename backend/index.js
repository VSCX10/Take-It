const express = require('express');
const cors = require('cors'); 
const app = express();
const puerto = 3000;

app.use(cors());
app.use(express.json());

const restaurantes = [
  { id: 1,  nombre: 'Maido',             categoria: 'Nikkei',                rating: 3.5, img: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=500&q=80' },
  { id: 2,  nombre: 'Tanta',             categoria: 'Peruana',               rating: 4.6, img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80' },
  { id: 3,  nombre: 'Cala',              categoria: 'Pescados y Mariscos',   rating: 5.0, img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&q=80' },
  { id: 4,  nombre: 'Amoramar',          categoria: 'Contemporánea',         rating: 4.6, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&q=80' },
  { id: 5,  nombre: 'La Rosa Náutica',   categoria: 'Comida Internacional',  rating: 4.5, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80' },
  { id: 6,  nombre: 'Central',           categoria: 'Contemporánea',         rating: 5.0, img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&q=80' },
  { id: 7,  nombre: 'Astrid & Gastón',   categoria: 'Peruana',               rating: 4.8, img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=500&q=80' },
  { id: 8,  nombre: 'La Mar',            categoria: 'Pescados y Mariscos',   rating: 4.7, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&q=80' },
  { id: 9,  nombre: 'Osso',              categoria: 'Carnes y Parrilla',     rating: 4.9, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
  { id: 10, nombre: 'Isolina',           categoria: 'Peruana',               rating: 4.5, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80' },
  { id: 11, nombre: 'El Mercado',        categoria: 'Pescados y Mariscos',   rating: 4.4, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80' },
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