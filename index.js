const express = require('express');
require('dotenv').config();
const { dbConection } = require('./database/config');
var cors = require('cors');

//creating app express
const app = express();

//DB
dbConection();

//cors
app.use(cors())

//public directory

app.use(express.static('public'));

//parseo del body
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));

//escuchar peticiones
app.listen(process.env.PORT, () => console.log('server up'));