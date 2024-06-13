const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

module.exports = function(app) {
    app.use(bodyParser.json());

    app.get('/facturacion', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'facturacion.html'));
    });

    app.post('/add_invoice', async (req, res) => {
        const { owner, idNumber, paymentReason, amount: amountStr, paymentDate } = req.body;

        if (!owner || !idNumber || !paymentReason || !amountStr || !paymentDate) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const amount = parseFloat(amountStr);
        if (isNaN(amount)) {
            return res.status(400).json({ error: 'El monto debe ser un número válido' });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor que cero' });
        }

        try {
            const result = await db.query(
                'INSERT INTO invoices (owner, id_number, payment_reason, amount, payment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [owner, idNumber, paymentReason, amount, paymentDate]
            );
            const invoice = result.rows[0];
            res.status(200).json({ invoice });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar la factura' });
        }
    });

    app.get('/get_invoices', async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM invoices');
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener las facturas' });
        }
    });
    
};
