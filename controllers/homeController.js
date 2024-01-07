const mongoose = require('mongoose');
const AreaInteres = mongoose.model('areasInteres'); // Asegúrate de que el nombre del modelo sea correcto

const mostrarTrabajos = async (req, res, next) => {
    try {
        const areasDeInteres = await AreaInteres.find(); // Usa un nombre diferente para el resultado de la consulta

        res.render('home', {
            nombrePagina: 'realPWorld',
            tagline: 'Encuentra tu futura y vias para aprender a programar',
            barra: true,
            boton: true,
            areasInteres: areasDeInteres // Pasa el resultado de la consulta a la vista
        });
    } catch (error) {
        console.error(error);
        return next(); // Manejo de errores
    }
}

module.exports = {  
    mostrarTrabajos
}
