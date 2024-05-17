const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'presentacion')));

// Cargar todos los archivos JavaScript en la carpeta negocio
const negocioPath = path.join(__dirname, 'negocio');
fs.readdirSync(negocioPath).forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
        require(path.join(negocioPath, file))(app);
    }
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
