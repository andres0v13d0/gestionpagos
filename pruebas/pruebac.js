const assert = require('chai').assert;
const request = require('supertest');
const app = require('../server'); // Ruta correcta a tu archivo server.js

describe('Test de Contabilidad API', function() {
    describe('GET /contabilidad', function() {
        it('Debería devolver el archivo contabilidad.html', function(done) {
            request(app)
                .get('/contabilidad')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    describe('POST /add_transaction', function() {
        it('Debería agregar una transacción', function(done) {
            request(app)
                .post('/add_transaction')
                .send({
                    description: 'Compra de alimentos',
                    amount: '50',
                    category: 'Compras'
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.exists(res.body.transaction);
                    assert.equal(res.body.transaction.description, 'Compra de alimentos');
                    assert.equal(res.body.transaction.amount, 50);
                    assert.equal(res.body.transaction.category, 'Compras');
                    done();
                });
        });

        it('Debería devolver un error si falta un campo', function(done) {
            request(app)
                .post('/add_transaction')
                .send({
                    amount: '50',
                    category: 'Compras'
                })
                .expect('Content-Type', /json/)
                .expect(400, done);
        });

        // Otros casos de prueba para validar diferentes escenarios
    });
});
