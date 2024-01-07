const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const areasController = require('../controllers/areasController.js');
const usuariosController = require('../controllers/usuariosController.js');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController.js');





router.get('/', homeController.mostrarTrabajos);

//crear areas de interes
router.get('/areasInteres/nueva', authController.verificarUsuario,
 areasController.formularioNuevaAreaInteres);

router.post('/areasInteres/nueva', authController.verificarUsuario,
 areasController.agregarAreaInteres);

router.get('/areasInteres/:url', areasController.mostrarAreaInteres);

//editar areas de interes
router.get('/areasInteres/editar/:url', authController.verificarUsuario,
areasController.formEditarAreaInteres);
router.post('/areasInteres/editar/:url', authController.verificarUsuario,
areasController.editarAreaInteres);
router.post('/areasInteres/responder/:url', areasController.procesarRespuestas);

// Ruta para procesar el formulario de agregar contenido




//crear cuentas  
router.get('/crear-cuenta',usuariosController.formCrearCuenta);
router.post('/crear-cuenta', 
    [
        body('nombre').trim().escape().notEmpty().withMessage('El nombre es obligatorio'),
        body('email').trim().escape().isEmail().withMessage('El email debe ser valido'),
        body('password').trim().escape().notEmpty().withMessage('El password no puede ir vacio'),
        body('confirmar').trim().escape().notEmpty().withMessage('Confirmar password no puede ir vacio')
          .custom((value, { req }) => {
              if (value !== req.body.password) {
                  throw new Error('El password es diferente');
              }
              return true;
          })
    ],
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
);

//iniciar sesion
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);
//cerrar sesion
router.get('/cerrar-sesion', authController.verificarUsuario,
authController.cerrarSesion);


//panel de administracion
router.get('/administracion',authController.verificarUsuario,
authController.mostrarPanel);

//editar perfil
router.get('/editar-perfil',authController.verificarUsuario,
usuariosController.formEditarPerfil);

router.post('/editar-perfil',authController.verificarUsuario,
usuariosController.editarPerfil);

//respondeer preguntas de areas de interes


module.exports = router;