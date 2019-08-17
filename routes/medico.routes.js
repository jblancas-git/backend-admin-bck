
// Libreriras principales
var express = require('express');
var app = express();

// Middleware Verifica Token
var verifyToken = require('../middlewares/autenticacion').verifyToken;

// Importar Schema de medicos
var Medico = require('../models/medico');

//-----------------------------------
// Obtener Medicos
//-----------------------------------
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('medico')
        .exec( (err, medicosDB) => {
        // En caso de error
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargardo Medicos!',
                errro:err
            });
        }
        // En caso correcto
        res.status(200).json({
            ok:true,
            medicos: medicosDB
        });
    });
});

//-----------------------------------
// Crear nuevo medico
//-----------------------------------

app.post('/', verifyToken, (req, res, next )=> {
    var body = req.body;

    // Crear nuevo Documento
    var medico = new Medico({
        nombre: body.nombre,
        //img:  body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    // Guardar objeto
    medico.save((err, newMedico)=> {
        // En cado de erro
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al crear medico',
                error: err
            });
        }

        // En caso correcto
        res.status(201).json({
            ok:true,
            newMedico: newMedico
        });
    });
});

//-----------------------------------
// Actualizar Medico
//-----------------------------------

app.put('/:id', verifyToken, (req, res, next )=> {
    
    // Obtener ID
    var id = req.params.id;

    // Obtener body
    var body = req.body;

    Medico.findById(id, (err, medicoDB)=> {
        // En caso de error
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error buscando Medico',
                error: err
            });
        }

        // Cuando no se econtró el Medico
        if (!medicoDB){
            return res.status(404).json({
                ok:false,
                mensaje: 'No se encontró al Médico!',
                errror: { message: 'No se encontró el Médico'}
            });
        }

        // Si encontró objeto lo modificamos
        medicoDB.nombre = body.nombre;
        medicoDB.img = body.img;
        medicoDB.usuario = body.usuario;
        medicoDB.hospital = body.hospital;

        // Guardamos los cambios
        medicoDB.save( (err, modMedico) => {
            // En caso de error
            if (err){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al Guardar Medico!',
                    error: err
                });
            }

            // En caso correcto
            res.status(200).json({
                ok:true,
                medico: modMedico
            });
        });
    });
});


//---------------------------------
// * Eliminar Medicos
//---------------------------------

app.delete('/:id', verifyToken, (req, res, next)=> {
    // Obtener parametros de url
    var id = req.params.id;
    Medico.findByIdAndDelete(id, (err, delMedico)=> {
        // En caso de error 
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error buscando hospital!',
                error: err
            });
        }
        // Cuando no encuentra el objeto
        if (!delMedico){
            return res.status(404).json({
                ok:false,
                mensaje:'No se pudo borar el Medico!',
                error: { message: 'Error al borrar Médico!'}
            });
        }

        // Si todo sale bien
        res.status(200).json({
            ok:true,
            delMedico:delMedico
        });
    });
});

module.exports = app;
