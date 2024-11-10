const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/conexionFormulario', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Modelo de datos
const Formulario = mongoose.model('Formulario', new mongoose.Schema({
    nombre: String,
    email: String,
    mensaje: String
}));

// Rutas
app.post('/api/formulario', async (req, res) => {
    const { nombre, email, mensaje } = req.body;
    const nuevoFormulario = new Formulario({ nombre, email, mensaje });
    try {
        await nuevoFormulario.save();
        res.status(201).send('Formulario guardado exitosamente.');
    } catch (error) {
        res.status(500).send('Error al guardar el formulario.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
