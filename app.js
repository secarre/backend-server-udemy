// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Rutas
var appRoutes = require('./routes/routes');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');

// Conexión a la BD Mongo
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('BD Hospital: \x1b[32m%s\x1b[0m', 'activo');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(8080, () => {
    console.log('Express server puerto 8080: \x1b[32m%s\x1b[0m', 'activo');
});