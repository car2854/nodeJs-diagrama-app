const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { login, renewToken } = require('../controllers/autenticacion');
const { validarJWT } = require('../middleware/validate-jwt');

router.post('/login', login);
router.get('/renew',validarJWT ,renewToken);

module.exports = router;