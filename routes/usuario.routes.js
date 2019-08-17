
var express = require('express');
var app = express();

// Importar libreria para encriptar
var bcrypt = require('bcryptjs');

// Importar libreria de jwt
var jwt = require('jsonwebtoken');
var SEDDToken = require('../configs/config').SEED;

// Middleware Verifica Token
var verifyToken = require('../middlewares/autenticacion').verifyToken;


// importar Schema de usuarios
var Usuario = require('../models/usuario');


//---------------------------------
// *Obtener todos los usuarios 
//---------------------------------
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({},'nombre email avatar role date_new date_upd')
    .skip(desde)
    .limit(5)
    .exec( 
        (err, usuariosDB) => {
            // En caso de error 
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error cargando usuario',
                    error: err
                });
            }

            Usuario.countDocuments({}, (err, conteo)=> {
                // En caso Correcto
                res.status(200).json({
                    ok:true,
                    usuarios: usuariosDB,
                    total: conteo
                });
            });
            
        }
    );
});

//-------------------------------------------------
// * Verificar token
// Si falla verificación, las siguientes rutas no se ejecutan
// Esto se pasa a middlewares 
//---------------------------------------------------

/* 
    app.use('/', (req, res, next) => {
    // Obtener Token
    var token = req.query.token;

    // Verificar
    jwt.verify( token, SEDDToken, (err, decode) => {
        // En caso de error 
        if (err) {
            return res.status(401).json({
                ok:false,
                mensaje: 'Token incorrecto!',
                error: err
            });
        }   
        //Si todo ok, next
        next();
    });

}); 
*/


//---------------------------------
// * Crear un nuevo usuario
//---------------------------------
app.post('/', verifyToken, (req, res, next) => {

    // Requiere libreria body-parser para obtener el post
    var body = req.body;

    // Nuevo obejeto Usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        avatar: body.avatar,
        role: body.role
    });

    // Guardar Documento en mongodb
    usuario.save((err, newUsuario) => {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error save usuario!',
                error: err
            });
        }
        // En caso Correcto | 201: Created
        res.status(201).json({
            ok:true,
            newUsuario
        });
    });
});

//---------------------------------
// * Actualizar usuario
//---------------------------------

app.put('/:id', verifyToken, (req, res, next) => {
    
    // Obtener el parametro :id del url
    var id = req.params.id;
    // Obtener body del put/post
    var body = req.body;

    Usuario.findById(id, (err, updUsuario) => {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error buscar usuario!',
                error: err
            });
        }
        
        // Si el usuario es null 
        if (!updUsuario){
            return res.status(404).json({
                ok:false,
                mensaje: 'No se encontró el usuario!',
                error: { message: 'No existe el usuario'}
            });
        }

        // Si todo Ok, modificar usuario
        updUsuario.nombre = body.nombre;
        updUsuario.email = body.email;
        updUsuario.date_upd =  Date.now();

        updUsuario.save( (err, modUsuario) => {
            // En caso de error 
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error Guardar Usuario!',
                    error: err
                });
            }

            //Disfrasar el password
            modUsuario.password = ';)';

            // En caso Correcto | 201: Created
            res.status(201).json({
                ok:true,
                modUsuario: modUsuario
            });
        });
    });
});

//---------------------------------
// * Eliminar usuario
//---------------------------------

app.delete('/:id', verifyToken, ( req, res, next) => {
    // Obtener parametro de url
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, ( err, delUsuario)=> {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error eliminar usuario!',
                error: err
            });
        }

        // Validar si encontró usuario
        if (!delUsuario){
            return res.status(404).json({
                ok:false,
                mensaje: 'Error eliminar usuario!',
                errors: { message: 'No se encontró el usuario a borrar'}
            });
        }

        // En caso Correcto | 200: Created
        res.status(200).json({
            ok:true,
            delUsuario
        });
    });
});

module.exports = app;