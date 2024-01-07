const areasInteres = require('../models/areasInteres');
const AreaInteres = require('../models/areasInteres');
const Pregunta = require('../models/preguntas');
const Usuarios = require('../models/usuarios');
const Contenido = require('../models/contenido');
const UsuarioDestacado = require('../models/usuarioDestacado');


const formularioNuevaAreaInteres = (req, res) => {
    res.render('nueva-area', {
        nombrePagina : 'Nueva Area de Interes',
        tagline: 'Llena el formulario y publica tu area de interes',
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

const agregarAreaInteres = async (req, res) => {
    const { nombre, nivelDificultad, descripcion, preguntas, contenidos } = req.body;

    const nuevaAreaInteres = new AreaInteres({
        nombre,
        nivelDificultad,
        descripcion,
        autor: req.user._id,
        preguntas: [], // Asegúrate de que tu modelo AreaInteres tenga este campo si es necesario
        contenidos: [] // Similarmente, si necesitas guardar referencias a contenidos
    });

    try {
        await nuevaAreaInteres.save();

        if (Array.isArray(preguntas)) {
            for (let p of preguntas) {
                let nuevaPregunta = new Pregunta({ ...p, areaDeInteres: nuevaAreaInteres._id });
                await nuevaPregunta.save();
                nuevaAreaInteres.preguntas.push(nuevaPregunta._id);
            }
        }

        if (contenidos) {
            for (let nivel in contenidos) {
                let nuevoContenido = new Contenido({ 
                    [nivel]: contenidos[nivel], 
                    areaDeInteres: nuevaAreaInteres._id 
                });
                await nuevoContenido.save();
                nuevaAreaInteres.contenidos.push(nuevoContenido._id); // Suponiendo que necesitas guardar estas referencias
            }
        }

        await nuevaAreaInteres.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el área de interés');
    }
};



// const mostrarAreaInteres = async (req, res, next) => {

//     const areaDeInteres = await AreaInteres.findOne({ url: req.params.url }).populate('preguntas'); // Cambio de preguntas a preguntas
//     if (!areaDeInteres) return next();
//     res.render('area', {
//         nombrePagina: areaDeInteres.nombre,
//         areaDeInteres,
//         barra: true 
//     });
// }
const mostrarAreaInteres = async (req, res, next) => {
    const areaDeInteres = await AreaInteres.findOne({ url: req.params.url }).populate('preguntas');

    if (!areaDeInteres) {
        return next();
    }

    // Obtener los usuarios destacados para esta área de interés
    const usuariosDestacados = await UsuarioDestacado.find({ areaDeInteres: areaDeInteres._id })
        .sort({ conteoRespuestasCorrectas: -1 }) // Ordenar por mayor número de respuestas correctas
        .limit(10); // Limitar a los primeros 10, por ejemplo

    res.render('area', {
        nombrePagina: areaDeInteres.nombre,
        barra : true,
        areaDeInteres,
        usuariosDestacados,
        // Otros parámetros que necesites
    });
};

const formEditarAreaInteres = async (req, res, next) => {
    const areaDeInteres = await AreaInteres.findOne({ url: req.params.url });
    if (!areaDeInteres) return next();

    res.render('editar-area', {
        nombrePagina: `Editar - ${areaDeInteres.nombre}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        areaDeInteres
    });
}

const editarAreaInteres = async (req, res) => {
    const { nombre, nivelDificultad, descripcion } = req.body; // Asume que estos son los campos en tu formulario
    const { url } = req.params; // Asume que la URL es un parámetro de la ruta

    try {
        // Encuentra y actualiza el área de interés
        await AreaInteres.findOneAndUpdate({ url }, { nombre, nivelDificultad, descripcion });

        // Redirige a la página principal o a una de confirmación
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el área de interés');
    }
};


// const agregarContenido = async (req, res) => {
//     const urlAreaInteres = req.params.url;
//     const { url, descripcion, nivel } = req.body;
//     console.log('Accediendo a agregarContenido con URL:', urlAreaInteres, 'y datos:', req.body);

//     try {
//         // Aquí necesitas obtener 'areaInteres' basado en 'urlAreaInteres'
//         const areaInteres = await AreaInteres.findOne({ url: urlAreaInteres });

//         // Si 'areaInteres' no existe, debes manejar ese caso
//         if (!areaInteres) {
//             res.status(404).send('Área de interés no encontrada');
//             return;
//         }

//         const nuevoContenido = new Contenido({ 
//             url, 
//             descripcion, 
//             nivel, 
//             areaDeInteres: areaInteres._id 
//         });

//         await nuevoContenido.save();
//         res.redirect('/administracion');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al agregar el contenido');
//     }
// };

const procesarRespuestas = async (req, res) => {
    const respuestasUsuario = req.body;
    let aciertos = 0;
    let totalPreguntas = 0;

    // Obtener el nombre del usuario del formulario
    const nombreUsuario = respuestasUsuario.nombreUsuario;
    // Eliminar el nombre del usuario del objeto de respuestas
    delete respuestasUsuario.nombreUsuario;

    // Convertir los números en letras
    const convertirRespuesta = (numero) => {
        const opciones = ['A', 'B', 'C', 'D'];
        return opciones[numero];
    };

    for (const [key, valorNumerico] of Object.entries(respuestasUsuario)) {
        if(key.startsWith('respuesta_')) {
            const preguntaId = key.split('_')[1];
            const pregunta = await Pregunta.findById(preguntaId);

            const respuestaUsuario = convertirRespuesta(valorNumerico);

            if (pregunta && pregunta.respuestaCorrecta === respuestaUsuario) {
                aciertos++;
            }
            totalPreguntas++;
        }
    }

    const porcentajeAciertos = totalPreguntas > 0 ? (aciertos / totalPreguntas) * 100 : 0;

    // Obtén el ID del área de interés de la URL
    const areaDeInteresUrl = req.params.url;
    // Encuentra el área de interés usando la URL
    const areaDeInteres = await AreaInteres.findOne({ url: areaDeInteresUrl });

    if (!areaDeInteres) {
        // Manejar el caso en que el área de interés no se encuentra
        return res.status(404).send('Área de interés no encontrada');
    }

    // Continuar con la lógica para manejar la respuesta del usuario
    // Aquí puedes agregar la lógica para actualizar o crear un UsuarioDestacado
    let usuarioDestacado = await UsuarioDestacado.findOne({ nombre: nombreUsuario, areaDeInteres: areaDeInteres._id });

        if (usuarioDestacado) {
            // Si ya existe, actualizar el conteo de respuestas correctas
            usuarioDestacado.conteoRespuestasCorrectas += aciertos;
            await usuarioDestacado.save();
        } else {
            // Si no existe, crear un nuevo registro
            usuarioDestacado = new UsuarioDestacado({
                nombre: nombreUsuario,
                areaDeInteres: areaDeInteres._id,
                conteoRespuestasCorrectas: aciertos
            });
            await usuarioDestacado.save();
        }

    // Redirige a otra página o renderiza una vista con el resultado
    res.render('resultado', { porcentajeAciertos, areaDeInteres });
};




//mostrar lo maxiomos usuairos



module.exports = {
    formularioNuevaAreaInteres,
    agregarAreaInteres,
    mostrarAreaInteres,
    formEditarAreaInteres,
    editarAreaInteres,
    procesarRespuestas
    
}
