var express = require('express');
var app = express();

// Importar libreria para encriptar
var bcrypt = require('bcryptjs');

// Importar libreria de jwt
var jwt = require('jsonwebtoken');
var SEDDToken = require('../configs/config').SEED;

// Middleware Verifica Token
var verifyToken = require('../middlewares/autenticacion').verifyToken;

// Importar Schema de hospitales

var Hospital = require('../models/hospital') ;

//-----------------------------------
// Obtener todos los hospitales
//-----------------------------------
app.get('/', ( req, res, next) => {
    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitalesDB)=> {
        // En caso de error 
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando hospitales',
                error: err
            });
        }
        // En caso Correcto
        res.status(200).json({
            ok:true,
            hospitales: hospitalesDB
        });
    });
});


//-----------------------------------
// Crear nuevo Hopital
//-----------------------------------
app.post('/', verifyToken,  (req, res, next) => {

    var body = req.body;

    // Crear nuevo documento
    var hospital = new Hospital({
        nombre: body.nombre,
        // img:  body.img, // Pendiente
        usuario: req.usuario.id
    });
    
    hospital.save((err, newHospital) => {
        // En caso de error 
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error creardo hospital!',
                error: err
            });
        }

        // En caso Correcto | 201: Created
        res.status(201).json({
            ok:true,
            newHospital: newHospital
        });

    });
});

//-----------------------------------
// Actualizar Hopital
//-----------------------------------

app.put('/:id', verifyToken, (req, res, next) => {
    //Obtener id del hospital
    var id  = req.params.id;
    //Obtener el body
    var body = req.body;

    Hospital.findById(id, (err, hospitalDB) => {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error buscando hospital!',
                error: err
            });
        }

        // Si el usuario es null 
        if (!hospitalDB){
            return res.status(404).json({
                ok:false,
                mensaje: 'No se encontró el hospital!',
                error: { message: 'No existe el hospital'}
            });
        }

        // si todo sale bien, actualizamos datos
        hospitalDB.nombre = body.nombre;
        //hospitalDB.img = body.img;
        hospitalDB.usuario = req.usuario._id;

        //Guardar cambios del objeto
        hospitalDB.save((err, modHospital) => {
            // En caso de error 
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al Guardar Hospital!',
                    error: err
                });
            }
            // En caso Correcto
            res.status(200).json({
                ok:true,
                hospital: modHospital
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

    Hospital.findByIdAndDelete(id, (err, delHospital)=> {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error buscando hospital!',
                error: err
            });
        }

        // Si el usuario es null 
        if (!hospitalDB){
            return res.status(404).json({
                ok:false,
                mensaje: 'No se encontró el hospital!',
                error: { message: 'No existe el hospital'}
            });
        }

        // Si todo salió bien
        res.status(200).json( {
            ok:true,
            delHospital: delHospital
        });
    });

});

module.exports = app;

