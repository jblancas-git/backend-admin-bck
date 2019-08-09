var mongoose = require('mongoose');

// Libreria de validación para campos Unique.
var uniqueValidator = require('mongoose-unique-validator');

// Roles Válidos para Enum.
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'Warning: {VALUE} no es un rol permitido!.'
};



var Schema = mongoose.Schema;
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido!']},
    email: { type: String, unique:true, required: [true, 'El email es requerido!']},
    password: { type: String,  required: [true, 'El password es requerido!']},
    avatar: { type: String, required:false },
    role: { type: String, required:true, default:'USER_ROLE', enum: rolesValidos },
    date_new: {type: Date, default: Date.now},
    date_upd: {type: Date, required: false, default: null}
});
// Aplicar validación al campo email de tipo "unique"
usuarioSchema.plugin(uniqueValidator, { message:'El email debe ser único!'});

module.exports = mongoose.model('Usuario', usuarioSchema);