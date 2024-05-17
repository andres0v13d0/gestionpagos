from flask import Flask, render_template
from negocio.contabilidad import add_transaction

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contabilidad')
def contabilidad():
    transa = add_transaction()
    return render_template('contabilidad.html', transa=transa)

@app.route('/facturacion')
def facturacion():
    return render_template('facturacion.html')

@app.route('/contratos')
def contratos():
    return render_template('contratos.html')

if __name__ == '__main__':
    app.run(debug=True)
