const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, obtenerUsuarioReunion } = require('../controllers/usuario');
const { validateFields } = require('../middleware/validate-fileds');
const { validarJWT } = require('../middleware/validate-jwt');

const router = Router();

router.post('/',
  [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    validateFields
  ] ,
  createUser
);

router.get('/usuariosReuniones/:reunion', obtenerUsuarioReunion);

module.exports = router;