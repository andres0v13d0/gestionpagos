from flask import Flask, render_template, request, send_file
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

current_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(current_dir, '..', 'templates')

app = Flask(__name__, template_folder=template_dir)

invoices = []

@app.route('/')
def index():
    return render_template('facturacion.html', invoices=invoices)

@app.route('/generate_invoice', methods=['POST'])
def generate_invoice():
    resident_name = request.form.get('resident_name', '').strip()
    amount_str = request.form.get('amount', '').strip()
    logo_path = request.form.get('logo_path', '').strip()  # Path to condo logo
    details = request.form.get('details', '').strip()
    
    if not resident_name or not amount_str or not details:
        error = 'Todos los campos son obligatorios'
        return render_template('facturacion.html', invoices=invoices, error=error)
    
    try:
        amount = float(amount_str)
    except ValueError:
        error = 'El monto debe ser un número válido'
        return render_template('facturacion.html', invoices=invoices, error=error)
    
    if amount <= 0:
        error = 'El monto debe ser mayor que cero'
        return render_template('facturacion.html', invoices=invoices, error=error)
    
    # Generate invoice PDF
    invoice_filename = f"{resident_name}_invoice.pdf"
    invoice_path = os.path.join(current_dir, 'invoices', invoice_filename)
    generate_pdf_invoice(resident_name, amount, logo_path, details, invoice_path)
    
    invoices.append({'resident_name': resident_name, 'amount': amount, 'invoice_path': invoice_path})
    
    return render_template('facturacion.html', invoices=invoices)

def generate_pdf_invoice(resident_name, amount, logo_path, details, invoice_path):
    c = canvas.Canvas(invoice_path, pagesize=letter)
    c.drawString(100, 750, f"Factura para: {resident_name}")
    c.drawString(100, 730, f"Monto: {amount}")
    c.drawString(100, 710, f"Detalles: {details}")
    if logo_path:
        c.drawInlineImage(logo_path, 400, 750)
    c.save()

@app.route('/download_invoice/<path:invoice_path>')
def download_invoice(invoice_path):
    return send_file(invoice_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
