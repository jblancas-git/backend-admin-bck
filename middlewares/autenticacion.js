
// Importar libreria de jwt
var jwt = require('jsonwebtoken');
var SEDDToken = require('../configs/config').SEED;

//-------------------------------------------------
// * Verificar token
// Si falla verificación, las siguientes rutas no se ejecutan
// Esto se pasa a middlewares 
//---------------------------------------------------

module.exports.verifyToken = function(req, res, next) {
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
        // regresamos en el request en objeto usuario para que este disponible
        // en todas partes donde se use la función.
        req.usuario = decode.usuario;
        next();
    });
}

