const passport = require('passport');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const AreaInteres = mongoose.model('areasInteres');



const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//verificar si el usuario esta autenticado o no
const verificarUsuario = (req, res, next) => {
    //revisar el usuario
    if(req.isAuthenticated()){
        return next(); //estan autenticados
    }
    //redireccionar
    res.redirect('/iniciar-sesion');
}


const mostrarPanel = async(req, res) => {
//consultar el usuario autenticado
    const areasInteres = await AreaInteres.find({autor: req.user._id});

    res.render('administracion', {
        nombrePagina: 'Panel de administración',
        tagline: 'Crea y administra tus rutas de aprendizaje desde aquí',
        cerrarSesion: true,
        nombre: req.user.nombre,
        areasInteres   
    })
}

const cerrarSesion = (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err); // Manejar el error si existe
        }
        req.flash('correcto', 'Cerraste sesión correctamente');
        res.redirect('/iniciar-sesion');
    });
};





module.exports = {
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario,
    cerrarSesion
}