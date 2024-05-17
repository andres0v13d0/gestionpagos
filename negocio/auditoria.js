const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app) {
    let transactions = [];
    let contracts = [];
    let nextId = 1;
    let invoices = [];
    let stories = [];

    // Middleware to parse JSON request bodies
    app.use(express.json());

    app.get('/auditoria', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'auditoria.html'));
    });

    app.get('/contabilidad', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contabilidad.html'));
    });

    app.get('/facturacion', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'facturacion.html'));
    });

    app.get('/contratos', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contratos.html'));
    });

    app.get('/get_transactions', (req, res) => {
        return res.status(200).json({stories: stories });
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

        let des = "Nueva Transacción";
        let cat = "Contabilidad";
        const history = {des, amount, cat};
        stories.push(history)

        return res.status(200).json({ transaction: transaction });
    });

    app.post('/add_invoice', (req, res) => {
        const owner = req.body.owner.trim();
        const idNumber = req.body.idNumber.trim();
        const paymentReason = req.body.paymentReason.trim();
        const amountStr = req.body.amount.trim();
        const paymentDate = req.body.paymentDate.trim();

        if (!owner || !idNumber || !paymentReason || !amountStr || !paymentDate) {
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

        const invoice = {
            owner,
            idNumber,
            paymentReason,
            amount,
            paymentDate
        };

        invoices.push(invoice);

        let des = "Nueva Factura";
        let cat = "Facturación";
        const history = {des, amount, cat};
        stories.push(history)

        return res.status(200).json({ invoice: invoice });
    });

    app.post('/add_contract', (req, res) => {
        const contract = req.body;
        contract.id = nextId;
        nextId++;
        contracts.push(contract);
        let des = "Nuevo Contrato";
        let cat = "Contratos";
        const rent = req.body.rent;
        const history = {des, amount: rent, cat};
        stories.push(history)
        res.status(201).json(contract);
    });
};
