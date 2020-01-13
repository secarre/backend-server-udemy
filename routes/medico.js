var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// Obtener todos los médicos
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img hospital usuarioCreacion usuarioModificacion')
        .skip(desde)
        .limit(5)
        .populate('usuarioCreacion', 'nombre email role')
        .populate('usuarioModificacion', 'nombre email')
        .populate('hospital', 'nombre')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando médicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, cont) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: cont
                    });
                });
            });
});

// Actualizar médico
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con ID ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospitalId;
        medico.usuarioModificacion = req.usuario._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// Crear un nuevo médico
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospitalId,
        usuarioCreacion: req.usuario._id,
        usuarioModificacion: req.usuario._id
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el médico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// Eliminar hospital
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con ID ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;