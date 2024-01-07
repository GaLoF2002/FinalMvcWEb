const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
    textoPregunta: {
        type: String,
        required: true
    },
    opcionesRespuesta: {
        type: Map,
        of: String,
        required: true
    },
    respuestaCorrecta: {
        type: String,
        required: true
    },
    areaDeInteres: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AreaInteres',
        required: true
    }
});

module.exports = mongoose.model('Pregunta', preguntaSchema);
