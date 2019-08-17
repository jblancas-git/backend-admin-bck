
var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');

// Definicion de Rutas
app.get('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${id}`);

    //Validar ruta de img
    console.log(pathImg);

    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = app;