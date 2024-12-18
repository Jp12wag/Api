const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configurar CORS
app.use(cors()); // Permite todos los orígenes. Puedes limitarlo a dominios específicos.
app.use(express.json());
const corsOptions = {
  origin: '*',  // Permite todos los orígenes
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],  // Asegúrate de permitir DELETE
  allowedHeaders: ['Content-Type', 'Authorization'],  // Permite los encabezados necesarios
  preflightContinue: false,  // No pasar a la siguiente middleware
  optionsSuccessStatus: 204, // Asegura que el servidor responda con un código exitoso para OPTIONS
};
// Configura CORS con las opciones
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://wagneralcantara36:HFiUvmjTGf7XqJPU@cluster0.6hmqy.mongodb.net/", {
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

app.delete('/api/formulario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Formulario.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).send('Formulario eliminado exitosamente.');
    } else {
      res.status(404).send('Formulario no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el formulario:', error);
    res.status(500).send('Error al eliminar el formulario.');
  }
});


// Configurar puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
