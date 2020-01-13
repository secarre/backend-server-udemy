var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

// Rutas
app.put('/:coleccion/:id', (req, res, next) => {
    var coleccion = req.params.coleccion;
    var id = req.params.id;
    var coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];

    if (coleccionesValidas.indexOf(coleccion) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección no válida',
            errors: { message: 'Las colecciones válidas son ' + coleccionesValidas.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ningún fichero',
            errors: { message: 'Debe seleccionar un fichero' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
    // Mover el archivo del temporal a un path
    var path = `./uploads/${ coleccion }/${ nombreArchivo }`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(coleccion, id, path, nombreArchivo, res);
    });
});

function subirPorTipo(coleccion, id, path, nombreArchivo, res) {
    if (coleccion === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el usuario con ID ' + id,
                    errors: { message: 'No existe el usuario con ID ' + id }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = null;
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            });
        });
    }

    if (coleccion === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el médico con ID ' + id,
                    errors: { message: 'No existe el médico con ID ' + id }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medicoActualizado: medicoActualizado
                });
            });
        });
    }

    if (coleccion === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el hospital con ID ' + id,
                    errors: { message: 'No existe el hospital con ID ' + id }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;