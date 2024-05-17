const path = require('path');

module.exports = function(app) {
    let invoices = [];

    app.get('/facturacion', (req, res) => {
        res.sendFile(path.join(__dirname, '../presentacion', 'facturacion.html'));
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

        return res.status(200).json({ invoice: invoice });
    });
};
