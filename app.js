// Declaración de librerias
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

// Importar rutas
var appRoutes = require('./routes/app.routes');
var usrRoutes = require('./routes/usuario.routes');
var loginRoutes = require('./routes/login.routes');
var hospitlaRoutes = require('./routes/hospital.routes');
var medicoRoutes = require('./routes/medico.routes');
var buscarRoutes = require('./routes/buscar.routes');
var uploadRoutes = require('./routes/upload.routes');
var imagesRoutes = require('./routes/imagenes.routes');

// Inicializar Variables
var app = express();


// Conexión a base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true, useCreateIndex: true}, 
    (err)=> {
        if (err) throw err;
    console.log('Base MongoDB hospitalDB: \x1b[36m%s\x1b[0m', 'online'); 
    }
);

//---------------------------------------
// Configuración de Midlwares
//---------------------------------------
// -- Configs CORS
//- https://enable-cors.org/server_nginx.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });


//---------Body parser ------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//---------END: Body parser -------------------



//------------- Rutas -------------------
app.use('/login', loginRoutes);
app.use('/usuario', usrRoutes);
app.use('/hospital', hospitlaRoutes);
app.use('/medico', medicoRoutes);
app.use('/buscar', buscarRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagesRoutes);

// Esta debe ser la última ruta
app.use('/', appRoutes);

//------------- END: Rutas --------------


// Escucha de peticiones
app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});