const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

module.exports = function(app) {
    app.use(bodyParser.json());

    app.get('/auditoria', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'auditoria.html'));
    });

    app.get('/get_transactions', async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM stories');
            res.status(200).json({ stories: result.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener las transacciones' });
        }
    });

    app.post('/add_transaction', async (req, res) => {
        const { description, amount: amountStr, category } = req.body;

        if (!description || !amountStr || !category) {
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
            const transaction = { description, amount, category };
            await db.query(
                'INSERT INTO transactions (description, amount, category) VALUES ($1, $2, $3)',
                [description, amount, category]
            );

            await db.query(
                'INSERT INTO stories (description, amount, category) VALUES ($1, $2, $3)',
                ["Nueva Transacción", amount, "Contabilidad"]
            );

            res.status(200).json({ transaction });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar la transacción' });
        }
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
            const invoice = { owner, idNumber, paymentReason, amount, paymentDate };
            await db.query(
                'INSERT INTO invoices (owner, id_number, payment_reason, amount, payment_date) VALUES ($1, $2, $3, $4, $5)',
                [owner, idNumber, paymentReason, amount, paymentDate]
            );

            await db.query(
                'INSERT INTO stories (description, amount, category) VALUES ($1, $2, $3)',
                ["Nueva Factura", amount, "Facturación"]
            );

            res.status(200).json({ invoice });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar la factura' });
        }
    });

    app.post('/add_contract', async (req, res) => {
        const { resident_name, id_number, property_address, start_date, end_date, rent } = req.body;

        if (!resident_name || !id_number || !property_address || !start_date || !end_date || !rent) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({ error: 'La fecha de vencimiento no puede ser anterior a la fecha de inicio' });
        }

        if (rent <= 0) {
            return res.status(400).json({ error: 'La renta debe ser mayor a 0' });
        }

        try {
            const contract = { resident_name, id_number, property_address, start_date, end_date, rent };
            await db.query(
                'INSERT INTO contracts (resident_name, id_number, property_address, start_date, end_date, rent) VALUES ($1, $2, $3, $4, $5, $6)',
                [resident_name, id_number, property_address, start_date, end_date, rent]
            );

            await db.query(
                'INSERT INTO stories (description, amount, category) VALUES ($1, $2, $3)',
                ["Nuevo Contrato", rent, "Contratos"]
            );

            res.status(201).json({ contract });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar el contrato' });
        }
    });
};
