const {Router} = require('express');
const { check } = require('express-validator');
const { crearReunion, eliminarReunion, obtenerReunion, obtenerTodasReuniones, cargarDiagram, guardarDiagram } = require('../controllers/reunion');
const { validarJWT } = require('../middleware/validate-jwt');
const { validateFields } = require('../middleware/validate-fileds');
const app = Router();
app.post('/',
  [
    validarJWT,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('contrasenia', 'La contraseña es obligatorio').not().isEmpty(),
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    validateFields
  ],
  crearReunion
);
app.delete('/:id', validarJWT, eliminarReunion);
app.get('/', validarJWT, obtenerTodasReuniones);
app.get('/:id', validarJWT, obtenerReunion);
app.post('/guardarDiagrama', 
  [
    validarJWT,
    check('reunion','La reunion de la reunion es invalida').not().not().isEmpty(),
    check('diagrama','El diagrama es obligatorio').not().isEmpty(),
    validateFields
  ],
  guardarDiagram
);
app.get('/cargarDiagrama/:id', 
  validarJWT,
  cargarDiagram
);
module.exports = app;

