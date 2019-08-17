
var express = require('express');
var app = express();


var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//-----------------------------------
// Buscar por coleccion
//----------------------------------
app.get('/coleccion/:tabla/:busqueda', (req, res, next)=> {

    var tabla= req.params.tabla;
    var busqueda = req.params.busqueda;
    var regExp = new RegExp( busqueda,'i');

    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios(regExp);
            break;
        case 'medico':
            promesa = buscarMedicos(regExp);
            break;
        case 'hospital': 
            promesa = buscarHospitales(regExp);
            break;
        default: 
            return res.status(400).json({
                ok:false,
                mensaje: 'Los valores de busqueda son: usuario, medico, hospital'
            });
    }

    promesa.then( data => {
        res.status(200).json({
            ok:true,
            [tabla]:data
        });
    });
});



// Definicion de Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regExp = new RegExp( busqueda,'i');

    Promise.all([
        buscarHospitales(regExp),
        buscarMedicos(regExp),
        buscarUsuarios(regExp)
    ]).then( respuestas => {
        res.status(200).json({
            ok:true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});

function buscarMedicos(regExp){

    return new Promise((resolve, reject)=> {
        Medico.find({nombre: regExp}, (err, medicosDB)=> {
            if (err){
                reject('Error al cargar Medicos >>', err);
            } else {
                resolve(medicosDB);
            }
        });
    });
}


function buscarHospitales(regExp){

    return new Promise((resolve, reject)=> {
        Hospital.find({nombre: regExp}, (err, hosptalesDB)=> {
            if (err){
                reject('Error al cargar Hospitales>>', err);
            } else {
                resolve(hosptalesDB);
            }
        });
    });
}

function buscarUsuarios(regExp){
    return new Promise((resolve, reject) => {
        Usuario.find({},'nombre email role date_new')
            .or([{nombre: regExp}, {email: regExp}])
            .exec((err, usuarios)=> {
                if (err) {
                    reject('Error al cargar usuarios: ', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;