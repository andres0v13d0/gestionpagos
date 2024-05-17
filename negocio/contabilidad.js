const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../presentacion')));

let transactions = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../presentacion', 'contabilidad.html'));
});

app.post('/add_transaction', (req, res) => {
    const description = req.body.description.trim();
    const amountStr = req.body.amount.trim();
    const category = req.body.category.trim();

    if (!description || !amountStr || !category) {
        const error = 'Todos los campos son obligatorios';
        return res.status(400).json({ error: error });
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
        const error = 'El monto debe ser un número válido';
        return res.status(400).json({ error: error });
    }

    if (amount <= 0) {
        const error = 'El monto debe ser mayor que cero';
        return res.status(400).json({ error: error });
    }

    const transaction = { description, amount, category };
    transactions.push(transaction);

    return res.status(200).json({ transaction: transaction });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
