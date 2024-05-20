const request = require('supertest');
const express = require('express');
const contratosRouter = require('../negocio/contratos.js');

const app = express();
contratosRouter(app);

describe('Contract API', () => {
    it('should create a contract', async () => {
        const newContract = {
            resident_name: 'Juan Pérez',
            id_number: '1759571316',
            property_address: 'Calle Falsa 123',
            start_date: '2023-06-01',
            end_date: '2024-06-01',
            rent: 500
        };

        const response = await request(app)
            .post('/add_contract')
            .send(newContract)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toMatchObject(newContract);
    });

    it('should return all contracts', async () => {
        const response = await request(app)
            .get('/contracts')
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return a contract by ID', async () => {
        const newContract = {
            resident_name: 'Juan Pérez',
            id_number: '1759571316',
            property_address: 'Calle Falsa 123',
            start_date: '2023-06-01',
            end_date: '2024-06-01',
            rent: 500
        };

        const createdContract = await request(app)
            .post('/add_contract')
            .send(newContract)
            .expect(201);

        const response = await request(app)
            .get(`/contracts/${createdContract.body.id}`)
            .expect(200);

        expect(response.body).toMatchObject(newContract);
    });

    it('should update a contract by ID', async () => {
        const newContract = {
            resident_name: 'Juan Pérez',
            id_number: '1759571316',
            property_address: 'Calle Falsa 123',
            start_date: '2023-06-01',
            end_date: '2024-06-01',
            rent: 500
        };

        const createdContract = await request(app)
            .post('/add_contract')
            .send(newContract)
            .expect(201);

        const updatedContract = {
            ...newContract,
            resident_name: 'Juan Gómez'
        };

        const response = await request(app)
            .put(`/update_contracts/${createdContract.body.id}`)
            .send(updatedContract)
            .expect(200);

        expect(response.body.resident_name).toBe('Juan Gómez');
    });

    it('should delete a contract by ID', async () => {
        const newContract = {
            resident_name: 'Juan Pérez',
            id_number: '1759571316',
            property_address: 'Calle Falsa 123',
            start_date: '2023-06-01',
            end_date: '2024-06-01',
            rent: 500
        };

        const createdContract = await request(app)
            .post('/add_contract')
            .send(newContract)
            .expect(201);

        await request(app)
            .delete(`/delete_contracts/${createdContract.body.id}`)
            .expect(204);
    });
});
