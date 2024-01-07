const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const usuariosSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    token: String,
    expira: Date,

});
    

//metodo para hashear los password
usuariosSchema.pre('save', async function(next){
    //si el password ya esta hasheado
    if(!this.isModified('password')){
        return next();
    }
    //si no esta hasheado
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next(); 
});

//enviar alerta cuando un usuario ya esta registrado
usuariosSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Ese correo ya está registrado'));
    } else {
        next(error);
    }
});


//autenticar usuarios
usuariosSchema.methods = {
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);