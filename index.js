const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
require('dotenv').config();

// server express
const app = express();

// DB connection
dbConnection();

// Cors
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Body parser
app.use(express.json());

// rutas
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/events',  require('./routes/events'));
// TODO: Crud: Eventos de Calendario

// listen
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
});