const {Router} = require('express');
const { check } = require('express-validator');

const { salirReunion, unirseReunion } = require('../controllers/unirse');

const { validarJWT } = require('../middleware/validate-jwt');
const { validateFields } = require('../middleware/validate-fileds');

const app = Router();

app.post('/',
  [
    validarJWT,
    check('codigo', 'La codigo es obligatorio').not().isEmpty(),
    check('contrasenia', 'La contrasenia es obligatorio').not().isEmpty(),
    validateFields
  ],
  unirseReunion
);

app.delete('/:reunion', validarJWT, salirReunion);


module.exports = app;

