const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { registerUser, loginUser, renewToken } = require('../controllers/auth');
const { validateForms } = require('../middlewares/validate-forms');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/register',
    [   
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener 6 o más caracteres').isLength({ min:6 }),
        validateForms
    ],
    registerUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener 6 o más caracteres').isLength({ min:6 }),
        validateForms
    ],
    loginUser
);

router.get('/renew', validateJWT, renewToken);

module.exports = router;