const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        let usuarioBD = await Usuario.findOne({ email })

        if (usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: "Un usuario existe con ese correo"
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generateJWT(usuario.uid, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error por favor contacte con el administrador'
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuarioBD = await Usuario.findOne({ email })

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: "Un usuario existe con ese correo"
            })
        }

        const { id, name } = usuarioBD;
        console.log(usuarioBD)

        //confirmar los passwords

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta"
            })
        }

        //Generar Token
        const token = await generateJWT(id, name);

        res.status(201).json({
            ok: true,
            id,
            name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error por favor contacte con el administrador'
        })
    }

    res.json({
        ok: true,
        msg: 'this will be login',
        email,
        password
    })
}

const revalidarToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}