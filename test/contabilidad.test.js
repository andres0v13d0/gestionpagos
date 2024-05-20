// Test for contabilidad.js
const request = require('supertest');
const express = require('express');
const contabilidad = require('../negocio/contabilidad.js'); // Reemplaza con la ruta correcta a tu archivo contabilidad.js

const app = express();
contabilidad(app);

describe('Contabilidad API', () => {
    let testTransaction = { description: 'Test Transaction', amount: '100.50', category: 'Test Category' };

    it('should add a new transaction', async () => {
        const res = await request(app)
           .post('/add_transaction')
           .send(testTransaction)
           .expect(200)
           .expect('Content-Type', /json/);

        expect(res.body.transaction).toMatchObject({
            description: testTransaction.description,
            amount: parseFloat(testTransaction.amount),
            category: testTransaction.category
        });
    });

    it('should get the contabilidad page', async () => {
        const res = await request(app)
           .get('/contabilidad')
           .expect(200)
           .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    // Si planeas agregar más funcionalidades en contabilidad.js, puedes agregar más pruebas aquí.
});
