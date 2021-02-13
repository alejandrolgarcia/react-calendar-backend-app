const { response } = require('express');
const { validationResult } = require('express-validator');

const validateForms = (req, res = response, next) => {

    // manejo de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            errors: errors.mapped()
        });
    }

    next();
}

module.exports = {
    validateForms
}