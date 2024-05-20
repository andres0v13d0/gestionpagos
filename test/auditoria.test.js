// Test for auditoria.js
const request = require('supertest');
const express = require('express');
const auditoria = require('../negocio/auditoria.js'); // Reemplaza con la ruta correcta a tu archivo auditoria.js

const app = express();
auditoria(app);

describe('Auditoria API', () => {
    let testTransaction = { description: 'Test Transaction', amount: '100.50', category: 'Test Category' };
    let testInvoice = { owner: 'John Doe', idNumber: '12345', paymentReason: 'Consulting', amount: '1500', paymentDate: '2023-05-18' };
    let testContract = { title: 'Test Contract', description: 'This is a test contract', rent: '1000' };

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

    it('should add a new contract', async () => {
        const res = await request(app)
           .post('/add_contract')
           .send(testContract)
           .expect(201)
           .expect('Content-Type', /json/);

        expect(res.body).toMatchObject({
            title: testContract.title,
            description: testContract.description,
            rent: testContract.rent
        });
        expect(res.body.id).toBeGreaterThan(0);
    });

    it('should get the auditoria page', async () => {
        const res = await request(app)
           .get('/auditoria')
           .expect(200)
           .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    it('should get the contabilidad page', async () => {
        const res = await request(app)
           .get('/contabilidad')
           .expect(200)
           .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    it('should get the facturacion page', async () => {
        const res = await request(app)
           .get('/facturacion')
           .expect(200)
           .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    it('should get the contratos page', async () => {
        const res = await request(app)
           .get('/contratos')
           .expect(200)
           .expect('Content-Type', /html/);

        // Puedes agregar más verificaciones aquí si es necesario
    });

    it('should get all transactions stories', async () => {
        const res = await request(app)
           .get('/get_transactions')
           .expect(200)
           .expect('Content-Type', /json/);

        expect(Array.isArray(res.body.stories)).toBe(true);
        // Puedes agregar más verificaciones aquí si es necesario
    });
});
