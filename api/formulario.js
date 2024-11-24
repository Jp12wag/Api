const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configurar CORS
app.use(cors()); // Permite todos los orígenes. Puedes limitarlo a dominios específicos.
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Definir el modelo de datos
const Formulario = mongoose.model('Formulario', new mongoose.Schema({
  nombre: String,
  email: String,
  mensaje: String
}));

// Ruta para manejar solicitudes POST
app.post('/api/formulario', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  const nuevoFormulario = new Formulario({ nombre, email, mensaje });

  try {
    await nuevoFormulario.save();
    res.status(201).send('Formulario guardado exitosamente.');
  } catch (error) {
    console.error('Error al guardar el formulario:', error);
    res.status(500).send('Error al guardar el formulario.');
  }
});

app.get('/api/formulario', async (req, res) => {
  try {
    const formularios = await Formulario.find(); // Obtiene todos los documentos de la colección
    res.status(200).json(formularios); // Envía los datos en formato JSON
  } catch (error) {
    console.error('Error al obtener los formularios:', error);
    res.status(500).send('Error al obtener los formularios.');
  }
});
// Configurar puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
