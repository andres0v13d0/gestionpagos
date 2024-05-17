// contratos.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = function (app) {
    let contracts = [];
    let nextId = 1;

    app.use(express.json());

    app.get('/contratos', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contratos.html'));
    });

    app.use(bodyParser.json());

    // Obtener todos los contratos
    app.get('/contracts', (req, res) => {
        res.json(contracts);
    });

    // Agregar un nuevo contrato
    app.post('/add_contract', (req, res) => {
        const contract = req.body;
        contract.id = nextId;
        nextId++;
        contracts.push(contract);
        res.status(201).json(contract);
    });

    // Actualizar un contrato existente
    app.put('/contracts/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const updatedContract = req.body;

        const index = contracts.findIndex(contract => contract.id === id);
        if (index !== -1) {
            contracts[index] = { ...contracts[index], ...updatedContract };
            res.json(contracts[index]);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    });

    app.delete('/delete_contracts/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const index = contracts.findIndex(contract => parseInt(contract.id) == parseInt(id));
    
        if (index !== -1) {
            contracts.splice(index, 1);
            res.sendStatus(204);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    });    
};
