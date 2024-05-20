// Test for contratos.js
const request = require('supertest');
const app = require('../negocio/contratos.js'); // Replace with your actual app file path

describe('Contracts API', () => {
    let testContract = { title: 'Test Contract', description: 'This is a test contract' };

    it('should add a new contract', async () => {
        const res = await request(app)
           .post('/add_contract')
           .send(testContract)
           .expect(201)
           .expect('Content-Type', /json/);

        expect(res.body).toMatchObject(testContract);
        expect(res.body.id).toBeGreaterThan(0);
    });

    it('should get all contracts', async () => {
        const res = await request(app)
           .get('/contracts')
           .expect(200)
           .expect('Content-Type', /json/);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should update an existing contract', async () => {
        const res = await request(app)
           .put(`/contracts/${testContract.id}`)
           .send({ title: 'Updated Test Contract' })
           .expect(200)
           .expect('Content-Type', /json/);

        expect(res.body).toMatchObject({...testContract, title: 'Updated Test Contract' });
    });

    it('should delete a contract', async () => {
        const res = await request(app)
           .delete(`/delete_contracts/${testContract.id}`)
           .expect(204);

        const getRes = await request(app)
           .get(`/contracts/${testContract.id}`)
           .expect(404);
    });
});