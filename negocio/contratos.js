const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app) {
    let contracts = [];
    let nextId = 1;

    app.use(bodyParser.json());

    app.get('/contratos', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contratos.html'));
    });

    app.post('/add_contract', (req, res) => {
        const { resident_name, id_number, property_address, start_date, end_date, rent } = req.body;

        if (!resident_name || !id_number || !property_address || !start_date || !end_date || !rent) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (!isValidCI(id_number)) {
            return res.status(400).json({ error: 'La cédula ingresada no es válida' });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({ error: 'La fecha de vencimiento no puede ser anterior a la fecha de inicio' });
        }

        if (rent <= 0) {
            return res.status(400).json({ error: 'La renta debe ser mayor a 0' });
        }

        const contract = {
            id: nextId++,
            resident_name,
            id_number,
            property_address,
            start_date,
            end_date,
            rent
        };
        contracts.push(contract);

        res.status(201).json(contract);
    });

    app.get('/contracts', (req, res) => {
        res.json(contracts);
    });

    app.get('/contracts/:id', (req, res) => {
        const contract = contracts.find(c => c.id === parseInt(req.params.id));
        if (contract) {
            res.json(contract);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    });

    app.put('/update_contracts/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const contractIndex = contracts.findIndex(c => c.id === id);

        if (contractIndex === -1) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        const { resident_name, id_number, property_address, start_date, end_date, rent } = req.body;
        if (!resident_name || !id_number || !property_address || !start_date || !end_date || !rent) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (!isValidCI(id_number)) {
            return res.status(400).json({ error: 'La cédula ingresada no es válida' });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({ error: 'La fecha de vencimiento no puede ser anterior a la fecha de inicio' });
        }

        if (rent <= 0) {
            return res.status(400).json({ error: 'La renta debe ser mayor a 0' });
        }

        const updatedContract = {
            id,
            resident_name,
            id_number,
            property_address,
            start_date,
            end_date,
            rent
        };

        contracts[contractIndex] = updatedContract;
        res.json(updatedContract);
    });

    app.delete('/delete_contracts/:id', (req, res) => {
        contracts = contracts.filter(contract => contract.id !== parseInt(req.params.id));
        res.status(204).send();
    });

    function isValidCI(ci) {
        var isNumeric = true;
        var total = 0, individual;

        for (var position = 0; position < 10; position++) {
            individual = ci.toString().substring(position, position + 1);

            if (isNaN(individual)) {
                isNumeric = false;
                break;
            } else {
                if (position < 9) {
                    if (position % 2 == 0) {
                        if (parseInt(individual) * 2 > 9) {
                            total += 1 + ((parseInt(individual) * 2) % 10);
                        } else {
                            total += parseInt(individual) * 2;
                        }
                    } else {
                        total += parseInt(individual);
                    }
                }
            }
        }

        if ((total % 10) != 0) {
            total = (total - (total % 10) + 10) - total;
        } else {
            total = 0;
        }

        if (isNumeric) {
            if (ci.toString().length != 10) {
                return false;
            }

            if (parseInt(ci, 10) == 0) {
                return false;
            }

            if (total != parseInt(individual)) {
                return false;
            }

            return true;
        }

        return false;
    }
};
