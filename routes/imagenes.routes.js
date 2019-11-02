
var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');

// Definicion de Rutas
app.get('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${id}`);



    if (fs.existsSync(pathImg)){
        console.log('>> get:imagen:', pathImg);
        res.sendFile(pathImg);
    } else {
        console.log('>> get:imagen: no-img.jpg',);
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = app;