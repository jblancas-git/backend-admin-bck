
var express = require('express');

var app = express();

// Definicion de Rutas
app.get('/', (req, res) => {
    res.status(200).json({
        ok:true,
        mensaje: "Petición Exitosa!."
    });
});

module.exports = app;