import mongoose from 'mongoose';
import Cors from 'cors';

// Middleware para CORS
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

// Conectar a MongoDB (usando la URI de MongoDB Atlas)
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://wagneralcantara36:HFiUvmjTGf7XqJPU@cluster0.6hmqy.mongodb.net/';
mongoose.connect(mongoURI, {
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

// Middleware para manejar CORS
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

// Exportar la función que manejará las solicitudes HTTP
export default async function handler(req, res) {
  // CORS
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { nombre, email, mensaje } = req.body;

    const nuevoFormulario = new Formulario({ nombre, email, mensaje });

    try {
      await nuevoFormulario.save();
      res.status(201).send('Formulario guardado exitosamente.');
    } catch (error) {
      console.error('Error al guardar el formulario:', error);
      res.status(500).send('Error al guardar el formulario.');
    }
  } else {
    res.status(405).send('Método no permitido');
  }
}
