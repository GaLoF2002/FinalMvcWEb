const mongoose = require('mongoose');
const express = require('express');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash');
// Importa el modelo Usuarios aquí (si es necesario en otras partes del código)

// Conexión a la base de datos
require('./BaseDatos/conexion.js');

const passport = require('./BaseDatos/passport.js');

// Configuración de la aplicación Express
const app = express();
// Configuración del body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cargar variables de entorno
require('dotenv').config({ path: 'variables.env' });

// Configuración de sesiones
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE })
}));

// Configuración de passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Configuración de connect-flash
app.use(flash());

// Middleware para pasar mensajes flash a locals
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

// Otros middleware y rutas van aquí...

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    res.locals.error = err.message; // Guarda solo el mensaje de error
    res.status(err.status || 500);
    res.render('error'); // Renderiza una vista de error
});

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'layout',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        tipoNivelDificultad: function(valorActual, opcionValor) {
            return valorActual === opcionValor ? 'selected' : '';
        },
        mostrarAlertas: (errores = {}) => {
            let html = '';
            const categorias = Object.keys(errores);
    
            categorias.forEach(categoria => {
                errores[categoria].forEach(error => {
                    html += `<div class="${categoria} alerta">${error}</div>`;
                });
            });
    
            return new Handlebars.SafeString(html);
        },
        lt: (a, b) => a < b // Helper 'lt' agregado aquí
    }
}));
app.set('view engine', 'handlebars');

// Configuración de rutas
const router = require('./routes/index.js');
app.use('/', router);

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(process.env.Puerto, () => {
    console.log(`Server is running on port ${process.env.Puerto}`);
});

//guardar un array de usuarios con nombre que hayan respondido mejor las preguntas y cuantas veces de un area de interes en el modelo de areas de interes