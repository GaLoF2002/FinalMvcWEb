const mongoose = require('mongoose');

const usuarioDestacadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    conteoRespuestasCorrectas: {
        type: Number,
        default: 0
    },
    areaDeInteres: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AreaInteres',
        required: true
    }
});

module.exports = mongoose.model('UsuarioDestacado', usuarioDestacadoSchema);
