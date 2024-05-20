// Test for facturacion.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const facturacion = require('../negocio/facturacion.js'); // Reemplaza con la ruta correcta a tu archivo facturacion.js

const app = express();
app.use(bodyParser.json()); // Asegúrate de usar bodyParser para parsear el cuerpo de las solicitudes JSON
facturacion(app);

describe('Facturacion API', () => {
    let testInvoice = {
        owner: 'Test Owner',
        idNumber: '1234567890',
        paymentReason: 'Test Payment Reason',
        amount: '250.75',
        paymentDate: '2023-05-20'
    };

    it('should add a new invoice', async () => {
        const res = await request(app)
            .post('/add_invoice')
            .send(testInvoice)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body.invoice).toMatchObject({
            owner: testInvoice.owner,
            idNumber: testInvoice.idNumber,
            paymentReason: testInvoice.paymentReason,
            amount: parseFloat(testInvoice.amount),
            paymentDate: testInvoice.paymentDate
        });
    });

    it('should return an error if any field is missing', async () => {
        const incompleteInvoice = { ...testInvoice, owner: '' };

        const res = await request(app)
            .post('/add_invoice')
            .send(incompleteInvoice)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(res.body.error).toBe('Todos los campos son obligatorios');
    });

    it('should return an error if the amount is not a valid number', async () => {
        const invalidAmountInvoice = { ...testInvoice, amount: 'invalid' };

        const res = await request(app)
            .post('/add_invoice')
            .send(invalidAmountInvoice)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(res.body.error).toBe('El monto debe ser un número válido');
    });

    it('should return an error if the amount is less than or equal to zero', async () => {
        const zeroAmountInvoice = { ...testInvoice, amount: '0' };

        const res = await request(app)
            .post('/add_invoice')
            .send(zeroAmountInvoice)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(res.body.error).toBe('El monto debe ser mayor que cero');
    });

    it('should get the facturacion page', async () => {
        const res = await request(app)
            .get('/facturacion')
            .expect(200)
            .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    // Si planeas agregar más funcionalidades en facturacion.js, puedes agregar más pruebas aquí.
});
