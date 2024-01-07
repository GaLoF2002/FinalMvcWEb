const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');
const pregunta = require('./preguntas.js');
const Usuarios = require('./usuarios.js');
const contenido = require('./contenido.js');


const areasInteresSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: 'El nombre del área de interés es obligatorio',
        trim: true
    },
    nivelDificultad: {
        type: String,
        required: 'El nivel de dificultad es obligatorio',
        enum: ['basico', 'intermedio', 'avanzado'] // Enumeración para los niveles de dificultad
    },
    descripcion: {
        type: String,
        required: 'La descripción es obligatoria',
        trim: true
    },
    preguntas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pregunta'
    }],
    contenidos: {
        basico: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contenido'
        },
        normal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contenido'
        },
        excelente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contenido'
        }
    },

    url: {
        type: String,
        lowercase: true
      },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es obligatorio'
    }
});

areasInteresSchema.pre('save', function(next) {
    // Crear la URL
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;
    next();
});

// Hooks para generar la URL
module.exports = mongoose.model('areasInteres', areasInteresSchema);