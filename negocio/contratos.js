const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

module.exports = function(app) {
    app.use(bodyParser.json());

    app.get('/contratos', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'contratos.html'));
    });

    app.post('/add_contract', async (req, res) => {
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

        try {
            const result = await db.query(
                'INSERT INTO contracts (resident_name, id_number, property_address, start_date, end_date, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [resident_name, id_number, property_address, start_date, end_date, rent]
            );
            const contract = result.rows[0];
            res.status(201).json(contract);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar el contrato' });
        }
    });

    app.get('/contracts', async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM contracts');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener los contratos' });
        }
    });

    app.get('/contracts/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const result = await db.query('SELECT * FROM contracts WHERE id = $1', [id]);
            const contract = result.rows[0];
            if (contract) {
                res.json(contract);
            } else {
                res.status(404).json({ error: 'Contrato no encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener el contrato' });
        }
    });

    app.put('/update_contracts/:id', async (req, res) => {
        const id = parseInt(req.params.id);
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

        try {
            const result = await db.query(
                'UPDATE contracts SET resident_name = $1, id_number = $2, property_address = $3, start_date = $4, end_date = $5, rent = $6 WHERE id = $7 RETURNING *',
                [resident_name, id_number, property_address, start_date, end_date, rent, id]
            );
            const updatedContract = result.rows[0];
            res.json(updatedContract);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al actualizar el contrato' });
        }
    });

    app.delete('/delete_contracts/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            await db.query('DELETE FROM contracts WHERE id = $1', [id]);
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el contrato' });
        }
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
