const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

    // x-token headers
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            status: false,
            msg: 'No hay un token en la petición'
        });
    }

    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            status: false,
            msg: 'Token no válido'
        });
    }

    console.log(token);
    next();

}

module.exports = {
    validateJWT
}