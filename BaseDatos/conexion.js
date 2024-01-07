const moongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });


moongoose.connect(process.env.DATABASE);

moongoose.connection.on('error', (error) => {
    console.log(error);
});

// Importar los modelos
require('../models/usuarios.js');
require('../models/areasInteres.js');
require('../models/preguntas.js');
require('../models/contenido.js');
require('../models/usuarioDestacado.js');


