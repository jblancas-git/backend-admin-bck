var express = require('express');
var app = express();



// Importar libreria para encriptar
var bcrypt = require('bcryptjs');

// Importar libreria de jwt
var jwt = require('jsonwebtoken');
var SEDDToken = require('../configs/config').SEED;

// importar Schema de usuarios
var Usuario = require('../models/usuario');


//---------------------------------
// Validar usuario
//---------------------------------

app.post('/', (req, res, next) => {

    var body = req.body;
    
    console.log( body);

    // Buscar usuario
    Usuario.findOne( {email: body.email}, ( err, usuarioDB) => {
        // En caso de error 
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error no existe el usuario',
                error: err
            });
        }
        // Validar Usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - email',
                error: { message:'Error al consultar usuario'}
            });
        }

        // Validar password
        if (! bcrypt.compareSync( body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - Password',
                error: { message:'Error al consultar usuario'}
            });
        }

        // Si todo salio bien, Crear un Token.
        usuarioDB.password = ';)'; // limpiar password
        var token = jwt.sign({ usuario: usuarioDB}, SEDDToken, { expiresIn: 86400});

        // En caso Correcto
        res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            token: token
        });
    });
});

module.exports = app;