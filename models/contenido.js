const mongoose = require('mongoose');

const contenidoSchema = new mongoose.Schema({
    basico: {
        url: {
            type: String,
            required: 'La URL del contenido básico es obligatoria',
            trim: true
        },
        descripcion: {
            type: String,
            required: 'La descripción del contenido básico es obligatoria',
            trim: true
        }
    },
    normal: {
        url: {
            type: String,
            required: 'La URL del contenido normal es obligatoria',
            trim: true
        },
        descripcion: {
            type: String,
            required: 'La descripción del contenido normal es obligatoria',
            trim: true
        }
    },
    excelente: {
        url: {
            type: String,
            required: 'La URL del contenido excelente es obligatoria',
            trim: true
        },
        descripcion: {
            type: String,
            required: 'La descripción del contenido excelente es obligatoria',
            trim: true
        }
    },
    areaDeInteres: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'areasInteres',
        required: 'La referencia al área de interés es obligatoria'
    }
});

module.exports = mongoose.model('Contenido', contenidoSchema);