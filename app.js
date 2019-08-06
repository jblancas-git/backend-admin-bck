// declarar servidor express
var express     = require('express');
var mongoose    = require('mongoose');


// Inicializar Variables
var app = express();


// Conexión a base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true}, (err, res)=> {
    if (err) throw err;

    console.log('Base MongoDB hospitalDB: \x1b[36m%s\x1b[0m', 'online'); 
});


// Definicion de Rutas
app.get('/', (req, res) => {
    res.status(200).json({
        ok:true,
        mensaje: "Petición Exitosa!."
    });
});

// Escucha de peticiones

app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});