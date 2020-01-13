var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioModificacion: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);