from flask import Flask, render_template, request
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(current_dir, '..', 'templates')

app = Flask(__name__, template_folder=template_dir)

transactions = []
contratos = []

class ContratoCondominio:
    def __init__(self, nombre_condominio, fecha_inicio, duracion_meses, monto_mensual):
        self.nombre_condominio = nombre_condominio
        self.fecha_inicio = fecha_inicio
        self.duracion_meses = duracion_meses
        self.monto_mensual = monto_mensual

    def obtener_informacion_contrato(self):
        return {
            "nombre_condominio": self.nombre_condominio,
            "fecha_inicio": self.fecha_inicio,
            "duracion_meses": self.duracion_meses,
            "monto_mensual": self.monto_mensual
        }

@app.route('/')
def index():
    return render_template('contratos.html', transactions=transactions, contratos=contratos)

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    description = request.form.get('description', '').strip()
    amount_str = request.form.get('amount', '').strip()
    category = request.form.get('category', '').strip()
    
    if not description or not amount_str or not category:
        error = 'Todos los campos son obligatorios'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    try:
        amount = float(amount_str)
    except ValueError:
        error = 'El monto debe ser un número válido'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    if amount <= 0:
        error = 'El monto debe ser mayor que cero'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    transactions.append({'description': description, 'amount': amount, 'category': category})
    
    return render_template('contratos.html', transactions=transactions, contratos=contratos)

"""@app.route('/crear_contrato', methods=['POST'])
def crear_contrato():
    nombre_condominio = request.form.get('nombre_condominio', '').strip()
    fecha_inicio = request.form.get('fecha_inicio', '').strip()
    duracion_meses_str = request.form.get('duracion_meses', '').strip()
    monto_mensual_str = request.form.get('monto_mensual', '').strip()
    
    if not nombre_condominio or not fecha_inicio or not duracion_meses_str or not monto_mensual_str:
        error = 'Todos los campos son obligatorios'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    try:
        duracion_meses = int(duracion_meses_str)
        monto_mensual = float(monto_mensual_str)
    except ValueError:
        error = 'La duración en meses y el monto mensual deben ser números válidos'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    if duracion_meses <= 0 or monto_mensual <= 0:
        error = 'La duración en meses y el monto mensual deben ser mayores que cero'
        return render_template('contratos.html', transactions=transactions, contratos=contratos, error=error)
    
    contrato = ContratoCondominio(nombre_condominio, fecha_inicio, duracion_meses, monto_mensual)
    contratos.append(contrato.obtener_informacion_contrato())
    
    return render_template('contratos.html', transactions=transactions, contratos=contratos)
"""
if __name__ == '__main__':
    app.run(debug=True)
