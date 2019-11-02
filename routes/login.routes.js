var express = require('express');
var app = express();



// Importar libreria para encriptar
var bcrypt = require('bcryptjs');

// Importar libreria de jwt
var jwt = require('jsonwebtoken');
var SEDDToken = require('../configs/config').SEED;

// importar Schema de usuarios
var Usuario = require('../models/usuario');

// Librerias de Google Sing-In
var CLIENT_ID = require('../configs/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);


//---------------------------------
// Google Sing-In
//---------------------------------

// token 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

  }


app.post('/google', async (req, res, next )=> {

    var token = req.body.token;

    // Validar token de usuario google
    var googleUser = await verify(token)
        .catch( err => {
            return res.status(403).json({
                ok:false,
                mensaje: 'Token no válido!',
                error: err
            });
        });
        
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=> {
        // En caso de error 
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error en consulta de usuario',
                error: err
            });
        }
        // Validar Usuario
        if (usuarioDB) {
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'El usuario es de tipo local',
                    error: { message:'Error al consultar usuario'}
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB}, SEDDToken, { expiresIn: 86400});
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
            
        }
    });
});


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