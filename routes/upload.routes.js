
var express = require('express');
var app = express();

var myPath = require('../configs/config').PATHFILE;

// Libreria file system
var fs = require('fs');
// Libreria para subir archivos
var fileUpload = require('express-fileupload');


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// Implementar Middleware
app.use(fileUpload());


// Definicion de Rutas
app.put('/:tipo/:id', (req, res) => {

    var id = req.params.id;
    var tipo = req.params.tipo;

    // Validar si viene files
    if (!req.files) {
        return res.status(400).json({
            ok:false,
            mensaje: 'No se adjuntaron archivos!',
            error: {message: 'Error: Se requiere un archivo!'}
        });
    }

    //Obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreSeparado = archivo.name.split('.');
    var archivoExt = nombreSeparado[nombreSeparado.length -1];

    //Extensiones de archivo validaas
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //  validar extension
    if ( extValidas.indexOf(archivoExt) <0 ){
        return res.status(400).json({
            ok:false,
            mensaje: 'Extensión no válida!',
            error: {message: 'Error: Se requiere un archivo de tipo imagen!'}
        });
    }

    // Hacer nombre de archivo
    var myFileName = `${id}-${new Date().getMilliseconds()}.${archivoExt}`;

    // Generar el path
    var filePath =  `uploads/${myFileName}`;

    archivo.mv( filePath, err => {

        // Si error
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'No fue posible copiar el archivo:',
                error: err
            });
        }

        updTipoColeccion(tipo, id, myFileName, res);

        /* res.status(200).json({
            ok:true,
            mensaje: "Archivo Cargado!."
        }); */
    });

});

function updTipoColeccion(tipo, id, avatar, res ){

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuarioDB) => {
                // Obtener path de la imagen de 
                var pathOld = `uploads/usuarios/${usuarioDB.avatar}`;
                // Si existe la imagen 
                if (fs.existsSync(pathOld)){
                    // la eliminamos
                    fs.unlink(pathOld);
                }

                //Actualizamos el valor
                usuarioDB.avatar = avatar;

                usuarioDB.save( (err, usuarioUpd)=> {
                    
                    usuarioUpd.password =';)';

                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen de usuario actualiada!',
                        usurio: usuarioUpd
                    });
                });
            });

            break;
        case 'medicos':
                Medico.findById(id, (err, medicoDB) => {
                    // Obtener path de la imagen de 
                    var pathOld = `uploads/medicos/${medicoDB.img}`;
                    // Si existe la imagen 
                    if (fs.existsSync(pathOld)){
                        // la eliminamos
                        fs.unlink(pathOld);
                    }
    
                    //Actualizamos el valor
                    medicoDB.avatar = avatar;
    
                    medicoDB.save( (err, medicoUpd)=> {
        
                        return res.status(200).json({
                            ok:true,
                            mensaje: 'Imagen de médico actualiada!',
                            medico: medicoUpd
                        });
                    });
                });
            break;
        
        case 'hospitals':

            break;
    
        default:
            break;
    }
}

module.exports = app;