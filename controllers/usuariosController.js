const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { validationResult } = require('express-validator');

const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta en DevJobs',
        tagline: 'Comienza a publicar tus rutas de aprendizaje, solo debes crear una cuenta'
    })
}

const validarRegistro = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        return res.render('crear-cuenta', {
            nombrePagina: 'Crear cuenta en DevJobs',
            tagline: 'Comienza a publicar tus rutas de aprendizaje, solo debes crear una cuenta',
            mensajes: req.flash()
        });
    }
    next();
};


const crearUsuario = async (req, res, next) => {
    const usuario = new Usuarios(req.body);
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }   
}

const formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesión en RealPwolrd'
    })  
}

const formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en RealPwolrd',
        usuario: req.user,
        cerrarSesion: true,
        nombre : req.user.nombre
        
    })
}

//guradar cambios editar perfil

const editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password;
    }

    await usuario.save();

    req.flash('correcto', 'Cambios guardados correctamente');   
    res.redirect('/administracion');


};

module.exports = {
    editarPerfil
};




module.exports = {
    formCrearCuenta,
    crearUsuario,
    validarRegistro,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil
}