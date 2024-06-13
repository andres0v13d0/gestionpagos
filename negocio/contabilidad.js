const path = require('path');
const express = require('express');
const db = require('./db');

module.exports = function(app) {
    app.use(express.json());

    app.get('/contabilidad', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contabilidad.html'));
    });

    app.get('/get_contas', async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM transactions');
            console.log('Transactions from DB:', result.rows);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener las transacciones' });
        }
    });
    

    app.post('/add_transaction', async (req, res) => {
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

        try {
            const result = await db.query(
                'INSERT INTO transactions (description, amount, category) VALUES ($1, $2, $3) RETURNING *',
                [description, amount, category]
            );
            const transaction = result.rows[0];
            return res.status(200).json({ transaction: transaction });
        } catch (err) {
            console.error(err);
            const error = 'Error al registrar la transacción';
            return res.status(500).json({ error: error });
        }
    });

    
};

