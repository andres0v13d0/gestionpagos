from flask import Flask, render_template, request
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(current_dir, '..', 'templates')

app = Flask(__name__, template_folder=template_dir)

transactions = []

@app.route('/')
def index():
    return render_template('contabilidad.html', transactions=transactions)

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    description = request.form.get('description', '').strip()
    amount_str = request.form.get('amount', '').strip()
    category = request.form.get('category', '').strip()
    
    if not description or not amount_str or not category:
        error = 'Todos los campos son obligatorios'
        return render_template('contabilidad.html', transactions=transactions, error=error)
    
    try:
        amount = float(amount_str)
    except ValueError:
        error = 'El monto debe ser un número válido'
        return render_template('contabilidad.html', transactions=transactions, error=error)
    
    if amount <= 0:
        error = 'El monto debe ser mayor que cero'
        return render_template('contabilidad.html', transactions=transactions, error=error)
    
    transactions.append({'description': description, 'amount': amount, 'category': category})
    
    return render_template('contabilidad.html', transactions=transactions)

if __name__ == '__main__':
    app.run(debug=True)

