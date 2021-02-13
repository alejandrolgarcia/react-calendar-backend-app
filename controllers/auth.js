const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                status: false,
                msg: 'Ya existe un usuario registrado con el correo ' + email
            });
        }

        user = new User(req.body);

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({
            status: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Por favor comuniquese con su administrador.',
        });
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                msg: 'Usuario o password incorrecto.'
            });
        }

        // Confirmacion de passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                status: false,
                msg: 'Usuario o password incorrecto.'
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            status: true,
            uid: user.id,
            name: user.name,
            token
        });
        

    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Por favor comuniquese con su administrador.',
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    // Generar JWT
    const token = await generateJWT(uid, name);

    res.json({
        status: true,
        uid,
        name,
        token
    });
}

module.exports = {
    registerUser,
    loginUser,
    renewToken
}