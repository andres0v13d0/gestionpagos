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
    description = request.form['description']
    amount = float(request.form['amount'])
    category = request.form['category']
    
    transactions.append({'description': description, 'amount': amount, 'category': category})
    
    return render_template('contabilidad.html', transactions=transactions)

if __name__ == '__main__':
    app.run(debug=True)

