var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El hospital es necesario'] },
    usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioModificacion: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Medico', medicoSchema);