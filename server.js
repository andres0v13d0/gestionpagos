const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'presentacion')));

const negocioPath = path.join(__dirname, 'negocio');
fs.readdirSync(negocioPath).forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
        const modulePath = path.join(negocioPath, file);
        const module = require(modulePath);

        // Verificar si el módulo es una función antes de invocarlo
        if (typeof module === 'function') {
            module(app);
        } else {
            console.error(`El archivo ${file} no exporta una función`);
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'presentacion/contabilidad.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
