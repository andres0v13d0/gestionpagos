function isValidCI(ci) {
    var isNumeric = true;
    var total = 0, individual;

    for (var position = 0; position < 10; position++) {
        individual = ci.toString().substring(position, position + 1);

        if (isNaN(individual)) {
            console.log(ci, position, individual, isNaN(individual));
            isNumeric = false;
            break;
        } else {
            if (position < 9) {
                if (position % 2 == 0) {
                    if (parseInt(individual) * 2 > 9) {
                        total += 1 + ((parseInt(individual) * 2) % 10);
                    } else {
                        total += parseInt(individual) * 2;
                    }
                } else {
                    total += parseInt(individual);
                }
            }
        }
    }

    if ((total % 10) != 0) {
        total = (total - (total % 10) + 10) - total;
    } else {
        total = 0;
    }

    if (isNumeric) {
        if (ci.toString().length != 10) {
            alert("La c\u00E9dula debe ser de: 10 d\u00EDgitos.");
            return false;
        }

        if (parseInt(ci, 10) == 0) {
            alert("La c\u00E9dula ingresada no puede ser cero.");
            return false;
        }

        if (total != parseInt(individual)) {
            alert("La c\u00E9dula ingresada no es v\u00E1lida.");
            return false;
        }

        console.log('cédula válida', ci);
        return true;
    }

    alert("El dato solo puede contener numeros.");
    return false;
}

document.getElementById('billingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var owner = document.getElementById('owner').value;
    var idNumber = document.getElementById('idNumber').value;
    var paymentReason = document.getElementById('paymentReason').value;
    var amount = parseFloat(document.getElementById('amount').value);
    var paymentDate = document.getElementById('paymentDate').value;

    if (!owner || !idNumber || !paymentReason || !amount || !paymentDate) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!isValidCI(idNumber)) {
        return;
    }

    if (amount <= 0) {
        alert("El monto debe ser mayor a cero.");
        return;
    }

    var invoiceDetails = 'Propietario: ' + owner + '\n' +
                         'Cédula: ' + idNumber + '\n' +
                         'Motivo de Pago: ' + paymentReason + '\n' +
                         'Monto a Pagar: $' + amount.toFixed(2) + '\n' +
                         'Fecha de Pago: ' + paymentDate;

    alert(invoiceDetails);

    // Agregar la factura a la tabla
    var invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
    var newRow = invoiceTable.insertRow();
    newRow.insertCell(0).innerText = owner;
    newRow.insertCell(1).innerText = idNumber;
    newRow.insertCell(2).innerText = paymentReason;
    newRow.insertCell(3).innerText = '$' + amount.toFixed(2);
    newRow.insertCell(4).innerText = paymentDate;

    // Agregar botones de editar y eliminar
    var actionsCell = newRow.insertCell(5);
    /*var editButton = document.createElement('button');
    editButton.innerText = 'Editar';
    editButton.className = 'action-btn';
    editButton.onclick = function() {
        loadInvoiceToForm(newRow);
    };
    actionsCell.appendChild(editButton);*/

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.className = 'action-btn';
    deleteButton.onclick = function() {
        invoiceTable.deleteRow(newRow.rowIndex - 1);
    };
    actionsCell.appendChild(deleteButton);

    // Limpiar el formulario después de agregar la factura
    document.getElementById('billingForm').reset();
});

/* Función para cargar la factura en el formulario para editar
function loadInvoiceToForm(row) {
    var owner = row.cells[0].innerText;
    var idNumber = row.cells[1].innerText;
    var paymentReason = row.cells[2].innerText;
    var amount = row.cells[3].innerText.replace('$', '');
    var paymentDate = row.cells[4].innerText;

    document.getElement
*/