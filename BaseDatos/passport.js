
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
  
        const usuario = await Usuarios.findOne({ email });
        // Verificar si el usuario existe
        if (!usuario) 
            return done(null, false, { message: 'Usuario no existente' });
        

        // Verificar la contraseña
        const verificarPass = await usuario.compararPassword(password);
        if (!verificarPass) {
            
            return done(null, false, { message: 'Password incorrecto' });
        }

        // Usuario autenticado con éxito
        return done(null, usuario);

}));

// Serialización y deserialización de usuario (si aún no lo has implementado)
passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
});

passport.deserializeUser(async(id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario);
    }
);

     
module.exports = passport;
